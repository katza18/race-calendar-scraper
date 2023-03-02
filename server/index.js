const express = require('express');
const scraper = require('./webscraper');


const app = express();
const port = 8080;

//run the server as an async function to wait for the webscraper to run
async function run() {
    //wait for the scraper to run
    await(scraper.start());
    const races = scraper.wrcraceinfo;

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
