import { AppDataSource } from "../../db";
import { Location } from "../../entities/location";
import { verifyJwt } from "../../utils";

export default async function (jwt: string, id: number) {
  const userId = verifyJwt(jwt) as string;
  const locationRepo = AppDataSource.getRepository(Location);
  const location = await locationRepo.findOneBy({ id });
  if (!location) throw "目标点位已不存在。";
  if (location.userId !== +userId) throw "不能删除别人的点位。";
  await locationRepo.delete(location);
}
