// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MultiToken
 * @dev An ERC1155 token contract with mint cooldown functionality.
 */
contract MultiToken is ERC1155, ERC1155Burnable, Ownable {
    uint256 public mintCooldown; // seconds
    bool public firstMintDone = false;
    error CoolDownFailure();
    /**
     * @dev Modifier to check if minting is allowed based on cooldown.
     */
    modifier canMint() {
        if (block.timestamp < mintCooldown + 60) revert CoolDownFailure();
        _;
    }

    /**
     * @dev Constructor that initializes the MultiToken contract.
     */
    constructor()
        ERC1155("ipfs://QmYPdi5nLPCrEugAZoxaqhK1RyEyoz3w4pb6tLuKqf5Sd7/")
        Ownable(msg.sender)
    {
        mintCooldown = block.timestamp;

        // Mint three initial tokens with IDs 0, 1, and 2
        for (uint256 tokenId = 0; tokenId <= 2; tokenId++) {
            _mint(msg.sender, tokenId, 0, "");
        }
    }

    /**
     * @dev Mint tokens to a specified recipient, restricted by mint cooldown.
     * @param recipient The address to mint tokens to.
     * @param tokenId The ID of the token to mint.
     * @param amount The amount of tokens to mint.
     */
    function mint(
        address recipient,
        uint256 tokenId,
        uint256 amount
    ) external canMint {
        _mint(recipient, tokenId, amount, "");

        mintCooldown = block.timestamp + 60;
    }

    /**
     * @dev Internal function to update token balances during transfers.
     * @param $from The address to transfer tokens from.
     * @param $to The address to transfer tokens to.
     * @param $ids An array of token IDs to transfer.
     * @param $values An array of token amounts to transfer.
     */
    function _update(
        address $from,
        address $to,
        uint256[] memory $ids,
        uint256[] memory $values
    ) internal override(ERC1155) {
        super._update($from, $to, $ids, $values);
    }
}
