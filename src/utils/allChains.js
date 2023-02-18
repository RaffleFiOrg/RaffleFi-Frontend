import ethLogo from '../assets/token-logos/ethereum-eth-logo.svg'
import arbitrumLogo from '../assets/token-logos/arbitrum.svg'

export const menuItems = [
    {
      key: 5,
      name: "Ethereum Goerli",
      value: "ETH",
      icon: ethLogo,
    },
    {
        key: 421613,
        name: "Arbitrum Goerli",
        value: "ETH",
        icon: arbitrumLogo
    }
];

export const blockExplorers = {
    1: "https://etherscan.io",
    5: "https://goerli.etherscan.io",
    42161: "https://arbiscan.io/address",
    421613: "https://goerli.arbiscan.io"
}

export const chainsData = {
    arbitrumTestnet: {
        chainId: 421613,
        rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
        chainName: "Arbitrum Görli",
        nativeCurrency: { name: "Arbitrum Görli", decimals: 18, symbol: "AGOR" },
        blockExplorerUrls: [blockExplorers[421613]]
    },
    arbitrum: {
        chainId: 42161,
        rpcUrls: ["https://arb1.arbitrum.io/rpc	"],
        chainName: "Arbitrum One",
        nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH"},
        blockExplorerUrls: [blockExplorers[42161]]
    }
}