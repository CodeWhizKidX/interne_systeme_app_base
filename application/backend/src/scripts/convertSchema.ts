// convertSchema.ts
import fs from "fs";
import path from "path";

// スキーマファイルのパス
const schemaPath = path.resolve(__dirname, "../../prisma/schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf-8");

// スネークケース → キャメルケース変換関数
const toCamel = (str: string) =>
  str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

// フィールド行を変換
const converted = schema.replace(
  /(\s*)([a-z0-9_]+)\s+([A-Za-z0-9\[\]]+)(.*)/g,
  (match, indent, fieldName, type, rest) => {
    // id や @@map などは変換対象外
    if (fieldName.startsWith("@") || fieldName.startsWith("id")) return match;

    const camelName = toCamel(fieldName);
    if (camelName === fieldName) return match;

    return `${indent}${camelName} ${type} ${rest.trim()} @map("${fieldName}")`;
  }
);

const outPath = path.resolve(__dirname, "../../prisma/schema.prisma");
fs.writeFileSync(outPath, converted);
console.log("変換完了: ", outPath);
