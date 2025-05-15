import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createHtmlPlugin } from 'vite-plugin-html'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('my-')
        }
      }
    }),
    vueDevTools(),
    // createHtmlPlugin({
    //   inject: {
    //     data: {
    //       cdn_domain: process.env.CDN_DOMAIN || 'ascdn.console.inter.env38.shuguang.com', // 这里替换成你的 CDN 域名
    //       timeStamp: Date.now(),
    //       version: process.env.VERSION || '1.0.0',
    //     },
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
