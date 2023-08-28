import signUp from './signUp';
import checkDuplicatedEmail from './checkDuplicatedEmail';
import login from './login';
import tickets from './tickets';
import ticket from './ticket';
import info from './info';
import logout from './logout';
import checkPassword from './checkPassword';

export default {
  ...signUp,
  ...checkDuplicatedEmail,
  ...login,
  ...tickets,
  ...ticket,
  ...info,
  ...logout,
  ...checkPassword,
};
