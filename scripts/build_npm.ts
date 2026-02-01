import { build, emptyDir } from "jsr:@deno/dnt@0.42.3";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@openstatus/sdk-node",
    version: "0.1.2",
    description: "SDK for openstatus.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/openstatushq/sdk-node.git",
    },
    bugs: {
      url: "https://github.com/openstatushq/sdk-node/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
