import {auth, db, provider, getPerformances} from "../scripts/firebaseCall.js";

const params = new URLSearchParams(window.location.search);
const key = params.get("key");

let searchQuery = [];

if (key) {
  let keyLib = key.split(' ');
  let year = keyLib.pop();
  let choir = keyLib.join(' ');
  searchQuery = [choir, year];
}

const performancesElement = document.querySelector('#performances');
const yearsDrop = document.querySelector('#sortYear');
const concertDrop = document.querySelector('#sortConcert');
const searchBar = document.querySelector('#search');
let performances = [];
let years = [];
let concerts = [];

const populatePerformances = async () => {
    let prePerfs = await getPerformances();
    performances = await indexPerformances(prePerfs);
    search(searchQuery);
    populateFilters(performances);
}

const indexPerformances = (performances) => {
    let newPs = [];

    performances.forEach(performance => {
        if (performance.Source != "0") {
            performance.Search = `${performance.Year} ${performance.Choir} ${performance.Song} ${performance.Credit} ${performance.Concert}`;
            newPs.push(performance);
        }
    })
    return newPs;
}

const displayPerformances = (searchedPs) => {

    performancesElement.innerHTML = '';
    
    searchedPs.forEach(performance => {

        if (performance.Source != "0") {

            let sources = performance.Source.split("/");
            let id = sources[sources.indexOf("d") + 1];

            let ar = document.createElement('article');
            let h3 = document.createElement('h3');
            let frame = document.createElement('iframe');
            let link = document.createElement('a');
            let thumb = document.createElement('img');
            let newT = document.createElement('img');
            let p = document.createElement('p');

            h3.innerHTML = `${performance.Concert} ${performance.Year}`;
            link.setAttribute('href',performance.Source);
            link.setAttribute('target','_blank');
            link.setAttribute('width','100%');
            link.setAttribute('height','100%');
            thumb.setAttribute('loading','lazy');
            thumb.setAttribute('alt',`${performance.Concert} ${performance.Year} Thumbnail`);
            thumb.setAttribute('src',`https://drive.google.com/thumbnail?id=${id}`);
            newT.setAttribute('src','../media/newTab.png');
            newT.setAttribute('alt',"New Tab Button to open performance.");
            newT.setAttribute('class','newT');
            p.innerHTML = `Song: ${performance.Song}<br>Choir: ${performance.Choir}<br>Credit: ${performance.Credit}`;
            
            link.append(thumb);
            link.append(newT);
            ar.appendChild(h3);
            ar.appendChild(link);
            ar.appendChild(p);
            performancesElement.appendChild(ar);
        }});
}

const populateFilters = (performances) => {
    // Make lists
    performances.forEach(performance => {
        if (!years.includes(performance.Year)) {
            years.push(performance.Year);
        }
        if (!concerts.includes(performance.Concert)) {
            concerts.push(performance.Concert)
        }
    });


    // Years
    years.forEach(year => {
        let option = document.createElement('option');
        option.setAttribute('value',`${year}`);
        option.innerText = `${year}`;

        yearsDrop.appendChild(option);
    })

    // Concerts
    concerts.forEach(concert => {
        let option = document.createElement('option');
        option.setAttribute('value',`${concert}`);
        option.innerText = `${concert}`;

        concertDrop.appendChild(option);
    })
}

const updateSearch = () => {
    let searchkey = ''
    if (yearsDrop.value != 'all' && concertDrop.value != 'all') {
        searchkey = `${yearsDrop.value} ${concertDrop.value} ${searchBar.value}`
    }
    else if (concertDrop.value != 'all') {
        searchkey = `${concertDrop.value} ${searchBar.value}`
    }
    else if (yearsDrop.value != 'all') {
        searchkey = `${yearsDrop.value} ${searchBar.value}`
    }
    else {
        searchkey = `${searchBar.value}`
    }
    search(searchkey.split(' '))
}

const search = (searchQuery) => {
    // every for exact match, some for at least one
    let searchedPs = performances.filter(performance => searchQuery.every(word => performance.Search.toLowerCase().includes(word.toLowerCase())));
    displayPerformances(searchedPs);
    if (searchedPs.length != 0) {
        document.querySelector('#dissapoint').innerHTML = ''
    }
    else {
        document.querySelector('#dissapoint').innerHTML = '<p>There are no performance videos available for the entered search.<br></br>Please check filters and search bar to try again.</p>'
    }
}

populatePerformances();
yearsDrop.addEventListener("change", () => {updateSearch()});
concertDrop.addEventListener("change", () => {updateSearch()});
searchBar.addEventListener("input", () => {updateSearch()});