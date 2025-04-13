export type User = {
  login: string;
  password: string;
};

export class AuthHelper{
  private static users;

  public static Init() {
    AuthHelper.users = new Map();
    AuthHelper.users.set('Alex', 'alex$secret_password');
    AuthHelper.users.set('Bob', 'bob$secret_password');
  }
  public static async login(
    login: string,
		password: string,) {
      const userPassword = AuthHelper.users.get(login);
      if(!userPassword){
        return Promise.resolve(false);
      }
      if(userPassword !== password){
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
  }
}

AuthHelper.Init();

