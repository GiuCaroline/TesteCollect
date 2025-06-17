let currentIndex = 1;
const items = document.querySelectorAll('.carousel-item');
const titles = document.querySelectorAll('.titulocarrossel');
const contents = document.querySelectorAll('.conteudocarrossel');
const carouselInner = document.querySelector('.carousel-inner');
const dots = document.querySelectorAll('.dot');

function showItem(index) {
  items.forEach((item, i) => {
    item.classList.remove('active');
    titles[i].classList.remove('active');
    contents[i].classList.remove('active');
    dots[i].classList.remove('active');
    
    if (i === index) {
      item.classList.add('active');
      titles[i].classList.add('active');
      contents[i].classList.add('active');
      dots[i].classList.add('active');
    }
  });
  const offset = (index - 1) * -(items[0].offsetWidth + 40);
    carouselInner.style.transform = `translateX(${offset}px)`;
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    currentIndex = i;
    showItem(currentIndex);
  });
});

showItem(currentIndex);
