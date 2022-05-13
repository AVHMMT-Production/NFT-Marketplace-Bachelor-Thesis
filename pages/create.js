import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useMoralis, useNewMoralisObject  } from "react-moralis";


const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

import { nftaddress, nftmarketaddress } from '../config'
import { MinterABI as NFT, MarketplaceHandlerABI as Market } from '../contractABI'

export default function CreateNFT () {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const [desc, setDesc] = useState("Insert description here...")
    const router = useRouter()
    const { isAuthenticated, user, Moralis } = useMoralis();
    const { save } = useNewMoralisObject("MintedNFTs");

    useEffect(() => {
        if(!selectedFile){
            setFileUrl(undefined);
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setFileUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile])

    async function onChange(e) {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return
        }

        setSelectedFile(e.target.files[0]); 
    }

    async function createNFT() {
        formInput.description = desc
        const { name, description } = formInput

        const imgData = new Moralis.File(selectedFile.name, selectedFile)
        try {
            await imgData.saveIPFS();
            const url = imgData.ipfs();

            const metadata = {
                name, 
                description, 
                image: url,
            };

            let MoralisMeta = metadata;
            MoralisMeta.creator = user.get("ethAddress");

            const meta = new Moralis.File(`${name}metadata.json`, {
                base64: Buffer.from(JSON.stringify(metadata)).toString('base64'),
            });
            await meta.saveIPFS();
            const metaUrl = meta.ipfs();

            createSale(metaUrl, MoralisMeta)
        } catch (e) {
            console.log('Error uploading metadata: ', e)
            
        }
    }

    async function createSale(url, meta) {
        const provider = await Moralis.enableWeb3();
        const signer = provider.getSigner()
        
        let contract = new ethers.Contract(nftaddress, NFT, signer)
        let transaction = await contract.mintNFT(url)
        let tx = await transaction.wait()

        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        contract = new ethers.Contract(nftmarketaddress, Market, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.listNFT(
            nftaddress, tokenId
        )
        
        await transaction.wait()

        meta.tokenId = tokenId;

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

    if (!isAuthenticated) { 
        return (
            <div className='h-screen'>
            <div className="flex justify-center">
                <div className="w-1/2 flex flex-col pb-12">
                    <h1 className="text-2xl text-indigo-400 font-bold leading-7 sm:text-3xl sm:truncate pt-12 pb-12 mx-auto">You must be logged in to create a NFT</h1>
                </div>
            </div>
        </div>
        )
    }

    return (
        <div className='h-screen'>
            <div className="flex justify-center">
                <div className="w-1/2 flex flex-col pb-12">
                <h1 className="text-2xl text-indigo-400 font-bold leading-7 sm:text-3xl sm:truncate pt-12 pb-12 mx-auto">Upload your own NFT to sell</h1>
                    <input
                        placeholder="Asset Name"
                        className="mt-8 mb-4 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    />
                    <MDEditor value={desc} onChange={setDesc} />
                    <div className='mx-auto'>
                        <input
                            type="file"
                            name="Asset"
                            className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4 file:mt-2
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-cyan-50 file:text-cyan-700
                            hover:file:bg-cyan-100 mt-4"
                            onChange={onChange}
                            accept="image/*"
                        />

                    </div>
                    
                    {
                        fileUrl && (
                            <img className="rounded mt-4 mx-auto shadow-lg" width="500" src={fileUrl} />
                        )
                    }
                    <button
                        onClick={createNFT}
                        className="font-bold mt-4 text-white p-4 bg-cyan-500 shadow-lg shadow-cyan-500/50 px-12 rounded"
                        >
                            Mint NFT
                    </button>
                </div>
            </div>
        </div>
    )
}