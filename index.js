const fs = require("fs");
const http = require("http");
const url = require("url");

const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  //Path to Favicon
  if (pathName === "/favicon.icon") {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("This page does not exist");
  }
  //Creating URL for image
  else if (/\.(jpg|jpeg|png|git)$/i.test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, { "Content-type": "image/jpg" });
      res.end(data);
    });
  }
  // Product page
  else if (pathName === "/products" || pathName === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      "utf-8",
      (err, data) => {

        const overview = data;

        fs.readFile(
          `${__dirname}/templates/template-card.html`,
          "utf-8",
          (err, data) => {
            const cards = laptopData
              .map((ele) => {
                return replaceString(data, ele);
              })
              .join("");
            let output = overview.replace(/{%CARDS%}/g, cards);
            res.end(output);
          }
        );
      }
    );
  }
    // Laptop page
  else if (pathName === "/laptop" && id < laptopData.length) {
    res.writeHead(200, { "Content-type": "text/html" });
    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      "utf-8",
      (err, data) => {
        let laptop = laptopData[id];

        res.end(replaceString(data, laptop));
      }
    );
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("The URL was not found on the server");
  }
});

function replaceString(originalHTML, laptop) {
  let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
}

server.listen(3000, "127.0.0.1", () => {
  console.log("Someone accessed the sever");
});
