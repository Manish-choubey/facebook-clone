import { IAuthDocument } from '../../../feature/auth/interfaces/auth.interface';
import { AuthModel } from '../../../feature/auth/models/auth.schema';
import { Helpers } from '../../globals/helpers/helper';

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }

  public async UpdatePassordtoken(authId:string,token:string,tokenExpiration:number): Promise<void> {
    await AuthModel.updateOne({_id:authId},{
      passwordRestToken:token,
      passwordresetExpiration:tokenExpiration
    });
  }

  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ username: Helpers.firstLetterUppercase(username) }, { email: Helpers.lowerCase(email) }]
    };
    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }

  public async getAuthUserByUsername(username: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ username: Helpers.firstLetterUppercase(username) }).exec()) as IAuthDocument;
    return user;
  }
  public async getAuthUserByEmail(email: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ username: Helpers.lowerCase(email) }).exec()) as IAuthDocument;
    return user;
  }

  public async getAuthUserByPasswordresetToken(token: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({
      passwordRestToken:token,
      passwordresetExpiration:{$gt:Date.now()}}
    ).exec()) as IAuthDocument;
    return user;
  }
}





export const authService: AuthService = new AuthService();
