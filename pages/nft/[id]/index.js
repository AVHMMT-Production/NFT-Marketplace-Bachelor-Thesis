import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useMoralis, useNewMoralisObject, useMoralisQuery } from "react-moralis";

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

import {
  nftaddress, nftmarketaddress
} from '../../../config'

import { MinterABI as NFT, MarketplaceHandlerABI as Market } from '../../../contractABI'

export async function getServerSideProps(context){
    
  
  return {
      props: {},
  };
}  

export default function NFTPage() {
  const router = useRouter()
  const { id } = router.query
  const [nft, setNft] = useState([])
  const [checks, setChecks] = useState(0)
  const [formInput, updateFormInput] = useState({ price: '' })
  const [owner, setOwner] = useState(false);
  const [seller, setSeller] = useState(false);
  const [selling, setSelling] = useState(false);
  const [loadingState, setLoadingState] = useState('not-loaded')
  const { isAuthenticated, account, Moralis } = useMoralis();
  const { save } = useNewMoralisObject("ListedNFTs");

  

  useEffect(() => {
    const getNFT = async () => {
      const provider = await Moralis.enableWeb3();
      const tokenContract = new ethers.Contract(nftaddress, NFT, provider)
      const marketContract = new ethers.Contract(nftmarketaddress, Market, provider)
  
      try {
        let data = await marketContract.fetchNFT(id)
        data = data[0]

        const postTokenUri = await tokenContract.tokenURI(data.tokenId)
        if(postTokenUri.substring(8, 12) == 'ipfs') {
          var tokenUri = postTokenUri.replace(/^.{28}/g, "https://gateway.moralisipfs.com")
        }else {
          var tokenUri = postTokenUri;
        }
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(data.price.toString(), 'ether')

        const item = {
            price,
            tokenId: data.tokenId.toNumber(),
            seller: data.seller,
            owner: data.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            itemId: data.itemId,
            forSale: data.forSale
        }
        setNft(item)

      } catch (error) {
        console.log(error)
      }
      setLoadingState('loaded');
    }
    getNFT()
      .catch(console.error);
  }, [])

  function openInput() {
    setSelling(true);
  } 

  if (nft.image !== undefined) {
    if (nft.owner.toLowerCase() === account || nft.seller.toLowerCase() === account) {
      accessControl(nft)
    }
  }

  function accessControl(i) {
    if(checks < 2) {
      if (i.owner.toLowerCase() === account) {
        setOwner(true)
      }

      if (i.seller.toLowerCase() === account) {
        setSeller(true)
      }
      setChecks(checks + 1)
    } else {
      return;
    }
  }

  async function cancelSale() {
    const provider = await Moralis.enableWeb3();
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftmarketaddress, Market, signer)
    let transaction = await contract.cancelMarketSale(
      nftaddress, nft.tokenId, nft.itemId,
    )
    await transaction.wait()

    const query = new Moralis.Query('ListedNFTs');
    query.equalTo('TokenID', nft.tokenId)
    const object = await query.first();
    if (object) {
      object.destroy().then(() => {
        console.log('destroyed')
      },
      (error) => {
        console.log(error)
      })
    }

    router.push('/dashboard')
  }

  async function createSale() {
    const provider = await Moralis.enableWeb3();
    const signer = provider.getSigner()

    console.log(signer)

    let contract = new ethers.Contract(nftmarketaddress, Market, signer)

    const { price } = formInput
    if (!price ) return
    const sellPrice = ethers.utils.parseEther(formInput.price)
    let listingPrice = await contract.getListingPrice()
    let transaction = await contract.createMarketItem(
        nftaddress, nft.tokenId, sellPrice, nft.itemId, { value: listingPrice.toString() }
    )
    await transaction.wait()
    const meta = {
      "TokenID": nft.tokenId,
      "ItemID": nft.itemId,
      "Price": sellPrice.toString(),
      "Seller": account,
      "Sold": 0
    }
    save(meta, {
      onSuccess: (i) => {
          console.log("Great success: ", i.id);
      },
      onError: (err) => {
          console.log("Error: ", err);
      }
  });
    router.push('/')
}

async function buyNft() {
  const provider = await Moralis.enableWeb3();
  const signer = provider.getSigner()

  const contract = new ethers.Contract(nftmarketaddress, Market, signer)

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

  const transaction = await contract.createMarketSale(
    nftaddress, 
    nft.tokenId, 
    {
    value: price,
    }
  )
  await transaction.wait()


  const query = new Moralis.Query('ListedNFTs');
  query.equalTo('TokenID', nft.tokenId)
  query.descending("createdAt");
  const object = await query.first();

  if (object) {
    object.set("Sold", 1);
    object.save();
  }


  router.push('/dashboard')
}

  if (loadingState === 'loaded' && nft.tokenId === undefined) return (
    <h1 className="px-20 py-10 text-3xl">This item does not exist</h1>
  )

  if (loadingState === 'loaded' && owner || loadingState === 'loaded' && seller) return (
    <div className="flex flex-row mt-4">
      <div className="px-4 basis-2/3">
        <div className="border shadow rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <img src={nft.image} />
            </div>
        </div>
      </div>
      <div className="px-4 basis-1/3">
        <div className="border shadow rounded-xl overflow-hidden">
              <div className="p-4 bg-gray-400">
                  <p style={{ width: '100%', height: '64px' }} className="text-2xl font-semibold">{ nft.name }</p>

                  <hr></hr>

                  <MarkdownPreview source={ nft.description } className="mt-4 mb-4"/>
              </div>
              <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{ nft.price } ETH</p>
                  <button onClick={openInput} hidden={selling || nft.forSale} className="w-full bg-cyan-500 shadow-lg shadow-cyan-500/50 py-2 px-12 rounded">Sell?</button>
                  <div hidden={!selling}>
                    <input
                      placeholder="Put a price on your NFT"
                      className="mt-2 mb-2 border rounded p-4"
                      onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                    <button onClick={createSale} className="w-full bg-cyan-500 shadow-lg shadow-cyan-500/50 py-2 px-12 rounded">Put NFT for sale</button>
                  </div>

                  <button onClick={cancelSale} hidden={!seller} className="w-full bg-red-500 shadow-lg shadow-red-500/50 py-2 px-12 rounded">Cancel sell</button>

              </div>
          </div>        
      </div>
    </div> 
  )

  return (
    <div className="flex flex-row mt-4">
      <div className="px-4 basis-2/3">
        <div className="border shadow rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <img src={nft.image} />
            </div>
        </div>
      </div>

      <div className="px-4 basis-1/3">
        <div className="border shadow rounded-xl overflow-hidden">
              <div className="p-4 bg-gray-400">
                  <p style={{ width: '100%', height: '64px' }} className="text-2xl font-semibold">{ nft.name }</p>

                  <hr></hr>

                  <MarkdownPreview source={ nft.description } className="mt-4 mb-4"/>
              </div>
              <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{ nft.price } ETH</p>
                  <button onClick={buyNft} hidden={!nft.forSale || !isAuthenticated} className="w-full bg-green-500 shadow-lg shadow-green-500/50 py-2 px-12 rounded">Buy</button>
              </div>
          </div>        
      </div>
    </div>
  )
}