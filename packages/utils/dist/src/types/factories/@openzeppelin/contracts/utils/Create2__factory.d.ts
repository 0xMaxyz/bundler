import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { Create2, Create2Interface } from "../../../../@openzeppelin/contracts/utils/Create2";
type Create2ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Create2__factory extends ContractFactory {
    constructor(...args: Create2ConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<Create2>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): Create2;
    connect(signer: Signer): Create2__factory;
    static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212207ee53a45e64b2ab5a3569d84fe3057c9111b0c47e224fcc04098bc2550fda95364736f6c63430008170033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "Create2EmptyBytecode";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "Create2FailedDeployment";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "balance";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "needed";
            readonly type: "uint256";
        }];
        readonly name: "Create2InsufficientBalance";
        readonly type: "error";
    }];
    static createInterface(): Create2Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): Create2;
}
export {};
