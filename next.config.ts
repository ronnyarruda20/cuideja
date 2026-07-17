import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Há um package-lock.json no diretório home do usuário; fixamos a raiz aqui
  // para o Next não inferir o workspace errado.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
