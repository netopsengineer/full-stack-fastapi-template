import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "./openapi.json",
  output: "./src/client",

  plugins: [
    "@hey-api/typescript",
    "@hey-api/client-axios",
    {
      name: "@hey-api/sdk",
      // NOTE: this doesn't allow tree-shaking
      asClass: true,
      operationId: true,
      classNameBuilder: "{{name}}Service",
      methodNameBuilder: (name: string) =>
        name
          .replace(/^(users|items|login|utils|private)/, "")
          .replace(/^./, (c) => c.toLowerCase()),
    },
    {
      name: "@hey-api/schemas",
      type: "json",
    },
  ],
})
