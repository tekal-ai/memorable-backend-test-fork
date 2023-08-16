/**
 * Overrides the tsconfig used for the app.
 * In the test environment we need some tweaks.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsNode = require("ts-node");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const testTSConfig = require("./test/tsconfig.json");

tsNode.register({
    files: true,
    transpileOnly: true,
    project: "./test/tsconfig.json",
});
