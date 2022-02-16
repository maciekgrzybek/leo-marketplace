//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("USD Token", "USDT") {
        _mint(address(this), initialSupply);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function printTokens(uint256 amount) public returns (bool) {
        address owner = _msgSender();
        _mint(owner, amount);
        return true;
    }
}
