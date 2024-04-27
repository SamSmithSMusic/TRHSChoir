const brandsElement = document.querySelector('#brands');
const carsElement = document.querySelector("#cars");
let carList = [];
let choir = document.title.split('|').map(item => item.trim()).pop();


const getCars = async () => {
    const response = await fetch('media/performances.json');
    carList = await response.json()
    if (choir == "Archive")
    {
        displayCars(carList, carsElement);
    }
    else if (choir == "Repertoire")
    {
        displayBrands(carList, brandsElement);
    } 
    else
    {
        displayCars(carList.filter(car => car.Choir.includes(choir)), carsElement);
    }
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

    if (filter == "all" && choir != "Archive" && choir != "Repertoire")
    {
        displayCars(carList.filter(car => car.Choir.includes(choir)), carsElement);
    }

    else if (choir != "Archive" && choir != "Repertoire" && filter != "all")
    {
        displayCars(cars.filter(car => car.Year.includes(filter) && car.Choir.includes(choir)), carsElement);
    }

    else if (choir == "Archive")
    {
    switch (filter) {
        case "2022":
            displayCars(cars.filter(car => car.Year.includes('2022')), carsElement);
            break;
        case "2023":
            displayCars(cars.filter(car => car.Year.includes('2023')), carsElement);
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
        let ar = document.createElement('article');
        let h3 = document.createElement('h3');
        let frame = document.createElement('iframe');
        let p = document.createElement('p');

        h3.innerHTML = `${car.Concert} ${car.Year}`;
        frame.setAttribute('src',car.Source);
        frame.setAttribute('width','100%');
        frame.setAttribute('height','100%');
        frame.setAttribute('autoplay','allow');
        frame.setAttribute('alt',`${car.Concert} ${car.Year} Video`);
        p.innerHTML = `Song: ${car.Song}<br>Choir: ${car.Choir}<br>Credit: ${car.Credit}`;

        ar.appendChild(h3);
        ar.appendChild(frame);
        ar.appendChild(p);
        carsElement.appendChild(ar);
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