module.exports = function (api) {
  api.cache(true);
  return {
        plugins: ['react-native-reanimated/plugin'], // THIS IS REQUIRED

    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
