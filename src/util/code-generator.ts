export type AuthCode = {
  key: string;
  code: string;
};

export const generateSignUpCode = async (
  phoneNumber: string,
): Promise<AuthCode> => {
  const key = `signUp:${phoneNumber}`;
  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  console.log(key, 'code', code);
  return { key, code };
};
