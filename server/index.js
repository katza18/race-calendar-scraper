const express = require('express');
const scraper = require('./webscraper');


const app = express();
const port = 8080;

//run the server as an async function to wait for the webscraper to run
async function run() {
    //wait for the scraper to run
    await(scraper.start());

    //all races in the same date/name format
    const races = scraper.standardizeF1Info(scraper.f1raceinfo);
    //scraper.standardizeGT3Info(scraper.gt3raceinfo);
    console.log(typeof scraper.standardizeF1Info(scraper.f1raceinfo));

    //set the get response
    app.get("/", (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.json({"races": races});
    });

    app.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });
}

run();
