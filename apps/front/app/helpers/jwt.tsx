export function getPayload(jwt: string): { exp?: number; iat?: number } | null {
  // A JWT has 3 parts separated by '.'
  // The middle part is a base64 encoded JSON
  // decode the base64
  return JSON.parse(atob(jwt.split(".")[1]));
}

export function isTokenValid(jwt: string): boolean {
  // Check if the token is still valid
  let payload = getPayload(jwt);
  if (!payload) {
    console.info("JWT is invalid", jwt, payload);
    return false;
  }
  let now = new Date().getTime();
  let expirationTime = (payload.exp ?? 0) * 1000;

  if (expirationTime === 0 || now > expirationTime) {
    console.info(
      "JWT has expired",
      jwt,
      payload,
      new Date(expirationTime).toISOString(),
      new Date(now).toISOString()
    );
    return false;
  } else {
    console.info(
      "JWT is valid",
      jwt,
      payload,
      new Date(expirationTime).toISOString(),
      new Date(now).toISOString()
    );
    return true;
  }
}
