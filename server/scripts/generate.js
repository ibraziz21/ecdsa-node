const {secp256k1} = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils")
const {keccak256} = require("ethereum-cryptography/keccak")

const privatekey = secp256k1.utils.randomPrivateKey()
console.log("private",toHex(privatekey))

const pubkey = secp256k1.getPublicKey(privatekey); 
console.log("public",toHex(pubkey))

let add = keccak256(pubkey);
const newAd = add.slice
(-20)

console.log("Address: ", toHex(newAd))

