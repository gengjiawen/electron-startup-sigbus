require("./excel_worker-DY7N8Sze.js");
let electron = require("electron");
let path = require("path");
let url = require("url");
let _electron_toolkit_utils = require("@electron-toolkit/utils");
let node_worker_threads = require("node:worker_threads");
//#region resources/icon.png?asset
var icon_default = (0, path.join)(__dirname, "../../resources/icon.png");
//#endregion
//#region ./excel_worker?nodeWorker&importer=/Users/11086661/code/modern_industrial_software/src/main/index.ts
function main_default(options) {
	return new node_worker_threads.Worker(new URL("./excel_worker-DY7N8Sze.js", require("url").pathToFileURL(__filename).href), options);
}
//#endregion
//#region src/main/index.ts
var settingsWindow = null;
function loadRenderer(window, hash) {
	const url$1 = _electron_toolkit_utils.is.dev && process.env["ELECTRON_RENDERER_URL"] ? new URL(process.env["ELECTRON_RENDERER_URL"]) : (0, url.pathToFileURL)((0, path.join)(__dirname, "../renderer/index.html"));
	if (hash) url$1.hash = hash;
	window.loadURL(url$1.toString());
}
function createMainWindow() {
	const window = new electron.BrowserWindow({
		width: 900,
		height: 670,
		show: false,
		autoHideMenuBar: true,
		...process.platform === "linux" ? { icon: icon_default } : {},
		webPreferences: {
			preload: (0, path.join)(__dirname, "../preload/index.js"),
			sandbox: false
		}
	});
	window.on("ready-to-show", () => {
		window.show();
	});
	window.webContents.setWindowOpenHandler((details) => {
		electron.shell.openExternal(details.url);
		return { action: "deny" };
	});
	loadRenderer(window);
}
function openSettingsWindow() {
	if (settingsWindow) {
		settingsWindow.show();
		settingsWindow.focus();
		return;
	}
	const window = new electron.BrowserWindow({
		width: 860,
		height: 600,
		show: false,
		title: "Settings",
		autoHideMenuBar: process.platform !== "darwin",
		...process.platform === "linux" ? { icon: icon_default } : {},
		...process.platform === "darwin" ? { titleBarStyle: "hiddenInset" } : {},
		webPreferences: {
			preload: (0, path.join)(__dirname, "../preload/index.js"),
			sandbox: false
		}
	});
	settingsWindow = window;
	window.on("ready-to-show", () => {
		window.show();
	});
	window.on("closed", () => {
		settingsWindow = null;
	});
	loadRenderer(window, "#/settings?standalone=1");
}
function createAppMenu() {
	const isMac = process.platform === "darwin";
	const settingsLabel = isMac ? "Settings…" : "Settings...";
	const template = [
		...isMac ? [{
			label: electron.app.name,
			submenu: [
				{ role: "about" },
				{ type: "separator" },
				{
					label: settingsLabel,
					accelerator: "CmdOrCtrl+,",
					click: () => openSettingsWindow()
				},
				{ type: "separator" },
				{ role: "services" },
				{ type: "separator" },
				{ role: "hide" },
				{ role: "hideOthers" },
				{ role: "unhide" },
				{ type: "separator" },
				{ role: "quit" }
			]
		}] : [],
		...!isMac ? [{
			label: "File",
			submenu: [
				{
					label: settingsLabel,
					accelerator: "Ctrl+,",
					click: () => openSettingsWindow()
				},
				{ type: "separator" },
				{ role: "quit" }
			]
		}] : [],
		{ role: "editMenu" },
		{ role: "viewMenu" },
		{ role: "windowMenu" },
		{
			role: "help",
			submenu: [{
				label: "Learn More",
				click: async () => {
					await electron.shell.openExternal("https://electron-vite.org");
				}
			}]
		}
	];
	electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));
}
electron.app.whenReady().then(() => {
	_electron_toolkit_utils.electronApp.setAppUserModelId("com.electron");
	electron.app.on("browser-window-created", (_, window) => {
		_electron_toolkit_utils.optimizer.watchWindowShortcuts(window);
	});
	createAppMenu();
	electron.ipcMain.on("ping", () => console.log("pong"));
	electron.ipcMain.handle("read-excel-file", (_event, args) => {
		return new Promise((resolve, reject) => {
			main_default({ workerData: "worker" }).on("message", (message) => {
				resolve(message);
			}).on("error", (err) => {
				reject(err);
			}).postMessage(args);
		});
	});
	createMainWindow();
	electron.app.on("activate", function() {
		if (electron.BrowserWindow.getAllWindows().length === 0) createMainWindow();
	});
});
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
//#endregion
