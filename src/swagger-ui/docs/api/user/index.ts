import signUp from './signUp';
import checkDuplicatedEmail from './checkDuplicatedEmail';
import loginWithEmail from './loginWithEmail';
import tickets from './tickets';
import ticket from './ticket';
import info from './info';

export default {
  ...signUp,
  ...checkDuplicatedEmail,
  ...loginWithEmail,
  ...tickets,
  ...ticket,
  ...info,
};
