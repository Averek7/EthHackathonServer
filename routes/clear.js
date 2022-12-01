const borrowedNft = require("../modal/Borrow");
const lentnft = require("../modal/Lend");
const nftwallet = require("../modal/Nft");

const router = require("express").Router();

router.post("/clear", async (req, res) => {
  await borrowedNft.remove();
  await lentnft.remove();
  await nftwallet.remove();

  return res.status(200).json({ message: "Cleared DataBase Successfully" });
});

module.exports = router;
