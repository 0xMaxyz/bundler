import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { TestRulesAccount, TestRulesAccountInterface } from "../../../../contracts/tests/TestRulesAccount.sol/TestRulesAccount";
type TestRulesAccountConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TestRulesAccount__factory extends ContractFactory {
    constructor(...args: TestRulesAccountConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<TestRulesAccount>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): TestRulesAccount;
    connect(signer: Signer): TestRulesAccount__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b506110ee806100206000396000f3fe6080604052600436106100865760003560e01c80637c627b21116100595780637c627b211461013957806382e46b751461015b578063a9e966b71461019b578063cd330fb0146101bb578063e3480cb3146101db57600080fd5b8063107679041461008b57806311df9995146100a057806319822f7c146100dd57806352b7512c1461010b575b600080fd5b61009e610099366004610c57565b6101f0565b005b3480156100ac57600080fd5b506001546100c0906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100e957600080fd5b506100fd6100f8366004610c74565b61024e565b6040519081526020016100d4565b34801561011757600080fd5b5061012b610126366004610c74565b610336565b6040516100d4929190610d18565b34801561014557600080fd5b5061009e610154366004610d3a565b5050505050565b34801561016757600080fd5b506100fd610176366004610c57565b600180546001600160a01b0319166001600160a01b0392909216919091179055600090565b3480156101a757600080fd5b5061009e6101b6366004610dd2565b6103b7565b3480156101c757600080fd5b506100fd6101d6366004610e01565b6103f8565b3480156101e757600080fd5b5061009e610c08565b604051621cb65b60e51b8152600160048201526001600160a01b03821690630396cb609034906024016000604051808303818588803b15801561023257600080fd5b505af1158015610246573d6000803e3d6000fd5b505050505050565b600081156102a257604051600090339084908381818185875af1925050503d8060008114610298576040519150601f19603f3d011682016040523d82523d6000602084013e61029d565b606091505b505050505b6102b0610100850185610eb2565b90506004036102de5760006102c9610100860186610eb2565b6102d291610f00565b60e01c915061032f9050565b6103296102ef610100860186610eb2565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506103f892505050565b50600090505b9392505050565b606060008061034860e0870187610eb2565b610356916034908290610f30565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092935061039992508391506103f89050565b50506040805160208101909152600080825290969095509350505050565b60005460408051918252602082018390527fe56f542cbdb0e18291d73ec9fd0b443112d0b4f547479e1303ffbc1007cc4f0f910160405180910390a1600055565b6040805160208082019092526000908190528251918301919091207fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4700361044157506000919050565b604080518082019091526006815265373ab6b132b960d11b6020918201528251908301207ff648814c67221440671fd7c2de979db4020a9320fb7985ff79ca8e7dced277f803610492575043919050565b604080518082019091526008815267636f696e6261736560c01b6020918201528251908301207f76ec948a9207fdea26dcba91086bcdd181920ff52a539b0d1eb28e73b4cd92af036104e5575041919050565b6040805180820190915260098152680c4d8dec6d6d0c2e6d60bb1b6020918201528251908301207fd60ee5d9b1a312631632d0ab8816ca64259093d8ab0b4d29f35db6a6151b0f8d0361053a57505060004090565b60408051808201909152600781526631b932b0ba329960c91b6020918201528251908301207f8fac3d089893f1e87120aee7f9c091bedb61facca5e493da02330bcb46f0949c0361061c5760405160019061059490610c33565b8190604051809103906000f59050801580156105b4573d6000803e3d6000fd5b506001600160a01b0316633fa4f2456040518163ffffffff1660e01b8152600401602060405180830381865afa1580156105f2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106169190610f5a565b92915050565b60408051808201909152600c81526b3130b630b731b296b9b2b63360a11b6020918201528251908301207fe1eb40348c4d42c6f93b840cbedec69afb249b96fd8af4bcbeed87fcef3815d8036106b5576001546040516370a0823160e01b81523060048201526001600160a01b03909116906370a08231906024015b602060405180830381865afa1580156105f2573d6000803e3d6000fd5b60408051808201909152601081526f616c6c6f77616e63652d73656c662d3160801b6020918201528251908301207fcc3befdbd4c845f2f5f48ac59e621de2a47c26950d22d6092b4c2ffafdfc7f9f036107405760018054604051636eb1769f60e11b815230600482015260248101929092526001600160a01b03169063dd62ed3e90604401610698565b60408051808201909152601081526f30b63637bbb0b731b2969896b9b2b63360811b6020918201528251908301207f46b549298973374f07ae868394b73f37c1cf6f25e976e36f99f1abbe6a5284e6036107cb5760018054604051636eb1769f60e11b815260048101929092523060248301526001600160a01b03169063dd62ed3e90604401610698565b60408051808201909152600981526836b4b73a16b9b2b63360b91b6020918201528251908301207f39509d2173ec8a4262a15fa569ebaeed05ddef813417dbd2877e415703355b6e03610863576001546040516335313c2160e11b81523060048201526001600160a01b0390911690636a627842906024015b6020604051808303816000875af11580156105f2573d6000803e3d6000fd5b60408051808201909152600981526862616c616e63652d3160b81b6020918201528251908301207f48bf62c98ebd199a8c4fa7e17d20fdbda06a014deb397741460366ff7e1e0755036108e157600180546040516370a0823160e01b815260048101929092526001600160a01b0316906370a0823190602401610698565b6040805180820190915260068152656d696e742d3160d01b6020918201528251908301207ff794573481a09002e3e46f42daa5499159620e2a2cc3f5bdd26c0a2669544d930361095c57600180546040516335313c2160e11b815260048101929092526001600160a01b031690636a62784290602401610844565b60408051808201909152600b81526a39ba393ab1ba16b9b2b63360a91b6020918201528251908301207e05e75ff00cb9bce888bba342b06e4b9d4695ba7caf0afdef7ef8cf6735bb7d03610a265760015460405160016222a30f60e01b031981523060048201526001600160a01b039091169063ffdd5cf1906024015b6060604051808303816000875af11580156109f8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a1c9190610f73565b6040015192915050565b6040805180820190915260088152677374727563742d3160c01b6020918201528251908301207f416c09f102f2ef6799166d01fa870b6995b38e93784afdbdda0c68b94ab7eadd03610aa6576001805460405160016222a30f60e01b0319815260048101929092526001600160a01b03169063ffdd5cf1906024016109d9565b60408051808201909152600c81526b1a5b9b995c8b5c995d995c9d60a21b6020918201528251908301207fc78ed5b2fc828eecd2c4fb3d39653e18c93b7d1815a5571aa088439dec36211a03610b4b57600160009054906101000a90046001600160a01b03166001600160a01b03166325d9185c6040518163ffffffff1660e01b81526004016020604051808303816000875af11580156105f2573d6000803e3d6000fd5b604080518082019091526008815267656d69742d6d736760c01b6020918201528251908301207f9b68a4beda047bbcff1923196e9af52348c30a06718efbeffa6d1dcc2c0a40fe03610bc8576040517f9290a3722c5472b1809a59826d75e07853b4fb2f836d93a3adee7b819ab8eac390600090a1506000919050565b81604051602001610bd99190610fcf565b60408051601f198184030181529082905262461bcd60e51b8252610bff91600401611005565b60405180910390fd5b6040517fd854278016dc3ac42aef8d423d936f9f37eea6f9a640f8a189f44247f1282c2c90600090a1565b60a08061101983390190565b6001600160a01b0381168114610c5457600080fd5b50565b600060208284031215610c6957600080fd5b813561032f81610c3f565b600080600060608486031215610c8957600080fd5b833567ffffffffffffffff811115610ca057600080fd5b84016101208187031215610cb357600080fd5b95602085013595506040909401359392505050565b60005b83811015610ce3578181015183820152602001610ccb565b50506000910152565b60008151808452610d04816020860160208601610cc8565b601f01601f19169290920160200192915050565b604081526000610d2b6040830185610cec565b90508260208301529392505050565b600080600080600060808688031215610d5257600080fd5b853560038110610d6157600080fd5b9450602086013567ffffffffffffffff80821115610d7e57600080fd5b818801915088601f830112610d9257600080fd5b813581811115610da157600080fd5b896020828501011115610db357600080fd5b9699602092909201985095966040810135965060600135945092505050565b600060208284031215610de457600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b600060208284031215610e1357600080fd5b813567ffffffffffffffff80821115610e2b57600080fd5b818401915084601f830112610e3f57600080fd5b813581811115610e5157610e51610deb565b604051601f8201601f19908116603f01168101908382118183101715610e7957610e79610deb565b81604052828152876020848701011115610e9257600080fd5b826020860160208301376000928101602001929092525095945050505050565b6000808335601e19843603018112610ec957600080fd5b83018035915067ffffffffffffffff821115610ee457600080fd5b602001915036819003821315610ef957600080fd5b9250929050565b6001600160e01b03198135818116916004851015610f285780818660040360031b1b83161692505b505092915050565b60008085851115610f4057600080fd5b83861115610f4d57600080fd5b5050820193919092039150565b600060208284031215610f6c57600080fd5b5051919050565b600060608284031215610f8557600080fd5b6040516060810181811067ffffffffffffffff82111715610fa857610fa8610deb565b80604052508251815260208301516020820152604083015160408201528091505092915050565b6d03ab735b737bbb710393ab6329d160951b815260008251610ff881600e850160208701610cc8565b91909101600e0192915050565b60208152600061032f6020830184610cec56fe60806040526001600055348015601457600080fd5b50607d806100236000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b603560005481565b60405190815260200160405180910390f3fea2646970667358221220b727b6351a804920a0e9f0d2f952a5444926ec0c7453e32dc67544f99bb111ae64736f6c63430008170033a2646970667358221220ec66db237f6c9888835a4f1bdce3bf0bef8f8a6cdf4a0beec7e1b13d53b6556564736f6c63430008170033";
    static readonly abi: readonly [{
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
        readonly anonymous: false;
        readonly inputs: readonly [];
        readonly name: "TestFromValidation";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [];
        readonly name: "TestMessage";
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
        readonly name: "coin";
        readonly outputs: readonly [{
            readonly internalType: "contract TestCoin";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "execSendMessage";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
            readonly internalType: "contract TestCoin";
            readonly name: "_coin";
            readonly type: "address";
        }];
        readonly name: "setCoin";
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
    static createInterface(): TestRulesAccountInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): TestRulesAccount;
}
export {};
