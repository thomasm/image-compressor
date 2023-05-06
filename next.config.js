require("dotenv").config

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TINYPNG_API_KEY: process.env.TINYPNG_API_KEY,
  }
}

module.exports = nextConfig
