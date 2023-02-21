import { AppDataSource } from "../../db";
import { Location } from "../../entities/location";
import { User } from "../../entities/user";
import { verifyJwt } from "../../utils";

export default async function (jwt: string) {
  const userId = +verifyJwt(jwt);
  const locationRepo = AppDataSource.getRepository(Location);
  const locations = await locationRepo.findBy({ userId });
  return locations;
}
