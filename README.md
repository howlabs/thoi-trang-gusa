# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Blob image migration

This project keeps product data in `public/products.json`. To move existing Sapo image URLs into Vercel Blob and rewrite `image` fields to Blob URLs:

```bash
cp .env.local.example .env.local
# set BLOB_READ_WRITE_TOKEN in .env.local or your shell
npm run blob:migrate-images
```

The migration script only rewrites `https://sapo.dktcdn.net/...` image URLs, deduplicates repeated source URLs, uploads them as public blobs, and updates `public/products.json` in place.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
