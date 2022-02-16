//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Metadata.sol";

contract Leon is ERC1155, ERC1155Metadata {
    uint256 public constant WORKOUT_LEON = 0;
    uint256 public constant EXPLOSION_LEON = 1;
    uint256 public constant SOCIAL_MEDIA_LEON = 2;

    constructor() ERC1155("") {
        _mint(msg.sender, WORKOUT_LEON, 1, "");
        _mint(msg.sender, EXPLOSION_LEON, 1, "");
        _mint(msg.sender, SOCIAL_MEDIA_LEON, 1, "");
    }
}
