import UserModel from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/authUtils";
import { UserDocument } from "../types";

// 🔹 Service pour créer un utilisateur
export const register = async (lastname: string, firstname: string, phonenumber: string, password: string) => {
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


// 🔹 Trouver un utilisateur par username
export const findByPhonenumber = async (phonenumber: string) => {
  const user = await UserModel.findOne({ phonenumber: phonenumber });
  return user;
};

// 🔹 Service pour l'authentification d'un utilisateur
export const signin = async (phonenumber: string, password: string) => {
  // Vérifier si l'utilisateur existe
  const user: UserDocument | null = await UserModel.findOne({ phonenumber: phonenumber });
  if (!user) throw new Error("Telephone ou mot de passe invalides.");
  // Vérifier si le mot de passe est correct
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Telephone ou mot de passe invalides.");
  // Retoruner l'utilisateur
  return user;
};


// 🔹 Envoi d'un OTP
export const generateOtp = async (phonenumber: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

// 🔹 Vérification d'un OTP
export const verifyOtp = async (otp: string, phonenumber: string) => {
  // const user = await UserModel.findOne({ phonenumber: phonenumber });
  // if (!user) return null;
  // return user;
};





export default {
  register,
  findByPhonenumber,
  signin,
  generateOtp,
  verifyOtp
};
