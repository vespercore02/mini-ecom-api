require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

const setupRelationships = require("./model/relationships");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {

    await sequelize.authenticate();
    console.log("✅ Database connected");

    setupRelationships();

    await sequelize.sync();

    console.log("✅ Tables synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server error:", error);
  }
}

startServer();