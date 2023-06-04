const filmsModel = require("../models/filmsModel");
const asyncHandler = require("express-async-handler");

class FilmsControllers {
  add = asyncHandler(async (req, res) => {
    const { title, genre } = req.body;
    if (!title || !genre) {
      //   res.status(404).json({
      //     code: 404,
      //     message: "Provide all required fields!",
      //   });
      res.status(404);
      throw new Error("Provide all required fields!");
    }
    const film = await filmsModel.create({
      ...req.body,
    });
    res.status(201).json({
      code: 201,
      message: "Success",
      film,
    });
  });

  getAll = asyncHandler(async (req, res) => {
    const films = await filmsModel.find({})
    if(!films) {
          res.status(404);
      throw new Error("Unable to fatch films!");
    }
    res.status(200).json({
      code: 200,
      message: "Success",
      films,
      qty: films.length
    });
  });

  getOne = (req, res) => {
    console.log("getOne");
  };

  update = (req, res) => {
    console.log("update");
  };

  remove = (req, res) => {
    console.log("remove");
  };
}

module.exports = new FilmsControllers();
