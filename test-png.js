const fs = require('fs');
const { PNG } = require('pngjs');

function analyze(file) {
  const data = fs.readFileSync(file);
  const png = PNG.sync.read(data);
  let transparentPixels = 0;
  for (let i = 3; i < png.data.length; i += 4) {
    if (png.data[i] < 255) transparentPixels++;
  }
  console.log(`${file}: ${transparentPixels} transparent pixels out of ${png.width * png.height}`);
}

['1','2','3','4','5'].forEach(n => analyze(`public/slot-machine/slot-machine${n}.png`));
