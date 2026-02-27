import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
  },
  // Default for all JS/TS files
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
  // Client specific
  {
    files: ["client/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@next/next/no-html-link-for-pages": ["error", "client/app"],
    },
    settings: {
      react: {
        version: "detect",
      },
      next: {
        rootDir: "client",
      },
    },
  },
  // Server specific
  {
    files: ["server/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  }
);
