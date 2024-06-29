export type AuthCode = {
  key: string;
  code: string;
};

export const generateSignUpCode = (phoneNumber: string): AuthCode => {
  const key = `signUp:${phoneNumber}`;
  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return { key, code };
};
