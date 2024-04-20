E-Commerce API

This is a RESTful API for managing brands, categories, products, and file uploads for an e-commerce application. It is built using Node.js, Express, and MongoDB.

Getting Started

Prerequisites: -

* Node.js installed on your machine
* MongoDB installed and running locally or on a cloud service

Installation
Clone the repository:
git clone https://github.com/JashSatashiya111/e-commerce-api.git

Install dependencies:

cd e-commerce-api
npm install

Set up environment variables: Create a .env file in the root directory and add the following:
PORT=3000
MONGODB_URI=your_mongodb_uri_here

Start the server:
npm start


Routes:

Brands:

    POST /brand/add_brand - Add a new brand
    PUT /brand/update_brand/:id - Update a brand
    GET /brand/get_brand/:id - Get a brand by ID
    GET /brand/get_brand_list - Get a list of all brands
    DELETE /brand/delete_brand/:id - Delete a brand by ID

Categories: 

    POST /category/add_category - Add a new category
    PUT /category/update_category/:id - Update a category
    GET /category/get_category/:id - Get a category by ID
    GET /category/get_category_list - Get a list of all categories
    DELETE /category/delete_category/:id - Delete a category by ID

Products:

    POST /product/add_product - Add a new product
    PUT /product/update_product/:id - Update a product
    GET /product/get_product/:id - Get a product by ID
    POST /product/get_product_list - Get a list of products with pagination and filtering
    DELETE /product/delete_product/:id - Delete a product by ID

Uploads:

    POST /upload/upload_image - Upload an image


Error Handling:
    The API handles errors using custom error handling middlewarein app.js. If an error occurs, it will be logged and an error response will be sent to the client.