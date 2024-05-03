const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(403).json({
      message: `Forbidden!`,
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: `Не удалось аутентифицировать токен. \n${err}`,
      });
    }

    //сохраняем декодированные данные в запросе
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };