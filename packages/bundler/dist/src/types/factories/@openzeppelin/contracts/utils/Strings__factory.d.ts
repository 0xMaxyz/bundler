import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { Strings, StringsInterface } from "../../../../@openzeppelin/contracts/utils/Strings";
type StringsConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Strings__factory extends ContractFactory {
    constructor(...args: StringsConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<Strings>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): Strings;
    connect(signer: Signer): Strings__factory;
    static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122035952d96490ef046edb0562cf06fb9eca3d2f7c19f3a3f87cb6976374dee395a64736f6c63430008170033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "length";
            readonly type: "uint256";
        }];
        readonly name: "StringsInsufficientHexLength";
        readonly type: "error";
    }];
    static createInterface(): StringsInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Strings;
}
export {};
