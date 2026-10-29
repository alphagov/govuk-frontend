import globals from "globals";
import { defineConfig } from "@eslint/config-helpers";

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
  }
]);
