// components/SessionHeader.js
import React from 'react';

const SessionHeader = ({ mySessionId, leaveSession, switchCamera }) => {
  return (
    <div id="session-header">
      <h1 id="session-title">{mySessionId}</h1>
      <input
        className="btn btn-large btn-danger"
        type="button"
        id="buttonLeaveSession"
        onClick={leaveSession}
        value="Leave session"
      />
      <input
        className="btn btn-large btn-success"
        type="button"
        id="buttonSwitchCamera"
        onClick={switchCamera}
        value="Switch Camera"
      />

      <input type="button" value="이게 바로 sessionHeader입니다." className="bg-red-500 text-white font-bold p-3"/>
    </div>
  );
};

export default SessionHeader;
