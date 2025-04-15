import { displayDOMInfo,invalidInputFn } from "./DOMLogic.js";

const displayingDataArray = [];

class Day {
    constructor () {
        this.dayName;
        this.maxTemp;
        this.minTemp;
        this.avgTemp;
        this.icon;
    }
}

const fetchingDataContainer = (() => {

    let collectedRawData,extractedData;
    const daysArr = 
    [
        {symbol: 0,dayName:'Sunday',dayNameAbbrev: 'Sun'},
        {symbol: 1, dayName: 'Monday',dayNameAbbrev: 'Mon'},
        {symbol: 2,dayName:'Tuesday',dayNameAbbrev: 'Tue'},
        {symbol: 3, dayName: 'Monday',dayNameAbbrev: 'Wed'},
        {symbol: 4,dayName:'Thursday',dayNameAbbrev: 'Thr'},
        {symbol: 5, dayName: 'Friday',dayNameAbbrev: 'Fri'},
        {symbol: 6,dayName:'Saturday',dayNameAbbrev: 'Sat'}
    ]

    async function controlFetchingProcess (location) {

        checkIfThereIsDataInDisplayingArray();

        try {   
           await toCollectAndExtractData (location);
            getInformationWeekly();
        }
        catch (error) {
            invalidInputFn();
        }
    }

    function checkIfThereIsDataInDisplayingArray () {
        if (displayingDataArray.length) {
            displayingDataArray.splice(0);
        }
    }

    async function toCollectAndExtractData (location) {
        collectedRawData = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=L6MBVA3B8R7UP3K579PQEQ3PJ`,{mode:'cors'})
        extractedData = await collectedRawData.json();
    }

    async function getInformationWeekly () {
        try {
            let i = 0;
            while (i < 7) {
                const dayObject = new Day();
                const dayNameIndex = await getAllDataForADay (dayObject,i);
                if (i === 0)  {
                    currentDayData(dayObject,i);            
                    dayObject.dayName = daysArr[dayNameIndex].dayName;
                }
                else {
                    dayObject.dayName = daysArr[dayNameIndex].dayNameAbbrev;
                }
                displayingDataArray.push(dayObject);
                i++;
            }
            displayDOMInfo(displayingDataArray);
        }
        catch (error) {
            invalidInputFn();
        }
    }


    async function getAllDataForADay (dayObject,i) {
        let dateTime, dayNameCode;
        try {
            dateTime = await extractedData.days[i].datetime;
            dateTime = new Date(dateTime);
            dayNameCode = dateTime.getDay();
            dayObject.maxTemp = await extractedData.days[i].tempmax;
            dayObject.minTemp = await extractedData.days[i].tempmin;
            dayObject.avgTemp = await extractedData.days[i].temp;
            dayObject.maxTemp = Math.floor((dayObject.maxTemp - 32) * (5/9));
            dayObject.minTemp = Math.floor((dayObject.minTemp - 32) * (5/9));
            dayObject.avgTemp = Math.floor((dayObject.avgTemp - 32) * (5/9));
            dayObject.icon = await extractedData.days[i].icon;
            if (i) {
                dayObject.condition = await extractedData.days[i].conditions;
            }
            return getDayName(dayNameCode);
        }
        catch (error) {
            invalidInputFn();
        }
    }

    function getDayName (dayNameCode) {
        for (let i = 0; i < daysArr.length; i++) {
            if (daysArr[i].symbol == dayNameCode) {
                return i;
            }
        }
    }

    async function currentDayData (dayObject,i) {
        dayObject.cityName = await extractedData.resolvedAddress;
        dayObject.todayDate = await extractedData.days[i].datetime;
        dayObject.rainProbability = await extractedData.days[i].precipprob;
        dayObject.humidity = await extractedData.days[i].humidity;
        dayObject.humidity = Math.floor(dayObject.humidity);
        dayObject.uvindex = await extractedData.days[i].uvindex;
        dayObject.uvindex = Math.floor(dayObject.uvindex);
        dayObject.sunrise = await extractedData.days[i].sunrise; 
        dayObject.sunset = await extractedData.days[i].sunset; 
    }
    return {controlFetchingProcess}
})()
 
export {fetchingDataContainer,displayingDataArray};

 