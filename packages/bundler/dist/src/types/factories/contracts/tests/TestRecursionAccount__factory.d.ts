import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type { TestRecursionAccount, TestRecursionAccountInterface } from "../../../contracts/tests/TestRecursionAccount";
type TestRecursionAccountConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TestRecursionAccount__factory extends ContractFactory {
    constructor(...args: TestRecursionAccountConstructorParams);
    deploy(_ep: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<TestRecursionAccount>;
    getDeployTransaction(_ep: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): TestRecursionAccount;
    connect(signer: Signer): TestRecursionAccount__factory;
    static readonly bytecode = "0x60a060405234801561001057600080fd5b50604051610b1e380380610b1e83398101604081905261002f91610040565b6001600160a01b0316608052610070565b60006020828403121561005257600080fd5b81516001600160a01b038116811461006957600080fd5b9392505050565b608051610a8c6100926000396000818161013f015261043f0152610a8c6000f3fe6080604052600436106100705760003560e01c80637c627b211161004e5780637c627b21146100eb578063a9e966b71461010d578063ca8b8ad11461012d578063cd330fb01461017957600080fd5b8063107679041461007557806319822f7c1461008a57806352b7512c146100bd575b600080fd5b610088610083366004610610565b610199565b005b34801561009657600080fd5b506100aa6100a5366004610640565b6101f7565b6040519081526020015b60405180910390f35b3480156100c957600080fd5b506100dd6100d8366004610640565b6102a1565b6040516100b49291906106e4565b3480156100f757600080fd5b50610088610106366004610706565b5050505050565b34801561011957600080fd5b5061008861012836600461079e565b610322565b34801561013957600080fd5b506101617f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016100b4565b34801561018557600080fd5b506100aa6101943660046107cd565b610363565b604051621cb65b60e51b8152600160048201526001600160a01b03821690630396cb609034906024016000604051808303818588803b1580156101db57600080fd5b505af11580156101ef573d6000803e3d6000fd5b505050505050565b6000811561024b57604051600090339084908381818185875af1925050503d8060008114610241576040519150601f19603f3d011682016040523d82523d6000602084013e610246565b606091505b505050505b61029661025c61010086018661087e565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061036392505050565b506000949350505050565b60606000806102b360e087018761087e565b6102c19160349082906108cc565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092935061030492508391506103639050565b50506040805160208101909152600080825290969095509350505050565b60005460408051918252602082018390527fe56f542cbdb0e18291d73ec9fd0b443112d0b4f547479e1303ffbc1007cc4f0f910160405180910390a1600055565b60408051808201909152600981526868616e646c654f707360b81b6020918201528151908201206000907fce204cb14db1456f3e271c1ead44898974871c52af46247d5d6e299a821c5d52036104b2576040805160008082526020820190925281610424565b604080516101208101825260008082526020820181905260609282018390528282018390526080820181905260a0820181905260c082015260e081018290526101008101919091528152602001906001900390816103c95790505b5060405163765e827f60e01b81529091506001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063765e827f906104779084906001906004016108f6565b600060405180830381600087803b15801561049157600080fd5b505af11580156104a5573d6000803e3d6000fd5b5060009695505050505050565b6104bb826104c1565b92915050565b6040805160208082019092526000908190528251918301919091207fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4700361050a57506000919050565b6040805180820190915260028152616f6b60f01b6020918201528251908301207f14502d3ab34ae28d404da8f6ec0501c6f295f66caa41e122cfa9b1291bc0f9e80361055857506000919050565b60408051808201909152600481526319985a5b60e21b6020918201528251908301207f3b2564d7e0fe091d49b4c20f4632191e4ed6986bf993849879abfef9465def25036105d95760405162461bcd60e51b81526020600482015260096024820152686661696c2072756c6560b81b60448201526064015b60405180910390fd5b816040516020016105ea9190610a0d565b60408051601f198184030181529082905262461bcd60e51b82526105d091600401610a43565b60006020828403121561062257600080fd5b81356001600160a01b038116811461063957600080fd5b9392505050565b60008060006060848603121561065557600080fd5b833567ffffffffffffffff81111561066c57600080fd5b8401610120818703121561067f57600080fd5b95602085013595506040909401359392505050565b60005b838110156106af578181015183820152602001610697565b50506000910152565b600081518084526106d0816020860160208601610694565b601f01601f19169290920160200192915050565b6040815260006106f760408301856106b8565b90508260208301529392505050565b60008060008060006080868803121561071e57600080fd5b85356003811061072d57600080fd5b9450602086013567ffffffffffffffff8082111561074a57600080fd5b818801915088601f83011261075e57600080fd5b81358181111561076d57600080fd5b89602082850101111561077f57600080fd5b9699602092909201985095966040810135965060600135945092505050565b6000602082840312156107b057600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b6000602082840312156107df57600080fd5b813567ffffffffffffffff808211156107f757600080fd5b818401915084601f83011261080b57600080fd5b81358181111561081d5761081d6107b7565b604051601f8201601f19908116603f01168101908382118183101715610845576108456107b7565b8160405282815287602084870101111561085e57600080fd5b826020860160208301376000928101602001929092525095945050505050565b6000808335601e1984360301811261089557600080fd5b83018035915067ffffffffffffffff8211156108b057600080fd5b6020019150368190038213156108c557600080fd5b9250929050565b600080858511156108dc57600080fd5b838611156108e957600080fd5b5050820193919092039150565b60006040808301604084528086518083526060925060608601915060608160051b8701016020808a0160005b848110156109e757898403605f19018652815180516001600160a01b03168552610120848201518587015289820151818b880152610962828801826106b8565b915050888201518682038a88015261097a82826106b8565b6080848101519089015260a0808501519089015260c0808501519089015260e080850151898303828b015291935091506109b483826106b8565b9250505061010080830151925086820381880152506109d381836106b8565b978501979550505090820190600101610922565b5050819650610a008189018a6001600160a01b03169052565b5050505050509392505050565b6d03ab735b737bbb710393ab6329d160951b815260008251610a3681600e850160208701610694565b91909101600e0192915050565b60208152600061063960208301846106b856fea2646970667358221220959e18cdcce487a75495a983b7422cef9e6541c072e599ec3c9092be93fa696164736f6c63430008170033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IEntryPoint";
            readonly name: "_ep";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "oldState";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "newState";
            readonly type: "uint256";
        }];
        readonly name: "State";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IEntryPoint";
            readonly name: "entryPoint";
            readonly type: "address";
        }];
        readonly name: "addStake";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "ep";
        readonly outputs: readonly [{
            readonly internalType: "contract IEntryPoint";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "enum IPaymaster.PostOpMode";
            readonly name: "";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "postOp";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "rule";
            readonly type: "string";
        }];
        readonly name: "runRule";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_state";
            readonly type: "uint256";
        }];
        readonly name: "setState";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
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
            readonly name: "";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "validatePaymasterUserOp";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "context";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
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
            readonly name: "";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256";
            readonly name: "missingAccountFunds";
            readonly type: "uint256";
        }];
        readonly name: "validateUserOp";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): TestRecursionAccountInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): TestRecursionAccount;
}
export {};
