import { api } from '@/test-structure/libs';

import testController from './testController';

export default function initApiController(app) {
  api.init(app);

  testController({ api, app });
}


