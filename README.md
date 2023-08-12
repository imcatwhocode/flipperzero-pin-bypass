# Flipper Zero PIN Bypass

Proof-of-concept for Flipper Zero PIN bypass vulnerability.
Tested on the latest 0.88.0 firmware.

## Requirements

1. Node.js 18+
2. `serialport` dependency. Install with `npm ci` or `yarn`

## Bzzzzzzzz

Makes Flipper vibrate.

```shell
# Execute and follow the instructions
./poc-vibro.mjs /dev/tty.usbmodemflip_1337
```

## U2F key decryption

Decrypts key.u2f file from SD using Flipper's internal key.

```shell
# Assume that we've already extracted key.u2f from Flipper's SD card into /foo/key.u2f

# Execute and follow the instructions
./poc.mjs /dev/tty.usbmodemflip_1337 /foo/key.u2f
```

## Vulnerability itself

Firmware has a race condition in lock screen routine. For a few moments after reset,
it's possible to establish a CLI connection over USB and send commands to the device.

PoC repeatedly tries to establish a connection. If succeed, it sends commands to Flipper's CLI.

Time window is small, but enough to perform cryptographic operations with CKS.
Or, to simply make Flipper vibrate :)

## Responsible disclosure

1. On 2023-08-12 I've reached out to Flipper's support team by email asking for
   GitHub username of the security contact to privately share this repository to triage this vulnerability.

2. On 2023-08-16, Flipper's support team replied that this vulnerability should be disclosed using public GitHub issues.

3. On 2023-08-17 I've reached out to Flipper Development team in Telegram community asking for the security contact,
   but received "we don't consider this as a vulnerability" reply:
   ![](assets/reply.png)

4. Initially, disclosure deadline was set to 2023-09-11. But, since Flipper's team doesn't consider this as a vulnerability,
   I'm publishing this right now.

## Credits

1. For the first, thanks to Flipper's team for the great device!
2. Dmitry Nourell (@imcatwhocode) for a good catch on Flipper boot animations and PoC.
3. Egor Koleda (@radioegor146) for initial PoC, and help with weird bugs.
