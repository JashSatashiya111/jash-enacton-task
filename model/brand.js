const mongoose = require("mongoose");

const BrandSchema = mongoose.Schema(
  {
    brand_name: {type : String},
    brand_website : {type : String}
  },
  {
    timestamps: true,
    versionKey: false
  },
);


module.exports = new mongoose.model("Brand", BrandSchema);
