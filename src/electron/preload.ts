import { createHmac, randomFillSync } from 'crypto';
import {toCanvas} from 'qrcode';
import * as base32 from 'hi-base32';
import { devtools } from 'vue';

const randomBuffer = randomFillSync(Buffer.alloc(160 / 8));
const secret = base32.encode('12345678901234567890');
const hmac = createHmac('sha1', Buffer.from(base32.decode(secret)));

// let load = (44376117).toString(16);
let load = Math.floor(new Date().getTime() / 1000 / 30).toString(16);
while (load.length < 16) {
    load = '0' + load;
}

console.log(load);


hmac.update(Buffer.from(load, 'hex'));

const hex = hmac.digest('hex').match(/.{1,2}/g)!.map((value) => Number.parseInt(value, 16));
const num = hex[hex.length - 1];

console.log(hex, num & 0xf);

const offset = hex[hex.length - 1] & 0xf;
const binary =
  ((hex[offset] & 0x7f) << 24) |
  ((hex[offset + 1] & 0xff) << 16) |
  ((hex[offset + 2] & 0xff) << 8) |
  (hex[offset + 3] & 0xff);

const otp = binary % 1000000;

console.log(otp);
const canvas = document.createElement('canvas');
document.addEventListener('DOMContentLoaded', () => document.querySelector('#app').appendChild(canvas))
console.log(canvas);

toCanvas(canvas, `otpauth://totp/${'testuser'}?secret=${secret}&issuer=Nasram`);