const jwt = require("jsonwebtoken");
module.exports = (rolesArray) => {
  return (req, res, next) => {
    try {
      //1 Зчитуємо токен із заголовку
      const [tokenType, token] = req.headers.authorization.split(" ");

      //2 Перевіряємо чи це токен авторизації
      if (token) {
        const { roles } = jwt.verify(token, "pizza");
        let hasRole = false;
        rolesArray.forEach((role) => {
          if (roles.includes(role)) {
            hasRole = true;
          }
        });
        if(!hasRole) {
          res.status(403).json({
            code: 403,
            message: "Forbidden",
          });
        }
      }
      next()
    } catch (error) {
      res.status(404).json({
        code: 404,
        message: "Not authorized",
      });
    }
  };
};
