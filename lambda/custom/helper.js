'use strict';
const xml2js = require('xml2js');
const https = require('https');

const HelperFunctions = {
    /**
     *  Uses the XML returned from a feed and returns a promise that has resolved a json object representative of the XML
     *
     * @param {(string)} xmlUrl
     * @returns {Promise}
     */
    'getJsonObjectFromXMLFeed': (xmlUrl) => {
        // A promise which makes a call to the api and waits for data
        let ctaArrivalTimes = new Promise(function(resolve, reject) {
            https.get(xmlUrl, (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    resolve(data);
                });

            }).on("error", (err) => {
                reject("Error: " + err.message);
            });

        }).then(function(xmlArrivalTimes){
            let xmlStringResult = "";
            xml2js.parseString(xmlArrivalTimes, function (err, result) {
                xmlStringResult = result;
            });
            return xmlStringResult;
        }).then(function(jsonArrivalTimes){
            return jsonArrivalTimes;
        }).catch(function(errorMsg){
            console.log(errorMsg);
        });

        return ctaArrivalTimes;
    },
    /**
     * Difference between two times in milliseconds
     *
     * @param {(string)} time1
     * @param {(string)} time2
     * @returns {number}
     */
    'getTimeDifference':  (time1, time2) => {
        let split_time1 = time1.split(':');
        let start1 = split_time1[0];
        let end1 = split_time1[1];

        let split_time2 = time2.split(':');
        let start2 = split_time2[0];
        let end2 = split_time2[1];

        var date1 = new Date(0);
        date1.setHours(parseInt(start1, 10));
        date1.setMinutes(parseInt(end1, 10));

        var date2 = new Date(0);
        date2.setHours(parseInt(start2, 10));
        date2.setMinutes(parseInt(end2, 10));

        return date2.getTime() - date1.getTime();
    },
    /**
     * Converts milliseconds to minutes
     *
     * @param {(number)} millseconds
     * @returns {number}
     */
    'convertMillisecondsToMinutes': (millseconds) => {
        return (millseconds * 0.001)/60;
    },
    /**
     * Converts military time to standard time
     *
     * @param {(number)} string
     * @returns {string}
     */
    'convertMiltaryTimeToStandardTime': (timeString) => {
        let splitTimeString = timeString.split(':');
        let hour = parseInt(splitTimeString[0], 10);
        let minutes = splitTimeString[1];

        let dayPeriod = (hour >= 12 && hour !== 24) ? 'PM' : 'AM';
        let standardHour = (hour > 12) ? (hour-12) : ((hour == 0) ? 12: hour);

        return standardHour+':'+minutes+dayPeriod;

    }

};

module.exports = HelperFunctions;