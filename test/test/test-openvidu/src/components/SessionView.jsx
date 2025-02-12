import React from "react";
import UserVideoComponent from "../UserVideoComponent";
import SessionHeader from "./SessionHeader";
import ChatWindow from "./ChatWindow";

const SessionView = ({
  session,
  mySessionId,
  myUserName,
  mainStreamManager,
  publisher,
  subscribers,
  handleMainVideoStream,
  leaveSession,
  switchCamera,
}) => {
  return (
    <div id="session" className="w-screen h-screen flex flex-col bg-black">
      {/* 상단 헤더 */}
      <div className="w-full bg-gray-900 p-4">
        <SessionHeader
          mySessionId={mySessionId}
          leaveSession={leaveSession}
          switchCamera={switchCamera}
        />
      </div>

      {/* 비디오 및 채팅창을 좌우 정렬 */}
      <div className="flex flex-1 gap-3">
        {/* 메인 비디오 영역 */}
        <div className="flex-1 flex flex-col items-center bg-black">
          {/* 비디오 화면 */}
          <div className="w-full max-w-[1280px] h-[720px] flex justify-center items-center bg-black rounded-lg shadow-lg">
            {mainStreamManager && (
              <UserVideoComponent
                streamManager={mainStreamManager}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* 방송 정보 섹션 */}
          <div className="w-full max-w-[1280px] bg-gray-900 text-white p-4 mt-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
              {/* 방송자 프로필 */}
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">
                {myUserName.charAt(0)}
              </div>
              {/* 방송 제목 & 정보 */}
              <div className="flex-1">
                <h2 className="text-xl font-bold">테스트</h2>
              </div>
              
            </div>
          </div>
        </div>

        {/* 오른쪽 채팅창 */}
        <div className="w-[350px] h-full bg-gray-800 text-black p-3 overflow-y-auto rounded shadow-lg">
          <ChatWindow session={session} myUserName={myUserName} />
        </div>
      </div>
    </div>
  );
};

export default SessionView;
