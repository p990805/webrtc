import React, { useRef, useEffect } from "react";

const OpenViduVideoComponent = ({ streamManager }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return <video autoPlay ref={videoRef} className="w-full h-full object-cover" />;
};

export default OpenViduVideoComponent;
