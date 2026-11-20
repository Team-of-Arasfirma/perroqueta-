import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import SeoSetting from "./models/SeoSetting.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await SeoSetting.createIndexes();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();