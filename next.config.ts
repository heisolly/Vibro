import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ensure Turbopack resolves the project root correctly when started
  // from nested directories like `src/app`. Use an absolute path.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
