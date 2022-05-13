# NFT Marketplace - Thesis
[![built-with openzeppelin](https://img.shields.io/badge/built%20with-OpenZeppelin-3677FF)](https://docs.openzeppelin.com/)
[![built-with solidity](https://img.shields.io/badge/built%20with-solidity-3677FF)](https://solidity.readthedocs.io/en/v0.8.11/getting-started.html)
[![built-with next.js](https://img.shields.io/badge/built%20with-next.js-3677FF)](https://nextjs.org/)
[![built-with tailwindcss](https://img.shields.io/badge/built%20with-tailwindcss-3677FF)](https://tailwindcss.com/)
[![built-with hardhat](https://img.shields.io/badge/built%20with-hardhat-3677FF)](https://hardhat.dev/)

The objective of this thesis is to investigate NFTs and design your own NFT marketplace on
the Ethereum TestNet.

We will be developing a web app where anyone with a Ethereum wallet is able to mint, buy
and sell NFTs. In the process we will be investigating NFTs to find what is most suitable to be
traded on a marketplace. We will be creating smart contracts to be deployed on the network
to control the trade of NFTs, and we will be integrating and deploying our marketplace with
one of the Ethereum TestNet.

## Technologies currently in use:

- Next.JS (React based framework for making SPA and mobile apps)
  - Next.JS is a framework based on Babel and Node which integrates with React to create fast SPAs, making Server-Side rendering super easy. In short: It's very easy to create pages with Next, writing less code, freeing up time to spend on developing other aspects of the app
- Tailwindcss
  - Tailwindcss is a modern looking css library helping us speed up the design process using their css classes
- Solidity
  - Solidity is a object-oriented, high-level language for implementing smart contracts. These smart contracts controls the behaviour of accounts within the Ethereum state. (taken from [Solidity Docs](https://docs.soliditylang.org/en/v0.8.11/index.html)). Using this programming language we can create smart contracts who handles buying, selling and minting NFTs on our marketplace. 
  - OpenZeppelin Contract Standards. "OpenZeppelin is the premier crypto cybersecurity technology and services company, trusted by the most used DeFi and NFT projects." (taken from [OpenZeppelin](https://openzeppelin.com/about/)). OpenZeppelin has a library for secure smart contract development. We will be using the ERC721 standard for our non-fungible tokens.
- HardHat
  - HardHat is a Ethereum development enviroment which makes it easy testing your smart contracts locally. This way you can debug and test your Solidity contracts easily without having to go through a official TestNet. It's very flexible and has lots of support for plugins etc.
- Polygon & Infura
  - Polygon is a secondary scaling solution for the Ethereum blockchain. Since the Ethereum blockchain has become slow and expensive to use, Polygon solves this by processing some of the transactions elsewhere. Making it cheaper to use.
  - Infura is going to be use to deploy our DApp to the Polygon TestNet when we are ready. Infura makes everything easier for a developer who wants to learn and test their DApp.
  
### Honorable mention
Just mentioning that we use Visual Studio Code for developing the DApp with is amazing expandability with all these extensions, and GitHub + Git for making cooperation and version control so easy.

## Link to Overleaf repo
https://github.com/AVHMMT-Production/NFT-Marketplace---Thesis
