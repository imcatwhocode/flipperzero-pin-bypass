import { SerialPort } from "serialport";
import { openCli, readUntil } from "./utils.mjs";

const U2F_KEY_SLOT = 11;

export default async function decrypt(path, iv, content) {
  const port = new SerialPort({
    path,
    baudRate: 115200,
  });

  port.on("close", () => console.log("💔 Connection lost"));
  console.log("👋 Trying to connect...");
  console.log(
    "🦄 Reset Flipper by pressing Arrow Left + Back buttons at the same time"
  );

  await openCli(port);
  port.write(`crypto decrypt ${U2F_KEY_SLOT} ${iv}\r\n`);
  await readUntil(port, "decryption:");
  port.write(`${content}\x03`);

  const decrypted = await readUntil(port, ">:");

  const suffix = Buffer.from("\r\n\r\n>: ", "ascii").toString("hex");
  const preamble = Buffer.from("\r\nDecrypted data:\r\n", "ascii").toString(
    "hex"
  );

  const start = decrypted.indexOf(preamble) + preamble.length;
  const end = decrypted.indexOf(suffix, start);

  return decrypted.substring(start, end);
}
