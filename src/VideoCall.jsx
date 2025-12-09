import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';

const VideoCall = () => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState('Idle'); // Idle, Calling, Connected

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    // Generate a simple 6-character ID
    const generateShortId = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const myId = generateShortId();
    const peer = new Peer(myId);

    peer.on('open', (id) => {
      setPeerId(id);
      console.log('My peer ID is: ' + id);
    });

    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // Show local video
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          // Answer the call with our stream
          call.answer(stream);
          setCallStatus('Connected');

          // Receive remote stream
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        })
        .catch(err => {
          console.error('Failed to get local stream', err);
        });
    });

    peerInstance.current = peer;

    return () => {
      peer.destroy();
    };
  }, []);

  const callPeer = (remoteId) => {
    setCallStatus('Calling...');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Show local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const call = peerInstance.current.call(remoteId, stream);

        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          setCallStatus('Connected');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });
      })
      .catch(err => {
        console.error('Failed to get local stream', err);
        setCallStatus('Error');
      });
  };

  return (
    <div className="video-call-container">
      <div className="controls">
        <h3>My ID: <span className="highlight">{peerId}</span></h3>
        <div className="join-controls">
          <input
            type="text"
            value={remotePeerIdValue}
            onChange={(e) => setRemotePeerIdValue(e.target.value)}
            placeholder="Enter Remote Peer ID"
          />
          <button onClick={() => callPeer(remotePeerIdValue)}>Call</button>
        </div>
        <p>Status: {callStatus}</p>
      </div>

      <div className="video-grid">
        <div className="video-wrapper local">
          <video ref={localVideoRef} autoPlay muted playsInline />
          <span className="label">You</span>
        </div>
        <div className="video-wrapper remote">
          <video ref={remoteVideoRef} autoPlay playsInline />
          <span className="label">Remote</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
