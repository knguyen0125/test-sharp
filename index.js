const sharp = require("sharp");
const fs = require("fs");
const os = require("os");

// Set UV_THREADPOOL_SIZE = 1 for the best performance (only ~100mb).
// More UV_THREADPOOL_SIZE = more memory consumed
// More UV_THREADPOOL_SIZE = more cpu consumed
// For best result on T2.small, use 1
// NOTE: pm2 unset this and automatically set this to 4. This will cause problem for t2.small instances
process.env.UV_THREADPOOL_SIZE = 1;

let maxRss = 0;

const data = fs.readFileSync(
  __dirname + "/14590bd80ed7f-ecfa-4ace-bcda-4cbc60caaa15.jpg"
);

sharp.concurrency(1);
sharp.cache(false);
function x() {
  return new Promise((resolve) => {
    sharp(data)
      .resize({
        width: 1234,
        height: 1234,
        fit: "contain",
        position: "center",
      })
      .toFormat("jpg")
      .toBuffer((err, data, info) => {
        console.log(sharp.counters());

        // console.log(info)
        // console.log(data)

        if (process.memoryUsage().rss > maxRss) {
          maxRss = process.memoryUsage().rss;
          // console.log(maxRss / 1024 / 1024);
        }

        resolve(data);
      });
  });
}

async function main() {
  let promises = [];
  for (let i = 0; i < 1; i++) {
    promises.push(x());
  }

  await Promise.all(promises);
  console.log(maxRss / 1024 / 1024);
}

main();
