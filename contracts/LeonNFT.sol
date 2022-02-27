//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LeonNFT is ERC1155, Ownable {
    uint256 public constant WORKOUT_LEON = 0;
    uint256 public constant EXPLOSION_LEON = 1;
    uint256 public constant SOCIAL_MEDIA_LEON = 2;

    constructor()
        ERC1155(
            "https://raw.githubusercontent.com/maciekgrzybek/leo-marketplace/main/tokens/{id}.json"
        )
    {}

    function mintMarketplace(address _marketplace) public onlyOwner {
        _mint(_marketplace, WORKOUT_LEON, 1, "");
        _mint(_marketplace, EXPLOSION_LEON, 1, "");
        _mint(_marketplace, SOCIAL_MEDIA_LEON, 1, "");
    }
}
