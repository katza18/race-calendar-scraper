const express = require('express');
const scraper = require('./webscraper');


const app = express();
const port = 8080;

//run the server as an async function to wait for the webscraper to run
async function run() {
    //wait for the scraper to run
    await(scraper.start());

    //all races in the same date/name format
    const f1races = scraper.standardizeF1Info(scraper.f1raceinfo);
    const gt3races = scraper.standardizeGT3Info(scraper.gt3raceinfo);
    const wrcraces = scraper.standardizeWRCInfo(scraper.wrcraceinfo);
    const races = f1races.concat(gt3races);

    //set the get response
    app.get("/f1", (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.json({"races": f1races});
    });
    app.get("/gt3", (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.json({"races": gt3races});
    });
    app.get("/wrc", (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.json({"races": wrcraces});
    });

    app.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });
}

run();
