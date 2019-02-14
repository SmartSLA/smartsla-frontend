module.exports = {
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(vue-openpaas-components|vuetify/lib|vuetify/src/stylus)/)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^%/(.*)$": "<rootDir>/tests/$1",
    "^%utils$": "<rootDir>/tests/unit/utils/index.js",
    "^%utils/(.*)$": "<rootDir>/tests/unit/utils/$1"
  },
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: ["**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"],
  testURL: "http://localhost/"
};
