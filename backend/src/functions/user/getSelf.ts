import { AppDataSource } from "../../db";
import { verifyJwt } from "../../utils";
import { User } from "../../entities/user";

export default async function (jwt: string) {
  const userId = verifyJwt(jwt) as string;
  const userRepo = AppDataSource.getRepository(User);
  return await userRepo.findOneBy({
    id: parseInt(userId),
  }) || undefined;
}
