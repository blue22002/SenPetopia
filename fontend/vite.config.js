import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' để chạy đúng trên GitHub Pages.
// proxy: khi chạy dev, mọi request /api sẽ chuyển sang ASP.NET (đổi cổng cho đúng với máy bạn).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: { '/api': { target: 'https://localhost:7001', secure: false, changeOrigin: true } },
  },
})
