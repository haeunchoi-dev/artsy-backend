import { api } from '@/test-structure/libs';

import userController from './userController';

export default function initApiController(app) {
  console.log('하이');

  api.init(app);

  userController({ api, app });
}


