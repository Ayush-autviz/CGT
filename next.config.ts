import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['lwj8k3bb-5000.inc1.devtunnels.ms','cgt-mvp-bucket.s3.amazonaws.com','18.216.181.203','cgtmvp.s3.amazonaws.com'],
  },
  // Enable standalone output for Docker deployment
  output: 'standalone',
};

export default nextConfig;
