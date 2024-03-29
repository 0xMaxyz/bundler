import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IERC5267, IERC5267Interface } from "../../../../@openzeppelin/contracts/interfaces/IERC5267";
export declare class IERC5267__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [];
        readonly name: "EIP712DomainChanged";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "eip712Domain";
        readonly outputs: readonly [{
            readonly internalType: "bytes1";
            readonly name: "fields";
            readonly type: "bytes1";
        }, {
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "version";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "chainId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "verifyingContract";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "salt";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "extensions";
            readonly type: "uint256[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IERC5267Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): IERC5267;
}
