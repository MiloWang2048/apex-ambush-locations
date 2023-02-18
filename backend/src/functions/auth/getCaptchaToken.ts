import svgCaptcha from "svg-captcha";
import { logger } from "../../utils";
import { decryptAES, encryptAES } from "../../utils";

export default function () {
  const captcha = svgCaptcha.create();
  const captchaToken = encryptAES(captcha.text);
  return { captcha: captcha.data, captchaToken };
}

export function verifyCaptcha(userAnswer: string, token: string) {
  try {
    return userAnswer === decryptAES(token);
  } catch (err) {
    logger.warn("Abnormal captcha verification:", err);
    return false;
  }
}
