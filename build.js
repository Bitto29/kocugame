const fs = require("fs");
const JavaScriptObfuscator = require("javascript-obfuscator");

const html = fs.readFileSync("index.html", "utf8");

// Obfuscate inline JS inside <script> tags
const output = html.replace(
  /<script(?![^>]*src)([^>]*)>([\s\S]*?)<\/script>/gi,
  (match, attrs, code) => {
    if (!code.trim()) return match;

    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      stringArray: true,
      stringArrayThreshold: 0.8,
      controlFlowFlattening: true
    }).getObfuscatedCode();

    return `<script${attrs}>${obfuscated}</script>`;
  }
);

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/index.html", output);

console.log("Build done");
