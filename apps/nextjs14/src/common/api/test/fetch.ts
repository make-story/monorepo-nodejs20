import {
  FetchManager,
  API_TYPE,
  URL_PATH,
  FetchConfig,
} from '@ysm/fetch-manager';

import { getPromiseData } from '@/common/utils/fetch';

export const getTestDataList = (params: any, fetchManager: FetchManager) =>
  getPromiseData(
    fetchManager[API_TYPE.TEST]({
      url: URL_PATH.TEST.LIST,
      params,
    }),
  );
