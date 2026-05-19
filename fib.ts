function fib(len: number): number {
	if (len <= 1) return len;

	return fib(len - 1) + fib(len - 2);
}

const memBefore = process.memoryUsage().heapUsed;
console.log(fib(50));
const memAfter = process.memoryUsage().heapUsed;

console.log(
	`Memória usada: ${((memAfter - memBefore) / 1024 / 1024).toFixed(2)}MB`,
);
