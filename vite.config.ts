import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import fs from "fs"
import { defineConfig } from "vite"

function productsApi() {
  return {
    name: 'products-api',
    configureServer(server: any) {
      server.middlewares.use('/api/cloudinary-usage', async (req: any, res: any, next: any) => {
        if (req.method === 'GET' && req.originalUrl === '/api/cloudinary-usage') {
          try {
            // Đọc credentials từ .env.local
            const envPath = path.resolve(__dirname, './.env.local');
            let cloudName = '', apiKey = '', apiSecret = '';
            if (fs.existsSync(envPath)) {
              const env = fs.readFileSync(envPath, 'utf8');
              const cnMatch = env.match(/CLOUDINARY_CLOUD_NAME=(.+)/);
              const akMatch = env.match(/CLOUDINARY_API_KEY=(.+)/);
              const asMatch = env.match(/CLOUDINARY_API_SECRET=(.+)/);
              cloudName = cnMatch ? cnMatch[1].trim() : '';
              apiKey = akMatch ? akMatch[1].trim() : '';
              apiSecret = asMatch ? asMatch[1].trim() : '';
            }

            if (!cloudName || !apiKey || !apiSecret) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: "Missing Cloudinary credentials in .env.local" }));
            }

            const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
            const clRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
              headers: { 'Authorization': 'Basic ' + auth }
            });
            const data = await clRes.json();

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch(e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e) }));
          }
        } else {
          next();
        }
      });

      server.middlewares.use('/api/update-product-image', (req: any, res: any, next: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { sku, imageUrl, oldImageUrl } = JSON.parse(body);
              const dataPath = path.resolve(__dirname, './public/products.json');
              const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
              
              const productIndex = data.findIndex((p: { sku: string }) => p.sku === sku);

              if (productIndex !== -1) {
                data[productIndex].image = imageUrl;
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
              }

              // Xóa ảnh cũ trên Cloudinary nếu có
              if (oldImageUrl && oldImageUrl.includes('cloudinary.com')) {
                const parts = oldImageUrl.split('/upload/');
                if (parts.length === 2) {
                  let pathStr = parts[1];
                  if (pathStr.match(/^v\d+\//)) pathStr = pathStr.replace(/^v\d+\//, '');
                  const lastDotIdx = pathStr.lastIndexOf('.');
                  if (lastDotIdx !== -1) pathStr = pathStr.substring(0, lastDotIdx);
                  
                  const envPath = path.resolve(__dirname, './.env.local');
                  if (fs.existsSync(envPath)) {
                    const env = fs.readFileSync(envPath, 'utf8');
                    const cloudName = (env.match(/CLOUDINARY_CLOUD_NAME=(.+)/)?.[1] || '').trim();
                    const apiKey = (env.match(/CLOUDINARY_API_KEY=(.+)/)?.[1] || '').trim();
                    const apiSecret = (env.match(/CLOUDINARY_API_SECRET=(.+)/)?.[1] || '').trim();

                    if (cloudName && apiKey && apiSecret) {
                      const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
                      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?public_ids[]=${pathStr}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': 'Basic ' + auth }
                      }).catch(e => console.error("Cloudinary delete failed:", e));
                    }
                  }
                }
              }
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch(e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: String(e) }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), productsApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
