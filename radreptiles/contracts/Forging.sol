pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "./MultiToken.sol";
    error noData();


    contract Forging is Ownable {

        MultiToken nft;

      constructor(address nftAddress)
        Ownable(msg.sender)
    {
       nft = MultiToken(nftAddress);
    }

    function mintToken3(uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 0) >= amount&&
            nft.balanceOf(msg.sender, 1) >= amount,
            "dont have the enough of toke 0 and 1"
        );


        nft.burn(msg.sender, 0, amount);
        nft.burn(msg.sender, 1, amount);

        nft.mint(msg.sender, 3, amount);

    } 

    function mintToken4(uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 1) >= amount&&
            nft.balanceOf(msg.sender, 2) >= amount,
            "dont have the enough of toke 1 and 2"
        );


        nft.burn(msg.sender, 1, amount);
        nft.burn(msg.sender, 2, amount);

        nft.mint(msg.sender, 4, amount);

    } 

    function mintToken5(uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 0) >= amount&&
            nft.balanceOf(msg.sender, 2) >= amount,
            "dont have the enough of toke 0 and 2"
        );


        nft.burn(msg.sender, 0, amount);
        nft.burn(msg.sender, 2, amount);

        nft.mint(msg.sender, 5, amount);

    } 
  

    function mintToken6(uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 0) >= amount,
            "Not enough token 0 balance"
        );
        require(
            nft.balanceOf(msg.sender, 1) >= amount,
            "Not enough token 1 balance"
        );
        require(
            nft.balanceOf(msg.sender, 2) >= amount,
            "Not enough token 2 balance"
        );

        nft.burn(msg.sender, 0, amount);
        nft.burn(msg.sender, 1, amount);
        nft.burn(msg.sender, 2, amount);

        nft.mint(msg.sender, 6, amount);
    }

    function burnNoRewards(uint256 tokenId, uint256 amount) external {
        require(
            nft.balanceOf(msg.sender, 3) >= amount,
            "Not enough token 0 balance"
        );
        require(
            nft.balanceOf(msg.sender, 4) >= amount,
            "Not enough token 1 balance"
        );
        require(
            nft.balanceOf(msg.sender, 5) >= amount,
            "Not enough token 2 balance"
        );
        require(
            nft.balanceOf(msg.sender, 6) >= amount,
            "Not enough token 2 balance"
        );

        nft.burn(msg.sender, 3, amount);
        nft.burn(msg.sender, 4, amount);
        nft.burn(msg.sender, 5, amount);
        nft.burn(msg.sender, 6, amount);
    }
}


