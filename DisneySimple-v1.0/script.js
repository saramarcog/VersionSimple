const movies = [
    {
        title: "Avatar: El Sentido del Agua",
        category: "Ciencia Ficción, Acción",
        image: "https://lumiere-a.akamaihd.net/v1/images/image_ccdd5962.jpeg",
        year: 2022,
        type: "new"
    },
    {
        title: "Encanto",
        category: "Animación, Fantasía",
        image: "https://lumiere-a.akamaihd.net/v1/images/p_encanto_homeent_22359_4892ae1c.jpeg",
        year: 2021,
        type: "recommended"
    },
    {
        title: "Black Panther: Wakanda Forever",
        category: "Acción, Aventura",
        image: "https://pics.filmaffinity.com/Black_Panther_Wakanda_Forever-869269163-large.jpg",
        year: 2022,
        type: "new"
    },
    {
        title: "The Mandalorian",
        category: "Ciencia Ficción",
        image: "https://pics.filmaffinity.com/The_Mandalorian_Serie_de_TV-526462730-large.jpg",
        year: 2023,
        type: "recommended"
    },
    {
        title: "Enredados",
        category: "Animación",
        image: "https://www.aceprensa.com/wp-content/uploads/2011/01/38757-0.jpg",
        year: 2010,
        type: "recommended"
    },
    {
        title: "Doctor Strange: Multiverse of Madness",
        category: "Fantasía, Acción",
        image: "https://sm.ign.com/ign_es/movie/d/doctor-str/doctor-strange-in-the-multiverse-of-madness_4pjr.jpg",
        year: 2022,
        type: "new"
    },
    {
        title: "Lightyear",
        category: "Animación, Aventura",
        image: "https://play-lh.googleusercontent.com/PKFoGvETaFE2P3rFnSR6QkyA1RaZL0LneVAlq5FpNG9R2h9YMyvAcp0iV4ayIVYPOSAJI5aINSndeSwGqLQ",
        year: 2022,
        type: "recommended"
    },
    {
        title: "Spider-Man: No Way Home",
        category: "Acción, Comedia",
        image: "https://pics.filmaffinity.com/Spider_Man_No_Way_Home-387287198-large.jpg",
        year: 2021,
        type: "new"
    },
    {
        title: "Luca",
        category: "Animación, Comedia",
        image: "https://www.aceprensa.com/wp-content/uploads/2021/06/Cartel-Luca.jpg",
        year: 2021,
        type: "recommended"
    },
    {
        title: "Cruella",
        category: "Comedia, Crimen",
        image: "https://lumiere-a.akamaihd.net/v1/images/p_cruella_21672_ba40c762.jpeg",
        year: 2021,
        type: "recommended"
    },
    {
        title: "Soul",
        category: "Animación, Fantasía",
        image: "https://lumiere-a.akamaihd.net/v1/images/p_soul_disneyplus_v2_20907_764da65d.jpeg",
        year: 2020,
        type: "recommended"
    },
    {
        title: "Raya y el Último Dragón",
        category: "Animación, Aventura",
        image: "https://lumiere-a.akamaihd.net/v1/images/p_rayaandthelastdragon_21294_83346778.jpeg",
        year: 2021,
        type: "recommended"
    }
];

// Estado de los carruseles (posición actual de scroll)
const carouselState = {
    'recommended-track': 0,
    'new-track': 0
};

function createMovieCard(movie) {
    const article = document.createElement('article');
    article.className = 'movie-card';
    article.innerHTML = `
        <a href="details.html">
            <img class="movie-poster" src="${movie.image}" alt="${movie.title}">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-category">${movie.category}</p>
            </div>
        </a>
    `;
    return article;
}

function loadCarousel(trackId, filteredMovies) {
    const track = document.getElementById(trackId);
    if (!track) return; // Salir si no existe el carrusel en esta página

    track.innerHTML = ''; // Limpiar

    // Resetear posición al filtrar
    carouselState[trackId] = 0;
    track.style.transform = `translateX(0)`;

    filteredMovies.forEach(movie => {
        track.appendChild(createMovieCard(movie));
    });
}

