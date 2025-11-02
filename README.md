# QR Worker

A QR code generator web application built with Nuxt 4, designed to run on Cloudflare Workers. Features multi-language support, customizable QR codes, and PDF export capabilities.

## Features

- Generate QR codes with customizable colors and options
- Multi-language support (English, Ukrainian, Polish, Spanish, Italian, German)
- PDF export functionality
- Modern UI built with Nuxt UI
- Deployed on Cloudflare Workers

## Setup

Make sure to install dependencies:

```bash
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn serve
```

Or run with Cloudflare Workers locally:

```bash
yarn serve:cf
```

## Production

Build the application for production:

```bash
yarn build
```

Generate static site:

```bash
yarn generate
```

Locally preview production build:

```bash
yarn preview
```

## Deployment

Deploy to Cloudflare Workers:

```bash
yarn deploy
```

Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) and [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/) for more information.
