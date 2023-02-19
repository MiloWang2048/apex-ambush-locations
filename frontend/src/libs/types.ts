export type ApexMapName =
  | "kings_canyon"
  | "worlds_edge"
  | "olympus"
  | "storm_point";

export interface ApexMap {
  name: ApexMapName;
  displayName: string;
  imgUrl: string;
  width: number;
  height: number;
}
