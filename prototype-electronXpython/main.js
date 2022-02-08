const electron = require("electron");
const url = require("url");
const path = require("path");

const {spawn} = require('child_process')

//*
let python = spawn('python3', ['-u', path.join(__dirname,'main.py')]);

python.stdout.on('data', (data) => {
  console.log(`[Python][stdout] ${data}`);
});

python.stderr.on('data', (data) => {
  console.log(`[Python][stderr] ${data}`);
});

python.on("error", (error) => {
    console.log(`[Python][error] Error: ${error}`);
});

python.on("close", (code) => {

    console.log(`[Python][close] Code: ${code}`);
});

python.on("exit", (code, signal) => {
    console.log(`[Python][exit] Code: ${code} Signal: ${signal}`);
});//*/

/* ----------------------*/

const {app, BrowserWindow} = electron;


let mainWindow = null;

app.on("ready", function () {
    mainWindow = new BrowserWindow({
        title: "Electron X Python",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            frame: false
        }});
    
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true
        })
    );
    
    //mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.openDevTools();
    
    mainWindow.on('closed', function () {
        console.log("electron exit");
        python.kill();
    })
});

app.on('window-all-closed', function () {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

