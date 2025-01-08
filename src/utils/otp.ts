export function generateOTP(length = 4): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export function isOTPExpired(createdAt: Date, validityMinutes = 10): boolean {
  const now = new Date();
  const diff = (now.getTime() - createdAt.getTime()) / (1000 * 60);
  return diff > validityMinutes;
}
