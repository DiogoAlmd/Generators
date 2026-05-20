import { createReadStream } from "node:fs";
import { setTimeout } from "node:timers/promises";

async function* readLines(file_path: string) {
	let leftover = "";
	for await (const chunk of createReadStream(file_path, {
		encoding: "utf-8",
	})) {
		const parts = (leftover + chunk).split("\n");
		leftover = parts ? parts.pop() || "" : "";
		for (const line of parts) {
			if (line) yield line;
		}
	}
	if (leftover) yield leftover;
}

const memBefore = process.memoryUsage().heapUsed;
for await (const line of readLines("./data/measurements.txt")) {
	const sep = line.indexOf(";");
	const city = line.slice(0, sep);
	const temp = parseFloat(line.slice(sep + 1));

	const json = JSON.stringify({ city, temp });

	const memAfter = process.memoryUsage().heapUsed;

	console.log({
		json,
		"Memória usada": `${((memAfter - memBefore) / 1024 / 1024).toFixed(2)}MB`,
	});
	await setTimeout(100);
}
