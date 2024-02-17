/**
 * https://stackblitz.com/edit/github-jjtp7l?file=pages%2Fapi%2Fset-api-cookie.ts,pages%2Fapi%2Fremove-api-cookie.ts
 */
import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function setApiCookie(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    deleteCookie('api-cookie', { req, res });
    res.status(200).send('remove api cookies');
  } catch (error) {
    res.status(400).send(error);
  }
}
