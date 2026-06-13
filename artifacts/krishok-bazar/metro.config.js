const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.watchFolders = (config.watchFolders || []).filter(
  (f) => !f.includes("_tmp_")
);

const originalWatchman = config.resolver?.blockList;
config.resolver = config.resolver || {};
config.resolver.blockList = [
  ...(Array.isArray(originalWatchman) ? originalWatchman : originalWatchman ? [originalWatchman] : []),
  /.*data-connect_tmp.*/,
];

module.exports = config;
