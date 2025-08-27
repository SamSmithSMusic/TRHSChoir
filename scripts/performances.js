import {auth, db, provider, getPerformances} from "../scripts/firebaseCall.js";

const params = new URLSearchParams(window.location.search);
console.log(params.get("key"));

const brandsElement = document.querySelector('#brands');
const carsElement = document.querySelector("#cars");
let carList = [];
// let choir = document.title.split('|').map(item => item.trim()).pop();


const getCars = async () => {
    // const response = await fetch('media/performances.json');
    carList = await getPerformances();
    if (choir == "Performance Archive")
    {
        displayCars(carList, carsElement);
    }
    else if (choir == "Repertoire")
    {
        displayBrands(carList, brandsElement);
    } 
    // else
    // {
    //     displayCars(carList.filter(car => car.Choir.includes(choir)), carsElement);
    // }
}

const reset = (element) => {
    element.innerHTML = '';
} 

const sortBy = (cars) => {

    if (choir == "Repertoire")
    {
        reset(brandsElement);
    }
    else 
    {
        reset(carsElement);
    }

    let filter = document.querySelector('#sortBy').value;

    if (filter == "all" && choir != "Performance Archive" && choir != "Repertoire")
    {
        displayCars(carList.filter(car => car.Choir.includes(choir)), carsElement);
    }

    else if (choir != "Performance Archive" && choir != "Repertoire" && filter != "all")
    {
        displayCars(cars.filter(car => car.Year.includes(filter) && car.Choir.includes(choir)), carsElement);
    }

    else if (choir == "Performance Archive")
    {
    switch (filter) {
        // case "2022":
        //     displayCars(cars.filter(car => car.Year.includes('2022')), carsElement);
        //     break;
        // case "2023":
        //     displayCars(cars.filter(car => car.Year.includes('2023')), carsElement);
        //     break;
        case "2025":
            displayCars(cars.filter(car => car.Year.includes('2025')), carsElement);
            break;
        case "2024":
            displayCars(cars.filter(car => car.Year.includes('2024')), carsElement);
            break;
        case "all":
            displayCars(cars, carsElement);
            break;
    }
    }

    else if (choir == "Repertoire" && filter == "all")
    {
        displayBrands(cars,brandsElement);
    }

    else if (choir == "Repertoire")
    {
        displayBrands(cars.filter(car => car.Year.includes(filter)),brandsElement);
    }
}

const displayCars = (carList, carsElement) => {
    carList.forEach(car => {

        if (car.Source != "0") {

            let sources = car.Source.split("/");
            let id = sources[sources.indexOf("d") + 1];

            let ar = document.createElement('article');
            let h3 = document.createElement('h3');
            let frame = document.createElement('iframe');
            let link = document.createElement('a');
            let thumb = document.createElement('img');
            let newT = document.createElement('img');
            let p = document.createElement('p');

            h3.innerHTML = `${car.Concert} ${car.Year}`;
            link.setAttribute('href',car.Source);
            link.setAttribute('target','_blank');
            link.setAttribute('width','100%');
            link.setAttribute('height','100%');
            thumb.setAttribute('loading','lazy');
            thumb.setAttribute('alt',`${car.Concert} ${car.Year} Thumbnail`);
            thumb.setAttribute('src',`https://drive.google.com/thumbnail?id=${id}`);
            newT.setAttribute('src','../media/newTab.png');
            newT.setAttribute('alt',"New Tab Button to open performance.");
            newT.setAttribute('class','newT');
            p.innerHTML = `Song: ${car.Song}<br>Choir: ${car.Choir}<br>Credit: ${car.Credit}`;
            
            link.append(thumb);
            link.append(newT);
            ar.appendChild(h3);
            ar.appendChild(link);
            ar.appendChild(p);
            carsElement.appendChild(ar);
        }

    });
}

const displayBrands = (carList, brandsElement) => {
    const groupedData = {};

    // Group the data by Choir and Year
    carList.forEach(car => {
        const key = `${car.Choir}-${car.Year}`;
        if (!groupedData[key]) {
            groupedData[key] = [];
        }
        groupedData[key].push(car);
    });

    // Loop through the grouped data and create articles for each Choir and Year combination
    for (const key in groupedData) {
        const choirYearData = groupedData[key];

        let choirYearArticle = document.createElement('article');
        let h3 = document.createElement('h3');
        h3.innerHTML = choirYearData[0].Choir + ' ' + choirYearData[0].Year;
        choirYearArticle.appendChild(h3);

        let songsParagraph = document.createElement('p');
        choirYearData.forEach(car => {
            songsParagraph.innerHTML += `${car.Song} (${car.Credit})<br>`;
        });

        choirYearArticle.appendChild(songsParagraph);
        brandsElement.appendChild(choirYearArticle);
    }
};

getCars();

document.querySelector("#sortBy").addEventListener("change", () => {sortBy(carList)});