"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
const fs = __importStar(require("fs"));
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const mnemonicFileName = process.env.MNEMONIC_FILE;
let mnemonic = 'test '.repeat(11) + 'junk';
if (fs.existsSync(mnemonicFileName)) {
    mnemonic = fs.readFileSync(mnemonicFileName, 'ascii');
}
function getNetwork1(url) {
    return {
        url,
        accounts: { mnemonic }
    };
}
const config = {
    solidity: {
        version: '0.8.23',
        settings: {
            optimizer: { enabled: true }
        }
    },
    networks: {
        localhost: { url: 'http://localhost:8545' },
        botanix: getNetwork1('https://node.botanixlabs.dev')
    },
    defaultNetwork: 'botanix',
    mocha: {
        timeout: 3600000
    }
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map