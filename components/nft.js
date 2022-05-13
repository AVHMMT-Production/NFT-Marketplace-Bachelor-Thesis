import React from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

export const NFTcard = ({ nft, key, formated }) => {
    if(formated) return (
        <div className='max-w-225 max-height-345'>
            <div key={nft.tokenId} className="border shadow rounded-xl overflow-hidden mx-auto">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <img className="object-cover shadow aspect-square z-20" src={ nft.image } />
            </div>
            <div className="p-4 bg-black">
                <p className='text-white'>{ nft.name }</p>
                <p className="text-2xl mb-4 font-bold text-white">{ nft.price } ETH</p>
                <Link href="/nft/[id]" as={`/nft/${nft.tokenId}`}>
                <button className="w-full bg-cyan-500 shadow-lg shadow-cyan-500/50 py-2 px-12 rounded">View</button>
                </Link>
            </div>
            </div>
        </div>
    )

    if (nft.price === undefined) return (
        <div className='max-w-225 max-height-345'>
            <div key={nft.tokenId} className="border shadow rounded-xl overflow-hidden mx-auto">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <img className="object-cover shadow aspect-square z-20" src={ nft.image } />
            </div>
            <div className="p-4 bg-black">
            <p className='text-white'>{ nft.name }</p>
                <Link href="/nft/[id]" as={`/nft/${nft.tokenId}`}>
                <button className="w-full bg-cyan-500 shadow-lg shadow-cyan-500/50 py-2 px-12 rounded text-white">View</button>
                </Link>
            </div>
            </div>
        </div>
    )

    return (
        <div className='max-w-225 max-height-345'>
            <div key={nft.tokenId} className="border shadow rounded-xl overflow-hidden mx-auto">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <img className="object-cover shadow aspect-square z-20" src={ nft.image } />
            </div>
            <div className="p-4 bg-black">
            <p className='text-white'>{ nft.name }</p>

                <p className="text-2xl mb-4 font-bold text-white">{ ethers.utils.formatUnits(nft.price, 'ether') } ETH</p>
                <Link href="/nft/[id]" as={`/nft/${nft.tokenId}`}>
                <button className="w-full bg-cyan-500 shadow-lg shadow-cyan-500/50 py-2 px-12 rounded text-white">View</button>
                </Link>
            </div>
            </div>
        </div>
    )
}
