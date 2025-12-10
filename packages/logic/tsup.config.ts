import { defineConfig } from "tsup";

export default defineConfig({
  // 👇 AQUI ESTÁ O SEGREDO: Dois pontos de entrada
  entry: ["src/index.ts", "src/server.ts"], 
  format: ["cjs", "esm"],
  dts: true, // Gera tipos .d.ts para ambos
  clean: true,
  external: ["react", "next"], // Não inclua o Next no bundle, use o do app
});