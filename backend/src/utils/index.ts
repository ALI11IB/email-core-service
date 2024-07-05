const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export function generateToken(userId: string) {
  const payload = {
    userId: userId,
  };

  const options = {
    expiresIn: '24h', // Token expires in 1 hour
  };

  const token = jwt.sign(payload, SECRET_KEY, options);
  return token;
}

export function verifyToken(token: string) {
  try {
    var decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return err;
  }
}
