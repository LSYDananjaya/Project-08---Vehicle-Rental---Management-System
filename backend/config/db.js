const mongoose = require("mongoose");

const dburl =
  "";

mongoose.set("strictQuery", true, "userNewUrlParser", true);

const connection = async () => {
  try {
    await mongoose.connect(dburl);
    console.log("MongoDB Connected~");
  } catch (e) {
    console.error(e.message);
    process.exit();
  }
};

module.exports = connection;
