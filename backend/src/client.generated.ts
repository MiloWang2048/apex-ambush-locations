/**
 * This file is generated and should NOT be modified manually.
 */

import axios, { type AxiosInstance } from "axios";
import { generateClientHandler } from "ts-rpc";

import type auth_getCaptchaToken from "./functions/auth/getCaptchaToken";
import type auth_getEmailVerifyToken from "./functions/auth/getEmailVerifyToken";
import type auth_login from "./functions/auth/login";
import type locations_add from "./functions/locations/add";
import type locations_delete from "./functions/locations/delete";
import type locations_get from "./functions/locations/get";
import type locations_getMine from "./functions/locations/getMine";
import type locations_update from "./functions/locations/update";
import type user_getSelf from "./functions/user/getSelf";

let agent = axios.create({
  baseURL: "http://localhost:3000",
});

export function setAgent(_agent: AxiosInstance) {
  agent = _agent;
}


export default {
  auth: {
    getCaptchaToken: generateClientHandler<typeof auth_getCaptchaToken>("auth_getCaptchaToken", agent),
    getEmailVerifyToken: generateClientHandler<typeof auth_getEmailVerifyToken>("auth_getEmailVerifyToken", agent),
    login: generateClientHandler<typeof auth_login>("auth_login", agent),
  },
  locations: {
    add: generateClientHandler<typeof locations_add>("locations_add", agent),
    delete: generateClientHandler<typeof locations_delete>("locations_delete", agent),
    get: generateClientHandler<typeof locations_get>("locations_get", agent),
    getMine: generateClientHandler<typeof locations_getMine>("locations_getMine", agent),
    update: generateClientHandler<typeof locations_update>("locations_update", agent),
  },
  user: {
    getSelf: generateClientHandler<typeof user_getSelf>("user_getSelf", agent),
  },
};
