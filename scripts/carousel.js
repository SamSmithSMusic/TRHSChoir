const carousel = document.querySelector('.carousel');
const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const slideWidth = carousel.clientWidth;

let currentIndex = 0;

function adjustImageSizes() {
    const slideWidth = carousel.clientWidth;
    slides.style.width = `${slideWidth * images.length}px`;

    images.forEach((img) => {
        img.style.width = `${slideWidth}px`;
    });

    slides.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
}

adjustImageSizes();
window.addEventListener('resize', adjustImageSizes);

// Function to move to the next slide
function moveToNextSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  slides.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
}

// Function to move to the previous slide
function moveToPrevSlide() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  slides.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
}

// Automatic transitioning every 10 seconds
setInterval(moveToNextSlide, 15000);

// Button click events
nextButton.addEventListener('click', moveToNextSlide);
prevButton.addEventListener('click', moveToPrevSlide);