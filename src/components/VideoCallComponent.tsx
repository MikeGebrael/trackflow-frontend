import React, { useState, useEffect, useRef } from 'react';
import { Employee, getAllEmployees } from '../services/employeeService';
import { Button } from 'react-bootstrap';
import {
  initiateCall,
  joinOngoingCall,
  checkOngoingCall,
  getLocalStream,
  getRemoteStream,
} from '../services/webrtcService';
import { getEmployeeIdFromLocalStorage } from '../services/employeeService';

/**
 * VideoCallComponent
 *
 * The VideoCallComponent handles the video calling functionality for the application, enabling employees to initiate or join ongoing video calls.
 * It allows users to select multiple employees to call, initiate a call, and join an ongoing call. The component manages the local and remote media streams
 * (video and audio), provides a UI for video display, and allows for seamless interaction during calls.
 *
 * Components displayed include:
 * - A list of employees: Checkboxes to select multiple employees to initiate a call.
 * - `Button`: Allows the user to start a call or join an ongoing call.
 * - `video`: Displays the local and remote video streams for the ongoing call.
 *
 * States:
 * - `employees` (Employee[]): Holds the list of all employees fetched from the server.
 * - `selectedEmployees` (string[]): Keeps track of the selected employees to be included in the call.
 * - `isCalling` (boolean): Indicates if the call has been initiated by the user.
 * - `ongoingCallId` (string | null): Stores the ID of an ongoing call, if any.
 * - `isJoining` (boolean): Indicates if the user is in the process of joining an ongoing call.
 * - `localStream` (MediaStream | null): Stores the local media stream for the user (video/audio).
 * - `remoteStream` (MediaStream | null): Stores the remote media stream from the peer during the call.
 *
 * Refs:
 * - `localVideoRef`: Ref for the local video element to display the local stream.
 * - `remoteVideoRef`: Ref for the remote video element to display the incoming peer stream.
 *
 * Methods:
 * - `toggleSelection`: Toggles the selection of employees to be called.
 * - `handleInitiateCall`: Handles the logic for initiating a call to the selected employees.
 * - `handleAcceptCall`: Handles joining an ongoing call if there is one.
 * - `renderLocalVideo`: Renders the local video stream in the video player.
 * - `renderRemoteVideo`: Renders the remote video stream from the peer.
 *
 * Usage:
 * This component is primarily used for video calling between employees. It allows the admin or employee to select one or more other employees
 * to initiate a video call or join an ongoing call. It integrates with the `webrtcService` to manage the WebRTC peer connection, including 
 * stream handling, signaling, and media playback.
 *
 * Example:
 * ```
 * <VideoCallComponent />
 * ```
 */

const VideoCallComponent = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [ongoingCallId, setOngoingCallId] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeList = await getAllEmployees();
        setEmployees(employeeList);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const checkCallStatus = async () => {
      const employeeId = getEmployeeIdFromLocalStorage();
      if (employeeId) {
        const callId = await checkOngoingCall();
        if (callId) {
          setOngoingCallId(callId);
        }
      }
    };
    checkCallStatus();
  }, []);

  const toggleSelection = (employeeId: string) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const handleInitiateCall = async () => {
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee to call.');
      return;
    }

    try {
      const localStream = await getLocalStream();
      if (localStream) {
        setLocalStream(localStream);
        const callId = await initiateCall(selectedEmployees);
        if (callId) {
          console.log('Call initiated with ID:', callId);
          setIsCalling(true);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
        }
      } else {
        console.error('Failed to get local stream');
      }
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  const handleAcceptCall = async () => {
    if (ongoingCallId) {
      setIsJoining(true);
      try {
        const peer = await joinOngoingCall();
        if (peer) {
          const remoteStream = await getRemoteStream(peer);
          setRemoteStream(remoteStream);
          if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        }
      } catch (error) {
        console.error('Error accepting call:', error);
      }
    }
  };

  const renderLocalVideo = () => {
    return localStream && (
      <video ref={localVideoRef} autoPlay muted playsInline width="300" />
    );
  };

  const renderRemoteVideo = () => {
    return remoteStream && (
      <video ref={remoteVideoRef} autoPlay playsInline width="300" />
    );
  };

  return (
    <div>
      <h3>Video Call</h3>
      <div>
        {employees.map((employee) => (
          <div key={employee._id}>
            <input
              type="checkbox"
              onChange={() => toggleSelection(employee._id)}
              checked={selectedEmployees.includes(employee._id)}
            />
            {employee.firstName} {employee.lastName}
          </div>
        ))}
      </div>

      <div>
        {!isCalling && !ongoingCallId ? (
          <Button onClick={handleInitiateCall}>Start Call</Button>
        ) : ongoingCallId ? (
          <>
            <Button onClick={handleAcceptCall} disabled={isJoining}>
              {isJoining ? 'Joining...' : 'Join Call'}
            </Button>
            {isJoining && <p>Joining call...</p>}
          </>
        ) : null}
      </div>

      <div>
        {renderLocalVideo()}
        {renderRemoteVideo()}
      </div>
    </div>
  );
};

export default VideoCallComponent;
