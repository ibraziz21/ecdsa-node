import { useState } from "react";
import server from "./server";
import {utf8ToBytes} from 'ethereum-cryptography/utils';
import {secp256k1} from 'ethereum-cryptography/secp256k1';
import {keccak256} from 'ethereum-cryptography/keccak'
function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    //hash amount 
    let data= {sender: address, recipient, amount: parseInt(sendAmount)};

    let hashedAmt = utf8ToBytes(JSON.stringify(data))
    let hashed = keccak256(hashedAmt);

    const signed =secp256k1.sign(hashed,privateKey,{recovered: true});
    console.log(signed)

    let sig = Array.from(signed[0]);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {...data, signature: sig, recovery: signed[1]});

      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }
  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
