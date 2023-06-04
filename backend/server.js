require("colors");
const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const connectDb = require("../config/connectDb");
const filmsRoutes = require("./routes/filmsRoutes");
const { urlencoded } = require("body-parser");
const usersModel = require("./models/usersModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const configPath = path.join(__dirname, "..", "config", ".env");
dotenv.config({ path: configPath });

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/api/v1", filmsRoutes);

//Реєстрація - збереження користувача у базі даних

app.post(
  "/register",
  asyncHandler(async (req, res) => {
    //1 Отримуємо та валідуємо дані
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      res.status(400);
      throw new Error("Provide all required fields!");
    }

    //2 Шукаємо користувача в базі даних
    const candidate = await usersModel.findOne({ email });

    //3 Якщо знайшли(відповідь "Користувач вже існує")
    if (candidate) {
      res.status(409);
      throw new Error("User already exists!");
    }

    //4 Хешування паролю
    const hashPassword = bcrypt.hashSync(password, 5);

    //5 Зберігання користувача з зашифрованим паролем
    const userRole = await rolesModel.findOne({ value: "USER" });
    console.log(userRole);

    const newUser = await usersModel.create({
      ...req.body,
      password: hashPassword,
      roles: [userRole.value],
    });
    if (!newUser) {
      res.status(404);
      throw new Error("Can't save new user to data!");
    }

    res.status(201).json({
      code: 201,
      message: "Success",
      data: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  })
);

//Аутентифікація - перевірка даних наданих користувачем, з тими, що є в базі даних

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    //1 Отримуємо та валідуємо дані
    const { password, email } = req.body;
    if (!password || !email) {
      res.status(400);
      throw new Error("Provide all required fields!");
    }

    //2 Шукаємо користувача в базі даних
    const user = await usersModel.findOne({ email });

    //3 Розшифровуємо пароль
    const isValidPassword = bcrypt.compareSync(password, user.password);

    //4 Якщо не знайшли або не розшифрували пароль (invalid login or password)
    if (!user || !isValidPassword) {
      res.status(400);
      throw new Error("invalid login or password all required fields!");
    }

    //5 Видаємо токен і зберігаємо в базі даних
    const friends = ["Valik", "Vitalik", "Max"];
    const hobbies = ["Vodka", "Beer", "Girls"];
    const token = generateToken({
      friends,
      hobbies,
      id: user._id,
      roles: user.roles,
    });
    user.token = token;
    await user.save();
    res.status(200).json({
      code: 200,
      message: "Success",
      data: {
        name: user.name,
        email: user.email,
        token: user.token,
      },
    });
  })
);

function generateToken(data) {
  const payload = {
    ...data,
  };
  return jwt.sign(payload, "pizza", {
    expiresIn: "2h",
  });
}

//Авторизація - перевірка прав доступа користувача до певних ресурсів сайту

const authMiddleware = require("./middlewares/authMiddleware");
const rolesModel = require("./models/rolesModel");

//Логаут - вихід користувача з ресурсу (закінчення сеансу)

app.get(
  "/logout",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const id = req.user;
    const user = await usersModel.findById(id);

    user.token = null;
    await user.save();
    res.status(200).json({
      code: 200,
      message: "Logout Success",
      data: {
        name: user.name,
        email: user.email,
        token: user.token,
      },
    });
  })
);

app.use("*", (req, res, next) => {
  res.status(404).json({
    code: 404,
    message: "Not Found",
  });
  next();
});

app.use((error, req, res, next) => {
  // console.log(res.statusCode);
  const statusCode = res.statusCode || 500;
  res.status(statusCode);
  res.json({
    code: statusCode,
    stack: error.stack,
  });
});

connectDb();

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on PORT ${process.env.PORT}`.green.italic.bold
  );
});
