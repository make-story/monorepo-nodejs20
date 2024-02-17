/**
 * https://stackblitz.com/edit/github-jjtp7l?file=pages%2Fapi%2Fset-api-cookie.ts
 */
import { setCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function setApiCookie(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    setCookie('api-cookie', 'mock-values', { req, res, maxAge: 60 * 60 * 24 });
    res.status(200).send('set api cookies');
  } catch (error) {
    res.status(400).send(error);
  }
}
