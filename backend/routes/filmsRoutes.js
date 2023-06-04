const { model } = require("mongoose");
const filmsController = require("../controllers/FilmsControllers");
const rolesMiddleware = require("../middlewares/rolesMiddleware");

// http://localhost:62000/api/v1/films
const filmsRoutes = require("express").Router();

// Додати фільм
filmsRoutes.post("/films", filmsController.add);

// Отримати усі фільми
filmsRoutes.get(
  "/films",
  rolesMiddleware(["ADMIN", "MODERATOR"]),
  filmsController.getAll
);

//Отримати один фільм
filmsRoutes.get("/films/:id", filmsController.getOne);

//Обновити фільм
filmsRoutes.patch("/films/:id", filmsController.update);

//Видалити  фільм
filmsRoutes.delete("/films/:id", filmsController.remove);

module.exports = filmsRoutes;
