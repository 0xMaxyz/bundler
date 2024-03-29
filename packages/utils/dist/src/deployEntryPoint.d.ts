import { JsonRpcProvider } from '@ethersproject/providers';
import { IEntryPoint } from './soltypes';
export declare const entryPointSalt = "0x90d8084deab30c2a37c45e8d47f49f2f7965183cb6990a98943ef94940681de3";
export declare function deployEntryPoint(provider: JsonRpcProvider, signer?: import("@ethersproject/providers").JsonRpcSigner): Promise<IEntryPoint>;
export declare function getEntryPointAddress(): string;
