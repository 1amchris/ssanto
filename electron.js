const electron = require('electron');
const path = require('path');

const { spawn } = require('child_process');

const { app, BrowserWindow } = electron;

let mainWindow = null;

const IS_IN_PRODUCTION = false;

// For windows built-in python for easy install for the user
const PYTHON_PATH = IS_IN_PRODUCTION
  ? path.join(__dirname, '\\Python39-32\\python.exe')
  : 'python3';
const PYTHON_CWD = 'server';
const PYTHON_MAIN = './main.py';

const python = spawn(PYTHON_PATH, ['-u', PYTHON_MAIN], {
  cwd: path.join(__dirname, PYTHON_CWD),
});

let loadCompleted = false;

python.stdout.on('data', data => {
  if (data.includes('STARTUP_FINISH')) {
    while (!loadCompleted) {}
    createWindow();
    return;
  }
  // process.stdout.write(`[Python][stdout] ${data}`);
  process.stdout.write(`${data}`);
});

python.stderr.on('data', data => {
  console.log(`[Python][stderr] ${data}`);
});

python.on('error', error => {
  console.log(`[Python][error] Error: ${error}`);
});

python.on('close', code => {
  console.log(`[Python][close] Code: ${code}`);
});

python.on('exit', (code, signal) => {
  console.log(`[Python][exit] Code: ${code} Signal: ${signal}`);
  if (mainWindow) mainWindow.close();
  app.quit();
});

/* ----------------------*/

/**
 * Create the app window.
 * @return {void}}
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    title: 'SSANTO',
    icon: './public/logo512.png', // change that in prod too
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      frame: false,
    },
  });

  const appUrl = IS_IN_PRODUCTION
    ? require('url').format({
        pathname: path.join(__dirname, 'build/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    : 'http://localhost:3000';

  mainWindow.loadURL(appUrl, {});
  mainWindow.setMenuBarVisibility(false);
  // mainWindow.webContents.openDevTools();
  mainWindow.maximize();
  mainWindow.show();

  mainWindow.on('closed', () => {
    console.log('electron exit');
    python.kill();
  });
}

app.on('ready', () => (loadCompleted = true));

app.on('window-all-closed', () => {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
