const base = require("./app.json");

module.exports = {
  ...base,
  expo: {
    ...base.expo,
    extra: {
      geminiApiKey: process.env.GEMINI_API_KEY ?? "",
    },
  },
};
