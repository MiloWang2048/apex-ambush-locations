import { string } from "mathjs";

export type ApexMapName =
  | "kings_canyon"
  | "worlds_edge"
  | "olympus"
  | "storm_point";

export type Id = string;

export interface ApexMap {
  name: ApexMapName;
  displayName: string;
  imgUrl: string;
  width: number;
  height: number;
}

export interface AmbushLocation {
  name: string;
  map: ApexMapName;
  x: number;
  y: number;
  description: string;
}
