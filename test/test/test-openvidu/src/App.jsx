import React, { useState, useEffect, useCallback } from "react";
import { OpenVidu } from "openvidu-browser";
import JoinSession from "./components/JoinSession";
import SessionView from "./components/SessionView";
import { getToken } from "./utils/openviduUtils";

const App = () => {
  const [mySessionId, setMySessionId] = useState("SessionA");
  const [myUserName, setMyUserName] = useState(
    `Participant${Math.floor(Math.random() * 100)}`
  );
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  let OV = null;

  // 🔹 창이 닫힐 때 세션을 종료
  useEffect(() => {
    const handleBeforeUnload = () => leaveSession();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 🔹 세션 종료 함수
  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
    }
    OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("SessionA");
    setMyUserName(`Participant${Math.floor(Math.random() * 100)}`);
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setCurrentVideoDevice(null);
  }, [session]);

  // 🔹 세션 참여 함수
  const joinSession = useCallback(
    async (event) => {
      event.preventDefault();
      OV = new OpenVidu();
      const newSession = OV.initSession();

      setSession(newSession);

      // 새로운 스트림 생성 시 처리 (본인의 스트림은 구독하지 않음)
      newSession.on("streamCreated", (event) => {
        if (
          event.stream.connection.connectionId === newSession.connection.connectionId
        ) {
          return;
        }
        const subscriber = newSession.subscribe(event.stream, undefined);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      newSession.on("streamDestroyed", (event) => {
        setSubscribers((prevSubscribers) =>
          prevSubscribers.filter(
            (sub) => sub !== event.stream.streamManager
          )
        );
      });

      newSession.on("exception", (exception) => console.warn(exception));

      try {
        const token = await getToken(mySessionId);
        await newSession.connect(token, { clientData: myUserName });

        console.log("🔹 OpenVidu 세션 연결 성공!");

        // 🔹 퍼블리셔 초기화 (내 카메라 스트림)
        const newPublisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: false,
        });

        newSession.publish(newPublisher);
        console.log("🔹 OpenVidu 퍼블리셔 스트림 생성 성공!");

        const devices = await OV.getDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const currentVideoDeviceId = newPublisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .getSettings().deviceId;
        const currentDevice = videoDevices.find(
          (device) => device.deviceId === currentVideoDeviceId
        );

        setCurrentVideoDevice(currentDevice);
        setMainStreamManager(newPublisher);
        setPublisher(newPublisher);
      } catch (error) {
        console.log("세션 연결 중 에러 발생:", error.code, error.message);
      }
    },
    [mySessionId, myUserName]
  );

  // 🔹 카메라 변경 함수
  const switchCamera = useCallback(async () => {
    try {
      const devices = await OV.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices.length > 1) {
        const newVideoDevices = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevices.length > 0) {
          const newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevices[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          await session.unpublish(mainStreamManager);
          await session.publish(newPublisher);

          setCurrentVideoDevice(newVideoDevices[0]);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [session, mainStreamManager, currentVideoDevice]);

  return (
    <div className="h-1 bg-white text-white">
      {session === undefined ? (
        <JoinSession
          mySessionId={mySessionId}
          myUserName={myUserName}
          handleChangeSessionId={(e) => setMySessionId(e.target.value)}
          handleChangeUserName={(e) => setMyUserName(e.target.value)}
          joinSession={joinSession}
        />
      ) : (
        <SessionView
          session={session}
          mySessionId={mySessionId}
          myUserName={myUserName}
          mainStreamManager={mainStreamManager}
          publisher={publisher}
          subscribers={subscribers}
          handleMainVideoStream={setMainStreamManager}
          leaveSession={leaveSession}
          switchCamera={switchCamera}
        />
      )}
    </div>
  );
};

export default App;
