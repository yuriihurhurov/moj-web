const articles = [
  {
    slug: "2slimey",
    title: "Who Is 2Slimey? Meet the Unhinged Rapper Polarizing the Internet",
    image: "../img/image.png",
    alt: "2Slimey artist profile"
  },
  {
    slug: "osamason",
    title: "Four Sight: How OsamaSon is Reshaping the Rap Underground",
    image: "../img/osamason.avif",
    alt: "OsamaSon artist profile"
  },
  {
    slug: "esdeekid",
    title: "Everything You Need to Know About EsDeeKid, the Breakout Rapper of 2025",
    image: "../img/esdeekid.jpeg",
    alt: "EsDeeKid artist profile"
  },
  {
    slug: "pz",
    title: "What to Know About Pz’, the Model-Turned-Rapper Making Noise in Atlanta’s Underground Scene",
    image: "../img/pz.avif",
    alt: "Pz’ artist profile"
  }
];

const carousel = document.querySelector(".related-news");

if (carousel) {
  const currentArticle = carousel.dataset.currentArticle;
  const track = carousel.querySelector(".related-track");
  const previousButton = carousel.querySelector('[data-related-direction="previous"]');
  const nextButton = carousel.querySelector('[data-related-direction="next"]');
  const relatedArticles = articles.filter((article) => article.slug !== currentArticle);

  for (const article of relatedArticles) {
    const card = document.createElement("article");
    card.className = "related-card";
    card.setAttribute("role", "listitem");

    const imageLink = document.createElement("a");
    imageLink.className = "related-image";
    imageLink.href = `${article.slug}.html`;
    imageLink.setAttribute("aria-label", article.title);

    const image = document.createElement("img");
    image.src = article.image;
    image.alt = article.alt;
    image.loading = "lazy";

    const copy = document.createElement("div");
    copy.className = "related-copy";

    const category = document.createElement("p");
    category.className = "category-text";
    category.textContent = "Rap News";

    const heading = document.createElement("h3");
    const titleLink = document.createElement("a");
    titleLink.href = `${article.slug}.html`;
    titleLink.textContent = article.title;
    heading.append(titleLink);
    imageLink.append(image);
    copy.append(category, heading);
    card.append(imageLink, copy);
    track.append(card);
  }

  function updateControls() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    previousButton.disabled = track.scrollLeft <= 2;
    nextButton.disabled = track.scrollLeft >= maxScroll - 2;
  }

  function scrollByCard(direction) {
    const card = track.querySelector(".related-card");
    if (!card) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = card.getBoundingClientRect().width + gap;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    track.scrollBy({ left: direction * distance, behavior });
  }

  previousButton.addEventListener("click", () => scrollByCard(-1));
  nextButton.addEventListener("click", () => scrollByCard(1));
  track.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);
  requestAnimationFrame(updateControls);
}
