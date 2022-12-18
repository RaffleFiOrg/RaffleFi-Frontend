import ethLogo from '../assets/token-logos/ethereum-eth-logo.svg'
import maticLogo from '../assets/token-logos/polygon-matic-logo.svg'
import arbitrumLogo from '../assets/token-logos/arbitrum.svg'

export const menuItems = [
    {
      key: 1,
      name: "Ethereum",
      value: "ETH",
      icon: ethLogo,
    },
    {
      key: 5,
      name: "Ethereum Goerli",
      value: "ETH",
      icon: ethLogo,
    },
    {
      key: 80001,
      name: "Matic Mumbai",
      value: "MATIC",
      icon: maticLogo
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
    421613: "https://goerli.arbiscan.io",
    137: "https://polygonscan.com",
    80001: "https://mumbai.polygonscan.com"
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
    },
    maticMumbai: {
        chainId: 80001,
        rpcUrls: [
            "https://rpc-mumbai.maticvigil.com", 
            "https://matic-testnet-archive-rpc.bwarelabs.com", 
            "https://matic-mumbai.chainstacklabs.com"
        ],
        chainName: "Polygon Mumbai",
        nativeCurrency: { name: "Matic", decimals: 18, symbol: "MATIC"},
        blockExplorerUrls: [blockExplorers[80001]]
    },
    matic: {
        chainId: 137,
        rpcUrls: [
            "https://polygon-rpc.com",
            "https://matic-mainnet-full-rpc.bwarelabs.com",
        ],
        chainName: "Polygon PoS",
        nativeCurrency: { name: "Matic", decimals: 18, symbol: "MATIC"},
        blockExplorerUrls: [blockExplorers[137]]
    }
}