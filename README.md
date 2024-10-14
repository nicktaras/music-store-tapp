# music-store-tapp
music store tapp

### Testnet 

0x41f1Cd88870fF73b6BF4465Ea6e494F9BEdF67c6 Sepolia

### Tapp

A demonstration Tapp to show how labels and artists could reach fans in a new and innovative way. 

#### Action Cards:

- Info to listen and rate music (Public)
- Buy (Public)

#### Quick steps to develop using the source code

- Upload the music to a service such as IPFS
- Update the meta to link to the music and image files
- upload the meta folder
- deploy the smart contract and set the contract uri to the root of the meta folder
- develop the tapp source code, adding new views or anything you need
- upload to .tsml file to IPFS or any location 
- Set the script uri inside the contract to point to the TSML file
- Mint the music to the contact by id, creating as many songs as you choose per song, selecting which artist(s) to pay

#### Enhancements 

The current hackathon project was completed over a day. Here are some considerations to advance this towards being part of a product / service:

- Price selection per song
- More control given to artists, e.g. in this initial version the owner decides when withrawals are made to all artists
- Optimisations (this has not been security checked, fully tested, gas optimised)
- Tapp solutions made for both the owner and artists to utilise all smart contract functions
- Addition of Web 2 feautres such as a star rating feature to non-token holders to bring further social interaction with the tapp


