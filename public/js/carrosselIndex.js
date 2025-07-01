// public/js/carrosselIndex.js

const items = document.querySelectorAll('.carousel-item');
let currentIndex = 0;

// Cláusula de Guarda
// 1. Encontre o elemento principal do carrossel
const carrosselContainer = document.querySelector('.carousel-container');

// 2. Se o container do carrossel NÃO existir nesta página, não execute o resto do código.
if (!carrosselContainer) {
    // console.log('Carrossel não encontrado nesta página, script não será executado.');
} else {


    // Todo o seu código existente do carrossel vai aqui dentro do 'else'
    function showItem(index) {
        items.forEach((item, i) => {
            if (item) { 
                item.style.transform = `translateX(${-index * 100}%)`;
            }
        });
    }

    function nextItem() {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    }

    // Inicia o carrossel
    setInterval(nextItem, 4000); // Muda a cada 4 segundos

    // Mostra o primeiro item inicialmente
    showItem(currentIndex);

}