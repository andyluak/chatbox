/* eslint-disable @typescript-eslint/no-var-requires */

// https://github.com/trivago/prettier-plugin-sort-imports/issues/117

/** @type {import("prettier").Config} */

const pluginSortImports = require("@trivago/prettier-plugin-sort-imports");
// @ts-ignore
const pluginTailwindcss = require("prettier-plugin-tailwindcss");

/** @type {import("prettier").Parser}  */
const myParser = {
  // @ts-ignore
  ...pluginSortImports.parsers.typescript,
  parse: pluginTailwindcss.parsers.typescript.parse,
};

/** @type {import("prettier").Plugin}  */
const myPlugin = {
  parsers: {
    typescript: myParser,
  },
};

module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  importOrder: [
    "^src/core/(.*)$",
    "^~/src/components/(.*)$",
    "^~/src/containers/(.*)$",
    "^~/src/queries/(.*)$",
    "^~/src/mutations/(.*)$",
    "^~/src/hooks[./]",
    "^~/src/pages[./]",
    "^~/src/utils/(.*)$",
    "^~/src/types/(.*)$",
    "^~/src/styles/(.*)$",
    "^content/(.*)$",
    "^public/(.*)$",
    "^[./|~/]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [myPlugin],
};
