const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

// Ensure .cjs files are resolved
defaultConfig.resolver.sourceExts.push('cjs');

// Add alias so old imports of "react-native-picker" use "@react-native-picker/picker"
defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  'react-native-picker': path.resolve(__dirname, 'node_modules/@react-native-picker/picker'),
};

module.exports = defaultConfig;
