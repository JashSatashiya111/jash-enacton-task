const asyncHandler = require("../middleware/async")
const category = require("../model/category")
const product = require("../model/product")
const router = require("express").Router();
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({})

// add category:
const add_category = asyncHandler(async (req, res, next) => {
  try {
    const addCategory = new category(req.body);
    await addCategory.save();
    res.status(200).send({ data: addCategory, message: "category added successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// update category:
const update_category = asyncHandler(async (req, res, next) => {
  try {
    const updateCategory = await category.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: req.body,
      },
      { returnDocument: 'after' },
    );
    if (!updateCategory) {
      throwError('no category found', 400)
    }
    return res.status(200).send({ data: updateCategory, message: "category updated successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// get particular category:
const get_category = asyncHandler(async (req, res, next) => {
  try {
    const getCategory = await category.findOne(
      {
        _id: req.params.id,
      }
    );
    if (!getCategory) {
      throwError('no category found', 400)
    }
    return res.status(200).send({ data: getCategory, message: "category get successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// get category with pagination:
const get_category_list = asyncHandler(async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const startIndex = (page - 1) * limit;

    const condition = {}
    if (req.query.searchkey) {
        condition.category_name = { $regex: req.query.searchkey, $options: 'i' }
    }

    const getCategory = await category.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    if (!getCategory.length) {
      throwError('no category found', 400)
    }
    const getCategorycount = await category.find(condition).countDocuments();
    const totalPage = Math.ceil(getCategorycount / limit);

    return res.status(200).send({ data: { totalRecords: getCategorycount, records: getCategory, currentPage: Number(page), totalPages: totalPage }, message: "category found" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// delete category:
const delete_category = asyncHandler(async (req, res, next) => {
  try {
    const deleteCategory = await category.findOneAndDelete({_id : req.params.id})
    if(!deleteCategory){
      throwError('no category found', 400)
    }
    await product.updateMany(
      {categories : req.params.id},
      {
        $unset: { categories: 1 },
      },
    )

    res.status(200).send({ message: "category deleted successfully" });
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// Routes
router.post("/add_category", validator.body(Joi.object({ category_name: Joi.string().required()})), add_category);
router.put("/update_category/:id", validator.body(Joi.object({ category_name: Joi.string()})), update_category);
router.get("/get_category/:id", get_category);
router.get("/get_category_list", get_category_list);
router.delete("/delete_category/:id", delete_category);

module.exports = router;