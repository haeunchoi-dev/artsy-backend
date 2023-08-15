class UserController {
  constructor({ userService }) {
    this.userService = userService;
  }

  siginUpWithEmail = async (req, res) => {
    const { displayName, email, password } = req.body;

    const newUser = await this.userService.siginUpWithEmail(
      displayName,
      email,
      password,
    );
    res.status(200).json({ success: true, artsyData: newUser });
  };
}

export default UserController;
