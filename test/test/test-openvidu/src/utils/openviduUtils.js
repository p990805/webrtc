// src/utils/openviduUtils.js
import axios from 'axios';

// Vite 환경 변수 사용 (VITE_APP_API_URL을 `.env` 파일에서 설정 가능)
const APPLICATION_SERVER_URL = import.meta.env.VITE_APP_API_URL || 'https://demos.openvidu.io/';

/**
 * 지정한 sessionId로 세션을 생성합니다.
 * @param {string} sessionId 
 * @returns {Promise<string>} 생성된 세션 ID
 */
export const createSession = async (sessionId) => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/api/sessions`,
      { customSessionId: sessionId },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // 생성된 sessionId 반환
  } catch (error) {
    console.error('세션 생성 오류:', error);
    throw error;
  }
};

/**
 * 지정한 세션에 대한 토큰을 생성합니다.
 * @param {string} sessionId 
 * @returns {Promise<string>} 생성된 토큰
 */
export const createToken = async (sessionId) => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/api/sessions/${sessionId}/connections`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // 생성된 토큰 반환
  } catch (error) {
    console.error('토큰 생성 오류:', error);
    throw error;
  }
};

/**
 * 지정한 세션 ID에 대해 세션 생성 후 토큰을 가져옵니다.
 * @param {string} sessionId 
 * @returns {Promise<string>} 토큰
 */
export const getToken = async (sessionId) => {
  try {
    const session = await createSession(sessionId);
    return await createToken(session);
  } catch (error) {
    console.error('토큰 가져오기 오류:', error);
    throw error;
  }
};
