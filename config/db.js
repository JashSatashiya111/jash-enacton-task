const mongoose = require("mongoose");

// DB connection:
const dbConnect = async () => {
  mongoose.set("strictQuery", false);
  const conn = await mongoose.connect(
    process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = dbConnect;
