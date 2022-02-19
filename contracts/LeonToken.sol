//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract LeonToken is ERC1155 {
    uint256 public constant WORKOUT_LEON = 0;
    uint256 public constant EXPLOSION_LEON = 1;
    uint256 public constant SOCIAL_MEDIA_LEON = 2;
    string public symbol = "LEON";

    address private _owner;

    constructor()
        ERC1155(
            "https://raw.githubusercontent.com/maciekgrzybek/leo-marketplace/feat/leo-marketplace/tokens/{id}.json"
        )
    {
        _mint(msg.sender, WORKOUT_LEON, 1, "");
        _mint(msg.sender, EXPLOSION_LEON, 1, "");
        _mint(msg.sender, SOCIAL_MEDIA_LEON, 1, "");
        _owner = msg.sender;
    }

    function showTokens(address owner) public view returns (uint256[3] memory) {
        return [
            balanceOf(owner, WORKOUT_LEON),
            balanceOf(owner, EXPLOSION_LEON),
            balanceOf(owner, SOCIAL_MEDIA_LEON)
        ];
    }

    function showOwnersTokens() public view returns (uint256[3] memory) {
        return showTokens(_owner);
    }
}
