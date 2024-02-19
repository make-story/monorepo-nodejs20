import striptags from 'striptags';

/**
 * 문자열(html) 내용 중 특정 tag 제거
 * @param html
 * @param tag
 * @returns
 */
export const setRemoveHtmlTag = (html: string, tag: string) => {
  // striptags 도구는 태그 내부 내용까지 제거하지 않기 때문에, 아래 정규식으로 해당 태그 전체(내용포함) 제거
  return html.replace(
    new RegExp(`<${tag}[^>]*>((\n|\r|.)*?)<\\/${tag}>`, 'gim'),
    '',
  );
};

/**
 * html을 text로 변환
 */
export const setConvertHtmlToText = (
  html: string = '',
  {
    isTrim = true,
    isSingleSpace = true,
  }: { isTrim?: boolean; isSingleSpace?: boolean } = {},
) => {
  // html 제거 (striptags 사용하더라도, 특수문자 코드는 제거 안됨. 예: &nbsp; &amp;)
  html = striptags(html);

  if (isTrim) {
    // 시작과 끝 공백 제거
    html = html.trim();
  }
  if (isSingleSpace) {
    // 반복된 공백 단일로 변환
    html = html.replace(/(\s|&nbsp;)+/gm, ' '); // 하나 이상의 공백을 하나로 변경 (http://jira-digit.amorepacific.com:8080/browse/OOP-351)
  }

  return html;
};
