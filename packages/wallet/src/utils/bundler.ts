import { bundlerUrl, EntryPointAddress } from "@/constants/Contracts";
import { ClientConfig, wrapProvider } from "@account-abstraction/sdk";
import { ethers } from "ethers";
import { provider } from "./provider";
const clientConfig: ClientConfig = {
    entryPointAddress: EntryPointAddress,
    bundlerUrl
}
export const bundler = async(originalSigner?: ethers.Signer | undefined)=>{
    return (await wrapProvider(provider, clientConfig,originalSigner))
}