import { createReadStream } from "node:fs";

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

const stats = new Map<
	string,
	{ sum: number; count: number; min: number; max: number }
>();

const memBefore = process.memoryUsage().heapUsed;
for await (const line of readLines("./1brc/measurements.txt")) {
	const sep = line.indexOf(";");
	const city = line.slice(0, sep);
	const temp = parseFloat(line.slice(sep + 1));

	const entry = stats.get(city);
	if (entry) {
		entry.sum += temp;
		entry.count++;
		if (temp < entry.min) entry.min = temp;
		if (temp > entry.max) entry.max = temp;
	} else {
		stats.set(city, { sum: temp, count: 1, min: temp, max: temp });
	}
}

for (const [city, { sum, count, min, max }] of stats) {
	console.log(
		`${city}: min=${min}, max=${max}, mean=${(sum / count).toFixed(1)}`,
	);
}

const memAfter = process.memoryUsage().heapUsed;

console.log(
	`Memória usada: ${((memAfter - memBefore) / 1024 / 1024).toFixed(2)}MB`,
);
