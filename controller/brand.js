const asyncHandler = require("../middleware/async")
const brand = require("../model/brand")
const product = require("../model/product")
const router = require("express").Router();
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({})

// add brand:
const add_brand = asyncHandler(async (req, res, next) => {
    try {
        const addBrand = new brand(req.body);
        await addBrand.save();
        res.status(200).send({ data: addBrand, message: "brand added successfully" })
    } catch (error) {
        return next(setError(error, error?.status));
    }
});

// update brand:
const update_brand = asyncHandler(async (req, res, next) => {
    try {
        const updateBrand = await brand.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $set: req.body,
            },
            { returnDocument: 'after' },
        );
        if (!updateBrand) {
            throwError('no brand found', 400)
        }
        return res.status(200).send({ data: updateBrand, message: "brand updated successfully" })
    } catch (error) {
        return next(setError(error, error?.status));
    }
});

// get particular brand:
const get_brand = asyncHandler(async (req, res, next) => {
    try {
        const getBrand = await brand.findOne(
            {
                _id: req.params.id,
            }
        );
        if (!getBrand) {
            throwError('no category found', 400)
        }
        return res.status(200).send({ data: getBrand, message: "brand get successfully" })
    } catch (error) {
        return next(setError(error, error?.status));
    }
});

// get brand with pagination:
const get_brand_list = asyncHandler(async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const startIndex = (page - 1) * limit;

        const condition = {}
        if (req.query.searchkey) {
            condition.brand_name = { $regex: req.query.searchkey, $options: 'i' }
        }

        const getBrand = await brand.find(condition).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
        if (!getBrand.length) {
            throwError('no brand found', 400)
        }

        const getBrandcount = await brand.find(condition).countDocuments();
        const totalPage = Math.ceil(getBrandcount / limit);

        return res.status(200).send({ data: { totalRecords: getBrandcount, records: getBrand, currentPage: Number(page), totalPages: totalPage }, message: "brand found" })
    } catch (error) {
        return next(setError(error, error?.status));
    }
});

// delete category:
const delete_brand = asyncHandler(async (req, res, next) => {
    try {
        const deleteBrand = await brand.findOneAndDelete({ _id: req.params.id })
        if (!deleteBrand) {
            throwError('no brand found', 400)
        }

        await product.updateMany(
            {brands : req.params.id},
            {
              $unset: { brands: 1 },
            },
          )

        res.status(200).send({ message: "brand deleted successfully" });
    } catch (error) {
        return next(setError(error, error?.status));
    }
});

// Routes
router.post("/add_brand", validator.body(Joi.object({ brand_name: Joi.string().required(), brand_website : Joi.string()})), add_brand);
router.put("/update_brand/:id", validator.body(Joi.object({ brand_name: Joi.string(), brans_webrand_websitebsite : Joi.string()})), update_brand);
router.get("/get_brand/:id", get_brand);
router.get("/get_brand_list", get_brand_list);
router.delete("/delete_brand/:id", delete_brand);

module.exports = router;