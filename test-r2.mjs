import crypto from "node:crypto";
import fs from "node:fs";

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET_NAME;

const endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}/ping.txt`;

const date = new Date().toUTCString();
const stringToSign = `PUT\n\ntext/plain\n${date}\n/${BUCKET}/ping.txt`;

const signature = crypto
  .createHmac("sha1", SECRET_KEY)
  .update(stringToSign)
  .digest("base64");

const auth = `AWS ${ACCESS_KEY}:${signature}`;

const res = await fetch(endpoint, {
  method: "PUT",
  headers: {
    "Date": date,
    "Authorization": auth,
    "Content-Type": "text/plain",
  },
  body: "r2 ok",
});

console.log("Status:", res.status);
console.log(await res.text());
