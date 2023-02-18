import crypto from "crypto-js";
import mysql from "mysql2";
import log4js from "log4js";
import { string } from "joi";
import jwt from "jsonwebtoken";

export const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

export function encryptAES(payload: string) {
  return crypto.AES.encrypt(payload, process.env.JWT_SECRET).toString();
}

export function decryptAES(cipher: string) {
  return crypto.AES.decrypt(cipher, process.env.JWT_SECRET).toString(
    crypto.enc.Utf8
  );
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw "非法身份标识";
  }
}
