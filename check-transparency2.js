const fs = require('fs');
const { PNG } = require('pngjs');

const data = fs.readFileSync('public/slot-machine/slot-machine1.png');
const png = PNG.sync.read(data);

let opMinX = png.width, opMaxX = 0, opMinY = png.height, opMaxY = 0;
for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    let idx = (png.width * y + x) << 2;
    if (png.data[idx+3] > 0) {
      if (x < opMinX) opMinX = x;
      if (x > opMaxX) opMaxX = x;
      if (y < opMinY) opMinY = y;
      if (y > opMaxY) opMaxY = y;
    }
  }
}
console.log(`1.png Machine opaque bounds: X: ${opMinX}-${opMaxX}, Y: ${opMinY}-${opMaxY}`);

let minX = png.width, maxX = 0, minY = png.height, maxY = 0;
for (let y = opMinY + 50; y < opMaxY - 50; y++) {
  for (let x = opMinX + 50; x < opMaxX - 50; x++) {
    let idx = (png.width * y + x) << 2;
    if (png.data[idx+3] === 0) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log(`1.png Inner transparent bounds: X: ${minX}-${maxX}, Y: ${minY}-${maxY}`);
