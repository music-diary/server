export const sendContactEmailTemplate = (
  email: string,
  contactTypeLabel: string,
  message: string,
) => {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Muda Contact</title>
  </head>
  <body>
    <h1>Contact</h1>
    <p>이메일: ${email}</p>
    <p>문의유형: ${contactTypeLabel}</p>
    <p>메시지: ${message}</p>
  </body>
</html>
`;
};
