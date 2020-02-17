const axios = require("axios");
const xml2js = require("xml2js");
const yargs = require("yargs");
const chalk = require("chalk");
const fs = require("fs");

const urlList = [];
(async () => {
    try {
        const argv = yargs.argv;
        if (argv.sitemapurl) {
            const response = await axios.get(argv.sitemapurl);
            const siteMapUrls = await xml2js.parseStringPromise(response.data);
            getNotFoundUrls(siteMapUrls.urlset.url);
            writeFiles();
        }
    } catch (error) {
        console.log(error);
    }
})();

const getNotFoundUrls = urls => {
    urls.forEach((item, index) => {
        setTimeout(async () => {
            try {
                const response = await axios.get(item.loc[0], {
                    headers: [{ "Content-Type": "text/html" }]
                });
                if (typeof response !== "undefined") {
                    const status = response.status;
                    if (status === 200) {
                        const ok = chalk.greenBright.bold(item.loc[0], response.status);
                        console.log(ok);
                        return;
                    }
                }
            } catch (error) {
                if(error && error.response && error.response.status) {
                    const notOk = chalk.redBright.bold(item.loc[0], error.response.status);
                    urlList.push(item.loc[0]);
                    console.log(notOk);
                }
            }
        }, index * 500);
    });
    return urlList;
};

const writeFiles = () => {
    const writeStream =  fs.createWriteStream('a.txt');
    urlList.forEach((item) => {
        writeStream.write(item);
    });
    writeStream.close();
}
