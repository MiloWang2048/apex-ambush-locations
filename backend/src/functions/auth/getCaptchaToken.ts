import svgCaptcha from "svg-captcha";
import { logger } from "../../utils";
import { decryptAES, encryptAES } from "../../utils";

interface CaptchaToken {
  captchaText: string;
  expires: number;
}

export interface Captcha {
  captchaSVG: string;
  captchaToken: string;
  expires: number;
}

export default function (): Captcha {
  const captcha = svgCaptcha.create();
  const expires = new Date().getTime() + 5 * 60 * 1000;
  const captchaToken: CaptchaToken = {
    captchaText: captcha.text,
    expires,
  };
  return {
    captchaSVG: captcha.data,
    captchaToken: encryptAES(JSON.stringify(captchaToken)),
    expires,
  };
}

export function verifyCaptcha(userAnswer: string, encryptedToken: string) {
  try {
    const tokenText = decryptAES(encryptedToken);
    const token = JSON.parse(tokenText) as CaptchaToken;
    return (
      userAnswer.toLowerCase() === token.captchaText.toLowerCase() &&
      new Date().getTime() < token.expires
    );
  } catch (err) {
    logger.warn("Abnormal captcha verification:", err);
    return false;
  }
}
