import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
import Avatar from './Avatar';

// ═══════════════════════════════════════════════════════
// LUCIDE ICONS (Professional SVG)
// ═══════════════════════════════════════════════════════
const Icons = {
  Mic: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" x2="12" y1="19" y2="22"></line>
    </svg>
  ),
  MicOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" x2="22" y1="2" y2="22"></line>
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"></path>
      <path d="M5 10v2a7 7 0 0 0 12 5"></path>
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"></path>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12"></path>
      <line x1="12" x2="12" y1="19" y2="22"></line>
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 10 5.11-3.07a1 1 0 0 1 1.51.86v8.42a1 1 0 0 1-1.51.86L16 14v-4Z"></path>
      <rect width="14" height="14" x="2" y="5" rx="2"></rect>
    </svg>
  ),
  VideoOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.68 5.36 2.17 13.87A2 2 0 0 0 2 15v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-.17-1.13L16 8"></path>
      <line x1="2" x2="22" y1="2" y2="22"></line>
    </svg>
  ),
  Monitor: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  ),
  PhoneOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
      <line x1="22" x2="2" y1="2" y2="22"></line>
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
      <circle cx="12" cy="13" r="3"></circle>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  ),
  Bot: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"></path>
      <rect width="16" height="12" x="4" y="8" rx="2"></rect>
      <path d="M2 14h2"></path>
      <path d="M20 14h2"></path>
      <path d="M15 13v2"></path>
      <path d="M9 13v2"></path>
    </svg>
  )
};

const VideoCall = () => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [callStatus, setCallStatus] = useState('Idle');
  const [error, setError] = useState('');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const generateShortId = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    const myId = generateShortId();
    const peer = new Peer(myId);

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('error', (err) => {
      if (err.type !== 'webrtc') {
        setError('PeerJS Error: ' + err.type);
      }
    });

    peer.on('call', (call) => {
      setCallStatus('Connected');
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
          });
        })
        .catch(err => {
          setError('Camera Error: ' + err.message);
        });
    });

    peerInstance.current = peer;
    return () => peer.destroy();
  }, []);

  const callPeer = (remoteId) => {
    if (!remoteId) {
      setError("Please enter a valid ID");
      return;
    }
    setCallStatus('Calling...');
    setError('');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        const call = peerInstance.current.call(remoteId, stream);

        call.on('stream', (remoteStream) => {
          setCallStatus('Connected');
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });

        call.on('error', (err) => {
          setError('Call Error: ' + err.type);
          setCallStatus('Idle');
        });
      })
      .catch(err => {
        setError('Camera Error: ' + err.message);
        setCallStatus('Idle');
      });
  };

  const endCall = () => window.location.reload();

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    }
  };

  // ═══════════════════════════════════════════════════════
  // RENDER: LANDING PAGE
  // ═══════════════════════════════════════════════════════
  if (callStatus === 'Idle') {
    return (
      <div className="lobby-container">
        <div className="lobby-card">
          <h1 className="brand-title">ISL Translator</h1>
          <p className="subtitle">Real-time Sign Language Translation</p>

          <div className="id-section">
            <p className="id-label">Your ID</p>
            <div className="id-display" onClick={() => navigator.clipboard.writeText(peerId)} title="Click to copy">
              {peerId || '...'}
            </div>
          </div>

          <div className="input-group">
            <input
              className="lobby-input"
              type="text"
              value={remotePeerIdValue}
              onChange={(e) => setRemotePeerIdValue(e.target.value)}
              placeholder="Enter Meeting ID"
              onKeyPress={(e) => e.key === 'Enter' && callPeer(remotePeerIdValue)}
            />
          </div>

          <button className="btn-join" onClick={() => callPeer(remotePeerIdValue)}>
            Join Meeting
          </button>

          <div className="service-badge">
            <span className="status-dot-green"></span>
            <span>Service Active</span>
          </div>

          {error && <p style={{ color: '#EF4444', marginTop: '1rem', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RENDER: MEETING ROOM
  // ═══════════════════════════════════════════════════════
  return (
    <div className="meeting-container">

      {/* Video Grid */}
      <div className="video-grid">
        {/* Remote Video */}
        <div className="video-tile active-speaker">
          <video ref={remoteVideoRef} autoPlay playsInline />
          <div className="name-tag">
            <span>Remote User</span>
          </div>
        </div>

        {/* Local Video */}
        <div className="video-tile">
          <video ref={localVideoRef} autoPlay muted playsInline />
          {!isCamOn && (
            <div className="camera-off-placeholder">
              <Icons.Camera />
              <span>Camera Off</span>
            </div>
          )}
          <div className="name-tag">
            <span>You</span>
            {!isMicOn && <span style={{ color: '#EF4444', fontSize: '12px' }}>🔇</span>}
          </div>
        </div>
      </div>

      {/* AI Translator Overlay */}
      {/* AI Translator Overlay - Always Visible */}
      {/* AI Translator Overlay - Interactive Two-State System */}

      {/* STATE 1: SMALL BUTTON (Default) */}
      {/* AI Translator Overlay */}
      <div
        className={`avatar-overlay ${!isAvatarExpanded ? 'minimized' : ''}`}
        onClick={() => !isAvatarExpanded && setIsAvatarExpanded(true)}
      >
        {isAvatarExpanded ? (
          <>
            <div className="avatar-header">
              <div className="avatar-label">
                <span style={{ color: '#10B981', marginRight: '8px' }}>●</span> AI TRANSLATOR
              </div>
              <button
                className="btn-minimize"
                onClick={(e) => { e.stopPropagation(); setIsAvatarExpanded(false); }}
              >
                <Icons.X />
              </button>
            </div>

            <div className="avatar-circle">
              <Avatar />
            </div>

            <div className="captions-box">
              <p className="caption-text">
                Listening for speech and sign language...
              </p>
            </div>
          </>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            <Avatar />
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="toolbar">
        <button
          className={`tool-btn mic ${isMicOn ? 'active' : 'inactive'}`}
          onClick={toggleMic}
          title={isMicOn ? "Mute" : "Unmute"}
        >
          {isMicOn ? <Icons.Mic /> : <Icons.MicOff />}
        </button>

        <button
          className={`tool-btn video ${isCamOn ? 'active' : 'inactive'}`}
          onClick={toggleCam}
          title={isCamOn ? "Turn Off Camera" : "Turn On Camera"}
        >
          {isCamOn ? <Icons.Video /> : <Icons.VideoOff />}
        </button>

        <button className="tool-btn" title="Share Screen">
          <Icons.Monitor />
        </button>

        <button className="tool-btn leave" onClick={endCall} title="Leave Meeting">
          <Icons.PhoneOff />
        </button>
      </div>

    </div>
  );
};

export default VideoCall;
