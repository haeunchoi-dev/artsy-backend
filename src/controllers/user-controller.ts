interface UserServiceType {
  siginUpWithEmail: (
    displayName: string,
    email: string,
    password: string,
  ) => Promise<any>; // 'any' 타입은 실제 반환 타입으로 교체해야 합니다.
}

interface UserControllerProps {
  userService: UserServiceType;
}

class UserController {
  private userService: UserServiceType;
  constructor({ userService }: UserControllerProps) {
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
