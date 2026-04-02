let electron = require("electron");
let _electron_toolkit_preload = require("@electron-toolkit/preload");
//#region src/preload/index.ts
var api = { readExcelFile: (args) => electron.ipcRenderer.invoke("read-excel-file", args) };
var electronBridge = {
	..._electron_toolkit_preload.electronAPI,
	...api
};
if (process.contextIsolated) try {
	electron.contextBridge.exposeInMainWorld("electron", electronBridge);
} catch (error) {
	console.error(error);
}
else window.electron = electronBridge;
//#endregion
