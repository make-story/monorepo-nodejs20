/**
 * https://stackblitz.com/edit/github-jjtp7l?file=pages%2Fapi%2Fset-api-cookie.ts,pages%2Fapi%2Fget-api-cookie.ts
 */
import { getCookie, getCookies } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function getApiCookie(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const currentCookie = getCookie('api-cookie', { req, res });
    const allCookies = getCookies({ req, res });

    console.log('currentCookie: ', currentCookie);
    console.log('allCookies: ', allCookies);
    res.status(200).send('get api cookies');
  } catch (error) {
    res.status(400).send(error);
  }
}
