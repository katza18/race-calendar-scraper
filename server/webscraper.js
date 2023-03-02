const puppeteer = require ('puppeteer');
const fs = require ('fs/promises');

let f1raceinfo = [];
let gt3raceinfo = [];
let wrcraceinfo = [];

module.exports = {
    start: start,
    f1raceinfo: f1raceinfo,
    gt3raceinfo: gt3raceinfo,
    wrcraceinfo: wrcraceinfo
}

async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.formula1.com/en/racing/2023.html");
    //await page.screenshot({path: "f1.png", fullPage: true});

    //F1 Locations
    /*
    const locations = await page.$$eval("div.event-place", (places) => {
        return places.map(x => x.textContent);
    });
    */

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

    const gt3tracks = await page.$$eval("div.con-inner-text h3", (tracks) => {
        return tracks.map(x => x.textContent);
    });
    const gt3dates = await page.$$eval("span.date", (dates) => {
        return dates.map(x => x.textContent);
    });
    const gt3series = await page.$$eval("span.series", (series) => {
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
