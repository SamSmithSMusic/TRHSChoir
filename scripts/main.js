//header and footer
let headerhtml = `
<img id="banner" src="../media/trhschoir-logo.webp" alt="TRHS Choir Logo">
    <nav>
        <ul id="menu">
        <li><a id="toggleMenu">&equiv;</a></li>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../Calendar">Calendar</a></li>
        <li class="dropdown">
          <a href="#" class="droptn">Choirs &#9662;</a>
          <ul class="dropdown-content">
            <li><a href="../Chamber">Chamber</a></li>
            <li><a href="../Vivace">Vivace</a></li>
            <li><a href="../BelleVoix">Belle Voix</a></li>
            <li><a href="../Tenor-Bass">Tenor/Bass</a></li>
            <li><a id="sopAlt" href="../SopranoAlto">Soprano/Alto</a></li>
            <li><a href="../Unavoce">Una Voce</a></li>
            <li><a href="../MusicTheory">Music Appreciation</a></li>
          </ul>
        </li>
        <li><a href="../Tickets">Tickets & Fundraisers</a></li>
        <li><a href="../Shop">Shop</a></li>
        <li><a href="../Repertoire">Repertoire</a></li>
        <li><a href="../Performances">Performance Archive</a></li>
        </ul>
    </nav>
`
let footerhtml = `
&copy;<span id="year"></span> | Thunder Ridge High School Choir | Mary Clayton-Smith
`

document.querySelector('header').innerHTML = headerhtml;
document.querySelector('footer').innerHTML = footerhtml;

let navLinks = document.querySelectorAll("#menu a");

// Active switch case
navLinks.forEach(link => {
    switch (link.innerText.trim()) {
        case "Home":
        case "Calendar":
        case "Chamber":
        case "Vivace":
        case "Belle Voix":
        case "Tenor/Bass":
        case "Soprano/Alto":
        case "Una Voce":
        case "Music Appreciation":
        case "Tickets & Fundraisers":
        case "Shop":
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
}
document.querySelector('#toggleMenu').addEventListener('click', toggleMenu);

