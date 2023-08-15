class UserService {
  constructor({ userModel, bcrypt, errorNames }) {
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
