// Global variables
let filteredProperties = JSON.parse(localStorage.getItem('admin_properties')) || [...properties];
let currentModalProperty = null;
let currentImageIndex = 0;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let compareList = JSON.parse(localStorage.getItem('compareList')) || [];
const maxCompareItems = 3;

// Sync properties with localStorage for admin panel
if (!localStorage.getItem('admin_properties')) {
    localStorage.setItem('admin_properties', JSON.stringify([...properties]));
}

// DOM Elements
const propertyGrid = document.getElementById('propertyGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterType = document.getElementById('filterType');
const filterPurpose = document.getElementById('filterPurpose');
const filterPrice = document.getElementById('filterPrice');
const filterRooms = document.getElementById('filterRooms');
const filterSort = document.getElementById('filterSort');
const resetFilters = document.getElementById('resetFilters');
const favoritesToggle = document.getElementById('favoritesToggle');
const favoritesList = document.getElementById('favoritesList');
const favoritesCount = document.getElementById('favoritesCount');
const compareBtn = document.getElementById('compareBtn');
const compareCount = document.getElementById('compareCount');
const modal = document.getElementById('propertyModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const backToTop = document.getElementById('backToTop');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

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

// Mobile menu
if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Back to top button
window.addEventListener('scroll', () => {
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Property card template
function createPropertyCard(property) {
    const price = property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const isFeatured = property.featured ? '<span class="property-badge badge-featured">Destaque</span>' : '';
    const isNew = !property.featured && property.id > 20 ? '<span class="property-badge badge-new">Novo</span>' : '';
    const isFavorite = favorites.some(fav => fav.id === property.id) ? 'favorited' : '';
    const isComparing = compareList.some(item => item.id === property.id) ? 'comparing' : '';

    return `
        <div class="property-card" data-id="${property.id}" onclick="openPropertyModal(${property.id})">
            <div class="property-image">
                <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
                ${isFeatured}
                ${isNew}
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
                    ${property.rooms > 0 ? `<div class="feature"><i class="fas fa-bed"></i><span>${property.rooms}</span></div>` : ''}
                    ${property.bathrooms > 0 ? `<div class="feature"><i class="fas fa-bath"></i><span>${property.bathrooms}</span></div>` : ''}
                    ${property.garages > 0 ? `<div class="feature"><i class="fas fa-car"></i><span>${property.garages}</span></div>` : ''}
                    ${property.area > 0 ? `<div class="feature"><i class="fas fa-ruler-combined"></i><span>${property.area}m²</span></div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Display properties
function displayProperties() {
    if (!propertyGrid) return;

    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = filteredProperties.length;
    }

    if (filteredProperties.length === 0) {
        propertyGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nenhum imóvel encontrado</h3>
                <p>Tente ajustar os filtros ou buscar por outro termo.</p>
            </div>
        `;
        return;
    }

    const html = filteredProperties.map(property => createPropertyCard(property)).join('');
    propertyGrid.innerHTML = html;

    // Show loading effect
    propertyGrid.style.opacity = '0.5';
    setTimeout(() => {
        propertyGrid.style.opacity = '1';
    }, 200);
}

// Filter properties
function filterProperties() {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const type = filterType?.value || 'all';
    const purpose = filterPurpose?.value || 'all';
    const price = filterPrice?.value || 'all';
    const rooms = filterRooms?.value || 'all';
    const sort = filterSort?.value || 'featured';

    const currentProperties = JSON.parse(localStorage.getItem('admin_properties')) || [...properties];

    filteredProperties = currentProperties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm) ||
                            property.location.toLowerCase().includes(searchTerm) ||
                            property.address?.toLowerCase().includes(searchTerm) ||
                            property.description?.toLowerCase().includes(searchTerm);

        const matchesType = type === 'all' || property.type === type;
        const matchesPurpose = purpose === 'all' || property.purpose === purpose;
        const matchesPrice = price === 'all' || property.price <= Number(price);
        const matchesRooms = rooms === 'all' || property.rooms >= Number(rooms);

        return matchesSearch && matchesType && matchesPurpose && matchesPrice && matchesRooms;
    });

    // Sort properties
    switch (sort) {
        case 'price-asc':
            filteredProperties.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProperties.sort((a, b) => b.price - a.price);
            break;
        case 'area-desc':
            filteredProperties.sort((a, b) => b.area - a.area);
            break;
        case 'featured':
        default:
            filteredProperties.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
    }

    displayProperties();
}

// Event listeners
if (searchInput && searchBtn) {
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filterProperties();
        }
    });
    searchBtn.addEventListener('click', filterProperties);
}

if (filterType) filterType.addEventListener('change', filterProperties);
if (filterPurpose) filterPurpose.addEventListener('change', filterProperties);
if (filterPrice) filterPrice.addEventListener('change', filterProperties);
if (filterRooms) filterRooms.addEventListener('change', filterProperties);
if (filterSort) filterSort.addEventListener('change', filterProperties);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (filterType) filterType.value = 'all';
        if (filterPurpose) filterPurpose.value = 'all';
        if (filterPrice) filterPrice.value = 'all';
        if (filterRooms) filterRooms.value = 'all';
        if (filterSort) filterSort.value = 'featured';
        filteredProperties = JSON.parse(localStorage.getItem('admin_properties')) || [...properties];
        displayProperties();
    });
}

// Favorites functionality
function toggleFavorite(propertyId, event) {
    if (event) event.stopPropagation();

    const currentProperties = JSON.parse(localStorage.getItem('admin_properties')) || [...properties];
    const property = currentProperties.find(p => p.id === propertyId);
    const index = favorites.findIndex(fav => fav.id === propertyId);

    if (index === -1) {
        favorites.push(property);
        showToast('Adicionado aos favoritos!', 'success');
    } else {
        favorites.splice(index, 1);
        showToast('Removido dos favoritos', 'info');
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
    favoritesToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        favoritesList.classList.toggle('active');
    });
}

// Close favorites panel when clicking outside
document.addEventListener('click', () => {
    if (favoritesList) {
        favoritesList.classList.remove('active');
    }
});

// Compare functionality
function toggleCompare(propertyId, event) {
    if (event) event.stopPropagation();

    const currentProperties = JSON.parse(localStorage.getItem('admin_properties')) || [...properties];
    const property = currentProperties.find(p => p.id === propertyId);
    const index = compareList.findIndex(item => item.id === propertyId);

    if (index === -1 && compareList.length < maxCompareItems) {
        compareList.push(property);
        showToast('Adicionado à comparação!', 'success');
    } else if (index !== -1) {
        compareList.splice(index, 1);
        showToast('Removido da comparação', 'info');
    } else if (compareList.length >= maxCompareItems) {
        showToast(`Máximo de ${maxCompareItems} imóveis para comparar`, 'error');
        return;
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
    const currentProperties = JSON.parse(localStorage.getItem('admin_properties')) || [...properties];
    const property = currentProperties.find(p => p.id === propertyId);
    if (!property) return;

    currentModalProperty = property;
    currentImageIndex = 0;

    const price = property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const modalHTML = `
        <div class="modal-gallery">
            <img src="${property.images[0]}" alt="${property.title}">
            ${property.images.length > 1 ? `
                <button class="gallery-nav prev" onclick="navigateGallery(-1)">&#10094;</button>
                <button class="gallery-nav next" onclick="navigateGallery(1)">&#10095;</button>
                <div class="gallery-dots">
                    ${property.images.map((_, index) => `
                        <button class="gallery-dot ${index === 0 ? 'active' : ''}" onclick="navigateToImage(${index})"></button>
                    `).join('')}
                </div>
            ` : ''}
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
                ${property.rooms > 0 ? `
                    <div class="spec-item">
                        <i class="fas fa-bed"></i>
                        <span>Quartos</span>
                        <strong>${property.rooms}</strong>
                    </div>
                ` : ''}
                ${property.bathrooms > 0 ? `
                    <div class="spec-item">
                        <i class="fas fa-bath"></i>
                        <span>Banheiros</span>
                        <strong>${property.bathrooms}</strong>
                    </div>
                ` : ''}
                ${property.garages > 0 ? `
                    <div class="spec-item">
                        <i class="fas fa-car"></i>
                        <span>Garagens</span>
                        <strong>${property.garages}</strong>
                    </div>
                ` : ''}
                ${property.area > 0 ? `
                    <div class="spec-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>Área</span>
                        <strong>${property.area}m²</strong>
                    </div>
                ` : ''}
            </div>
            ${property.features && property.features.length > 0 ? `
                <div class="modal-features">
                    <h3>Características</h3>
                    <ul class="features-list">
                        ${property.features.map(feature => `<li><i class="fas fa-check-circle"></i> <span>${feature}</span></li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div class="modal-actions">
                <a href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o imóvel: ${encodeURIComponent(property.title)}" target="_blank" class="btn btn-primary">
                    <i class="fab fa-whatsapp"></i> Agendar Visita
                </a>
                <button class="btn btn-secondary" onclick="toggleFavorite(${property.id}, event)">
                    <i class="fas fa-heart"></i> ${favorites.some(fav => fav.id === property.id) ? 'Remover Favorito' : 'Favoritar'}
                </button>
            </div>
        </div>
    `;

    modalBody.innerHTML = modalHTML;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModalProperty = null;
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function navigateGallery(direction) {
    if (!currentModalProperty) return;

    currentImageIndex = (currentImageIndex + direction + currentModalProperty.images.length) % currentModalProperty.images.length;

    const modalImg = document.querySelector('.modal-gallery img');
    if (modalImg) {
        modalImg.src = currentModalProperty.images[currentImageIndex];
    }

    document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentImageIndex);
    });
}

function navigateToImage(index) {
    currentImageIndex = index;
    const modalImg = document.querySelector('.modal-gallery img');
    if (modalImg && currentModalProperty) {
        modalImg.src = currentModalProperty.images[currentImageIndex];
    }

    document.querySelectorAll('.gallery-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
}

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
        navigateGallery(-1);
    } else if (e.key === 'ArrowRight') {
        navigateGallery(1);
    } else if (e.key === 'Escape') {
        closeModal();
    }
});

window.openPropertyModal = openPropertyModal;
window.closeModal = closeModal;
window.navigateGallery = navigateGallery;
window.navigateToImage = navigateToImage;
window.toggleFavorite = toggleFavorite;
window.toggleCompare = toggleCompare;

function showCompareModal() {
    const compareGrid = document.getElementById('compareGrid');
    if (!compareGrid) return;

    compareGrid.innerHTML = compareList.map(property => {
        const price = property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return `
            <div class="compare-item">
                <img src="${property.images[0]}" alt="${property.title}">
                <h4>${property.title}</h4>
                <p><strong>Preço:</strong> ${price}</p>
                <p><strong>Localização:</strong> ${property.location}</p>
                <p><strong>Quartos:</strong> ${property.rooms}</p>
                <p><strong>Banheiros:</strong> ${property.bathrooms}</p>
                <p><strong>Garagem:</strong> ${property.garages}</p>
                <p><strong>Área:</strong> ${property.area}m²</p>
                <button class="btn btn-secondary btn-sm" onclick="toggleCompare(${property.id}, event)">
                    <i class="fas fa-times"></i> Remover
                </button>
            </div>
        `;
    }).join('');

    document.getElementById('compareModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCompareModalFn() {
    document.getElementById('compareModal').classList.remove('active');
    document.body.style.overflow = '';
}

function clearCompareList() {
    compareList = [];
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareUI();
    closeCompareModalFn();
    displayProperties();
}

if (document.getElementById('closeCompareModal')) {
    document.getElementById('closeCompareModal').addEventListener('click', closeCompareModalFn);
}

if (document.getElementById('clearCompare')) {
    document.getElementById('clearCompare').addEventListener('click', clearCompareList);
}

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            interest: formData.get('interest'),
            property_type: formData.get('property_type'),
            message: formData.get('message'),
            date: new Date().toISOString()
        };

        // Save message to admin messages
        const messages = JSON.parse(localStorage.getItem('admin_messages') || '[]');
        messages.unshift({ ...data, id: Date.now() });
        localStorage.setItem('admin_messages', JSON.stringify(messages));

        alert('Obrigado por entrar em contato! Entraremos em contato em breve.');
        contactForm.reset();
    });
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Simulator functionality
const calculateSimulator = document.getElementById('calculateSimulator');
if (calculateSimulator) {
    calculateSimulator.addEventListener('click', calculateFinancing);
}

const simMonths = document.getElementById('simMonths');
if (simMonths) {
    simMonths.addEventListener('input', () => {
        document.getElementById('simMonthsValue').textContent = `${simMonths.value} meses`;
    });
}

function calculateFinancing() {
    const value = parseFloat(document.getElementById('simValue').value.replace(/\D/g, '')) || 0;
    const entry = parseFloat(document.getElementById('simEntry').value.replace(/\D/g, '')) || 0;
    const months = parseInt(document.getElementById('simMonths').value) || 240;
    const rate = parseFloat(document.getElementById('simRate').value.replace(',', '.')) || 10;

    const financed = value - entry;
    const monthlyRate = rate / 100 / 12;

    if (financed <= 0) {
        alert('O valor financiado deve ser maior que zero.');
        return;
    }

    // SAC formula (simplified)
    const monthlyPayment = financed * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - financed;

    document.getElementById('financedValue').textContent = financed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('monthlyPayment').textContent = monthlyPayment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('totalPayment').textContent = totalPayment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('totalInterest').textContent = totalInterest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Initialize
initializeTheme();
filteredProperties = JSON.parse(localStorage.getItem('admin_properties')) || [...properties];
updateFavoritesUI();
updateCompareUI();
displayProperties();
loadTestimonials();
loadSettings();

// Run simulator with default values on load
if (document.getElementById('simValue')) {
    setTimeout(calculateFinancing, 500);
}

// Check for property changes from admin panel periodically
setInterval(() => {
    const newProperties = JSON.parse(localStorage.getItem('admin_properties')) || [...properties];
    if (JSON.stringify(newProperties) !== JSON.stringify(filteredProperties)) {
        filteredProperties = newProperties;
        displayProperties();
    }
    loadSettings();
}, 2000);

// Load testimonials from admin panel
function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;

    const testimonials = JSON.parse(localStorage.getItem('admin_testimonials')) || [
        { id: 1, name: 'Maria Silva', city: 'São Paulo - SP', text: 'Atendimento excepcional! Encontrei meu apartamento dos sonhos em menos de uma semana. Recomendo a todos!', rating: 5 },
        { id: 2, name: 'João Santos', city: 'Campinas - SP', text: 'Profissionalismo nota 10! A equipe da ImobPrime me ajudou a vender meu imóvel pelo melhor preço.', rating: 5 },
        { id: 3, name: 'Ana Costa', city: 'Santos - SP', text: 'Já é a terceira vez que compro um imóvel com a ImobPrime. São sempre muito atenciosos e corretos.', rating: 4 }
    ];

    testimonialsGrid.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-stars">
                ${'<i class="fas fa-star"></i>'.repeat(t.rating)}${'<i class="far fa-star"></i>'.repeat(5 - t.rating)}
            </div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-author">
                <div class="author-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="author-info">
                    <strong>${t.name}</strong>
                    <span>${t.city}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load settings from admin panel
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    if (!settings) return;

    const companyName = document.getElementById('companyName');
    const contactAddress = document.getElementById('contactAddress');
    const contactPhone = document.getElementById('contactPhone');
    const contactEmail = document.getElementById('contactEmail');
    const footerCompanyName = document.getElementById('footerCompanyName');
    const whatsappFloatLink = document.querySelector('.whatsapp-float a');
    const whatsappBtn = document.querySelector('.social-btn.whatsapp');

    if (companyName) companyName.textContent = settings.companyName || 'ImobPrime';
    if (footerCompanyName) footerCompanyName.textContent = settings.companyName || 'ImobPrime';
    if (contactAddress) contactAddress.innerHTML = (settings.companyAddress || '').replace(',', '<br>');
    if (contactPhone) contactPhone.textContent = settings.companyPhone || '';
    if (contactEmail) contactEmail.textContent = settings.companyEmail || '';
    if (whatsappFloatLink && settings.companyWhatsapp) {
        whatsappFloatLink.href = `https://wa.me/${settings.companyWhatsapp}`;
    }
    if (whatsappBtn && settings.companyWhatsapp) {
        whatsappBtn.href = `https://wa.me/${settings.companyWhatsapp}`;
    }

    if (settings.primaryColor) {
        document.documentElement.style.setProperty('--primary', settings.primaryColor);
    }
    if (settings.secondaryColor) {
        document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
    }
}
