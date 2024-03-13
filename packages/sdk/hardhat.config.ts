import '@nomiclabs/hardhat-ethers'
import '@nomicfoundation/hardhat-toolbox'

import { HardhatUserConfig } from 'hardhat/config'

import * as fs from 'fs'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const mnemonicFileName = process.env.MNEMONIC_FILE!
let mnemonic = 'test '.repeat(11) + 'junk'
if (fs.existsSync(mnemonicFileName)) { mnemonic = fs.readFileSync(mnemonicFileName, 'ascii') }

function getNetwork1 (url: string): { url: string, accounts: { mnemonic: string } } {
  return {
    url,
    accounts: { mnemonic }
  }
}


const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.23',
    settings: {
      optimizer: { enabled: true }
    }
  },
  networks: {
    botanix: getNetwork1('https://node.botanixlabs.dev')
  },
  defaultNetwork: 'botanix',
  mocha:{
    timeout: 3600000
  }
}

export default config
