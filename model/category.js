const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    category_name: {type : String},
  },
  {
    timestamps: true,
    versionKey: false
  },
);


module.exports = new mongoose.model("Category", CategorySchema);
