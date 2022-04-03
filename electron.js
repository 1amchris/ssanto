const electron = require('electron');
// const url = require('url');
const path = require('path');

const {spawn} = require('child_process');

const PYTHON_PATH = 'python3';
const python = spawn(PYTHON_PATH, ['-u', './main.py'], {
  cwd: path.join(__dirname, 'server'),
});

let loadCompleted = false;

python.stdout.on('data', (data) => {
  if (data == 'STARTUP_FINISH\n') {
    while (!loadCompleted) {}
    createWindow();
    return;
  }
  process.stdout.write(`[Python][stdout] ${data}`);
});

python.stderr.on('data', (data) => {
  console.log(`[Python][stderr] ${data}`);
});

python.on('error', (error) => {
  console.log(`[Python][error] Error: ${error}`);
});

python.on('close', (code) => {
  console.log(`[Python][close] Code: ${code}`);
});

python.on('exit', (code, signal) => {
  console.log(`[Python][exit] Code: ${code} Signal: ${signal}`);
});

/* ----------------------*/

const {app, BrowserWindow} = electron;

let mainWindow = null;

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
      'http://localhost:3000',
      /* url.format({
              pathname: path.join(__dirname, './index.html'),
              protocol: "file:",
              slashes: true
          })*/
      {},
  );
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.openDevTools();
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
