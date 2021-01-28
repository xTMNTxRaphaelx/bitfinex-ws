const crypto = require("crypto-js"); // Standard JavaScript cryptography library
const WebSocket = require("ws"); // Websocket library for Node

const apiKey = "ggmlAUPrQE7wiAqHMkLWQLe7zsoY4xCW90v8dGVqd8H"; // Users API credentials are defined here
const apiSecret = "rrc2IR62309lY9eb1lVvzFtYDgbADhdnRbv1cm7Jjxd";

const authNonce = Date.now() * 1000; // Generate an ever increasing, single use value. (a timestamp satisfies this criteria)
const authPayload = "AUTH" + authNonce; // Compile the authentication payload, this is simply the string 'AUTH' prepended to the nonce value
const authSig = crypto
  .HmacSHA384(authPayload, apiSecret)
  .toString(crypto.enc.Hex); // The authentication payload is hashed using the private key, the resulting hash is output as a hexadecimal string

const payload = {
  apiKey, //API key
  authSig, //Authentication Sig
  authNonce,
  authPayload,
  event: "auth", // The connection event, will always equal 'auth'
};

const wss = new WebSocket("wss://api-pub.bitfinex.com/ws/2"); // Create new Websocket

wss.on("open", () => wss.send(JSON.stringify(payload)));

let lastDate = 0;
wss.on("message", (msg) => {
  // The 'message' event is called whenever the ws recieves ANY message
  let response = JSON.parse(msg);
  if (response[1] === "pu") {
    console.log(Date.now() - lastDate, Date.now());
    lastDate = Date.now();
  }
});
