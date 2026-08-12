const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { family: 4 });
    logger.info(`connected to MongoDB on URI ${config.MONGODB_URI}`);
  } catch (error) {
    logger.info(`error connecting to MongoDB: ${error.message}`);
  }

  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
})();
