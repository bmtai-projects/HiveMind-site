import type { NextConfig } from "next";

// The install scripts now live in the main repo, next to the code they
// install, so they get reviewed in pull requests.
const INSTALLERS_RAW = "https://raw.githubusercontent.com/bmtai-projects/HiveMind/main";

const nextConfig: NextConfig = {
  // Proxied rather than copied in, so the scripts stay single-source: editing
  // them in the repo takes effect here with no redeploy.
  async rewrites() {
    return [
      { source: "/install.sh", destination: `${INSTALLERS_RAW}/install.sh` },
      { source: "/install.ps1", destination: `${INSTALLERS_RAW}/install.ps1` },
    ];
  },
};

export default nextConfig;
