"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
void async function () {
    const inFilename = (0, path_1.join)(__dirname, "/../artifacts/contracts/Staking.sol/Staking.json");
    const outFilename = (0, path_1.join)(__dirname, "/../src/index.ts");
    const data = JSON.parse(await fs_1.promises.readFile(inFilename, 'utf-8'));
    const outData = 'export const Staking = ' + JSON.stringify(data) + ' as const;' + "\n";
    fs_1.promises.writeFile(outFilename, outData);
}();
