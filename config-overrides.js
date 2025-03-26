const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "util": require.resolve("util/"),
    "path": require.resolve("path-browserify"),
    "url": require.resolve("url/")
  };
  
  return config;
}
