"use strict";

///////////////////////////////////////
// Modal window

const scrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const section2 = document.querySelector("#section--2");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

scrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  /*
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */
  // An east way of smooth scroll by only applicable for super modern browsers
  section1.scrollIntoView({ behavior: "smooth" });
});

// Page navigation

// With event delegation
// Steps for event delegation
// 1. Add event listener to a common parent element
// 2. Determine what element originated the element

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    //  console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((tab) =>
    tab.classList.remove("operations__content--active")
  );

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

/*
// Without event delegation
document.querySelectorAll('.nav__link').forEach(function (item) {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const clicked = e.target;
    const siblings = clicked.closest(".nav").querySelectorAll(".nav__link");
    const image = clicked.closest(".nav").querySelector("img");

    siblings.forEach((sib) => {
      if (sib !== clicked) sib.style.opacity = this;
    });
    image.style.opacity = this;
  }
};

// Passing 'argument' into handler using bind
// Essentially there can only be one argument into a handler and that would be the event itself
// If we want to pass something extra we can do that using bind and then passing our value or array or object as the value of "this"
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// Sticky navigation with intersection observer

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const headerCallback = function (entries) {
  const [entry] = entries;
  // alert('Intersecting');
  // console.log(entry);

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};
const headerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(headerCallback, headerOptions);
headerObserver.observe(header);

// Reveal on scroll using Intersection Observer

const allSections = document.querySelectorAll(".section");

const sectionCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
  sectionCallback,
  sectionOptions
);

allSections.forEach((section) => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

// Lazy loading images

const imgsLazyLoaded = document.querySelectorAll("img[data-src]");

const imgCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgsLazyLoaded.forEach((img) => imgObserver.observe(img));

// Creating slider

const sliderComponent = function () {
  const slides = document.querySelectorAll(".slide");
  const slider = document.querySelector(".slider");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  let maxSlide = slides.length - 1;

  // Functions

  const goToSlide = function (cur) {
    slides.forEach(
      (slide, i) => (slide.style.transform = `translateX(${(i - cur) * 100}%)`)
    );
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const dotsActive = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const nextSlide = function () {
    if (curSlide == maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    dotsActive(curSlide);
  };

  const prevSlide = function () {
    if (curSlide == 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    dotsActive(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    dotsActive(0);
  };
  init();

  // Event handlers

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    // Short circuiting implementation of the same
    // e.key === 'ArrowRight' && nextSlide()
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const slide = +e.target.dataset.slide;
      goToSlide(slide);
      dotsActive(slide);
    }
  });
};

sliderComponent();
