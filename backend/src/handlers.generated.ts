/**
 * This file is generated and should NOT be modified manually.
 */

import { HandlerMap } from "ts-rpc";

import auth_getCaptchaToken from "./functions/auth/getCaptchaToken";
import auth_getEmailVerifyToken from "./functions/auth/getEmailVerifyToken";
import auth_login from "./functions/auth/login";
import locations_add from "./functions/locations/add";
import locations_delete from "./functions/locations/delete";
import locations_get from "./functions/locations/get";
import locations_getMine from "./functions/locations/getMine";
import locations_update from "./functions/locations/update";
import user_getSelf from "./functions/user/getSelf";

const handlers: HandlerMap = {
  auth_getCaptchaToken,
  auth_getEmailVerifyToken,
  auth_login,
  locations_add,
  locations_delete,
  locations_get,
  locations_getMine,
  locations_update,
  user_getSelf,
}

export default handlers;
