const nftwallet = require("../modal/Nft");
const router = require("express").Router();

router.get("/:wallet_address/getnft", async (req, res) => {
  try {
    const { wallet_address } = req.params;
    if (!wallet_address)
      return res.status(400).json({ message: "No wallet address found" });

    const nft = await nftwallet.findOne({
      $and: [{ wallet_address }, { status: "open" }],
    });

    return res.status(200).send({
      message: `Successfully Fetched NFTs with wallet address ${wallet_address}`,
      nft,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
