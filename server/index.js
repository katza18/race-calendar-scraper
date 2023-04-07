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

    const allRaces = f1races.concat(gt3races, wrcraces);

    //set the get response
    app.get("/races", (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.json({"races": allRaces});
    });

    app.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });
}

run();
