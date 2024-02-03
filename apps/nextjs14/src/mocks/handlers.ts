import { http, HttpResponse } from 'msw';

import { Book, Review } from './type';

export const handlers = [
  http.get(
    'https://my.backend/:name',
    ({ request, params, cookies }) => {
      const { id } = params;
      console.log('Fetching user with ID "%s"', id);
      return HttpResponse.text('Hello world');
    },
    {
      once: true,
    },
  ),
  http.post('/login', async ({ request }) => {
    const info = await request.formData();
    console.log('Logging in as "%s"', info.get('username'));
  }),
];
