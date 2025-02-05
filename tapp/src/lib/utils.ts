import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const BASE_URL = "http://127.0.0.1:3006/city-location";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function signMessage(msg: string): Promise<string> {
	return new Promise((resolve, reject) => {
		web3.personal.sign({ data: msg }, (error, value) => {
			if (error) {
				reject(error);
			} else {
				resolve(value);
			}
		});
	});
}

export async function fetchAndSignChallenge() {
  try {
    const challengeReq = await fetch(`${BASE_URL}/location-challenge`);
    const challengeReqJson = await challengeReq.json();
    const userSignature = await signMessage(challengeReqJson.text);
    // @ts-ignore
    return userSignature;
  } catch (e: any) {
    if (typeof e === 'string' && e.toLowerCase().includes('user rejected signing')) {
      e = 'User rejected signing.';
    }
    console.error('Authentication failed: ', e);
    throw new Error(e);
  }
}

type ChainConfig = {
  name: string
  rpc: string
  explorer: string
  tokenDiscoveryChainRef: string
}

type ChainId = number

type ChainConfigMap = {
  [key in ChainId]: ChainConfig
}

export const getNftPriceData = async (contractAddress: string, chainNumber: number) => {
  const nftStatsRequest = await fetch(
    `https://api.token-discovery.tokenscript.org/get-token-stats?blockchain=evm&smartContract=${contractAddress}&chain=${chainConfig[chainNumber].tokenDiscoveryChainRef}`
  )
  const nftStats = await nftStatsRequest.json()
  return {
    floorPrice: nftStats?.floorPrice,
    isLiveData: nftStats?.isLiveData,
    chain: nftStats?.tokenChain
  }
}

export const chainConfig: ChainConfigMap = {
  1: {
    name: "ETHEREUM",
    rpc: "https://nodes.mewapi.io/rpc/eth",
    explorer: "https://etherscan.com/",
    tokenDiscoveryChainRef: "eth"
  },
  5: {
    name: "GOERLI",
    rpc: "https://rpc.ankr.com/eth_goerli",
    explorer: "https://goerli.etherscan.io/",
    tokenDiscoveryChainRef: "goerli"
  },
  11155111: {
    name: "SEPOLIA",
    rpc: "https://endpoints.omniatech.io/v1/eth/sepolia/public",
    explorer: "https://sepolia.etherscan.io/",
    tokenDiscoveryChainRef: "sepolia"
  },
  137: {
    name: "POLYGON",
    rpc: "https://polygon-rpc.com/",
    explorer: "https://polygonscan.com/",
    tokenDiscoveryChainRef: "polygon"
  },
  80001: {
    name: "MUMBAI",
    rpc: "https://polygon-mumbai.api.onfinality.io/public",
    explorer: "https://mumbai.polygonscan.com/",
    tokenDiscoveryChainRef: "mumbai"
  },
  56: {
    name: "BSC",
    rpc: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com/",
    tokenDiscoveryChainRef: "bsc"
  },
  97: {
    name: "BSC_TESTNET",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorer: "https://testnet.bscscan.com/",
    tokenDiscoveryChainRef: "bsc_testnet"
  },
  43114: {
    name: "AVALANCH",
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    explorer: "https://cchain.explorer.avax.network/",
    tokenDiscoveryChainRef: "avalanche"
  },
  250: {
    name: "FANTOM",
    rpc: "https://rpc.fantom.network/",
    explorer: "https://ftmscan.com/",
    tokenDiscoveryChainRef: "fantom"
  },
  42161: {
    name: "ARBITRUM",
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io/",
    tokenDiscoveryChainRef: "arbitrum"
  },
  10: {
    name: "OPTIMISM",
    rpc: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io/",
    tokenDiscoveryChainRef: "optimism"
  },
  8217: {
    name: "KLAYTN",
    rpc: "https://public-node-api.klaytnapi.com/v1/cypress",
    explorer: "https://scope.klaytn.com/",
    tokenDiscoveryChainRef: "klaytn"
  },
  1001: {
    name: "BAOBAB",
    rpc: "https://public-node-api.klaytnapi.com/v1/baobab",
    explorer: "https://baobab.scope.klaytn.com/",
    tokenDiscoveryChainRef: "baobab"
  },
}