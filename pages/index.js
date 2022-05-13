import { useEffect, useState } from 'react';
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { NFTcard } from '../components/nft';

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [listed, setListed] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const { Moralis } = useMoralis();
  const { fetch } = useMoralisCloudFunction(
    "listedAndSoldNFTs",
    { autoFetch: false }
  );
  
  useEffect(() => {
      loadNFTs()
  }, [])
  
  async function loadNFTs() {
    await Moralis.enableWeb3();

    updateLists();
    setLoadingState('loaded')
}

async function updateLists() {
  fetch({
    onSuccess: (data) => {
      setListed(data[0])
      setSold(data[1])
    },
    onError: (err) => {
      console.log("Error: ", err);
  }
  });
}

  return (

    <div className="leading-normal tracking-normal text-indigo-400 bg-cover bg-fixed">
        <div className="h-full">
        <div className="w-full container mx-auto">
            <div className="w-full flex items-center justify-between">
            <a className="mx-auto mt-10 flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
                WELCOME T<span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">O NFTIO</span>
            </a>
            </div>
        </div>

        {/* <!--Main--> */}
        <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
            {/* <!--Left Col--> */}
            <div className="flex flex-col p-14 w-full xl:w-3/6 justify-center lg:items-start overflow-y-hidden">

              <div className='mx-auto'>
              <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center">
                Rec
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                ently Listed NFTs!
                </span>
            </h1>
            <p className="leading-normal text-base md:text-2xl mb-8 text-center">
                Take a look at the most recent NFTs that have been listed for sale on NFTIO!
            </p>

                <div className="flex justify-center">
                    <div >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pt-4">
                        {(() => {
                          if (loadingState === 'loaded' && !listed.length) {
                            return (
                              <p className="px-20 py-10 text-3xl">No items currently for sale on the marketplace... :( </p>
                            )
                          } else {
                            return (
                              listed.map((nft, i) => (<NFTcard nft={nft} key={i} formated={false} />))
                            )
                          }
                        })()}
                        </div>
                    </div>
                </div> 

              </div>           
            </div>

            {/* <!--Right Col--> */}
            <div className="flex flex-col p-14 w-full xl:w-3/6 justify-center lg:items-start overflow-y-hidden">

              <div className='mx-auto'>
              <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center">
                Rec
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                ently Sold NFTs!
                </span>
            </h1>
            <p className="leading-normal text-base md:text-2xl mb-8 text-center">
            Take a look at the most recent NFTs that have been sold on NFTIO!
            </p>

                <div className="flex justify-center">
                    <div >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pt-4">
                        {(() => {
                          if (loadingState === 'loaded' && !sold.length) {
                            return (
                              <p className="px-20 py-10 text-3xl">No items have been sold yet... :(</p>
                            )
                          } else {
                            return (
                              sold.map((nft, i) => (<NFTcard nft={nft} key={i} formated={false} />))
                            )
                          }
                        })()}
                        </div>
                    </div>
                </div> 

              </div>           
            </div>

        </div>
        </div>
    </div>
  )
}