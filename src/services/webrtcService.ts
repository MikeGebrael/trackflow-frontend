import { db } from '../firebaseConfig';
import { getEmployeeFromLocalStorage, getEmployeeIdFromLocalStorage } from './employeeService';
import SimplePeer from 'simple-peer'; // Default import
import { doc, setDoc, updateDoc, arrayUnion, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Define the type for ICE candidates
interface IceCandidate {
  candidate: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
}

// Get the local media stream (camera + microphone)
export const getLocalStream = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return stream;
  } catch (error) {
    console.error('Error accessing local media devices:', error);
    return null;
  }
};

// Get the remote media stream from the peer connection
export const getRemoteStream = async (peer: SimplePeer.Instance): Promise<MediaStream | null> => {
  return new Promise((resolve, reject) => {
    peer.on('stream', (stream) => {
      resolve(stream);
    });

    peer.on('error', (error) => {
      reject('Error receiving remote stream: ' + error);
    });
  });
};

// Create a peer connection
export const createPeerConnection = (
  isInitiator: boolean,
  options: {
    stream: MediaStream | null;
    onSignal: (signal: string | null) => void;
    onStream: (stream: MediaStream) => void;
  }
): SimplePeer.Instance => {
  const peer = new SimplePeer({
    initiator: isInitiator,
    trickle: false,
    stream: options.stream || undefined,
  });

  peer.on('signal', (signal) => {
    options.onSignal(signal ? JSON.stringify(signal) : null);
  });

  peer.on('stream', (stream) => {
    options.onStream(stream);
  });

  return peer;
};

// Initiate a call with multiple receivers
export const initiateCall = async (receiverIds: string[]): Promise<string | null> => {
  const caller = getEmployeeFromLocalStorage();

  if (!caller || !caller._id || receiverIds.length === 0) {
    console.error('Error: Missing caller or receiver IDs');
    return null;
  }

  const callId = `${caller._id}-${receiverIds.join('-')}`;

  try {
    // Create a new call document in Firestore
    await setDoc(doc(db, 'calls', callId), {
      callerId: caller._id,
      receiverIds,
      status: 'initiated',
      offer: null, // We'll update this after generating the offer
      answers: [],
      iceCandidates: [],
      recipientSeen: false,
    });

    // Get local media stream
    const localStream = await getLocalStream();
    if (!localStream) {
      throw new Error('Failed to access local media stream');
    }

    const peer = createPeerConnection(true, {
      stream: localStream,
      onSignal: async (signal) => {
        // Update Firestore with the offer
        await updateDoc(doc(db, 'calls', callId), { offer: signal });
      },
      onStream: (stream) => {
        console.log('Received remote stream:', stream);
      },
    });

    return callId; // Return callId
  } catch (error) {
    console.error('Error initiating call:', error);
    return null;
  }
};

// Check if there is an ongoing call
export const checkOngoingCall = async (): Promise<string | null> => {
  const employeeId = getEmployeeIdFromLocalStorage();

  if (!employeeId) {
    console.error('Error: Missing employeeId');
    return null;
  }

  const callsRef = collection(db, 'calls');
  const ongoingCallsQuery = query(
    callsRef,
    where('status', '==', 'initiated'),
    where('receiverIds', 'array-contains', employeeId),
    where('answers', 'not-in', [employeeId])
  );

  try {
    const querySnapshot = await getDocs(ongoingCallsQuery);

    if (!querySnapshot.empty) {
      const callDoc = querySnapshot.docs[0];
      return callDoc.id;
    }

    return null;
  } catch (error) {
    console.error('Error checking ongoing call:', error);
    return null;
  }
};

// Join an ongoing call
export const joinOngoingCall = async (): Promise<SimplePeer.Instance | null> => {
  const employeeId = getEmployeeIdFromLocalStorage();

  if (!employeeId) {
    console.error('Error: Missing employeeId');
    return null;
  }

  const callId = await checkOngoingCall();
  if (!callId) {
    console.log('No ongoing call to join');
    return null;
  }

  try {
    const callRef = doc(db, 'calls', callId);
    const callDoc = await getDoc(callRef);

    if (!callDoc.exists()) {
      console.error('Call not found in Firestore');
      return null;
    }

    const callData = callDoc.data();
    const offer = callData.offer;
    const iceCandidates = callData.iceCandidates || [];

    if (!offer) {
      console.error('No offer available to join the call');
      return null;
    }

    // Add receiver to call
    await updateDoc(callRef, { receiverIds: arrayUnion(employeeId) });

    const peer = createPeerConnection(false, {
      stream: await getLocalStream(),
      onSignal: (signal) => {
        // Send signal to Firestore as the answer
        setDoc(doc(db, 'calls', callId), { answer: signal }, { merge: true });
      },
      onStream: (stream) => {
        console.log('Received remote stream:', stream);
      },
    });

    // Process ice candidates and offer
    iceCandidates.forEach((candidate: IceCandidate) => {
      peer.signal(candidate.candidate);
    });
    peer.signal(offer);

    return peer;
  } catch (error) {
    console.error('Error joining call:', error);
    return null;
  }
};
