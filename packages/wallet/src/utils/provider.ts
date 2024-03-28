import {ethers} from 'ethers'
console.log("RPC_URL", process.env.RPC_URL)
export const provider = new ethers.providers.JsonRpcProvider("https://node.botanixlabs.dev");