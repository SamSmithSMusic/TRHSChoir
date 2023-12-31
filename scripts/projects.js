import displayCars from "./display.js";

const carsElement = document.querySelector("#cars");
let carList = [];

const getCars = async () => {
    const response = await fetch('https://run.mocky.io/v3/5bb6e031-e523-42fa-910a-60ed31688981');
    carList = await response.json()
    displayCars(carList, carsElement);
}

const reset = () => {
    carsElement.innerHTML = '';
} 

const sortBy = (cars) => {
    reset();
    let filter = document.querySelector('#sortBy').value;
    switch (filter) {
        case "super":
            displayCars(cars.filter(car => car.Classification.includes('Super') || car.Make.includes("Ferrari") || car.Make.includes("Lamborghini") || car.Make.includes("Aston") || car.Model.includes("Corvette")), carsElement);
            break;
        case "enthusiast":
            displayCars(cars.filter(car => !car.Classification.includes('Super') && !car.Make.includes("Ferrari") && !car.Make.includes("Lamborghini") && !car.Make.includes("Aston") && !car.Model.includes("Corvette")), carsElement);
            break;
        case "japan":
            displayCars(cars.filter(car => car.Make.includes("Nissan") || car.Make.includes("Honda") || car.Make.includes("Toyota") || car.Make.includes("Mazda") || car.Make.includes("Subaru") || car.Make.includes("Acura") || car.Make.includes("Lexus")), carsElement);
            break;
        case "usa":
            displayCars(cars.filter(car => car.Make.includes("Ford") || car.Make.includes("Chevrolet") || car.Make.includes("Dodge")), carsElement);
            break;
        case "europe":
            displayCars(cars.filter(car => car.Make.includes("Volkswagen") || car.Make.includes("BMW") || car.Make.includes("Audi") || car.Make.includes("Porsche") || car.Make.includes("Lamborghini") || car.Make.includes("Ferrari") || car.Make.includes("McLaren") || car.Make.includes("Aston Martin") || car.Make.includes("Mercedes")), carsElement);
            break;
        case "all":
            displayCars(cars, carsElement);
            break;
    }
}

getCars();

document.querySelector("#sortBy").addEventListener("change", () => {sortBy(carList)});