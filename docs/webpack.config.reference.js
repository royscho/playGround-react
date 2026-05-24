/**
 * webpack.config.js — annotated reference for interview prep
 *
 * Equivalent to what this project's vite.config.ts does,
 * but written the webpack way.
 *
 * NOT used to build this project — for learning only.
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { DefinePlugin } = require('webpack')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  // ─── Entry ──────────────────────────────────────────────────────────────────
  // Where webpack starts building the dependency graph.
  // Equivalent to: vite always starts from index.html
  entry: './src/main.tsx',

  // ─── Output ─────────────────────────────────────────────────────────────────
  // Where to write the bundle.
  // [contenthash] = fingerprint based on file contents → cache busting
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[contenthash].chunk.js',
    clean: true,            // delete dist/ before each build (replaces CleanWebpackPlugin)
    publicPath: '/',        // base URL for all assets — needed for React Router
  },

  // ─── Resolve ────────────────────────────────────────────────────────────────
  // Tell webpack which file extensions to resolve automatically.
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'), // import from '@/components/...'
    },
  },

  // ─── Loaders ────────────────────────────────────────────────────────────────
  // webpack can only parse JS/JSON natively.
  // Loaders transform other file types into JS modules.
  // Rules run RIGHT TO LEFT (bottom loader runs first).
  module: {
    rules: [
      // TypeScript + JSX → JS via Babel
      // Alternative: ts-loader (slower, but does type checking)
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',     // modern JS → compatible JS
              '@babel/preset-react',   // JSX → React.createElement
              '@babel/preset-typescript', // strip types
            ],
          },
        },
      },

      // CSS → injected into <style> tags in dev,
      //      extracted to .css files in prod (MiniCssExtractPlugin)
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',        // resolves @import and url()
          'postcss-loader',    // runs autoprefixer, tailwind (if v3)
        ],
      },

      // Images + fonts — copy to dist/ and return the URL
      {
        test: /\.(png|jpg|gif|svg|woff2?|ttf|eot)$/,
        type: 'asset/resource',  // webpack 5 built-in, replaces file-loader
      },
    ],
  },

  // ─── Plugins ────────────────────────────────────────────────────────────────
  // Plugins tap into the full build lifecycle (loaders only transform files).
  plugins: [
    // Generates index.html and injects <script> tags automatically
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './public/favicon.ico',
    }),

    // Extract CSS into separate files (production only)
    // Without this, CSS is injected via JS → flash of unstyled content
    !isDev && new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    // Inject env variables into the bundle (replaces import.meta.env in Vite)
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
    }),
  ].filter(Boolean), // remove falsy entries (e.g. MiniCssExtractPlugin in dev)

  // ─── Optimization ───────────────────────────────────────────────────────────
  optimization: {
    // Split node_modules into a separate "vendor" chunk
    // → browsers can cache vendor.js separately from your app code
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },

    // Extract webpack runtime into its own chunk
    // → changing app code doesn't bust the vendor chunk hash
    runtimeChunk: 'single',
  },

  // ─── Dev Server ─────────────────────────────────────────────────────────────
  // Equivalent to `vite` dev server
  devServer: {
    port: 3000,
    hot: true,                      // HMR — replaces modules without full reload
    historyApiFallback: true,        // serve index.html for all routes (React Router)
    open: true,
    proxy: {
      '/api': 'http://localhost:8080', // forward /api/* to backend (replaces msw in some setups)
    },
  },

  // ─── Source Maps ────────────────────────────────────────────────────────────
  // Maps minified bundle back to original source for debugging
  devtool: isDev ? 'eval-source-map' : 'source-map',

  mode: isDev ? 'development' : 'production',
}

/*
 * COMPARISON: this project (Vite) vs webpack
 *
 * vite.config.ts          webpack.config.js
 * ─────────────────────── ──────────────────────────────
 * plugins: [react()]      babel-loader with @babel/preset-react
 * plugins: [tailwindcss]  postcss-loader + tailwind plugin
 * import.meta.env.VITE_*  DefinePlugin + process.env.REACT_APP_*
 * native ESM in dev       full bundle on every change (slow)
 * rollup for prod build   webpack for prod build
 * ~0 config needed        explicit config for everything
 *
 * CODE SPLITTING:
 * Both work the same way in your app code:
 *   const Page = lazy(() => import('./Page'))
 * webpack sees the dynamic import and automatically creates a chunk.
 * Vite does the same via rollup.
 */