function loadAllMovies(genre = 'all') {
    // Filtrar por género si es necesario
    const filterFn = movie => {
        if (genre === 'all') return true;
        return movie.category.includes(genre);
    };

    // Separar en Recomendados (mix) y Novedades (mas recientes o marcados)
    const recommended = movies.filter(m => filterFn(m)); // Mostramos todos en recomendados para llenar
    const newReleases = movies.filter(m => m.type === 'new' && filterFn(m));

    loadCarousel('recommended-track', recommended);
    loadCarousel('new-track', newReleases);
}

// Función de scroll horizontal
window.scrollCarousel = function (trackId, direction) {
    const track = document.getElementById(trackId);
    const containerWidth = track.parentElement.offsetWidth;
    const cardWidth = track.querySelector('.movie-card')?.offsetWidth || 200;
    const gap = 16;
    const itemWidth = cardWidth + gap;

    // Cuántas cartas caben en pantalla
    const itemsPerPage = Math.floor(containerWidth / itemWidth);
    const scrollAmount = itemsPerPage * itemWidth;

    // Total de scroll posible
    const maxScroll = track.scrollWidth - containerWidth;

    // Calcular nueva posición
    let currentScroll = carouselState[trackId];
    let newScroll = currentScroll - (scrollAmount * direction); // - porque translateX negativo mueve a izquierda

    // Límites
    if (newScroll > 0) newScroll = 0; // No pasar del inicio
    if (newScroll < -maxScroll) newScroll = -maxScroll; // No pasar del final

    carouselState[trackId] = newScroll;
    track.style.transform = `translateX(${newScroll}px)`;
};

// Event Listeners Filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Actualizar UI botones
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Filtrar contenido
        const genre = e.target.dataset.genre;
        loadAllMovies(genre);
    });
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadAllMovies();
    initHeroSlider();
});

/* --- Hero Slider Logic --- */
let currentHeroIndex = 0;
let heroInterval;
const heroMovies = movies.filter(m => m.type === 'new' || m.year >= 2022).slice(0, 5); // Select top 5 new movies

function initHeroSlider() {
    const sliderContainer = document.getElementById('hero-slider');
    if (!sliderContainer) return;

    // Generate slides
    sliderContainer.innerHTML = heroMovies.map((movie, index) => {
        return `
            <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                <!-- Blurred Background Layer -->
                <div class="hero-bg-blur" style="background-image: url('${movie.image}')"></div>
                
                <div class="container hero-content-inner">
                    <div class="hero-text">
                        <h2 class="hero-title">${movie.title}</h2>
                        <span class="hero-subtitle mb-3 d-block">${movie.year} • ${movie.category}</span>
                        <div class="hero-buttons">
                            <a href="details.html" class="primary-button">VER AHORA</a>
                            <a href="#" class="secondary-button">TRÁILER</a>
                        </div>
                    </div>
                    <div class="hero-poster-container">
                        <img src="${movie.image}" alt="${movie.title}" class="hero-floating-poster">
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Controls
    document.getElementById('hero-prev')?.addEventListener('click', () => changeHeroSlide(-1));
    document.getElementById('hero-next')?.addEventListener('click', () => changeHeroSlide(1));

    // Auto play
    startHeroInterval();
}

function changeHeroSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    // Remove active class from current
    slides[currentHeroIndex].classList.remove('active');

    // Calculate new index
    currentHeroIndex += direction;
    if (currentHeroIndex >= slides.length) currentHeroIndex = 0;
    if (currentHeroIndex < 0) currentHeroIndex = slides.length - 1;

    // Add active class to new
    slides[currentHeroIndex].classList.add('active');

    // Reset timer on manual interaction
    resetHeroInterval();
}

function startHeroInterval() {
    heroInterval = setInterval(() => {
        changeHeroSlide(1);
    }, 5000); // Change every 5 seconds
}

function resetHeroInterval() {
    clearInterval(heroInterval);
    startHeroInterval();
}
