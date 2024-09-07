/* eslint-disable no-console */
// Native
import path, { join } from 'path';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, nativeTheme, shell } from 'electron';
import isDev from 'electron-is-dev';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

const height = 600;
const width = 700;

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    //  change to false to use AppBar
    frame: false,
    show: true,
    resizable: true,
    fullscreenable: true,
    icon: join(__dirname, '../assets/icons/Icon-Electron.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3262;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../dist-vite/index.html');

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }
  // Open the DevTools.
  // window.webContents.openDevTools();

  window.webContents.setWindowOpenHandler(({ url: newUrl }) => {
    shell.openExternal(newUrl);
    return { action: 'deny' };
  });

  window.maximize();
  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });

  nativeTheme.themeSource = 'dark';
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let serverProcess: ChildProcessWithoutNullStreams;
/*
app.whenReady().then(() => {
  const binPath = path.join(process.resourcesPath, 'bin');
  const binaryPath = path.join(binPath, 'dkg-api');
  console.log(binaryPath);
  serverProcess = spawn(binaryPath, ['local', '9126'], { cwd: binPath });
  serverProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
*/
// for windows
app.whenReady().then(() => {
  const binPath = path.join(process.resourcesPath, 'bin');
  const binaryPath = path.join(binPath, 'dkg-api.exe');
  console.log(binaryPath);
  serverProcess = spawn(binaryPath, ['local', '9126', 'windows'], { cwd: binPath });
  serverProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: string) => {
  console.log('message', message);
  setTimeout(() => event.sender.send('message', 'common.hiElectron'), 500);
});

// on kill or quit kill the server

app.on('before-quit', () => {
  serverProcess.kill();
});
app.on('will-quit', () => {
  serverProcess.kill();
});

app.on('quit', () => {
  serverProcess.kill();
});

process.on('exit', () => {
  serverProcess.kill();
});

process.on('SIGINT', () => {
  serverProcess.kill();
});

process.on('SIGTERM', () => {
  serverProcess.kill();
});
