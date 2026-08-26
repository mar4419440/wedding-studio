import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptConfig from "eslint-config-next/typescript";

const asArray = (config) => (Array.isArray(config) ? config : [config]);

const eslintConfig = [
  ...asArray(coreWebVitals),
  ...asArray(typescriptConfig),
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
