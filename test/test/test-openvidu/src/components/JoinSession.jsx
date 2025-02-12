// components/JoinSession.js
import React from 'react';

const JoinSession = ({
  mySessionId,
  myUserName,
  handleChangeSessionId,
  handleChangeUserName,
  joinSession,
}) => {
  return (
    <div id="join" className="w-[80%] mx-auto bg-yellow-500 flex flex-col items-center justify-center">
      <div id="join-dialog" className="flex flex-col gap-5 items-center justify-center">
        <h1 className="font-bold text-3xl ">Join a video session</h1>
        <form className="border p-5" onSubmit={joinSession}>
          <p className="border flex gap-5">
            <label className="font-bold text-xl border-r p-3">Participant </label>
            <input
              className=""
              type="text"
              id="userName"
              value={myUserName}
              onChange={handleChangeUserName}
              required
            />
          </p>
          <p className="border flex gap-5">
            <label className="font-bold text-xl border-r p-3">Session </label>
            <input
              className="form-control"
              type="text"
              id="sessionId"
              value={mySessionId}
              onChange={handleChangeSessionId}
              required
            />
          </p>
          <p className="border flex items-center justify-center p-3 bg-red-500">
            <input
              className="text-white"
              name="commit"
              type="submit"
              value="JOIN"
            />
          </p>
        </form>
      </div>
    </div>
  );
};

export default JoinSession;
