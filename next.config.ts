import type { NextConfig } from "next";

const RELEASES_RAW =
  "https://raw.githubusercontent.com/BibhabenduMukherjee/HiveMind-releases/main";

const nextConfig: NextConfig = {
  // Serve the installers from this domain, proxied from HiveMind-releases so
  // the scripts stay single-source and need no redeploy when they change.
  async rewrites() {
    return [
      { source: "/install.sh", destination: `${RELEASES_RAW}/install.sh` },
      { source: "/install.ps1", destination: `${RELEASES_RAW}/install.ps1` },
    ];
  },
};

export default nextConfig;
