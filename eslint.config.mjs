import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Ignore build output and dependencies
    ignores: [".next/", "node_modules/"],
    rules: {
      // Warn on 'any' to allow rare, justified use but discourage overuse
      '@typescript-eslint/no-explicit-any': 'warn',
      // Error on unused vars for code cleanliness
      '@typescript-eslint/no-unused-vars': 'error',
    },
    // Rationale: These settings provide strong stability without being overly strict. 'any' is allowed with a warning for rare cases. Unused vars are errors to keep code clean.
  },
];

export default eslintConfig;
