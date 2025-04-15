import {fetchingDataContainer} from './appLogic.js';

const searchBtn = document.getElementById('searchBtn');
const locationInput = document.getElementById('locationInput');
const weatherDataSection = document.getElementById('weatherData');
const loader = document.getElementById('loader');
const invalidInput = document.getElementById('invalidInput');
const icons = [];


async function displayDOMInfo (displayingDataArray) {
    try {
        setTheDomElt();
        emptyTheIconArr();
        await getIconSrc(displayingDataArray);
        displayingDataArray[0].todayDate = reformTodayDate (displayingDataArray[0].todayDate)
        structuringWebContent(displayingDataArray);
        setTheDomElt(true);
    }
    catch (error) {
        invalidInputFn();
    }
}

function setTheDomElt (showResult) {
    if (showResult) {
        showDOM();
    }
    else {
        hideDOM();
    }
}

function showDOM () {
    weatherDataSection.style.filter = 'blur(0)';
    loader.style.visibility = 'hidden';
}

function hideDOM () {
    loader.style.visibility = 'visible';
    invalidInput.style.display = 'none';
    weatherDataSection.style.display = 'block';
    weatherDataSection.style.filter = 'blur(.5rem)';
}

function emptyTheIconArr () {
    if (icons.length) {
        icons.splice(0);
    }
}

