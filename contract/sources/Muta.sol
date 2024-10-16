// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.2/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts@5.0.2/access/Ownable.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC1155/extensions/ERC1155Supply.sol";
import "./ERC5169.sol";

contract Muta is ERC1155, IERC5169, ERC1155Burnable, Ownable, ERC1155Supply {
    mapping(uint256 => address) public artists;
    mapping(uint256 => uint256) public tokensSold;   // Track tokens sold for each ID
    uint256[] public soldIds;                        // Dynamic array to track sold IDs
    mapping(uint256 => bool) public hasSold;         // Check if a token ID has ever been sold
    string[] private _scriptURI;

    event MusicMinted(address indexed to, uint256 indexed id, uint256 amount);
    event MusicPurchased(address indexed buyer, uint256 indexed id, uint256 amount);
    event MusicRemoved(address indexed operator, uint256 indexed id, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);
    event ArtistSet(uint256 indexed id, address indexed artist);

    // Set price in wei directly (e.g., 0.001 ether = 1e15 wei)
    uint256 public constant MUSIC_PRICE = 1000000000000000;  // 1e15 wei (0.001 ether)

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function scriptURI() external view override returns(string[] memory) {
        return _scriptURI;
    }

    function setScriptURI(string[] memory newScriptURI) external onlyOwner override {
        _scriptURI = newScriptURI;
        emit ScriptUpdate(newScriptURI);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setArtist(uint256 id, address artistAddr) external onlyOwner {
        artists[id] = artistAddr;
        emit ArtistSet(id, artistAddr);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data, address artistAddr) public onlyOwner {
        require(artistAddr != address(0), "Invalid artist address"); // Check for non-zero artist address
        _mint(account, id, amount, data);
        artists[id] = artistAddr;
        emit MusicMinted(account, id, amount); 
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data, address[] memory artistAddrs) 
    external onlyOwner 
    {
        require(ids.length == artistAddrs.length, "IDs and artist addresses length mismatch");
        
        _mintBatch(to, ids, amounts, data);
        
        for (uint256 i = 0; i < ids.length; i++) {
            // Set artist for each token ID, defaulting to the owner if artist address is zero
            artists[i] = artistAddrs[i];
            
            // Emit MusicMinted event for each token
            emit MusicMinted(to, ids[i], amounts[i]);
        }
    }

    // When purchasing, expect the payment in wei directly
    function purchase(uint256 id) external payable {
        require(msg.value == MUSIC_PRICE, "Incorrect payment amount.");  // msg.value is in wei
        require(balanceOf(owner(), id) >= 1, "Not enough supply.");
        
        // Transfer music track to buyer
        _safeTransferFrom(owner(), msg.sender, id, 1, "");

        // Update the number of tokens sold for this ID
        tokensSold[id] += 1;

        // Track the ID in soldIds array if it's the first sale of that ID
        if (!hasSold[id]) {
            soldIds.push(id);
            hasSold[id] = true;
        }

        emit MusicPurchased(msg.sender, id, 1);
    }

    function withdraw() external onlyOwner {
        uint256 totalBalance = address(this).balance;
        require(totalBalance > 0, "No balance to withdraw.");

        for (uint256 i = 0; i < soldIds.length; i++) {
            uint256 id = soldIds[i];
            if (tokensSold[id] > 0) {
                address artistAddr = artists[id] != address(0) ? artists[id] : owner();
                uint256 artistShare = (totalBalance * tokensSold[id] * 95) / (100 * totalTokensSold());
                uint256 ownerShare = (totalBalance * tokensSold[id] * 5) / (100 * totalTokensSold());

                if (artists[id] != address(0)) {
                    (bool artistSuccess, ) = payable(artistAddr).call{value: artistShare}("");
                    require(artistSuccess, "Transfer to artist failed.");
                }

                (bool ownerSuccess, ) = payable(owner()).call{value: ownerShare}("");
                require(ownerSuccess, "Transfer to owner failed.");

                emit Withdrawn(artistAddr, totalBalance);
            }
        }
    }

    function totalTokensSold() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < soldIds.length; i++) {
            total += tokensSold[soldIds[i]];
        }
        return total;
    }

    function removeMusic(uint256 id, uint256 amount) external {
        // Only the owner or artist can remove music
        require(msg.sender == owner() || msg.sender == artists[id], "Not authorized to remove music.");

        // Burn the specified amount of tokens
        _burn(msg.sender, id, amount);

        // Emit event to notify that music has been removed
        emit MusicRemoved(msg.sender, id, amount);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}
