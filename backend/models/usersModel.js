const { model, Schema } = require("mongoose");

const usersShcema = Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: null,
  },
  roles: [
    {
    type: String,
    ref: "roles"
    }
  ]
});

module.exports = model("users", usersShcema);
