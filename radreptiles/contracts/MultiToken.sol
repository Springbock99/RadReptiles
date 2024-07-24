pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiToken is ERC1155, ERC1155Burnable, Ownable {
    uint256 public mintCooldown = 60; // seconds
    bool public firstMintDone = false;

    modifier canMint() {
        require(
            mintCooldown == 0 || block.timestamp > mintCooldown,
            " Cooldown period not done"
        );
        _;
    }

    constructor()
        ERC1155("ipfs://QmYPdi5nLPCrEugAZoxaqhK1RyEyoz3w4pb6tLuKqf5Sd7/")
        Ownable(msg.sender)
    {
        for (uint256 tokenId = 0; tokenId <= 2; tokenId++) {
            _mint(msg.sender, tokenId, 0, "");
        }
    }

    function mint(
        address recipient,
        uint256 tokenId,
        uint256 amount
    ) external canMint {
        if (!firstMintDone) {
            mintCooldown = block.timestamp + 60; // 60 seconds cooldown after the first mint
            firstMintDone = true;
        }

        _mint(recipient, tokenId, amount, "");
    }

    function _update(
        address $from,
        address $to,
        uint256[] memory $ids,
        uint256[] memory $values
    ) internal override(ERC1155) {
        super._update($from, $to, $ids, $values);
    }
}
