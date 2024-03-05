/**
 * 소켓 전송 메시지 규칙 (포맷 가공)
 */
export const messageRules = (
  type: string,
  message: string,
  payload: any = {},
) => {
  return JSON.stringify({ type, message, payload });
};
