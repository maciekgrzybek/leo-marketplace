//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LeocodeToken is ERC20, AccessControl, Ownable {
    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");

    constructor() ERC20("Leocode Token", "LEO") {
        _mint(_msgSender(), 100_000 * (10**decimals()));
    }

    function setupMarketplace(address marketplace)
        public
        onlyOwner
        returns (bool)
    {
        _setupRole(MARKETPLACE_ROLE, marketplace);
        return true;
    }

    function transferFromByMarketPlace(address to, uint256 amount)
        public
        virtual
        returns (bool)
    {
        require(
            hasRole(MARKETPLACE_ROLE, msg.sender),
            "Caller is not a marketplace"
        );
        _transfer(this.owner(), to, amount);
        return true;
    }

    function transferToByMarketPlace(address from, uint256 amount)
        public
        virtual
        returns (bool)
    {
        require(
            hasRole(MARKETPLACE_ROLE, msg.sender),
            "Caller is not a marketplace"
        );
        _transfer(from, this.owner(), amount);
        return true;
    }
}
