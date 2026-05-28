import { defineConfig, mergeConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import baseConfig from './vite.config'

export default mergeConfig(baseConfig, defineConfig({
  define: {
    'import.meta.env.VITE_PWA': JSON.stringify('true'),
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'React Interview Dashboard',
        short_name: 'Interview',
        description: 'React interview prep and component showcase',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/playGround-react/',
        scope: '/playGround-react/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/playGround-react/index.html',
      },
    }),
  ],
}))
