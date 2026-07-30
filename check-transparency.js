const fs = require('fs');
const { PNG } = require('pngjs');

const data = fs.readFileSync('public/slot-machine/slot-machine4.png');
const png = PNG.sync.read(data);

let minX = png.width, maxX = 0, minY = png.height, maxY = 0;
// Ignore the completely transparent background around the machine itself.
// We only want to find transparent pixels that are INSIDE the machine (e.g. windows).
// To do this, let's find the bounding box of the OPAQUE pixels first.
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
console.log(`Machine opaque bounds: X: ${opMinX}-${opMaxX}, Y: ${opMinY}-${opMaxY}`);

// Now find transparent pixels INSIDE this bounding box (shrink it a bit to avoid edges)
let transPixels = 0;
for (let y = opMinY + 50; y < opMaxY - 50; y++) {
  for (let x = opMinX + 50; x < opMaxX - 50; x++) {
    let idx = (png.width * y + x) << 2;
    if (png.data[idx+3] === 0) { // fully transparent
      transPixels++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log(`Inner transparent bounds: X: ${minX}-${maxX}, Y: ${minY}-${maxY}`);
console.log(`Which in percentages of total width/height is:`);
console.log(`X: ${(minX/png.width*100).toFixed(2)}% - ${(maxX/png.width*100).toFixed(2)}%`);
console.log(`Y: ${(minY/png.height*100).toFixed(2)}% - ${(maxY/png.height*100).toFixed(2)}%`);
