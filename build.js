const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const html = fs.readFileSync('index.html', 'utf8');

// Only obfuscate inline <script> blocks, not <script src="...">
const scriptRegex = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

const output = html.replace(scriptRegex, (full, attrs, code) => {
  const js = code.trim();
  if (!js) return full;

  const obfuscated = JavaScriptObfuscator.obfuscate(js, {
    compact: true,
    stringArray: true,
    stringArrayThreshold: 0.75,
    controlFlowFlattening: true
  }).getObfuscatedCode();

  return `<script${attrs}>${obfuscated}</script>`;
});

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync(path.join('dist', 'index.html'), output);

console.log('Built dist/index.html');
