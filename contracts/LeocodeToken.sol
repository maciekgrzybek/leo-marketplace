//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LeocodeToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Leocode Token", "LEO") {
        _mint(address(this), initialSupply);
    }
}
