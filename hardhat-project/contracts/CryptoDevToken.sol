// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IASCryptoDevs.sol";

contract CryptoDevToken is ERC20, Ownable {

    IASCryptoDevs ASCryptoDevsNFT;
    uint256 public constant tokensPerNFT = 10 * 10**18;
    uint256 public constant tokenPrice = 0.001 ether;
    uint256 public constant maxTotalSupply = 10000 * 10**18;

    mapping (uint256 => bool) public tokenIdsClaimed;

    constructor( address _cryptoDevsContract) ERC20("Agrim Crypto Dev Token", "ACD") {
        ASCryptoDevsNFT = IASCryptoDevs(_cryptoDevsContract);
    }

    function mint(uint256 amount) public payable{
        
        uint256 requiredAmount = amount * tokenPrice;
        require(msg.value >= requiredAmount, "Ether sent is incorrect");
        uint256 amountWithDecimals = amount * 10**18;
        require(totalSupply() + amountWithDecimals <= maxTotalSupply, "Maximum total supply exceeded");
        _mint(msg.sender,amountWithDecimals );

    }

    function claim() public {

        address sender = msg.sender;
        uint256 balance = ASCryptoDevsNFT.balanceOf(sender);
        require(balance > 0, "You dont own any Agrim Crypto Dev NFT's ");
        uint256 amount = 0;

        for(uint256 i = 0; i < balance; i++){
            uint256 tokenId = ASCryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
            if(!tokenIdsClaimed[tokenId]) {
                amount++;
                tokenIdsClaimed[tokenId] = true;
            }
        }
        require(amount > 0, "You have already claimed all your tokens");

        _mint(msg.sender, amount * tokensPerNFT);
    }

    receive() external payable{}

    fallback() external payable{}

}   