//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let worker_threads = require("worker_threads");
let xlsx = require("xlsx");
xlsx = __toESM(xlsx);
//#region src/main/excel_worker.ts
worker_threads.parentPort?.on("message", (args) => {
	console.log(`read excel in worker, ${args}`);
	const workbook = xlsx.default.readFile(args.path);
	const sheetName = args.sheet;
	const worksheet = workbook.Sheets[sheetName];
	const data = xlsx.default.utils.sheet_to_json(worksheet);
	worker_threads.parentPort?.postMessage(data);
});
//#endregion
exports.__toESM = __toESM;
