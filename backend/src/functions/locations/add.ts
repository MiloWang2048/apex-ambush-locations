import { AppDataSource } from "../../db";
import { Location } from "../../entities/location";
import { validate } from "class-validator";
import { verifyJwt } from "../../utils";

export default async function (
  jwt: string,
  _location: Omit<Location, "id" | "userId">
) {
  const userId = verifyJwt(jwt) as string;

  const locationRepo = AppDataSource.getRepository(Location);

  let location = new Location();
  Object.assign(location, _location);
  location.userId = +userId;
  const err = await validate(location);
  if (err.length) throw "数据校验失败";
  const res = await locationRepo.insert(location);
  return res;
}
