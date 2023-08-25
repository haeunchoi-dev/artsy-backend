export default class UserDto {
    constructor(private _userId: string) {}
  
    get userId() {
      return this._userId;
    }
  }
  