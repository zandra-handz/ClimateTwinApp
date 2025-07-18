const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");
//const { getDefaultConfig } = require('@react-native/metro-config');

const config = getSentryExpoConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
...transformer,
babelTransformerPath: require.resolve("react-native-svg-transformer"),
_expoRelativeProjectRoot: __dirname,
}

config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

module.exports = config;