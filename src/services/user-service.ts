interface UserModel {
  findByEmail: (email: string) => Promise<any[]>;
  create: (
    displayName: string,
    email: string,
    password: string,
  ) => Promise<any>;
}

interface Bcrypt {
  hash: (password: string, saltRounds: number) => Promise<string>;
}

interface ErrorNames {
  EMAIL_ALREADY_EXISTS: string;
}

interface UserServiceProps {
  userModel: UserModel;
  bcrypt: Bcrypt;
  errorNames: ErrorNames;
}
class UserService {
  private userModel: UserModel;
  private bcrypt: Bcrypt;
  private errorNames: ErrorNames;

  constructor({ userModel, bcrypt, errorNames }: UserServiceProps) {
    this.userModel = userModel;
    this.bcrypt = bcrypt;
    this.errorNames = errorNames;
  }

  async siginUpWithEmail(displayName, email, password) {
    const user = await this.userModel.findByEmail(email);

    if (user.length > 0) {
      throw new Error(this.errorNames.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.bcrypt.hash(password, 10);
    const createdNewUser = await this.userModel.create(
      displayName,
      email,
      hashedPassword,
    );

    return createdNewUser;
  }
}

export default UserService;
