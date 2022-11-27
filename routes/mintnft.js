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
          const tokenuri = await currentContract.tokenURI(token_id);
          return tokenuri;
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
                .then(() => {
                  return res.status(200).json({
                    message: `Successfully Imported NFT with ${imp.name} & ${contract_address}`,
                  });
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
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
  const { title, description, contract_address, token_id, roi, repay } =
    req.body;
  if (!title) return res.status(400).json({ message: "Title not found" });
  if (!description) return res.status(400).json({ message: "Description not found" });
  if (!req.params.wallet_address)
    return res.status(400).json({ message: "wallet_address not found" });
  if (!contract_address)
    return res.status(400).json({ message: "contract_address not found" });
  if (!token_id) return res.status(400).json({ message: "token_id not found" });

  try {
    const nft = await nftwallet.findOne({
      $and: [{ contract_address }, { token_id }],
    });
    if (nft) {
      return res.status(400).send({ message: "Nft already exits" });
    }
    await nftwallet.create({
      title,
      description,
      wallet_address: req.params.wallet_address,
      contract_address,
      token_id,
      roi,
      repay,
      status: "open",
    });
    return res.json({
      message: `Successfully Minted NFT with ${title} & ${contract_address}`,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
