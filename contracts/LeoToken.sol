//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LeoToken is ERC20 {
    constructor() ERC20("Leo Token", "LEO") {
        _mint(msg.sender, 100_000 * (10**decimals()));
    }
}
