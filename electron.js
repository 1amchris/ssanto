const electron = require('electron');
const url = require('url');
const path = require('path');

const { spawn } = require('child_process');

const PYTHON_PATH = 'python3';
const python = spawn(PYTHON_PATH, ['-u', './main.py'], {
  cwd: path.join(__dirname, 'server'),
});

python.stdout.on('data', data => {
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
});

/* ----------------------*/

const { app, BrowserWindow } = electron;

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    title: 'SSanto',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      frame: false,
    },
  });

  mainWindow.loadURL(
    'http://localhost:3000',
    /*url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: "file:",
            slashes: true
        })*/
    {}
  );
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.openDevTools();
  mainWindow.maximize();
  mainWindow.show();

  mainWindow.on('closed', () => {
    console.log('electron exit');
    python.kill();
  });
});

app.on('window-all-closed', () => {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
