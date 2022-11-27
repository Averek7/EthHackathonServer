const nftwallet = require("../modal/Nft");
const router = require("express").Router();

router.get("/:wallet_address/getnft", async (req, res) => {
  try {
    const nft = await nftwallet.find(req.body.wallet_address);
    if (!nft) {
      return res.status(404).send({ message: "No wallet address found" });
    }
    return res.status(200).send({ message: "Successfully Fetched", nft });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
