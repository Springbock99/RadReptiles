// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "./MultiToken.sol";

/**
 * @title Forging
 * @dev A contract that facilitates token forging using the MultiToken contract.
 */
contract Forging is Ownable2Step {

    MultiToken nft;

    /**
     * @dev Constructor that initializes the Forging contract.
     * @param nftAddress The address of the MultiToken contract.
     */
    constructor(address nftAddress)
        Ownable(msg.sender)
    {
       nft = MultiToken(nftAddress);
    }

    /**
     * @dev Mint Token 3 by burning Tokens 0 and 1, restricted by token balances.
     * @param amount The amount of tokens to mint.
     */
    function mintToken3(uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 0) >= amount &&
            nft.balanceOf(msg.sender, 1) >= amount,
            "Not enough token 0 and/or token 1 balance"
        );

        nft.burn(msg.sender, 0, amount);
        nft.burn(msg.sender, 1, amount);

        nft.mint(msg.sender, 3, amount);
    } 

    /**
     * @dev Mint Token 4 by burning Tokens 1 and 2, restricted by token balances.
     * @param amount The amount of tokens to mint.
     */
    function mintToken4(uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 1) >= amount &&
            nft.balanceOf(msg.sender, 2) >= amount,
            "Not enough token 1 and/or token 2 balance"
        );

        nft.burn(msg.sender, 1, amount);
        nft.burn(msg.sender, 2, amount);

        nft.mint(msg.sender, 4, amount);
    } 

    /**
     * @dev Mint Token 5 by burning Tokens 0 and 2, restricted by token balances.
     * @param amount The amount of tokens to mint.
     */
    function mintToken5(uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 0) >= amount &&
            nft.balanceOf(msg.sender, 2) >= amount,
            "Not enough token 0 and/or token 2 balance"
        );

        nft.burn(msg.sender, 0, amount);
        nft.burn(msg.sender, 2, amount);

        nft.mint(msg.sender, 5, amount);
    } 

    /**
     * @dev Mint Token 6 by burning Tokens 0, 1, and 2, restricted by token balances.
     * @param amount The amount of tokens to mint.
     */
    function mintToken6(uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 0) >= amount &&
            nft.balanceOf(msg.sender, 1) >= amount &&
            nft.balanceOf(msg.sender, 2) >= amount,
            "Not enough token 0, token 1, and/or token 2 balance"
        );

        nft.burn(msg.sender, 0, amount);
        nft.burn(msg.sender, 1, amount);
        nft.burn(msg.sender, 2, amount);

        nft.mint(msg.sender, 6, amount);
    }

    /**
     * @dev Burn Tokens 3, 4, 5, and 6 without receiving rewards.
     * @param tokenId The ID of the token to burn.
     * @param amount The amount of tokens to burn.
     */
    function burnNoRewards(uint256 tokenId, uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 3) >= amount &&
            nft.balanceOf(msg.sender, 4) >= amount &&
            nft.balanceOf(msg.sender, 5) >= amount &&
            nft.balanceOf(msg.sender, 6) >= amount,
            "Not enough token 3, token 4, token 5, and/or token 6 balance"
        );

        nft.burn(msg.sender, 3, amount);
        nft.burn(msg.sender, 4, amount);
        nft.burn(msg.sender, 5, amount);
        nft.burn(msg.sender, 6, amount);
    }
}
