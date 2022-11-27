const nftwallet = require("../modal/Nft");
const borrowedNft = require("../modal/Borrow");
const router = require("express").Router();

router.post("/:contract_address/:wallet_address/borrownft", async (req, res) => {
  const {
    title,
    description,
    token_id,
    roi,
    repay,
  } = req.body;
  try {
    const wallet_address=req.params.wallet_address;
    const contract_address=req.params.contract_address;

    const mynft=await nftwallet.findOne({wallet_address,contract_address,token_id});
    if(!mynft){
        return res.status(400).send({ message: "NFT not found" });
    }

    if(mynft.status!="open"){
        return res.status(400).send({ message: "Cannot borrow an NFT which is not open to borrow" });
    }
    
    await nftwallet.findOneAndUpdate({ wallet_address , contract_address, token_id},{status:"borrowed"});

    
    await borrowedNft.create({
      title,
      description,
      borrower_address:wallet_address,
      contract_address,
      token_id,
      roi,
      repay,
    });

    return res.json({
      message: `Successfully Borrowed NFT with ${title} & ${contract_address}`,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports=router