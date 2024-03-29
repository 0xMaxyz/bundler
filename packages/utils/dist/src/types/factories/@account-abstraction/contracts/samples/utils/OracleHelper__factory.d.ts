import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { OracleHelper, OracleHelperInterface } from "../../../../../@account-abstraction/contracts/samples/utils/OracleHelper";
export declare class OracleHelper__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "currentPrice";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "previousPrice";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "cachedPriceTimestamp";
            readonly type: "uint256";
        }];
        readonly name: "TokenPriceUpdated";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "cachedPrice";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "cachedPriceTimestamp";
        readonly outputs: readonly [{
            readonly internalType: "uint48";
            readonly name: "";
            readonly type: "uint48";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bool";
            readonly name: "force";
            readonly type: "bool";
        }];
        readonly name: "updateCachedPrice";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): OracleHelperInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): OracleHelper;
}
