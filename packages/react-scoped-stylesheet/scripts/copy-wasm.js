const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '../target/release/libnextjs_component_tagger.dylib');
const destFile = path.join(__dirname, '../dist/plugin.dylib');

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.dirname(destFile))) {
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
}

fs.copyFileSync(sourceFile, destFile); 