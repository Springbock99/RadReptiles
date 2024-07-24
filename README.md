# DopeBears

## How to run the application

- head to the root of the application and run `docker compose up` or `docker compose up -d`
- go to http://localhost:3000
- Connect your wallet (metamask recommended) and choose Network (goerli recommended)


### Alternative 2:
- head to the root of the application and run `npm install`
- run `npm run dev`
- go to http://localhost:3000
- Connect your wallet (metamask recommended) and choose Network (goerli recommended)



## ERC-1155 - Multi-Token Standard

[nft multi-token standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-1155/)

[EIPs (Ethereum Improvement Protocol)](https://eips.ethereum.org/)

Erc-1155 tokens: 

- A standard to accommodate any combination of fungible tokens, non-fungible tokens, and semi-fungible tokens.
- ERC721's token ID is a single non-fungible index and group of thse non-fungibles is deployed as a single contract with settings of entire collection.
- ERC1155 allows each token ID to represent new configuration token type which may have its own metadata. 

Use cases: 

- When you need multiple copies of a token.
- Redundant bytecodes: ERC-20 and ERC-721 require separate contract to be deployed for each token type or collection.
- Certian functionalitites can be limited by separating each token contract into its own address, Blockchain games may require thousands of token types. 

## ERC-1155 Interface

| Function/Event Signature | Type | Description |
| ------------------------ | ---- | ----------- |
| `balanceOf(address _owner, uint256 _id) → uint256` | Function | Returns the balance of `_owner` for the token type `_id`. |
| `balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) → uint256[]` | Function | Returns the balance of multiple token types `_ids` for multiple `_owners`. |
| `safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes calldata _data)` | Function | Safely transfers `_amount` of tokens of type `_id` from `_from` to `_to`. |
| `safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _amounts, bytes calldata _data)` | Function | Safely transfers multiple token types in a batch from `_from` to `_to`. |
| `setApprovalForAll(address _operator, bool _approved)` | Function | Enables or disables approval for a third party (`_operator`) to manage all of the caller's tokens. |
| `isApprovedForAll(address _owner, address _operator) → bool` | Function | Checks if an `_operator` is approved to manage all of the `_owner`'s tokens. |
| `supportsInterface(bytes4 interfaceID) → bool` | Function | Returns `true` if the contract implements an interface, which can be ERC-1155 itself or other interfaces like ERC-165. |
| `TransferSingle(address operator, address from, address to, uint256 id, uint256 value)` | Event | Emitted when a single token type is transferred, including zero value transfers. |
| `TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)` | Event | Emitted when multiple token types are transferred in a batch, including zero value transfers. |
| `ApprovalForAll(address owner, address operator, bool approved)` | Event | Emitted when approval for a third party to manage all of an owner's tokens is enabled or disabled. |
| `URI(string value, uint256 indexed id)` | Event | Emitted when the URI for a token type is set or updated. The URI is expected to be a URL with metadata about the token. |
