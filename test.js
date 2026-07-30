const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');
css = css.replace(/font-size: clamp\(26px, 4\.4vw, 46px\);/g, 'font-size: clamp(16px, 2.5vw, 24px); line-height: 1.5;');
css = css.replace(/font-size: clamp\(52px, 10vw, 108px\);/g, 'font-size: clamp(24px, 5vw, 48px); line-height: 1.5;');
fs.writeFileSync('app/globals.css', css);
