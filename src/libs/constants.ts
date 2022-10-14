import { AmbushLocation, ApexMap, ApexMapName } from "./types";

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

export const testDescription = `# 一级标题
## 二级标题
### 三级标题

段落段落段落段落段落段落段落

**加粗文本**

*斜体文本*

- 无序列表
- 无序列表
- 无序列表
- 无序列表

1. 有序列表
2. 有序列表
3. 有序列表
4. 有序列表

> 引用
>
> 引用

---

[链接](https://markdown.com.cn)

![这是图片](/Kings_Canyon_MU4.webp)
`;

export const testLocations: AmbushLocation[] = [
  {
    name: "name",
    map: "kings_canyon",
    authorId: "636f9d292b8c45189ef18f3ec1d9ff51",
    x: 400,
    y: 400,
    description: "",
  },
  {
    name: "name",
    map: "kings_canyon",
    authorId: "636f9d292b8c45189ef18f3ec1d9ff51",
    x: 400,
    y: 600,
    description: "",
  },
  {
    name: "name",
    map: "kings_canyon",
    authorId: "636f9d292b8c45189ef18f3ec1d9ff51",
    x: 600,
    y: 400,
    description: "",
  },
  {
    name: "name",
    map: "kings_canyon",
    authorId: "636f9d292b8c45189ef18f3ec1d9ff51",
    x: 600,
    y: 600,
    description: "",
  },
];
