export const setUrlQuery = (url: string, parameter: string) => {
  return `${url}${url.indexOf('?') === -1 ? '?' : '&'}${parameter}`;
};

export default {};
