// Global variables
const properties = window.properties || [];
let filteredProperties = [...properties];
let currentModalProperty = null;
let currentImageIndex = 0;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let compareList = JSON.parse(localStorage.getItem('compareList')) || [];
const maxCompareItems = 3;

// DOM Elements
const propertyGrid = document.getElementById('propertyGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterType = document.getElementById('filterType');
const filterPurpose = document.getElementById('filterPurpose');
const filterPrice = document.getElementById('filterPrice');
const filterRooms = document.getElementById('filterRooms');
const resetFilters = document.getElementById('resetFilters');
const favoritesToggle = document.getElementById('favoritesToggle');
const favoritesList = document.getElementById('favoritesList');
const favoritesCount = document.getElementById('favoritesCount');
const compareBtn = document.getElementById('compareBtn');
const compareCount = document.getElementById('compareCount');
const modal = document.getElementById('propertyModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

// Theme switcher functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'modern';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButtons(savedTheme);
}

function updateThemeButtons(activeTheme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === activeTheme);
    });
}

function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeButtons(theme);
}

document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        changeTheme(btn.dataset.theme);
    });
});

// Property card template
function createPropertyCard(property) {
    const price = property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const isFeatured = property.featured ? '<span class="property-badge badge-featured">Destaque</span>' : '';
    const isFavorite = favorites.some(fav => fav.id === property.id) ? 'favorited' : '';
    const isComparing = compareList.some(item => item.id === property.id) ? 'comparing' : '';

    return `
        <div class="property-card" data-id="${property.id}" onclick="openPropertyModal(${property.id})">
            <div class="property-image">
                <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
                ${isFeatured}
                <div class="property-actions">
                    <button class="btn-favorite ${isFavorite}" onclick="toggleFavorite(${property.id}, event)" title="Favoritar">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn-favorite ${isComparing}" onclick="toggleCompare(${property.id}, event)" title="Comparar">
                        <i class="fas fa-balance-scale"></i>
                    </button>
                </div>
            </div>
            <div class="property-info">
                <div class="property-price">${price}<small>/ ${property.purpose === 'venda' ? 'venda' : 'mês'}</small></div>
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${property.location}</span>
                </div>
                <div class="property-features">
                    <div class="feature">
                        <i class="fas fa-bed"></i>
                        <span>${property.rooms}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-bath"></i>
                        <span>${property.bathrooms}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-car"></i>
                        <span>${property.garages}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area}m²</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Display properties
function displayProperties() {
    if (!propertyGrid) return;

    const html = filteredProperties.map(property => createPropertyCard(property)).join('');
    propertyGrid.innerHTML = html || '<div class="no-results">Nenhum imóvel encontrado.</div>';
}

// Filter properties
function filterProperties() {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const type = filterType?.value || 'all';
    const purpose = filterPurpose?.value || 'all';
    const price = filterPrice?.value || 'all';
    const rooms = filterRooms?.value || 'all';

    filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm) ||
                            property.location.toLowerCase().includes(searchTerm) ||
                            property.address.toLowerCase().includes(searchTerm);

        const matchesType = type === 'all' || property.type === type;
        const matchesPurpose = purpose === 'all' || property.purpose === purpose;
        const matchesPrice = price === 'all' || property.price <= Number(price);
        const matchesRooms = rooms === 'all' || property.rooms >= Number(rooms);

        return matchesSearch && matchesType && matchesPurpose && matchesPrice && matchesRooms;
    });

    displayProperties();
}

// Event listeners
if (searchInput && searchBtn) {
    searchInput.addEventListener('keyup', filterProperties);
    searchBtn.addEventListener('click', filterProperties);
}

if (filterType) filterType.addEventListener('change', filterProperties);
if (filterPurpose) filterPurpose.addEventListener('change', filterProperties);
if (filterPrice) filterPrice.addEventListener('change', filterProperties);
if (filterRooms) filterRooms.addEventListener('change', filterProperties);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (filterType) filterType.value = 'all';
        if (filterPurpose) filterPurpose.value = 'all';
        if (filterPrice) filterPrice.value = 'all';
        if (filterRooms) filterRooms.value = 'all';
        filteredProperties = [...properties];
        displayProperties();
    });
}

// Favorites functionality
function toggleFavorite(propertyId, event) {
    if (event) event.stopPropagation();

    const property = properties.find(p => p.id === propertyId);
    const index = favorites.findIndex(fav => fav.id === propertyId);

    if (index === -1) {
        favorites.push(property);
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesUI();
    displayProperties();
}

function updateFavoritesUI() {
    if (favoritesCount) {
        favoritesCount.textContent = favorites.length;
    }

    if (favoritesToggle) {
        favoritesToggle.classList.toggle('active', favorites.length > 0);
    }

    if (favoritesList) {
        if (favorites.length > 0) {
            const html = favorites.map(property => {
                const price = property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                return `
                    <div class="favorite-item" onclick="openPropertyModal(${property.id})">
                        <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
                        <div class="favorite-item-info">
                            <h4>${property.title}</h4>
                            <p>${price}</p>
                        </div>
                    </div>
                `;
            }).join('');
            favoritesList.innerHTML = html;
        } else {
            favoritesList.innerHTML = '<div class="empty-favorites">Nenhum favorito selecionado.</div>';
        }
    }
}

if (favoritesToggle && favoritesList) {
    favoritesToggle.addEventListener('click', () => {
        favoritesList.classList.toggle('active');
    });
}

// Compare functionality
function toggleCompare(propertyId, event) {
    if (event) event.stopPropagation();

    const property = properties.find(p => p.id === propertyId);
    const index = compareList.findIndex(item => item.id === propertyId);

    if (index === -1 && compareList.length < maxCompareItems) {
        compareList.push(property);
    } else if (index !== -1) {
        compareList.splice(index, 1);
    }

    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareUI();
    displayProperties();
}

function updateCompareUI() {
    if (compareCount) {
        compareCount.textContent = compareList.length;
    }

    if (compareBtn) {
        compareBtn.classList.toggle('active', compareList.length > 0);
    }
}

if (compareBtn) {
    compareBtn.addEventListener('click', () => {
        if (compareList.length >= 2) {
            showCompareModal();
        }
    });
}

// Modal functionality
function openPropertyModal(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    currentModalProperty = property;
    currentImageIndex = 0;

    const price = property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const modalHTML = `
        <div class="modal-gallery">
            <img src="${property.images[0]}" alt="${property.title}">
            <button class="gallery-nav prev" onclick="navigateGallery(-1)">&#10094;</button>
            <button class="gallery-nav next" onclick="navigateGallery(1)">&#10095;</button>
            <div class="gallery-dots">
                ${property.images.map((_, index) => `
                    <button class="gallery-dot ${index === 0 ? 'active' : ''}" onclick="navigateToImage(${index})"></button>
                `).join('')}
            </div>
        </div>
        <div class="modal-details">
            <h2>${property.title}</h2>
            <div class="modal-price">${price}</div>
            <div class="property-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${property.location}</span>
            </div>
            <p class="modal-description">${property.description}</p>
            <div class="modal-specs">
                <div class="spec-item">
                    <i class="fas fa-bed"></i>
                    <span>${property.rooms} Quartos</span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-bath"></i>
                    <span>${property.bathrooms} Banheiros</span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-car"></i>
                    <span>${property.garages} Garagens</span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-ruler-combined"></i>
                    <span>${property.area}m²</span>
                </div>
            </div>
            <div class="modal-features">
                <h3>Características</h3>
                <ul class="features-list">
                    ${property.features.map(feature => `<li><i class="fas fa-check-circle"></i> <span>${feature}</span></li>`).join('')}
                </ul>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="toggleFavorite(${property.id}, event)">
                    <i class="fas fa-heart"></i> ${favorites.some(fav => fav.id === property.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </button>
                <button class="btn btn-secondary" onclick="toggleCompare(${property.id}, event)">
                    <i class="fas fa-balance-scale"></i> ${compareList.some(item => item.id === property.id) ? 'Remover da Comparação' : 'Adicionar à Comparação'}
                </button>
            </div>
        </div>
    `;

    modalBody.innerHTML = modalHTML;
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    currentModalProperty = null;
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

function navigateGallery(direction) {
    if (!currentModalProperty) return;

    currentImageIndex = (currentImageIndex + direction + currentModalProperty.images.length) % currentModalProperty.images.length;

    const modalImg = document.querySelector('.modal-gallery img');
    modalImg.src = currentModalProperty.images[currentImageIndex];

    document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentImageIndex);
    });
}

function navigateToImage(index) {
    currentImageIndex = index;
    const modalImg = document.querySelector('.modal-gallery img');
    modalImg.src = currentModalProperty.images[currentImageIndex];

    document.querySelectorAll('.gallery-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
}

window.openPropertyModal = openPropertyModal;
window.closeModal = closeModal;
window.navigateGallery = navigateGallery;
window.navigateToImage = navigateToImage;
window.toggleFavorite = toggleFavorite;
window.toggleCompare = toggleCompare;

function showCompareModal() {
    const compareModal = document.createElement('div');
    compareModal.className = 'compare-modal';
    compareModal.innerHTML = `
        <div class="compare-content">
            <h2>Comparar Imóveis</h2>
            <div class="compare-grid">
                ${compareList.map(property => {
                    const price = property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    return `
                        <div class="compare-item">
                            <img src="${property.images[0]}" alt="${property.title}">
                            <h4>${property.title}</h4>
                            <p><strong>Preço:</strong> ${price}</p>
                            <p><strong>Localização:</strong> ${property.location}</p>
                            <p><strong>Quartos:</strong> ${property.rooms}</p>
                            <p><strong>Área:</strong> ${property.area}m²</p>
                            <button class="btn btn-secondary" onclick="toggleCompare(${property.id}, event)">
                                <i class="fas fa-times"></i> Remover
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="compare-actions">
                <button class="btn btn-primary" onclick="closeCompareModal()">Fechar Comparação</button>
            </div>
        </div>
    `;

    document.body.appendChild(compareModal);
    compareModal.classList.add('active');

    compareModal.querySelector('.btn-primary').addEventListener('click', closeCompareModal);
}

function closeCompareModal() {
    const compareModal = document.querySelector('.compare-modal');
    if (compareModal) {
        compareModal.classList.remove('active');
        setTimeout(() => compareModal.remove(), 300);
    }
}

window.closeCompareModal = closeCompareModal;

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        alert('Obrigado por entrar em contato! Entraremos em contato em breve.');
        contactForm.reset();
    });
}

// Initialize
initializeTheme();
filteredProperties = [...properties];
updateFavoritesUI();
updateCompareUI();
displayProperties();
