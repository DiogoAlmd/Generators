function main() {
  const memBefore = process.memoryUsage().heapUsed;
  const timeStart = performance.now();

  const size = 100_000_000;

  // for (const c of semGenerator(size)) {
  // }
  for (const c of comGenerator(size)) {
  }

  const memAfter = process.memoryUsage().heapUsed;
  const timeEnd = performance.now();

  console.log(
    `Memória usada: ${((memAfter - memBefore) / 1024 / 1024).toFixed(2)}MB e tempo ${(timeEnd - timeStart).toFixed(2)}`,
  );
}

function semGenerator(size: number) {
  const i: number[] = [];
  for (let a = 0; a <= size; a++) {
    i.push(a ** 2);
  }
  return i;
}

function* comGenerator(size: number) {
  for (let i = 0; i <= size; i++) {
    yield i ** 2;
  }
}

main();
