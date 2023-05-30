const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0366cb80a56eb612fbd7b2bcc62a7f0f6c776967ee71ad1100c011b42cd943b818": 100,
  "023bf62e41b990dc4cccdb5150bcc348e6385ba6be41a301b63d7227934e488682": 50,
  "021d8fd139fc16e7628bf896e1a6d3dd555f91fc4d27a57ce745137843b5399089": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signed, recovery } = req.body;
//Get signature from client side
//recover address from signature
try{

  const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount}));
  const hashed = keccak256(bytes);
  
  const sig = new Uint8Array(signed);

  const pKey = secp256k1.recoverPrimaryKey(hashed,sig,recovery);

  if(pKey!==sender){
    res.status(400).send({ message: "signature is not valid" })
  }
}catch (error) {
  console.log(error.message)
}

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
