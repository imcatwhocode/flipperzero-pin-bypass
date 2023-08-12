#!/usr/bin/env node
import { SerialPort } from "serialport";
import { openCli } from "./utils.mjs";

const device = process.argv[2];

if (typeof device === "undefined") {
  throw new Error("Usage: poc-vibro.mjs <path to serial port>");
}

if (!device || device.length === 0) {
  throw new Error("No serial port provided");
}

const port = new SerialPort({
  path: device,
  baudRate: 115200,
});

port.on("close", () => console.log("💔 Connection lost"));
console.log("👋 Trying to connect...");
console.log(
  "🦄 Reset Flipper by pressing Arrow Left + Back buttons at the same time"
);

await openCli(port);
port.write(`vibro 1\r\n`);

console.log("✨ Let the good vibes flow!");
