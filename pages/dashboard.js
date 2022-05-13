import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useMoralis, useMoralisWeb3Api, useMoralisCloudFunction } from "react-moralis";
import { NFTcard } from '../components/nft';


import {
    nftmarketaddress, nftaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/Minter.json'
import Market from '../artifacts/contracts/Market.sol/MarketplaceHandler.json'

export default function Dashboard() {
    const [nfts, setNfts] = useState([])
    const [ownedNfts, setOwnedNfts] = useState([])
    const [checks, setChecks] = useState(0);
    const [loadingState, setLoadingState] = useState('not-loaded')
    const { Moralis, account, isAuthenticated } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const { fetch } = useMoralisCloudFunction(
        "createdNFTs",
        { acc: account },
        { autoFetch: false }
    );

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        await Moralis.enableWeb3();

        const options = {
            chain: "rinkeby",
        };
        const userEthNFTs = await Moralis.Web3API.account.getNFTs(options);
        const data = userEthNFTs.result.filter(i => i.token_address === nftaddress.toLowerCase())

        const items = await Promise.all(data.map(async i => {
            const posttokenUri = i.token_uri;
            if(posttokenUri.substring(8, 12) == 'ipfs') {
                var tokenUri = posttokenUri.replace(/^.{28}/g, "https://gateway.moralisipfs.com")
            }else {
    
            }
            const meta = await axios.get(tokenUri)
            let item = {
                tokenId: i.token_id,
                owner: i.owner_of,
                price: undefined,
                image: meta.data.image,
            }
            return item
        }))

        setOwnedNfts(items)
        setLoadingState('loaded')
        }

    if(isAuthenticated) {
        if(checks < 2 && account){
            setChecks(checks + 1);
            updateList();
        } 
    }

    async function updateList() {
        fetch({
            onSuccess: (data) => {
                setNfts(data)
                console.log(data);
            },
            onError: (err) => {
                console.log("Error: ", err);
            }
        });
    }
    
    return (
        <div>
            <div className="flex flex-col items-center" hidden={!isAuthenticated}>

            </div>
            <div className="flex justify-start px-10 py-4">
                <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center">
                    Ite
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                    ms Created
                    </span>
                </h1>
            </div>
            <div className="flex justify-start px-10 py-4">
                {(() => {
                        if (loadingState === 'loaded' && !nfts.length) {
                            return (
                                <div className="flex justify-center">
                                    <p className="text-3xl">You have created no items... :( </p>
                                </div>
                            )
                        } else {
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                    {nfts.map((nft, i) => (<NFTcard nft={nft} key={i} formated={false} />))}
                                </div>
                            )
                        }
                    })()}
            </div>
            <div className="flex justify-start px-10 py-4">
            <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center">
                    Ite
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                    ms Owned
                    </span>
                </h1>
            </div>
            <div className='flex justify-start px-10 py-4'>
                {(() => {
                        if (loadingState === 'loaded' && !ownedNfts.length) {
                            return (
                                <div className="flex justify-center">
                                    <p className="text-3xl">You do not own any tokens... </p>
                                </div>
                            )
                        } else {
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-4">
                                    {ownedNfts.map((nft, i) => (<NFTcard nft={nft} key={i} formated={false} />))}
                                </div>
                            )
                        }
                    })()}
            </div>
        </div>
    )
}