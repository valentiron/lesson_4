const { model, Schema } = require("mongoose");

const rolesShcema = Schema({
  value: {
    type: String,
    unique: true,
    default: 'USER',
  }
});

module.exports = model("roles", rolesShcema);