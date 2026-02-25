// scripts/copy-generated.ts
import fs from "fs";
import path from "path";

function copyFolderSync(src: string, dest: string) {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source folder does not exist: ${src}`);
    process.exit(1);
  }

  // フォルダがなければ作成
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// --- コピー処理 1: src/generated → dist/generated ---
const generatedSrc = path.resolve(__dirname, "../generated");
const generatedDest = path.resolve(__dirname, "../../dist/generated");

copyFolderSync(generatedSrc, generatedDest);
console.log(`✅ Copied ${generatedSrc} → ${generatedDest}`);
