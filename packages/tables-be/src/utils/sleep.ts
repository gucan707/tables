export async function sleep(n: number) {
  const p = new Promise((resolve) => {
    setTimeout(() => {
      resolve("ok");
    }, n);
  });
  await p;
}
