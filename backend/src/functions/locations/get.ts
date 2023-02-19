import { AppDataSource } from "../../db";
import { Location } from "../../entities/location";

export default async function (map: string) {
  const locationRepo = AppDataSource.getRepository(Location);
  const locations = await locationRepo.findBy({ map });
  return locations;
}
