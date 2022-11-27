const nftwallet = require("../modal/Nft");
const borrowedNft = require("../modal/Borrow");
const lentnft = require("../modal/Lend");
const router = require("express").Router();

router.post("/:contract_address/:wallet_address/lendnft", async (req, res) => {
  try {
    const {contract_address,wallet_address}=req.params;
    const mynft=await nftwallet.findOne({wallet_address,contract_address});
    if(!mynft){
      return res.status(400).send({ message: "NFT not found" });
    }
    if(mynft.status=="lent"){
      return res.status(400).send({ message: "Cannot Lend NFT which is already lent" });
    }

    if(mynft.status!="borrowed"){
      return res.status(400).send({ message: "Cannot Lend NFT which is not in borrow status" });
    }

    await nftwallet.findOneAndUpdate({ wallet_address , contract_address},{status:"lent"});

    await lentnft.create({
      title,
      description,
      lender_address:wallet_address,
      contract_address,
      token_id,
      roi,
      repay,
    });

    return res.json({
      message: `Successfully Lent NFT with ${title} & ${nft_address}`,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});


router.post("/:contract_address/:wallet_address/repaynft", async (req, res) => {
  try {
    const {contract_address,wallet_address}=req.params;
    const mynft=await nftwallet.findOne({wallet_address,contract_address});
    if(!mynft){
      return res.status(400).send({ message: "NFT not found" });
    }
    if(mynft.status!="lent"){
      return res.status(400).send({ message: "Cannot repay NFT which not lent" });
    }

    await nftwallet.findOneAndUpdate({ wallet_address , contract_address},{status:"open"});

    return res.json({
      message: `Successfully repayed NFT with ${title} & ${nft_address}`,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
