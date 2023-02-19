import { AppDataSource } from "../../db";
import { User } from "../../entities/user";
import { verifyEmail } from "./getEmailVerifyToken";
import jwt from "jsonwebtoken";
import { validate } from "class-validator";

export default async function (
  email: string,
  emailVerifyCodeAnswer: string,
  emailVerifyToken: string
) {
  if (!verifyEmail(email, emailVerifyCodeAnswer, emailVerifyToken))
    throw "登录失败：邮箱验证未通过。";
  // create user object if not exist
  const userRepo = AppDataSource.getRepository(User);
  let user = await userRepo.findOneBy({
    email,
  });
  if (!user) {
    user = new User();
    const errors = await validate(user);
    if (errors.length) {
      throw "添加用户失败，数据校验未通过";
    }
    user.email = email;
  }
  await userRepo.save(user);
  // sign jwt
  return jwt.sign(String(user.id), process.env.JWT_SECRET);
}
