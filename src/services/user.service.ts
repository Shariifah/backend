import UserModel from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/authUtils";
import { UserDocument } from "../types/interfaces";


class UserService {
  
  // Service pour créer un utilisateur
  async register(lastname: string, firstname: string, phonenumber: string, password: string) : Promise<any> {
    // Vérifier si l'utilisateur existe déjà
    const user: UserDocument | null = await UserModel.findOne({ phonenumber: phonenumber });
    if (user) {
      throw new Error("L'utilisateur existe déjà");
    }
    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);
    // Créer un nouvel utilisateur
    const newUser = await UserModel.create({
      lastname,
      firstname,
      phonenumber,
      password: hashedPassword,
    });
    // Retourner le nouvel utilisateur
    return newUser;
  };

  // Trouver un utilisateur par numéro de téléphone
  async findByPhonenumber(phonenumber: string): Promise<UserDocument | any> {
    const user = await UserModel.findOne({ phonenumber: phonenumber });
    return user;
  };

  // Service pour l'authentification d'un utilisateur
  async signin(phonenumber: string, password: string): Promise<UserDocument | any> {
    // Vérifier si l'utilisateur existe
    const user: UserDocument | null = await UserModel.findOne({ phonenumber: phonenumber });
    if (!user) throw new Error("Telephone ou mot de passe invalides.");
    // Vérifier si le mot de passe est correct
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Telephone ou mot de passe invalides.");
    // Vérifier si le compte est inactif ou suspendu
    if(user.status === 'inactive') throw new Error("Compte inactif. Veuillez contacter l'administrateur.");
    if(user.status === 'suspended') throw new Error("Compte suspendu. Veuillez contacter l'administrateur.");
    // Retoruner l'utilisateur
    return user;
  };

  // Réinitialiser le mot de passe d'un utilisateur
  async resetPassword(userId: string, newPassword: string) : Promise<any> {
    // Hacher le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);
    // Mettre à jour le mot de passe de l'utilisateur
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }

}


export default new UserService();
