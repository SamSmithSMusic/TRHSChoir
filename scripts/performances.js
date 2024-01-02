
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
    else{
        displayCars(carList.filter(car => car.Choir.includes(choir)), carsElement);
    }
}

const reset = () => {
    carsElement.innerHTML = '';
} 

const sortBy = (cars) => {
    reset();
    let filter = document.querySelector('#sortBy').value;

    if (filter == "all" && choir != "Archive")
    {
        displayCars(carList.filter(car => car.Choir.includes(choir)), carsElement);
    }

    else if (choir != "Archive")
    {
        displayCars(cars.filter(car => car.Year.includes(filter) && car.Choir.includes(choir)), carsElement);
    }

    else
    {
        let filter = document.querySelector('#sortBy').value;
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
}

const displayCars = (carList, carsElement) => {
    carList.forEach(car => {
        let ar = document.createElement('article');
        let h3 = document.createElement('h3');
        let frame = document.createElement('iframe');
        let p = document.createElement('p');

        h3.innerHTML = `${car.Concert} ${car.Year}`;
        frame.setAttribute('src',car.Source);
        frame.setAttribute('width','auto')
        frame.setAttribute('height','auto')
        frame.setAttribute('autoplay','allow')
        frame.setAttribute('alt',`${car.Concert} ${car.Year} Video`);
        p.innerHTML = `Song: ${car.Song}<br>Choir: ${car.Choir}<br>Credit: ${car.Credit}`;

        ar.appendChild(h3);
        ar.appendChild(frame);
        ar.appendChild(p);
        carsElement.appendChild(ar);
    });
}

getCars();

document.querySelector("#sortBy").addEventListener("change", () => {sortBy(carList)});