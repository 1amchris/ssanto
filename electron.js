const electron = require('electron');
// const url = require('url'); // PROD
const path = require('path');

const { spawn } = require('child_process');

const { app, BrowserWindow } = electron;

let mainWindow = null;

// Windows: path.join(__dirname, '\\Python39-32\\python.exe')
const PYTHON_PATH = 'python3';
const PYTHON_CWD = 'server'; // Prod: '../server'; Dev: // 'server'
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
  process.stdout.write(`[Python][stdout] ${data}`);
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
    icon: './icon.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      frame: false,
    },
  });

  mainWindow.loadURL(
    'http://localhost:3000', // DEV
    // PROD
    /* url.format({
              pathname: path.join(__dirname, 'build/index.html'),
              protocol: "file:",
              slashes: true
          }),*/
    {}
  );
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
