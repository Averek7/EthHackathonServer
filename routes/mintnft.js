const nftwallet = require("../modal/Nft");
const router = require("express").Router();
const ethers = require("ethers");
const axios = require("axios");
const fetch = require("node-fetch");

router.post(
  "/:contract_address/:wallet_address/importnft",
  async (req, res) => {
    try {
      const { token_id } = req.body;
      const { contract_address, wallet_address } = req.params;

      if (!wallet_address)
        return res.json({ message: "Wallet address Not found" });
      if (!contract_address)
        return res.json({ message: "Contract address Not found" });

      var contractABI;
      //Fetch ABI
      fetch(
        `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contract_address}&apikey=${process.env.API_KEY}`
      )
        .then(async (res) => {
          const provider = ethers.getDefaultProvider(
            `https://polygon-mumbai.g.alchemy.com/v2/${process.env.alchemy}`
          );
          contractABI = (await res.json()).result;
          const currentWallet = new ethers.Wallet(
            process.env.private_key,
            provider
          );

          const currentContract = new ethers.Contract(
            contract_address,
            contractABI,
            currentWallet
          );
          const ownerOfNft = await currentContract.ownerOf(token_id);
          if (ownerOfNft != wallet_address)
            return res.status(400).json({ err: "Only owners can import nft!" });

          const tokenuri = await currentContract.tokenURI(token_id);
          return tokenuri;
        })
        .catch((err) => {
          return res.status(400).json({
            status: false,
            message: "Invalid Contract Address provided",
          });
        })
        .then(async (resp) => {
          // console.log(await resp);
          const importedNFT = await resp;

          const nft = await nftwallet.findOne({
            $and: [{ contract_address }, { token_id }],
          });
          if (nft) {
            return res.status(400).send({ message: "Nft already exists" });
          }

          fetch(importedNFT)
            .then(async (r) => {
              const imp = await r.json();
              await nftwallet
                .create({
                  title: imp.name,
                  description: imp.description,
                  image: imp.image,
                  wallet_address,
                  contract_address,
                  token_id,
                  status: "open",
                })
                .then(async () => {
                  const allNFT = await nftwallet.find({ wallet_address });
                  return res.status(200).json({
                    message: `Successfully Imported NFT with ${imp.name} & ${contract_address}`,
                    nfts: allNFT,
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(400)
                .json({ status: false, message: err.message });
            });
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({ status: false, message: err.message });
        });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  }
);

router.post("/:wallet_address/mintnft", async (req, res) => {
  const { title, description, contract_address, token_id, image } = req.body;
  const { wallet_address } = req.params;
  if (!wallet_address)
    return res.status(400).json({ message: "Wallet Address Not Found" });

  if (!title) return res.status(400).json({ message: "Title not found" });
  if (!description)
    return res.status(400).json({ message: "Description not found" });
  if (!contract_address)
    return res.status(400).json({ message: "Contract Address not found" });
  if (!token_id) return res.status(400).json({ message: "Token Id not found" });
  if (!image) return res.status(400).json({ message: "Image link not found" });

  try {
    const nft = await nftwallet.findOne({
      $and: [{ contract_address }, { token_id }],
    });
    if (nft) {
      return res.status(400).send({ message: "Nft already exists" });
    }
    await nftwallet.create({
      title,
      description,
      wallet_address,
      contract_address,
      token_id,
      status: "open",
      image,
    });
    const allNFT = await nftwallet.find({ wallet_address });
    return res.json({
      message: `Successfully Minted NFT with ${title} & ${contract_address}`,
      nft: allNFT,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
