//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./LeoToken.sol";
import "./USDToken.sol";

contract Marketplace is ERC1155Holder {
    address private leo;
    address private usdt;
    address private leonNft;

    uint8 public leoDecimals;
    uint8 public usdtDecimals;

    modifier isMyToken(address _address) {
        require(_address == leo || _address == usdt, "Not my token");
        _;
    }

    constructor(
        address _leo,
        address _usdt,
        address _leonNft
    ) {
        leo = _leo;
        usdt = _usdt;
        leonNft = _leonNft;

        leoDecimals = LeoToken(_leo).decimals();
        usdtDecimals = USDToken(_usdt).decimals();
    }

    function exchange(
        address _from,
        address _to,
        uint256 _amount
    ) public isMyToken(_from) isMyToken(_to) {
        uint256 toSend;

        if (_from == leo) {
            toSend = _exchangeLeoToUsdt(_amount);
        } else {
            toSend = _exchangeUsdtToLeo(_amount);
        }

        require(
            IERC20(_to).balanceOf(address(this)) >= toSend,
            "Not enough tokens"
        );
        IERC20(_to).transfer(msg.sender, toSend);
        IERC20(_from).transferFrom(msg.sender, address(this), _amount);
    }

    function buyNft(uint256 _id, address _with) public {
        require(
            IERC1155(leonNft).balanceOf(address(this), _id) > 0,
            "Don't have that NFT"
        );

        IERC1155(leonNft).safeTransferFrom(
            address(this),
            msg.sender,
            _id,
            1,
            ""
        );
        ERC20(_with).transferFrom(
            msg.sender,
            address(this),
            _calculateNftPrice(_with)
        );
    }

    function sellNft(uint256 _id, address _with) public {
        require(
            IERC1155(leonNft).balanceOf(msg.sender, _id) > 0,
            "Don't have that NFT"
        );

        IERC1155(leonNft).safeTransferFrom(
            msg.sender,
            address(this),
            _id,
            1,
            ""
        );
        ERC20(_with).transfer(msg.sender, _calculateNftPrice(_with));
    }

    function _calculateNftPrice(address _with) private view returns (uint256) {
        uint256 price;

        if (_with == leo) {
            price = 200 * (10**leoDecimals);
        } else {
            price = (15 * (10**usdtDecimals)) / 10;
        }

        return price;
    }

    function _exchangeLeoToUsdt(uint256 _amount)
        private
        view
        returns (uint256)
    {
        return ((_amount * (10**usdtDecimals)) / (10**leoDecimals) / 100) * 3;
    }

    function _exchangeUsdtToLeo(uint256 _amount)
        private
        view
        returns (uint256)
    {
        return ((_amount * 100 * (10**leoDecimals)) / (10**usdtDecimals)) / 3;
    }
}