async function getIconSrc (displayingDataArray) {
    try {
        for (let i = 0; i < displayingDataArray.length; i++) {
            let noSimilarIcon = true;
            const iconObj = {};
            iconObj.name = displayingDataArray[i].icon + ' weather icon';
            if (i) {
                noSimilarIcon = checkIfTheseIsNoSimilarIcon(iconObj);
            }
            if (noSimilarIcon) {
                const unfilteredData = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=AoJn0jX4vYddou269e8jNpPPkPOzRCl8&s=${iconObj.name}&weirdness=`,{mode:'cors'});   
                const filteredData = await unfilteredData.json();
                iconObj.url = await filteredData.data.images.original.url;
            }
            icons.push(iconObj);
        }
    }
    catch(error) {
        invalidInputFn();
    }
}

function checkIfTheseIsNoSimilarIcon (dayData) {
    for (let i = 0; i < icons.length; i++) {
        if (icons[i].name === dayData.name) {
            dayData.url = icons[i].url;
            return false;
        }
    }
    return true;
}

function reformTodayDate (date) {
    let temp;
    date = date.split('-');
    temp = date[date.length - 1];
    date[date.length - 1] = date[0];
    date[0] = temp;
    return date;
}

function structuringWebContent (displayingDataArray) {
    weatherDataSection.innerHTML = '';
    const blurBgCover = document.createElement('div');
    blurBgCover.id = 'blurBg';
    weatherDataSection.append(blurBgCover);
    blurBgCover.innerHTML = 
    `
                <h1 id="weatherDataTitle">
                    <ins>Seven Days Forecast</ins>
                </h1>
    `
    addWeatherDataToBlurBg(displayingDataArray,blurBgCover);
}

function addWeatherDataToBlurBg (displayingDataArray,blurBgCover) {
    const todayWeather = document.createElement('div');
    const otherDaysWeather = document.createElement('ul');
    otherDaysWeather.id = 'otherDaysWeather';
    todayWeather.id = 'todayWeather';
    blurBgCover.append(todayWeather);
    blurBgCover.append(otherDaysWeather);
    todayWeather.innerHTML = `
                        <div id="todayData">
                            <p>
                                <span>${displayingDataArray[0].dayName} </span>
                                <span>${displayingDataArray[0].todayDate[0]} /</span><span>${displayingDataArray[0].todayDate[1]} /</span><span>${displayingDataArray[0].todayDate[2]}</span>
                            </p>
                            <p>${displayingDataArray[0].cityName}</p>
                            <p id="avgTemp">${displayingDataArray[0].avgTemp}&deg;C</p>
                            <p>
                                <span>${displayingDataArray[0].minTemp}&deg;C /</span><span> ${displayingDataArray[0].maxTemp}&deg;C</span>
                            </p>
                        </div>
                        <img id="todayDataIcon" src="${icons[0].url}" alt="weather icon">    
                    <ul id="otherData">
                        <li class="a_data">    
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sunrise">
                            <path d="M17 18a5 5 0 0 0-10 0"></path>
                            <line x1="12" y1="2" x2="12" y2="9"></line>
                            <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                            <line x1="1" y1="18" x2="3" y2="18"></line>
                            <line x1="21" y1="18" x2="23" y2="18"></line>
                            <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                            <line x1="23" y1="22" x2="1" y2="22"></line>
                            <polyline points="8 6 12 2 16 6"></polyline>
                        </svg>
                        <span>Sunrise: ${displayingDataArray[0].sunrise}</span>
                        </li>
                        <li class="a_data">
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sunset">
                                <path d="M17 18a5 5 0 0 0-10 0"></path>
                                <line x1="12" y1="9" x2="12" y2="2"></line>
                                <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                                <line x1="1" y1="18" x2="3" y2="18"></line>
                                <line x1="21" y1="18" x2="23" y2="18"></line>
                                <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                                <line x1="23" y1="22" x2="1" y2="22"></line>
                                <polyline points="16 5 12 9 8 5"></polyline>
                            </svg>
                            <span>Sunset: ${displayingDataArray[0].sunset}</span>
                        </li>
                        <li class="a_data">                        
                            <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#e3e3e3">
                                <path d="M440-142q-118-15-199-104t-81-210q0-66 24.5-122.5T254-678l226-222 226 222q36 36 59.5 81t31.5 97h-81q-7-34-23.5-64.5T650-620L480-788 310-620q-35 33-52.5 74.5T240-456q0 87 57.5 153T440-223v81Zm38-364Zm54 173-24-55q26-14 54.5-23t57.5-9q23 0 45.5 5.5T709-401q18 8 36.5 14t38.5 6q23 0 45-8t43-19l24 55q-26 14-54.5 23t-57.5 9q-23 0-45.5-5.5T695-340q-18-8-36.5-14t-38.5-6q-23 0-45 8t-43 19Zm0 120-24-55q26-14 54.5-23t57.5-9q23 0 45.5 5.5T709-281q18 8 36.5 14t38.5 6q23 0 45-8t43-19l24 55q-26 14-54.5 23t-57.5 9q-23 0-45.5-5.5T695-220q-18-8-36.5-14t-38.5-6q-23 0-45 8t-43 19Zm0 120-24-55q26-14 54.5-23t57.5-9q23 0 45.5 5.5T709-161q18 8 36.5 14t38.5 6q23 0 45-8t43-19l24 55q-26 14-54.5 23T784-81q-23 0-45.5-5.5T695-100q-18-8-36.5-14t-38.5-6q-23 0-45 8t-43 19Z"/>
                            </svg>
                            <span>Humidity:  ${displayingDataArray[0].humidity}%</span>
                        </li>
                        <li class="a_data">
                            <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#e3e3e3">
                                <path d="M558-84q-15 8-30.5 2.5T504-102l-60-120q-8-15-2.5-30.5T462-276q15-8 30.5-2.5T516-258l60 120q8 15 2.5 30.5T558-84Zm240 0q-15 8-30.5 2.5T744-102l-60-120q-8-15-2.5-30.5T702-276q15-8 30.5-2.5T756-258l60 120q8 15 2.5 30.5T798-84Zm-480 0q-15 8-30.5 2.5T264-102l-60-120q-8-15-2.5-30.5T222-276q15-8 30.5-2.5T276-258l60 120q8 15 2.5 30.5T318-84Zm-18-236q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z"/>
                            </svg>
                            <span>Rain Probability: ${displayingDataArray[0].rainProbability}%</span>
                        </li>
                        <li class="a_data">
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                            <span>Uvindex: ${displayingDataArray[0].uvindex}</span>
                        </li>
                    </ul>
                </div>
    `
    // otherDaysWeather
    for (let i = 1; i < displayingDataArray.length; i++) {
        otherDaysWeather.innerHTML += `
                    <li class="anotherDay">
                        <p>${displayingDataArray[i].dayName}</p>
                        <img class="otherDayIcon" src="${icons[i].url}" alt="a weather icon">
                        <p>${displayingDataArray[i].minTemp}&deg; / ${displayingDataArray[i].maxTemp}&deg;</p>
                        <p>${displayingDataArray[i].condition}</p>
                    </li>
        `
    }

    return (todayWeather + otherDaysWeather);
}

function invalidInputFn (error) {
    invalidInput.style.display = 'block';
    weatherDataSection.style.display = 'none';
    invalidInput.innerText = 'Invalid City or Location Entered !';
}

function userInputtedLocation (e) {
    e.preventDefault();
    fetchingDataContainer.controlFetchingProcess(locationInput.value);
    locationInput.value = '';
}

searchBtn.addEventListener('click',userInputtedLocation);

export {displayDOMInfo,invalidInputFn};