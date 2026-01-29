module.exports = {
  env: { node: true, es2020: true, jest: true },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  rules: {
    "no-unused-vars": "off",
  },
};
