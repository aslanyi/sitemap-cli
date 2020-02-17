const axios = require("axios");
const xml2js = require("xml2js");
const yargs = require("yargs");
const chalk = require("chalk");
const fs = require("fs");

(async () => {
  try {
    const argv = yargs.argv;
    if (argv.sitemapurl) {
        const response = await axios.get(argv.sitemapurl);
        const siteMapUrls = await xml2js.parseStringPromise(response.data);
        const urls = await getOkUrls(siteMapUrls.urlset.url);
        writeFiles(urls);
    }
  } catch (error) {
    console.log(error);
  }
})();

const getOkUrls = async urls => {
  const urlList = [];
  for (const item of urls) {
    try {
      const response = await axios.get(item.loc[0], {
        headers: [{ "Content-Type": "text/html" }]
      });
      if (typeof response !== "undefined") {
        const status = response.status;
        if (status === 200) {
          const ok = chalk.greenBright.bold(item.loc[0], response.status);
          console.log(ok);
          okItem = item;
        }
      }
    } catch (error) {
      if (error && error.response && error.response.status) {
        const notOk = chalk.redBright.bold(item.loc[0], error.response.status);
        urlList.push(item.loc[0]);
        console.log(notOk);
      }
    }
  }
  return urlList;
};

const writeFiles = urlList => {
  const json = { url: [] };
  urlList.forEach(item => {
    json.url.push(item);
  });
  fs.writeFile("url.json", JSON.stringify(json), err => {
    console.log(err);
  });
};
