import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Initializable, InitializableInterface } from "../../../../../@openzeppelin/contracts/proxy/utils/Initializable";
export declare class Initializable__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "InvalidInitialization";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotInitializing";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "version";
            readonly type: "uint64";
        }];
        readonly name: "Initialized";
        readonly type: "event";
    }];
    static createInterface(): InitializableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Initializable;
}
