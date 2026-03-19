import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Prefer this app’s lockfile when parent directories also contain package-lock.json */
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
