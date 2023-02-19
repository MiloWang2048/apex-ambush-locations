import nodemailer from "nodemailer";
import { verifyCaptcha } from "./getCaptchaToken";
import { logger } from "../../utils";
import { decryptAES, encryptAES } from "../../utils";

const { SMTP_HOST, SMTP_PORT, SMTP_PASSWD, SMTP_USER } = process.env;

export default function (
  captchaToken: string,
  userAnswer: string,
  email: string
) {
  if (!verifyCaptcha(userAnswer, captchaToken)) {
    throw "人机验证失败。";
  }
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email))
    throw "邮箱格式不正确";
  const SMTPTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: +SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWD,
    },
  });
  const code = Math.random().toFixed(6).substring(2);
  SMTPTransport.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Apex 大佐点位图登录验证码",
    text: `你正在登录 Apex 大佐点位图，验证码是 ${code}，十分钟内有效。`,
  });
  return encryptAES(
    JSON.stringify({
      email,
      code,
      expires: new Date().getTime() + 1000 * 60 * 10,
    })
  );
}

export function verifyEmail(email: string, userAnswer: string, token: string) {
  try {
    const decrypted = decryptAES(token);
    const meta = JSON.parse(decrypted) as {
      email: string;
      code: string;
      expires: number;
    };
    return (
      meta.email === email &&
      userAnswer === meta.code &&
      new Date().getTime() < meta.expires
    );
  } catch (err) {
    logger.warn("Abnormal email verification:", err);
    return false;
  }
}
