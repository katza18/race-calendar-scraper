const puppeteer = require ('puppeteer');
const fs = require ('fs/promises');

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

//STANDARD DATE: MONTH(MAR) DAY(03) YEAR (2023)

function standardizeF1Info(info) {
    //Separate date from race name
    var newInfo = [];
    var tempStr = "";
    var newDate = "";
    const numDays = 3;
    var count = 0;

    for (let i = 0; i < info.length; i++){
        //for each info entry, split twice to access month/months, days
        const splitInfo = info[i].split(" ");
        const month = splitInfo[0];
        const days = splitInfo[1].split("-", 2);
        var sub = 1;
        var name = "";

        while (splitInfo[splitInfo.length - sub] === "") {
            sub++;
        }
        const year = splitInfo[splitInfo.length - sub];

        //reassemble name
        for(let k = 2; k < splitInfo.length - sub; k++) {
            if (splitInfo[k] === "");
            else name += " " + splitInfo[k];
        }

        //for each day add it to the new info
        for(let j = 0; j < numDays; j++) {
            if (month.length === 3) {
                const newDay = parseInt(days[0]) + j;
                newInfo[count] = month + " " + newDay + " " + year + name; //need to account for newInfo being bigger than info
            }
            else {
                const months = month.split("-", 2);
                if (days [0 + j] > 2) { //first month
                    newInfo[count] = months[0] + " " + days[0 + j] + " " + year + name;
                }
                else {
                    newInfo[count] = months[1] + " " + days[0 + j] + " " + year + name;
                }

            }
            count++; //always increment count when newInfo gets a new entry
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
                newInfo[count] = month.substr(0, 3) + " " + newDay + " " + year + name;
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
                    newInfo[count] = monthOne.substr(0, 3) + " " + newDay + " " + yearOne + name;
                }
                else {
                    //month two
                    doneOne = true;
                    newDay = parseInt(dayEnd) - daysLeft + 1;
                    newInfo[count] = monthTwo.substr(0, 3) + " " + newDay + " " + yearTwo + name;
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
    await page.goto("https://www.formula1.com/en/racing/2023.html");

    //F1 Race Names
    const races = await page.$$eval("div.event-title.f1--xxs", (races) => {
        return races.map(x => x.textContent);
    });

    //F1 Date Info
    const startdates = await page.$$eval("span.start-date", (dates) => {
        return dates.map(x => x.textContent);
    });
    const enddates = await page.$$eval("span.end-date", (dates) => {
        return dates.map(x => x.textContent);
    });
    const months = await page.$$eval("span.month-wrapper.f1-wide--xxs", (dates) => {
        return dates.map(x => x.textContent);
    });

    const dates = [];
    for(let i = 0; i < months.length; i++) {
        dates[i] = months[i] + " " + startdates[i] + "-" + enddates[i];
    }
    races[0] = races[0].replace('\n', '');


    for(let i = 0; i < dates.length; i++) {
        f1raceinfo[i] = dates[i] + " " + races[i];
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

    /* MOTOGP INFO START */
    /*
    await page.goto("https://www.motogp.com/en/calendar");

    const motogpnames = await page.$$eval(".grid-card__event-name", (names) => {
        return names.map(x => x.textContent);
    });
    console.log(motogpnames[4]);
    const motogpdays = await page.$$eval("span.grid-card__date-event__day", (days) => {
        return days.map(x => x.textContent);
    });
    console.log(motogpdays[0]);
    const motogpmonths = await page.$$eval("span.grid-card__date-event__month", (months) => {
        return months.map(x => x.textContent);
    });

    const motogpdates = [];
    for(let i = 0; i < motogpmonths.length; i++) {
        motogpdates[i] = motogpmonths[i] + " " + motogpdays[i];
    }

    const motogpraceinfo = [];
    for(let i = 0; i < motogpdates.length; i++) {
        motogpraceinfo[i] = motogpdates[i] + " " + motogpnames[i];
    }
    */


    /* MOTOGP INFO END */

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
