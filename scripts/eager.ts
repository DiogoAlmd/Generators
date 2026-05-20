import { readFileSync } from "node:fs";

const memBefore = process.memoryUsage().heapUsed;

const data = readFileSync("./measurements.txt").toString("utf-8");
const lines = data.split("\n");

for (const line of lines) {
	if (!line) continue;
	const sep = line.indexOf(";");
	const city = line.slice(0, sep);
	const temp = parseFloat(line.slice(sep + 1));

	const json = JSON.stringify({ city, temp });
	console.log(json);
}

const memAfter = process.memoryUsage().heapUsed;

console.log(
	`Memória usada: ${((memAfter - memBefore) / 1024 / 1024).toFixed(2)}MB`,
);
