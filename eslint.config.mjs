import eslint from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const typedParserOptions = {
  project: "./tsconfig.eslint.json",
  tsconfigRootDir: import.meta.dirname,
};

export default tseslint.config(
  {
    ignores: [
      "content/**",
      "public/**",
      "dist/**",
      "docs/**",
      "docs_project/**",
      "specs/**",
      "licenses/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.mjs", "eslint.config.mjs"],
    ...eslint.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
      sourceType: "module",
    },
  },
  {
    files: ["scripts/capture-readme-screenshots.mjs"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [...tseslint.configs.recommendedTypeChecked, reactRefresh.configs.vite],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: typedParserOptions,
    },
    rules: {
      // JSON modules widen literal values even though runtime validators seal the data shape.
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
    },
  },
  {
    files: ["tests/e2e/**/*.ts", "*.config.ts"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
      parserOptions: typedParserOptions,
    },
  },
);
