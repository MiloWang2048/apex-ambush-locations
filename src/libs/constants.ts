import { ApexMap, ApexMapName } from "../types";

export const Maps: Record<ApexMapName, ApexMap> = {
  kings_canyon: {
    name: "kings_canyon",
    displayName: "诸王峡谷",
    imgUrl: "/Kings_Canyon_MU4.webp",
    width: 2048,
    height: 2048,
  },
  worlds_edge: {
    name: "worlds_edge",
    displayName: "世界边缘",
    imgUrl: "/Worlds_Edge_MU3_REV1.webp",
    width: 2048,
    height: 2048,
  },
  olympus: {
    name: "olympus",
    displayName: "奥林匹斯",
    imgUrl: "/Olympus_MU2_REV1.webp",
    width: 2048,
    height: 2048,
  },
  storm_point: {
    name: "storm_point",
    displayName: "风暴点",
    imgUrl: "/Storm_Point_MU1.webp",
    width: 2048,
    height: 2048,
  },
};

export const DefaultMap = Maps.kings_canyon;
