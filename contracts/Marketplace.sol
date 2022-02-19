//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./LeonToken.sol";
import "./LeocodeToken.sol";
import "./USDToken.sol";

contract Marketplace {
    LeonToken private LeonTokenContract;
    LeocodeToken private LeocodeTokenContract;
    USDToken private USDTokenContract;

    constructor(
        address leonTokenAddress,
        address leocodeTokenAddress,
        address USDTokenAddress
    ) {
        LeonTokenContract = LeonToken(leonTokenAddress);
        LeocodeTokenContract = LeocodeToken(leocodeTokenAddress);
        USDTokenContract = USDToken(USDTokenAddress);
    }

    function printUSDTokens(uint256 amount) public payable returns (bool) {
        USDTokenContract.printTokens(
            msg.sender,
            amount * (10**USDTokenContract.decimals())
        );
        return true;
    }

    function getUSDTokenBalance() public view returns (uint256 balance) {
        return USDTokenContract.balanceOf(msg.sender);
    }

    function getLeocodeTokenBalance() public view returns (uint256 balance) {
        return LeocodeTokenContract.balanceOf(msg.sender);
    }

    function getLeonTokenBalance() public view returns (uint256[3] memory) {
        return LeonTokenContract.showTokens(msg.sender);
    }

    function getLeonTokenUri() public view returns (string memory) {
        return LeonTokenContract.uri(0);
    }

    function buyUSDTokens(uint256 amount) public returns (bool) {
        require(
            getLeocodeTokenBalance() >= amount,
            "Not enough Leocode tokens"
        );
        printUSDTokens(_exchangeLeocodeTokensToUSTD(amount));
        LeocodeTokenContract.transfer(
            address(LeocodeTokenContract),
            amount * (10**LeocodeTokenContract.decimals())
        );

        return true;
    }

    function buyLeocodeTokens(uint256 amount) public returns (bool) {
        require(getUSDTokenBalance() >= amount, "Not enough USD tokens");

        LeocodeTokenContract.transferFromByMarketPlace(
            msg.sender,
            _exchangeUSTDToLeocodeTokens(amount)
        );
        USDTokenContract.transferToByMarketPlace(
            msg.sender,
            amount * (10**USDTokenContract.decimals())
        );

        return true;
    }

    function _exchangeLeocodeTokensToUSTD(uint256 amount)
        private
        view
        returns (uint256)
    {
        return
            amount /
            (10 **
                (LeocodeTokenContract.decimals() -
                    USDTokenContract.decimals())) /
            (uint256(100) / uint256(3));
    }

    function _exchangeUSTDToLeocodeTokens(uint256 amount)
        private
        view
        returns (uint256)
    {
        return
            amount *
            (10 **
                (LeocodeTokenContract.decimals() -
                    USDTokenContract.decimals())) *
            (uint256(100) / uint256(3));
    }

    // function _exchangeUSTDToLeocodeTokens(uint256 amount)
    //     private
    //     returns (uint256)
    // {
    //     return
    //         (amount * (100 / 3)) *
    //         (10**LeocodeTokenContract.decimals() - USDTokenContract.decimals());
    // }
}
