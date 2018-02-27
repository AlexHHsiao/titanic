#!/usr/bin/env node

const path = require("path");
const tsConfig = require("../tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");
const baseUrl = path.resolve(__dirname, "..");

tsConfigPaths.register({
    baseUrl,
    paths: {
        "src/*": [
            "./dist/*",
        ],
    },
});

require("../dist/main");