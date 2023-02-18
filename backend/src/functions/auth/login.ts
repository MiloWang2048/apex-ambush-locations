import { AppDataSource } from "../../db";
import { User } from "../../entities/user";
import { verifyEmail } from "./getEmailVerifyToken";
import jwt from "jsonwebtoken";

export default async function (
  email: string,
  emailVerifyCodeAnswer: string,
  emailVerifyToken: string
) {
  if (!verifyEmail(email, emailVerifyCodeAnswer, emailVerifyToken))
    throw "登录失败：邮箱验证未通过。";
  if (!AppDataSource.isInitialized) AppDataSource.initialize();
  // create user object if not exist
  const userRepo = AppDataSource.getRepository(User);
  let user = await userRepo.findOneBy({
    email,
  });
  if (!user) {
    user = new User();
    user.email = email;
  }
  userRepo.save(user);
  await AppDataSource.destroy();
  // sign jwt
  return jwt.sign(String(user.id), process.env.JWT_SECRET);
}
