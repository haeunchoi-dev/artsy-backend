import signUpWithEmail from './signUpWithEmail';
import checkDuplicatedEmail from './checkDuplicatedEmail';
import loginWithEmail from './loginWithEmail';
import badge from './badge';

export default {
  ...signUpWithEmail,
  ...checkDuplicatedEmail,
  ...loginWithEmail,
  ...badge,
};