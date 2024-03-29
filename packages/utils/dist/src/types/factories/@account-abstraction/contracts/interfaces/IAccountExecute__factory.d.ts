import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IAccountExecute, IAccountExecuteInterface } from "../../../../@account-abstraction/contracts/interfaces/IAccountExecute";
export declare class IAccountExecute__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "nonce";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "initCode";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "callData";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes32";
                readonly name: "accountGasLimits";
                readonly type: "bytes32";
            }, {
                readonly internalType: "uint256";
                readonly name: "preVerificationGas";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes32";
                readonly name: "gasFees";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes";
                readonly name: "paymasterAndData";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PackedUserOperation";
            readonly name: "userOp";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes32";
            readonly name: "userOpHash";
            readonly type: "bytes32";
        }];
        readonly name: "executeUserOp";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IAccountExecuteInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IAccountExecute;
}
