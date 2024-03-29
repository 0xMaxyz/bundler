import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type { Math, MathInterface } from "../../../../../@openzeppelin/contracts/utils/math/Math";
type MathConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Math__factory extends ContractFactory {
    constructor(...args: MathConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<Math>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): Math;
    connect(signer: Signer): Math__factory;
    static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220269c932cf457539b2acb9c4ebdc82932a69d023c9114f2925a562cd308f1577a64736f6c63430008170033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "MathOverflowedMulDiv";
        readonly type: "error";
    }];
    static createInterface(): MathInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Math;
}
export {};
