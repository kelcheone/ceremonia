import react from '@vitejs/plugin-react';
import { UserConfig, ConfigEnv } from 'vite';
import { cpSync, rmSync } from 'node:fs';
import path, { join } from 'path';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';

function copyBinaryFolder(isDev: boolean) {
  const binSrc = join(__dirname, 'bin');
  let binDest = join(__dirname, 'dist-electron', 'resources', 'bin');
  if (isDev) binDest = join(__dirname, 'node_modules', 'electron', 'dist', 'resources', 'bin');
  cpSync(binSrc, binDest, { recursive: true });
}

const root = join(__dirname);
const srcRoot = join(__dirname, './src');
rmSync('dist-electron', { recursive: true, force: true });

const buildElectron = (isDev: boolean) => {
  const config = {
    sourcemap: isDev,
    minify: !isDev,
    outDir: join(root, 'dist-electron'),
    rollupOptions: {
      external: Object.keys(pkg.dependencies || {})
    }
  };

  copyBinaryFolder(isDev);
  return config;
};

function plugins(isDev: boolean) {
  return [
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: join(root, 'electron/index.ts'),
        onstart(options) {
          options.startup();
        },
        vite: {
          build: buildElectron(isDev)
        }
      },
      {
        entry: join(root, 'electron/preload.ts'),
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
        vite: {
          build: buildElectron(isDev)
        }
      }
    ]),

    renderer()
  ];
}

export default ({ command }: ConfigEnv): UserConfig => {
  // DEV
  if (command === 'serve') {
    return {
      root: srcRoot,
      base: '/',
      plugins: plugins(true),
      define: {
        'process.env.VITE_DKG_HOST': JSON.stringify(process.env.VITE_DKG_HOST)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src')
        }
      },
      build: {
        outDir: join(root, '/dist-vite'),
        emptyOutDir: true,
        rollupOptions: {}
      },
      esbuild: {
        target: 'esnext'
      },
      server: {
        port: process.env.PORT === undefined ? 3000 : +process.env.PORT
      },
      optimizeDeps: {
        exclude: ['path']
      }
    };
  }
  // PROD
  return {
    root: srcRoot,
    base: './',
    plugins: plugins(false),
    define: {
      'process.env.VITE_DKG_HOST': JSON.stringify(process.env.VITE_DKG_HOST)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      outDir: join(root, '/dist-vite'),
      emptyOutDir: true,
      rollupOptions: {}
    },
    server: {
      port: process.env.PORT === undefined ? 3000 : +process.env.PORT
    },
    optimizeDeps: {
      exclude: ['path']
    }
  };
};
