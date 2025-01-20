const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
// mongoDB connection
async function connectToMongoDB(url) {
  return mongoose.connect(url);
}
module.exports = {
  connectToMongoDB,
};
