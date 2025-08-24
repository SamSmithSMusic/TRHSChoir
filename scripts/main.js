//header and footer
let headerhtml = `
<img id="banner" src="../media/TR-Logo-Button.webp" alt="TRHS Choir Logo">
<a id="toggleMenu">☰</a>
    <nav>
        <ul id="menu">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../Choirs">Who We Are</a></li>
        <li><a href="../Repertoire">Repertoire</a></li>
        </ul>
    </nav>
`
let footerhtml = `
&copy;<span id="year"></span> | Thunder Ridge High School Choir | Rand Matheson
`

document.querySelector('header').innerHTML = headerhtml;
document.querySelector('footer').innerHTML = footerhtml;

let navLinks = document.querySelectorAll("#menu a");

// Active switch case
navLinks.forEach(link => {
    switch (link.innerText.trim()) {
        case "Home":
        case "Calendar":
        case "Who We Are":
        case "Upcoming Performances":
        case "Repertoire":
        case "Performance Archive":
            if (link.innerText.trim() === choir) {
                link.classList.add("active");
            }
            break;
    }
});




// copyright year
document.querySelector('#year').textContent = new Date().getFullYear();

// toggle menu in small view
const toggleMenu = () => {
    document.querySelector('#menu').classList.toggle('open');
    let currentSymbol = document.querySelector('#toggleMenu');
    if (currentSymbol.innerText == "☰") {
        currentSymbol.innerText = "✖";
    }
    else if (currentSymbol.innerText == "✖") {
        currentSymbol.innerText = "☰";
    }
}
document.querySelector('#toggleMenu').addEventListener('click', toggleMenu);

