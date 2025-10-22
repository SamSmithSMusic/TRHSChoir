import {
  auth,
  db,
  provider,
  getPerformances,
} from "../scripts/firebaseCall.js";

const repertoireElement = document.querySelector("#repertoire");
const yearsDrop = document.querySelector("#sortYear");
const choirsDrop = document.querySelector("#sortChoir");
let performances = [];
let years = [];
let choirs = [];

const populatePerformances = async () => {
  performances = await getPerformances();
  displayRepertoire(performances);
  populateFilters(performances);
};

const displayRepertoire = (performances) => {
  const groupedData = {};

  // Group the data by Choir and Year
  performances.forEach((performance) => {
    const key = `${performance.Choir}-${performance.Year}`;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(performance);

    // Make lists for filters
    if (!years.includes(performance.Year)) {
      years.push(performance.Year);
    }
    if (!choirs.includes(performance.Choir)) {
      choirs.push(performance.Choir);
    }
  });

  // Loop through the grouped data and create articles for each Choir and Year combination
  for (const key in groupedData) {
    const choirYearData = groupedData[key];

    let choirYearArticle = document.createElement("article");
    let h3 = document.createElement("h3");
    let bigSpan = document.createElement("span");
    let keySend = `${choirYearData[0].Choir} ${choirYearData[0].Year}`;

    h3.innerHTML = keySend;
    bigSpan.appendChild(h3);
    choirYearArticle.appendChild(bigSpan);

    let songsDiv = document.createElement("div");
    let vidcheck = 0;
    choirYearData.forEach((performance) => {
      while (vidcheck == 0) {
        if (performance.Source != "0") {
          let aWrap = document.createElement("a");
          let thisImg = document.createElement("img");

          aWrap.setAttribute(
            "href",
            `../Performances/index.html?key=${encodeURIComponent(keySend)}`
          );
          thisImg.setAttribute("src", "../media/play.png");
          thisImg.setAttribute("alt", "Playable Entry");

          aWrap.appendChild(thisImg);

          bigSpan.prepend(aWrap);
        }
        vidcheck += 1;
      }

      let spanWrap = document.createElement("span");
      let desc = document.createElement("p");

      spanWrap.setAttribute("href", "#performances");
      desc.innerHTML = `${performance.Song} - ${performance.Credit}`;

      spanWrap.appendChild(desc);

      songsDiv.appendChild(spanWrap);
    });

    choirYearArticle.appendChild(songsDiv);
    repertoireElement.appendChild(choirYearArticle);
  }
};

const populateFilters = (performances) => {
  // Years
  years.forEach((year) => {
    let option = document.createElement("option");
    option.setAttribute("value", `${year}`);
    option.innerText = `${year}`;

    yearsDrop.appendChild(option);
  });

  // Choirs
  choirs.forEach((choir) => {
    let option = document.createElement("option");
    option.setAttribute("value", `${choir}`);
    option.innerText = `${choir}`;

    choirsDrop.appendChild(option);
  });
};

const sort = (performances) => {
  repertoireElement.innerHTML = "";

  let year = yearsDrop.value;
  let choir = choirsDrop.value;

  if (year != "all" && choir != "all") {
    displayRepertoire(
      performances.filter(
        (performance) =>
          performance.Choir.includes(choir) && performance.Year.includes(year)
      )
    );
  } else if (year != "all") {
    displayRepertoire(
      performances.filter((performances) => performances.Year.includes(year))
    );
  } else if (choir != "all") {
    displayRepertoire(
      performances.filter((performances) => performances.Choir.includes(choir))
    );
  } else {
    displayRepertoire(performances);
  }
};

populatePerformances();
document.querySelector("#sortYear").addEventListener("change", () => {
  sort(performances);
});
document.querySelector("#sortChoir").addEventListener("change", () => {
  sort(performances);
});
