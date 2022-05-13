// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarketplaceHandler is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsForSale;

    address payable owner;
    uint256 listingPrice = 0.005 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable creator;
        address payable seller;
        address payable owner;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool forSale
    );

    event NFTListed (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        bool forSale
    );

    event Transfer (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address sender,
        address owner,
        bool isApproved
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function listNFT(
        address nftContract,
        uint256 tokenId
        ) public {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            payable(msg.sender),
            0,
            false
        );
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        uint256 itemId
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must me equal to listing price");
        
        _itemsForSale.increment();
        idToMarketItem[itemId].forSale = true;
        idToMarketItem[itemId].seller = payable(msg.sender);
        idToMarketItem[itemId].owner = payable(address(0));
        idToMarketItem[itemId].price = price;

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            true
        );
    }

    function createMarketSale(
        address nftContract,
        uint256 itemId
        ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        bool approved = IERC721(nftContract).isApprovedForAll(msg.sender, address(this));
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        emit Transfer(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            idToMarketItem[itemId].owner,
            approved
        );

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).approve(msg.sender, tokenId);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].seller = payable(address(0));
        idToMarketItem[itemId].forSale = false;
        _itemsForSale.decrement();
        payable(owner).transfer(listingPrice);



    }

    function cancelMarketSale(
        address nftContract,
        uint256 tokenId,
        uint256 itemId
        ) public payable nonReentrant {

            _itemsForSale.decrement();
            idToMarketItem[itemId].forSale = false;
            idToMarketItem[itemId].seller = payable(address(0));
            idToMarketItem[itemId].price = 0;
            idToMarketItem[itemId].owner = payable(msg.sender);

            IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint unsoldItemCount = _itemsForSale.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1]. owner == address(0) && idToMarketItem[i + 1].forSale == true) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchItemIds() public view returns (uint) {
        return _itemIds.current();
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1]. owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1]. owner == msg.sender) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == msg.sender) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                items[currentIndex].itemId = currentId;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchNFT(
        uint256 id
    ) public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();

        MarketItem[] memory item = new MarketItem[](1);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].itemId == id) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                item[0] = currentItem;
                item[0].itemId = currentId;
            }
        }
        return item;
    }
}