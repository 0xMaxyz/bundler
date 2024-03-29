"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntryPointAddress = exports.deployEntryPoint = exports.entryPointSalt = void 0;
const EntryPoint_json_1 = require("@account-abstraction/contracts/artifacts/EntryPoint.json");
const soltypes_1 = require("./soltypes");
const DeterministicDeployer_1 = require("./DeterministicDeployer");
exports.entryPointSalt = '0x90d8084deab30c2a37c45e8d47f49f2f7965183cb6990a98943ef94940681de3';
async function deployEntryPoint(provider, signer = provider.getSigner()) {
    const addr = await new DeterministicDeployer_1.DeterministicDeployer(provider, signer).deterministicDeploy(EntryPoint_json_1.bytecode, exports.entryPointSalt);
    return soltypes_1.IEntryPoint__factory.connect(addr, signer);
}
exports.deployEntryPoint = deployEntryPoint;
function getEntryPointAddress() {
    return DeterministicDeployer_1.DeterministicDeployer.getAddress(EntryPoint_json_1.bytecode, exports.entryPointSalt);
}
exports.getEntryPointAddress = getEntryPointAddress;
//# sourceMappingURL=deployEntryPoint.js.map