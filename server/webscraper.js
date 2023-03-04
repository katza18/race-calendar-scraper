const puppeteer = require ('puppeteer');
const fs = require ('fs/promises');
const e = require('express');

let f1raceinfo = [];
let gt3raceinfo = [];
let wrcraceinfo = [];

module.exports = {
    start: start,
    f1raceinfo: f1raceinfo,
    gt3raceinfo: gt3raceinfo,
    wrcraceinfo: wrcraceinfo,
    standardizeF1Info: standardizeF1Info,
    standardizeGT3Info: standardizeGT3Info
}

function assembleNewInfo(month, day, year, name) {
    //name should have a leading space " "
    if (day < 10) {
        day = `0${day}`;
    }
    return month.substr(0, 3) + " " + day + " " + year + name;
}

//STANDARD DATE: MONTH(MAR) DAY(03) YEAR (2023)

function standardizeF1Info(info) {
    //Separate date from race name
    var newInfo = [];
    var tempStr = "";
    var newDate = "";
    const numDays = 3;
    var count = 0;

    for (let i = 0; i < info.length; i++) {
        //for each race, split by space to access month/days data
        const split = info[i].split(" ");

        if(split[5] === "Formula") {
            //SPANS ONE MONTH
            const month = split[0];
            const start = parseInt(split[1]);
            const end = parseInt(split[3]);
            const year = split[4];
            let name = ""
            for (let i = 5; i < split.length; i++)
                name += " " + split[i];
            for (let j = 0; j <= end - start; j++) {
                newInfo[count] = assembleNewInfo(month, start + j, year, name);
                count++;
            }
        }
        else {
            //SPANS TWO MONTHS
            const monthOne = split[0];
            const monthTwo = split[3];
            const start = parseInt(split[1]);
            const end = parseInt(split[4]);
            const year = split[5];
            let name = "";
            let newDay = 0;
            let doneOne = false;
            const totalDays = daysThisMonth(monthOne) - start + 1 + end;

            for (let i = 6; i < split.length; i++)
                name += " " + split[i];
            for (let j = 0; j < totalDays; j++) {
                newDay = start + j;
                const daysLeft = totalDays - j;
                if (newDay <= daysThisMonth(monthOne) && doneOne === false) {
                    newInfo[count] = assembleNewInfo(monthOne, newDay, year, name);
                }
                else {
                    doneOne = true;
                    newDay = end - daysLeft + 1;
                    newInfo[count] = assembleNewInfo(monthTwo, newDay, year, name);
                }
                count++;
            }
        }
    }
    return newInfo;
}

function standardizeGT3Info(info) {
    let count = 0;
    let newInfo = [];
    for (let i = 0; i < info.length; i++) {
        const split = info[i].split(" ");
        let name = "";
        if (split[1] === "-") { //one month
            const dayStart = split[0];
            const dayEnd = split[2];
            const month = split[3];
            const year = split[4];
            for(let j = 5; j < split.length; j++) {
                name += " " + split[j];
            }
            for(let k = 0; k <= parseInt(dayEnd) - parseInt(dayStart); k++) {
                const newDay = parseInt(dayStart) + k;
                newInfo[count] = assembleNewInfo(month, newDay, year, name);
                count++;
            }
        }
        else { //covers 2 months
            const dayStart = split[0];
            const dayEnd = split[4];
            const monthOne = split[1];
            const monthTwo = split[5];
            const yearOne = split[2];
            const yearTwo = split[6]
            const totalDays = daysThisMonth(monthOne) - parseInt(dayStart) + 1 + parseInt(dayEnd);
            let newDay = 0;
            let doneOne = false;

            for(let j = 7; j < split.length; j++) {
                name += " " + split[j];
            }
            for(let j = 0; j < totalDays; j++) {
                newDay = parseInt(dayStart) + j;
                const daysLeft = totalDays - j;
                if (newDay <= daysThisMonth(monthOne) && doneOne === false) {
                    //month one
                    newInfo[count] = assembleNewInfo(monthOne, newDay, yearOne, name);;
                }
                else {
                    //month two
                    doneOne = true;
                    newDay = parseInt(dayEnd) - daysLeft + 1;
                    newInfo[count] = assembleNewInfo(monthTwo, newDay, yearTwo, name);
                }
                count++
            }
        }
    }
    return newInfo;
}

function daysThisMonth(month) {
    //determine how many days in the current month
    switch(month) {
        case "September", "April", "June", "Novemeber":
            return 30;
        case "February":
            if (yearOne % 4 === 0) return 29;
            return 28;
        default:
            return 31;
    }
}

async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.espn.com/f1/schedule");

    //F1 Race Info
    const races = await page.$$eval("td.race__col a", (races) => {
        //maps all f1 race names to races
        return races.map(x => x.textContent);
    });
    const dates = await page.$$eval("span.date__innerCell", (dates) => {
        //maps all f1 race dates to dates
        return dates.map(x => x.textContent);
    });
    const year = await page.$eval("h1.headline", (year) => {
        return year.textContent.split(" ")[3];
    });
    for(let i = 0; i < dates.length; i++) {
        //sets f1 race info with date/name
        f1raceinfo[i] = dates[i] + " " + year + " Formula 1 " + races[i];
    }

    /* F1 INFO END */

    /* GT3 INFO START */
    await page.goto("https://www.gt-world-challenge.com/calendar");

    const gt3tracks = await page.$$eval("section.calendar div.con-inner-text h3", (tracks) => {
        return tracks.map(x => x.textContent);
    });
    const gt3dates = await page.$$eval("section.calendar span.date", (dates) => {
        return dates.map(x => x.textContent);
    });
    const gt3series = await page.$$eval("section.calendar span.series", (series) => {
        return series.map(x => x.textContent);
    });

    for(let i = 0; i < gt3dates.length; i++) {
        gt3raceinfo[i] = gt3dates[i] + " " + gt3tracks[i] + " " + gt3series[i];
    }

    /* GT3 INFO END */

    /* WRC INFO START  */
    await page.goto("https://www.wrc.com/en/championship/calendar/wrc/");

    const wrcnames = await page.$$eval("td:nth-child(2)", (names) => {
        return names.map(x => x.textContent);
    });
    for(let i = 0; i < wrcnames.length; i++) {
        wrcnames[i] = wrcnames[i].trim(); //clear whitespace from strings
    }
    const wrcdates = await page.$$eval("td:nth-child(3)", (dates) => {
        return dates.map(x => x.textContent);
    });

    for(let i = 0; i < wrcdates.length; i++) {
        wrcraceinfo[i] = wrcdates[i] + " " + wrcnames[i];
    }

    /* WRC INFO END */


    await browser.close();
}

/* DATE INFO */
