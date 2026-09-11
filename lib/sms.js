// ارسال پیامک OTP — فعلاً فقط Kavenegar پیاده‌سازی شده.
// اگه SMS_API_KEY ست نشده باشه، به‌جای ارسال واقعی، کد رو توی لاگ سرور چاپ می‌کنه (حالت آزمایشی).

export async function sendOtpSms(phone, code) {
  const apiKey = process.env.SMS_API_KEY;
  const message = `کد ورود تله‌بار: ${code}\nاین کد تا ۲ دقیقه معتبره.`;

  if (!apiKey) {
    console.log(`[SMS DEV MODE] کد تأیید برای ${phone}: ${code}`);
    return { ok: true, dev: true };
  }

  const sender = process.env.SMS_SENDER || '';
  const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${encodeURIComponent(
    phone
  )}&message=${encodeURIComponent(message)}${sender ? `&sender=${encodeURIComponent(sender)}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('SMS send failed:', res.status, body);
    return { ok: false };
  }
  return { ok: true };
}
