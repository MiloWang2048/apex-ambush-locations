import { AppDataSource } from "../../db";
import { Location } from "../../entities/location";
import { validate } from "class-validator";
import { verifyJwt } from "../../utils";

export default async function (jwt: string, _location: Location) {
  const userId = verifyJwt(jwt) as string;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const locationRepo = AppDataSource.getRepository(Location);
  let location = await locationRepo.findOneBy({ id: _location.id });
  if (!location) throw "点位不存在";
  if (location.userId !== +userId) throw "不能修改别人的点位";
  Object.assign(location, _location);
  const err = await validate(location);
  if (err.length) throw "数据校验失败";
  location = await locationRepo.save(location);
  await AppDataSource.destroy();
  return location;
}
