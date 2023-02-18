import { AppDataSource } from "../../db";
import { Location } from "../../entities/location";

export default async function (map: string) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const locationRepo = AppDataSource.getRepository(Location);
  const locations = await locationRepo.findBy({ map });
  await AppDataSource.destroy();
  return locations;
}
