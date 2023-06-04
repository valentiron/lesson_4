const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  try {
    //1 Зчитуємо токен із заголовку
    const [tokenType, token] = req.headers.authorization.split(" ");

    //2 Перевіряємо чи це токен авторизації
    if (tokenType === "Bearer" && token) {
      const encoded = jwt.verify(token, "pizza");

      //3 Віддаємо інформацію про користувача далі
      req.user = encoded.id;
      next();
    }
  } catch (error) {
    res.status(404).json({
      code: 404,
      message: "Not authorized",
    });
  }
};

