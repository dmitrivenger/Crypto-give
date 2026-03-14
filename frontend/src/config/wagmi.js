import { createConfig, http } from 'wagmi'
import { mainnet, polygon, bsc } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

const metadata = {
  name: 'CryptoGive',
  description: 'Donate crypto, get tax receipts',
  url: 'http://localhost:3000',
  icons: [],
}

export const chains = [mainnet, polygon, bsc]

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  transports: {
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [bsc.id]: http('https://bsc-dataseed.binance.org/'),
  },
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: mainnet,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#6366f1',
    '--w3m-border-radius-master': '12px',
  },
})
