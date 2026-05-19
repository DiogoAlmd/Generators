import { readFileSync } from "node:fs";

const memBefore = process.memoryUsage().heapUsed;

const data = readFileSync("./measurements.txt").toString("utf-8");
const lines = data.split("\n");

const stats = new Map<
	string,
	{ sum: number; count: number; min: number; max: number }
>();

for (const line of lines) {
	if (!line) continue;
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
