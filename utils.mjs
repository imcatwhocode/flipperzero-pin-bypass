export function parseFlipperFile(contents) {
  return new Map(
    contents
      .split("\n")
      .filter((l) => l.length)
      .map((l) => l.split(": "))
  );
}

export async function readUntil(port, separator) {
  return new Promise((resolve) => {
    const sepSequence = Buffer.from(separator, "ascii").toString("hex");
    let buf = "";

    const waitForPrompt = (chunk) => {
      buf += chunk.toString("hex");

      if (buf.indexOf(sepSequence) > -1) {
        port.removeListener("data", waitForPrompt);
        resolve(buf);
      }
    };

    port.on("data", waitForPrompt);
  });
}

export async function openCli(port) {
  return new Promise((resolve) => {
    port.on("open", () => {
      console.log("🔥 Whoa, we're in the CLI. Executing payload...");

      let buf = "";
      const waitForPrompt = (chunk) => {
        buf += chunk.toString("ascii");
        if (buf.indexOf(">:") > -1) {
          port.removeListener("data", waitForPrompt);
          resolve();
        }
      };

      port.on("data", waitForPrompt);
    });

    port.on("error", () => {
      if (!port.isOpen) {
        setTimeout(() => port.open(), 10);
      }
    });
  });
}
