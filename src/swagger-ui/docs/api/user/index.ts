import signUpWithEmail from './signUpWithEmail';
import checkDuplicatedEmail from './checkDuplicatedEmail';
import loginWithEmail from './loginWithEmail';
import tickets from './tickets';
import ticket from './ticket';

export default {
  ...signUpWithEmail,
  ...checkDuplicatedEmail,
  ...loginWithEmail,
  ...tickets,
  ...ticket,
};
