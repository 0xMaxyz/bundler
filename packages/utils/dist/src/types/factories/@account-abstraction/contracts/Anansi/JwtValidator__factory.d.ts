import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { JwtValidator, JwtValidatorInterface } from "../../../../@account-abstraction/contracts/Anansi/JwtValidator";
type JwtValidatorConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class JwtValidator__factory extends ContractFactory {
    constructor(...args: JwtValidatorConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<JwtValidator>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): JwtValidator;
    connect(signer: Signer): JwtValidator__factory;
    static readonly bytecode = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220440b9ed741af952be6567377f56180ffbe60def867468534048f0a39ac58729664736f6c63430008170033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "InvalidToken";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "JsonParseFailed";
        readonly type: "error";
    }];
    static createInterface(): JwtValidatorInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): JwtValidator;
}
export {};
