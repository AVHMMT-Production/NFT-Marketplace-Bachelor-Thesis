import { useEffect, useState } from 'react';
import { useMoralisCloudFunction } from "react-moralis";
import { NFTcard } from '../components/nft';

export default function Feed() {
  const [nfts, setNfts] = useState([])
  const [sokList, setSokList] = useState([])
  const [fullList, setFullList] = useState([])
  const [testList, setTestList] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const { fetch } = useMoralisCloudFunction(
    "listedAndSoldNFTs",
    { autoFetch: false }
  );
  
  useEffect(() => {
    loadNFTs()
  }, [])
  
  async function loadNFTs(){
    updateList()
    setLoadingState('loaded')
  }

  async function updateList() {
    fetch({
      onSuccess: (data) => {
        setFullList(data[0])
        setNfts(data[0])
        setSokList(data[0])
      },
      onError: (err) => {
        console.log("Error: ", err);
    }
    });
  }
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setTestList(fullList.filter(nft => nft.name.toLowerCase().includes(lowerCase)));
    setNfts(fullList.filter(nft => nft.name.toLowerCase().includes(lowerCase)))

  };

  let selectHandler = (e) => {
    if(testList.length > 0) {
      switch(e.target.value){
        case "nameatz":
          setNfts(testList.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
          break;
        case "namezta":
          setNfts(testList.sort((a,b) => (a.name > b.name) ? -1 : ((b.name > a.name) ? 1 : 0)));
          break;
        case "pricelth":
          setNfts(testList.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0)));
          break;
          case "pricehtl":
            setNfts(testList.sort((a,b) => (a.price > b.price) ? -1 : ((b.price > a.price) ? 1 : 0)));
            break;
        default:
          break;
      }
    } else {
      switch(e.target.value){
        case "nameatz":
          setNfts(sokList.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
          break;
        case "namezta":
          setNfts(sokList.sort((a,b) => (a.name > b.name) ? -1 : ((b.name > a.name) ? 1 : 0)));
          break;
        case "pricelth":
          setNfts(sokList.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0)));
          break;
          case "pricehtl":
            setNfts(sokList.sort((a,b) => (a.price > b.price) ? -1 : ((b.price > a.price) ? 1 : 0)));
            break;
        default:
          break;
      }
    }
    console.log(testList);
  }

return (
    <div className="flex justify-center w-4/5 mx-auto">
    <div>
    <div className="flex justify-center">
      <div className="mb-3 xl:w-96">
          <div className="input-group relative flex flex-wrap items-stretch w-full mb-4">
            <input type="search" className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" onChange={inputHandler} />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <select className="form-select appearance-none
            block
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example" onChange={selectHandler}>
              <option selected>Open this select menu</option>
              <option value="nameatz">Name ascending</option>
              <option value="namezta">Name descending</option>
              <option value="pricelth">Price low to high</option>
              <option value="pricehtl">Price high to low</option>
          </select>
        </div>
      </div>
      {(() => {
          if (loadingState === 'loaded' && !nfts.length) {
              return (
                  <div className="flex justify-center">
                      <p className="text-3xl">No items for sale on the marketplace...(yet) ;) </p>
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
    </div>
)
}
