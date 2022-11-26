const nftwallet = require("../modal/Nft");
const address = require("../modal/Address");
const router = require("express").Router();

router.post("/:wallet_address/mintnft", async (req, res) => {
  const { title, description, wallet_address, nft_address, token_id, roi, repay } = req.body;
  try {
    const nft = await nftwallet.findOne({ nft_address });
    if (nft) {
      return res.status(400).send({ message: "Nft already exits" });
    }
    const create_nft = await nftwallet.create({
      title,
      description,
      wallet_address,
      nft_address,
      token_id,
      roi,
      repay,
    });
    return res.json({
      message: `Successfully Minted NFT with ${title} & ${nft_address}`,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

router.post("/:wallet_address/addnft", async (req, res) => {
  const { wallet_address, contract_address, token_id } = req.body;
  try {
    const nft = await address.find({ wallet_address, contract_address });
    if (nft) {
      return res.status(400).send({
        message: `${contract_address} already exits with ${wallet_address}`,
      });
    }
    const add_nft = await address.create({
      wallet_address,
      contract_address,
      token_id,
    });

    return res.json({
      message: `${contract_address} registered to ${wallet_address}`,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
