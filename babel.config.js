module.exports = function (api) {
  const presets = [
    "@babel/preset-env"
  ];
  const plugins = [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-proposal-object-rest-spread"
  ];

  api.cache(false);

  return {
    presets,
    plugins,
  };
};
