import g from "@root/utils/casual";

async function main() {
  await Promise.all([
    ...g.array_of_digits(20).map((v, i) => {
      return new Promise((r) => setTimeout(r, 1000));
    }),
  ]);
}

main()
  .then(() => {
    console.log("Finished seeding DB!");
  })
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  });
