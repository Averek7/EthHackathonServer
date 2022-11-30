const nftwallet = require("../modal/Nft");
const borrowedNft = require("../modal/Borrow");
const lentnft = require("../modal/Lend");
const router = require("express").Router();

router.post("/:contract_address/:wallet_address/lendnft", async (req, res) => {
  try {
    const { contract_address, wallet_address } = req.params;
    const lender = req.body.lender_address;
    if (!wallet_address)
      return res.json({ message: "Wallet address Not found" });
    if (!contract_address)
      return res.json({ message: "Contract address Not found" });

    const mynft = await nftwallet.findOne({
      $and: [{ wallet_address }, { contract_address }],
    });

    if (!mynft) {
      return res.status(400).send({ message: "NFT not found" });
    }

    const { title, description, token_id, roi, repay, status, image, amount } =
      mynft;

    if (status == "lent") {
      return res
        .status(400)
        .send({ message: "Cannot Lend NFT which is already lent" });
    }

    if (status != "borrowed") {
      return res
        .status(400)
        .send({ message: "Cannot Lend NFT which is not in borrow status" });
    }

    await nftwallet.findOneAndUpdate(
      {
        $and: [{ wallet_address }, { contract_address }],
      },
      { status: "lent" }
    );

    await lentnft.create({
      title,
      description,
      lender_address: lender,
      borrowers_address: mynft.wallet_address,
      contract_address,
      token_id,
      roi,
      repay,
      amount,
      image,
    });

    return res.json({
      message: `Successfully Lent NFT with ${title} & ${contract_address}`,
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
    const { contract_address, wallet_address } = req.params;

    if (!wallet_address)
      return res.json({ message: "Wallet address Not found" });
    if (!contract_address)
      return res.json({ message: "Contract address Not found" });

    const owner = mynft.wallet_address;

    const mynft = await nftwallet.findOne({
      $and: [{ owner }, { contract_address }],
    });
    if (!mynft) {
      return res.status(400).send({ message: "NFT not found" });
    }
    if (mynft.status != "lent") {
      return res
        .status(400)
        .send({ message: "Cannot repay NFT which is not lent" });
    }

    await nftwallet.findOneAndUpdate(
      {
        $and: [{ owner }, { contract_address }],
      },
      { status: "open", wallet_address }
    );

    return res.json({
      message: `Successfully repayed NFT with ${title} & ${contract_address}`,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

router.get("/:wallet_address/lendnft", async (req, res) => {
  try {
    const { wallet_address } = req.params;
    const allNFTS = await nftwallet.find({
      $and: [
        { status: "borrowed" },
        { wallet_address: { $ne: wallet_address } },
      ],
    });

    return res.status(200).send({
      message: "Successfully Fetched NFTs which can be lent",
      nft: allNFTS,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

router.get("/:lender_address/mylentnft", async (req, res) => {
  try {
    const lender_address = req.params.lender_address;
    if (!lender_address)
      return res.json({ message: "Lender address Not found" });

    const allNFTS = await lentnft.find({
      $and: [{ lender_address }, { transaction:"progress" }],
    });

    return res
      .status(200)
      .send({
        message: `Successfully Fetched NFTs which are lent by wallet address ${lender_address}`,
        nft: allNFTS,
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

router.get("/:borrower_address/myborrowednft", async (req, res) => {
  try {
    const borrower_address = req.params.borrower_address;
    if (!borrower_address)
      return res.json({ message: "Borrower address Not found" });

    const allNFTS = await lentnft.find({
      $and: [{ borrower_address }, { transaction:"progress" }],
    });

    return res
      .status(200)
      .send({
        message: `Successfully Fetched NFTs which are borrowed by wallet address ${borrower_address}`,
        nft: allNFTS,
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
