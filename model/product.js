const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    brands: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: {type : String, required: true},
    description: {type : String, required: true},
    mrp: {type : Number, required: true},
    selling_price: {type : Number, required: true},
    discount: {type : Number, required: true},
    rating: {type : Number},
    colors: {type : String, required: true},
    gender: {type : String, enum: ["Men", "Women", "Girl", "Boy"]},
    occasion: {type : String, required: true},
    image_url: {type : String},
  },  
  {
    timestamps: true,
    versionKey: false
  },
);


module.exports = new mongoose.model("Product", ProductSchema);
