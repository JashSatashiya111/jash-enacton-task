const asyncHandler = require("../middleware/async")
const product = require("../model/product")
const router = require("express").Router();
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({})

// add product:
const add_product = asyncHandler(async (req, res, next) => {
  try {
    const addProduct = new product(req.body);
    await addProduct.save();
    res.status(200).send({ data: addProduct, message: "product added successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// update product:
const update_product = asyncHandler(async (req, res, next) => {
  try {
    const updateProduct = await product.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: req.body,
      },
      { returnDocument: 'after' },
    );
    if (!updateProduct) {
      throwError('no product found', 400)
    }
    return res.status(200).send({ data: updateProduct, message: "product updated successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// get particular product:
const get_product = asyncHandler(async (req, res, next) => {
  try {
    const getProduct = await product.findOne(
      {
        _id: req.params.id,
      }
    );
    if (!getProduct) {
      throwError('no product found', 400)
    }
    return res.status(200).send({ data: getProduct, message: "product get successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// get product with pagination:
const get_product_list = asyncHandler(async (req, res, next) => {
  try {
        const page = req.body.page || 1;
        const limit = Number(req.body.limit) || 10;
        const startIndex = (page - 1) * limit;
    
        const field_name = req.body?.sort_by || 'createdAt';
        const order_by = req.body?.order_by == 'ASC' ? 1 : -1;
        const sortData = { [field_name]: order_by };
    
        // Sorting and filtering conditions
        let condition = {};
        if (req.body.brands && req.body.brands.length) { // for brand filter 
          condition = { 'brands': { $in: ObjectIds(req.body.brands) } }; // ObjectIds is global function in app.js to convert ids in to object id
        }
        if (req.body.categories && req.body.categories.length) {  // for category filter
          condition = { 'categories': { $in: ObjectIds(req.body.categories) } };
        }
    
        if (req.body.occasion && req.body.occasion.length) {  // for occasion filter
          condition = { 'occasion': { $in: req.body.occasion } };
        }
    
        if (req.body.min_price && req.body.max_price) { // for minimum and maximum proce filter
          condition.selling_price = {
            $gte: Number(req.body.min_price),
            $lte: Number(req.body.max_price),
          };
        }
    
        if (req.body.min_discount && req.body.max_discount) { // for custom minimum and maximum dicount filter
          condition.discount = {
            $gte: Number(req.body.min_discount),
            $lte: Number(req.body.max_discount),
          };
        }
    
        if (req.body.gender && req.body.gender.length) {  // for occasion filter
          condition.gender = req.body.gender
        };

    const getProduct = await product.find(condition).populate('categories brands').sort(sortData).skip(startIndex).limit(limit);
    if (!getProduct.length) {
      throwError('no product found', 400)
    }

    const getProductcount = await product.find(condition).countDocuments(); // to get total record count
    const totalPage = Math.ceil(getProductcount / limit); // for total page count

    return res.status(200).send({ data: { totalRecords: getProductcount, records: getProduct, currentPage: Number(page), totalPages: totalPage }, message: "product found" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// delete product:
const delete_product = asyncHandler(async (req, res, next) => {
  try {
    const deleteProduct = await product.findOneAndDelete({ _id: req.params.id })

    if (!deleteProduct) {
      throwError('no product found', 400)
    }

    res.status(200).send({ message: "product deleted successfully" });
  } catch (error) {
    return next(setError(error, error?.status));
  }
});


// Routes
router.post("/add_product", validator.body(Joi.object({ name: Joi.string().required(), description: Joi.string().required(), name: Joi.string().required(), mrp: Joi.number().required(), selling_price: Joi.number().required(), discount: Joi.number().required(), rating: Joi.number(), colors: Joi.string().required(), gender: Joi.string().valid('Men', 'Women', 'Girl', 'Boy').required(), occasion: Joi.string().required(), brands: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), categories: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), image_url: Joi.string() })), add_product);

router.put("/update_product/:id", validator.body(Joi.object({ name: Joi.string(), description: Joi.string(), name: Joi.string(), mrp: Joi.number(), selling_price: Joi.number(), discount: Joi.number(), rating: Joi.number(), colors: Joi.string(), gender: Joi.string().valid('Men', 'Women', 'Girl', 'Boy'), occasion: Joi.string(), brands: Joi.string().regex(/^[0-9a-fA-F]{24}$/), categories: Joi.string().regex(/^[0-9a-fA-F]{24}$/), image_url: Joi.string() })), update_product);
router.get("/get_product/:id", get_product);
router.post("/get_product_list", get_product_list);
router.delete("/delete_product/:id", delete_product);

module.exports = router;
