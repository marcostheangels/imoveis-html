// Admin JavaScript - Painel Administrativo Neo Imóveis e Negócios

// State Management
let adminState = {
    properties: JSON.parse(localStorage.getItem('admin_properties')) || [...properties],
    testimonials: JSON.parse(localStorage.getItem('admin_testimonials')) || [],
    messages: JSON.parse(localStorage.getItem('admin_messages')) || [],
    settings: JSON.parse(localStorage.getItem('admin_settings')) || {
        companyName: 'Neo Imóveis e Negócios',
        companyPhone: '(11) 9999-9999',
        companyAddress: 'Av. Paulista, 1000, São Paulo - SP',
        companyEmail: 'contato@imobprime.com',
        companyWhatsapp: '5511999999999',
        socialFacebook: '',
        socialInstagram: '',
        socialYoutube: '',
        socialLinkedin: '',
        primaryColor: '#2c3e50',
        secondaryColor: '#3498db',
        defaultTheme: 'modern'
    },
    currentSection: 'dashboard',
    editingPropertyId: null,
    uploadedImages: JSON.parse(localStorage.getItem('uploaded_images')) || []
};

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const navItems = document.querySelectorAll('.nav-item');
const adminSections = document.querySelectorAll('.admin-section');
const sectionTitle = document.getElementById('sectionTitle');
const sectionSubtitle = document.getElementById('sectionSubtitle');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
    setupEventListeners();
    loadSettings();
    updateDashboard();
    updateGithubStatus();
});

function updateGithubStatus() {
    const statusText = document.getElementById('githubStatusText');
    const statusDiv = document.getElementById('githubStatus');
    if (!statusText || !statusDiv) return;

    if (isGithubConfigured()) {
        statusText.textContent = 'Token Configurado ✓';
        statusText.style.color = 'var(--success, green)';
        statusDiv.innerHTML = '<span style="color: var(--success, green);">● Auto-deploy ativo - todas as alterações serão publicadas automaticamente</span>';
    } else {
        statusText.textContent = 'Configurar Token GitHub';
        statusText.style.color = '';
        statusDiv.innerHTML = '<span style="color: var(--text-light);">● Auto-deploy inativo - clique em "Configurar Token" para ativar</span>';
    }
}

function initializeAdmin() {
    // Ensure testimonials has default data if empty
    if (adminState.testimonials.length === 0) {
        adminState.testimonials = [
            {
                id: 1,
                name: 'Maria Silva',
                city: 'São Paulo - SP',
                text: 'Atendimento excepcional! Encontrei meu apartamento dos sonhos em menos de uma semana. Recomendo a todos!',
                rating: 5
            },
            {
                id: 2,
                name: 'João Santos',
                city: 'Campinas - SP',
                text: 'Profissionalismo nota 10! A equipe da Neo Imóveis e Negócios me ajudou a vender meu imóvel pelo melhor preço.',
                rating: 5
            },
            {
                id: 3,
                name: 'Ana Costa',
                city: 'Santos - SP',
                text: 'Já é a terceira vez que compro um imóvel com a Neo Imóveis e Negócios. São sempre muito atenciosos e corretos.',
                rating: 4
            }
        ];
        saveState();
    }
}

function setupEventListeners() {
    // Sidebar Toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            if (section) {
                navigateToSection(section);
            }
        });
    });

    // Property Form
    document.getElementById('propertyForm').addEventListener('submit', handlePropertySubmit);
    document.getElementById('clearForm').addEventListener('click', clearPropertyForm);

    // Image Upload
    setupImageUpload();

    // Testimonial Modal
    document.getElementById('addTestimonialBtn').addEventListener('click', openTestimonialModal);
    document.getElementById('testimonialForm').addEventListener('submit', handleTestimonialSubmit);
    setupStarRating();

    // Settings Form
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSubmit);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('importDataBtn').addEventListener('click', () => {
        document.getElementById('importFileInput').click();
    });
    document.getElementById('importFileInput').addEventListener('change', importData);
    document.getElementById('clearAllDataBtn').addEventListener('click', clearAllData);

    // Clear Messages
    document.getElementById('clearMessagesBtn').addEventListener('click', clearAllMessages);

    // Search Properties
    document.getElementById('searchProperties').addEventListener('input', filterPropertiesTable);

    // Filter Buttons
    document.querySelectorAll('.filter-buttons .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-buttons .btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterPropertiesTable();
        });
    });

    // Compare Modal
    const closeCompareModalEl = document.getElementById('closeCompareModal');
    const clearCompareEl = document.getElementById('clearCompare');
    if (closeCompareModalEl) closeCompareModalEl.addEventListener('click', closeCompareModalFn);
    if (clearCompareEl) clearCompareEl.addEventListener('click', clearCompareList);
}

function navigateToSection(sectionId) {
    // Update nav items
    navItems.forEach(item => item.classList.remove('active'));
    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) activeNavItem.classList.add('active');

    // Update sections
    adminSections.forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    // Update header
    const titles = {
        dashboard: { title: 'Dashboard', subtitle: 'Visão geral do sistema' },
        properties: { title: 'Gerenciar Imóveis', subtitle: 'Lista de todos os imóveis cadastrados' },
        'add-property': { title: 'Adicionar/Editar Imóvel', subtitle: 'Cadastre um novo imóvel ou edite existente' },
        uploads: { title: 'Upload de Imagens', subtitle: 'Gerencie suas imagens' },
        testimonials: { title: 'Depoimentos', subtitle: 'Gerencie os depoimentos dos clientes' },
        contacts: { title: 'Mensagens', subtitle: 'Mensagens recebidas do formulário de contato' },
        settings: { title: 'Configurações', subtitle: 'Personalize seu site' }
    };

    const titleData = titles[sectionId] || { title: sectionId, subtitle: '' };
    sectionTitle.textContent = titleData.title;
    sectionSubtitle.textContent = titleData.subtitle;

    // Load section data
    switch (sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'properties':
            renderPropertiesTable();
            break;
        case 'testimonials':
            renderTestimonials();
            break;
        case 'contacts':
            renderContacts();
            break;
        case 'settings':
            updateGithubStatus();
            break;
    }
}

// Navigation function for HTML
window.navigateToSection = navigateToSection;

// ============ DASHBOARD ============
function updateDashboard() {
    document.getElementById('totalProperties').textContent = adminState.properties.length;
    document.getElementById('totalViews').textContent = (Math.floor(Math.random() * 5000) + 1000);
    document.getElementById('totalFavorites').textContent = JSON.parse(localStorage.getItem('favorites') || '[]').length;
    document.getElementById('totalMessages').textContent = adminState.messages.length;

    // Update messages badge
    const messagesBadge = document.getElementById('messagesBadge');
    if (messagesBadge) {
        messagesBadge.textContent = adminState.messages.length;
    }

    // Recent Properties
    const recentProperties = adminState.properties.slice(0, 5);
    const recentHtml = recentProperties.map(prop => `
        <div class="recent-item">
            <img src="${prop.images[0] || 'https://via.placeholder.com/50'}" alt="${prop.title}">
            <div class="recent-item-info">
                <h4>${prop.title}</h4>
                <p>${prop.location}</p>
            </div>
        </div>
    `).join('');
    document.getElementById('recentProperties').innerHTML = recentHtml || '<p>Nenhum imóvel cadastrado</p>';

    // Recent Messages
    const recentMessages = adminState.messages.slice(0, 5);
    const messagesHtml = recentMessages.map(msg => `
        <div class="recent-item">
            <div class="recent-item-info">
                <h4>${msg.name}</h4>
                <p>${msg.email}</p>
            </div>
        </div>
    `).join('');
    document.getElementById('recentMessages').innerHTML = messagesHtml || '<p>Nenhuma mensagem</p>';

    // Charts
    setTimeout(() => {
        renderCharts();
    }, 100);
}

function renderCharts() {
    const typeCanvas = document.getElementById('typeChart');
    const purposeCanvas = document.getElementById('purposeChart');

    if (typeCanvas && purposeCanvas) {
        const ctx1 = typeCanvas.getContext('2d');
        const ctx2 = purposeCanvas.getContext('2d');

        // Count by type
        const types = { apartamento: 0, casa: 0, terreno: 0, comercial: 0 };
        adminState.properties.forEach(p => types[p.type]++);

        // Count by purpose
        const purposes = { venda: 0, aluguel: 0 };
        adminState.properties.forEach(p => purposes[p.purpose]++);

        // Simple bar chart using divs (Chart.js not loaded)
        renderSimpleChart('typeChart', types);
        renderSimpleChart('purposeChart', purposes);
    }
}

function renderSimpleChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const colors = {
        apartamento: '#3498db',
        casa: '#27ae60',
        terreno: '#f39c12',
        comercial: '#9b59b6',
        venda: '#e74c3c',
        aluguel: '#3498db'
    };

    const max = Math.max(...Object.values(data), 1);

    container.innerHTML = Object.entries(data).map(([key, value]) => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <div style="width: 100px; font-size: 0.85rem; text-transform: capitalize;">${key}</div>
            <div style="flex: 1; background: #eee; border-radius: 5px; height: 25px; overflow: hidden;">
                <div style="width: ${(value/max)*100}%; background: ${colors[key] || '#3498db'}; height: 100%; border-radius: 5px;"></div>
            </div>
            <div style="width: 30px; font-size: 0.85rem; font-weight: 600;">${value}</div>
        </div>
    `).join('');
}

// ============ PROPERTIES ============
function renderPropertiesTable(filter = 'all', search = '') {
    const tbody = document.getElementById('propertiesTableBody');
    let filtered = adminState.properties;

    if (filter !== 'all') {
        filtered = filtered.filter(p => p.type === filter);
    }

    if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(term) ||
            p.location.toLowerCase().includes(term)
        );
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    Nenhum imóvel encontrado
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(prop => {
        const price = prop.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return `
            <tr>
                <td><img src="${prop.images[0] || 'https://via.placeholder.com/80x60'}" alt="${prop.title}"></td>
                <td class="property-title-cell">${prop.title}</td>
                <td><span class="type-badge">${prop.type}</span></td>
                <td>${price}</td>
                <td><span class="purpose-badge ${prop.purpose}">${prop.purpose === 'venda' ? 'Venda' : 'Aluguel'}</span></td>
                <td>
                    <div class="property-actions">
                        <button class="view-btn" onclick="viewProperty(${prop.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="edit-btn" onclick="editProperty(${prop.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="deleteProperty(${prop.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterPropertiesTable() {
    const search = document.getElementById('searchProperties').value;
    const activeFilter = document.querySelector('.filter-buttons .btn.active');
    const filter = activeFilter ? activeFilter.dataset.filter : 'all';
    renderPropertiesTable(filter, search);
}

function editProperty(id) {
    const property = adminState.properties.find(p => p.id === id);
    if (!property) return;

    adminState.editingPropertyId = id;

    const form = document.getElementById('propertyForm');
    form.title.value = property.title;
    form.type.value = property.type;
    form.purpose.value = property.purpose;
    form.price.value = property.price;
    form.rooms.value = property.rooms || 0;
    form.bathrooms.value = property.bathrooms || 0;
    form.garages.value = property.garages || 0;
    form.area.value = property.area || 0;
    form.location.value = property.location;
    form.address.value = property.address || '';
    form.description.value = property.description;
    form.featured.checked = property.featured || false;

    // Set images for new upload system
    propertyImagesList = property.images ? [...property.images] : [];
    renderPropertyImageGrid();

    // Set features checkboxes
    if (property.features) {
        document.querySelectorAll('#featuresCheckboxes input[type="checkbox"]').forEach(cb => {
            cb.checked = property.features.includes(cb.value);
        });
    }

    navigateToSection('add-property');
    showToast('Editando: ' + property.title);
}

function deleteProperty(id) {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;

    adminState.properties = adminState.properties.filter(p => p.id !== id);
    saveState();
    renderPropertiesTable();
    showToast('Imóvel excluído com sucesso!', 'error');
}

function viewProperty(id) {
    const property = adminState.properties.find(p => p.id === id);
    if (!property) return;

    const modal = document.getElementById('propertyModal');
    const gallery = document.getElementById('propertyModalGallery');
    const details = document.getElementById('propertyModalDetails');

    const price = property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Gallery
    let galleryHtml = `<img src="${property.images[0]}" alt="${property.title}">`;
    if (property.images.length > 1) {
        galleryHtml += `
            <button class="gallery-nav prev" onclick="navigateGalleryModal(-1)">&#10094;</button>
            <button class="gallery-nav next" onclick="navigateGalleryModal(1)">&#10095;</button>
            <div class="gallery-dots">
                ${property.images.map((_, i) => `<button class="gallery-dot ${i === 0 ? 'active' : ''}" onclick="navigateToImageModal(${i})"></button>`).join('')}
            </div>
        `;
    }
    gallery.innerHTML = galleryHtml;

    // Details
    let specsHtml = '';
    if (property.rooms > 0) specsHtml += `<div class="spec-item"><i class="fas fa-bed"></i><span>Quartos</span><strong>${property.rooms}</strong></div>`;
    if (property.bathrooms > 0) specsHtml += `<div class="spec-item"><i class="fas fa-bath"></i><span>Banheiros</span><strong>${property.bathrooms}</strong></div>`;
    if (property.garages > 0) specsHtml += `<div class="spec-item"><i class="fas fa-car"></i><span>Garagens</span><strong>${property.garages}</strong></div>`;
    if (property.area > 0) specsHtml += `<div class="spec-item"><i class="fas fa-ruler-combined"></i><span>Área</span><strong>${property.area}m²</strong></div>`;

    let featuresHtml = '';
    if (property.features && property.features.length > 0) {
        featuresHtml = '<div class="features-list">' + property.features.map(f => `<span class="feature-tag">${f}</span>`).join('') + '</div>';
    }

    details.innerHTML = `
        <h2>${property.title}</h2>
        <div class="price">${price}</div>
        <div class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</div>
        <p class="description">${property.description}</p>
        ${specsHtml ? `<div class="specs">${specsHtml}</div>` : ''}
        ${featuresHtml}
    `;

    // Store current property and image index for navigation
    window.currentModalProperty = property;
    window.currentModalImageIndex = 0;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePropertyModal() {
    document.getElementById('propertyModal').classList.remove('active');
    document.body.style.overflow = '';
    window.currentModalProperty = null;
}

function navigateGalleryModal(direction) {
    if (!window.currentModalProperty) return;
    const len = window.currentModalProperty.images.length;
    window.currentModalImageIndex = (window.currentModalImageIndex + direction + len) % len;
    updateModalImage();
}

function navigateToImageModal(index) {
    window.currentModalImageIndex = index;
    updateModalImage();
}

function updateModalImage() {
    const gallery = document.getElementById('propertyModalGallery');
    const img = gallery.querySelector('img');
    if (img && window.currentModalProperty) {
        img.src = window.currentModalProperty.images[window.currentModalImageIndex];
    }
    // Update dots
    gallery.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === window.currentModalImageIndex);
    });
}

window.closePropertyModal = closePropertyModal;
window.navigateGalleryModal = navigateGalleryModal;
window.navigateToImageModal = navigateToImageModal;

function handlePropertySubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Get features
    const features = [];
    document.querySelectorAll('#featuresCheckboxes input[type="checkbox"]:checked').forEach(cb => {
        features.push(cb.value);
    });

    // Get images from the new upload system
    const images = propertyImagesList.length > 0 ? propertyImagesList : ['https://via.placeholder.com/800x600'];

    const propertyData = {
        id: adminState.editingPropertyId || Date.now(),
        title: form.title.value,
        type: form.type.value,
        purpose: form.purpose.value,
        price: parseFloat(String(form.price.value).replace(/\D/g, '')) || 0,
        rooms: parseInt(form.rooms.value) || 0,
        bathrooms: parseInt(form.bathrooms.value) || 0,
        garages: parseInt(form.garages.value) || 0,
        area: parseInt(form.area.value) || 0,
        location: form.location.value,
        address: form.address.value,
        description: form.description.value,
        features: features,
        images: images,
        featured: form.featured.checked
    };

    if (adminState.editingPropertyId) {
        // Update existing
        const index = adminState.properties.findIndex(p => p.id === adminState.editingPropertyId);
        if (index !== -1) {
            adminState.properties[index] = propertyData;
        }
        showToast('Imóvel atualizado com sucesso!');
    } else {
        // Add new
        adminState.properties.unshift(propertyData);
        showToast('Imóvel cadastrado com sucesso!');
    }

    saveState();
    clearPropertyForm();
    navigateToSection('properties');
}

function clearPropertyForm() {
    const form = document.getElementById('propertyForm');
    form.reset();
    adminState.editingPropertyId = null;
    propertyImagesList = [];
    renderPropertyImageGrid();
}

// ============ IMAGE UPLOAD ============
let propertyImagesList = [];

function setupImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');

    if (uploadArea && imageUpload) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--secondary)';
            uploadArea.style.background = 'rgba(52, 152, 219, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border)';
            uploadArea.style.background = 'none';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border)';
            handleFiles(e.dataTransfer.files);
        });

        imageUpload.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }

    // Large upload area
    const uploadAreaLarge = document.getElementById('uploadAreaLarge');
    const multipleImageUpload = document.getElementById('multipleImageUpload');

    if (uploadAreaLarge && multipleImageUpload) {
        uploadAreaLarge.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadAreaLarge.style.borderColor = 'var(--secondary)';
            uploadAreaLarge.style.background = 'rgba(52, 152, 219, 0.1)';
        });

        uploadAreaLarge.addEventListener('dragleave', () => {
            uploadAreaLarge.style.borderColor = 'var(--secondary)';
            uploadAreaLarge.style.background = 'rgba(52, 152, 219, 0.02)';
        });

        uploadAreaLarge.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadAreaLarge.style.borderColor = 'var(--secondary)';
            uploadAreaLarge.style.background = 'rgba(52, 152, 219, 0.02)';
            handleFiles(e.dataTransfer.files);
        });

        multipleImageUpload.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }

    // Property images upload (new simplified version)
    const addMoreImages = document.getElementById('addMoreImages');
    const propertyImagesInput = document.getElementById('propertyImages');

    if (addMoreImages && propertyImagesInput) {
        addMoreImages.addEventListener('click', () => {
            propertyImagesInput.click();
        });

        propertyImagesInput.addEventListener('change', (e) => {
            handlePropertyImageUpload(e.target.files);
        });
    }
}

function handlePropertyImageUpload(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) {
            showToast(`Arquivo muito grande: ${file.name}`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            propertyImagesList.push(imageData);
            renderPropertyImageGrid();
        };
        reader.readAsDataURL(file);
    });
}

function renderPropertyImageGrid() {
    const grid = document.getElementById('imageUploadGrid');
    if (!grid) return;

    let html = '';

    propertyImagesList.forEach((img, index) => {
        html += `
            <div class="image-upload-item">
                <img src="${img}" alt="Imagem ${index + 1}">
                <button class="remove-btn" onclick="removePropertyImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });

    html += `
        <div class="image-upload-item add-more" id="addMoreImages">
            <i class="fas fa-plus"></i>
            <span>Adicionar Fotos</span>
            <input type="file" id="propertyImages" multiple accept="image/*" style="display: none;">
        </div>
    `;

    grid.innerHTML = html;

    // Reattach event listener to new element
    const newAddMoreImages = document.getElementById('addMoreImages');
    const newPropertyImagesInput = document.getElementById('propertyImages');
    if (newAddMoreImages && newPropertyImagesInput) {
        newAddMoreImages.addEventListener('click', () => {
            newPropertyImagesInput.click();
        });
        newPropertyImagesInput.addEventListener('change', (e) => {
            handlePropertyImageUpload(e.target.files);
        });
    }

    // Update textarea with image URLs
    const imagesUrls = document.getElementById('imagesUrls');
    if (imagesUrls) {
        imagesUrls.value = propertyImagesList.join('\n');
    }
}

function removePropertyImage(index) {
    propertyImagesList.splice(index, 1);
    renderPropertyImageGrid();
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) {
            showToast(`Arquivo muito grande: ${file.name}`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                id: Date.now() + Math.random(),
                name: file.name,
                data: e.target.result
            };
            adminState.uploadedImages.push(imageData);
            saveState();
            renderUploadedImages();
        };
        reader.readAsDataURL(file);
    });
}

function renderUploadedImages() {
    const container = document.getElementById('uploadedImages');
    const gallery = document.getElementById('uploadedGallery');

    if (container) {
        container.innerHTML = adminState.uploadedImages.map(img => `
            <div class="uploaded-image">
                <img src="${img.data}" alt="${img.name}">
                <button class="remove-btn" onclick="removeImage('${img.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    if (gallery) {
        gallery.innerHTML = adminState.uploadedImages.map(img => `
            <div class="gallery-item" onclick="copyImageUrl('${img.data}')">
                <img src="${img.data}" alt="${img.name}">
                <div class="gallery-overlay">
                    <i class="fas fa-copy"></i> Copiar URL
                </div>
            </div>
        `).join('');
    }
}

function removeImage(id) {
    adminState.uploadedImages = adminState.uploadedImages.filter(img => img.id !== id);
    saveState();
    renderUploadedImages();
    showToast('Imagem removida', 'error');
}

function copyImageUrl(dataUrl) {
    // Create a temporary input to copy the data URL
    const input = document.createElement('input');
    input.value = dataUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('URL da imagem copiada!');
}

// ============ TESTIMONIALS ============
function renderTestimonials() {
    const container = document.getElementById('testimonialsList');

    if (adminState.testimonials.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-light);">Nenhum depoimento cadastrado</p>';
        return;
    }

    container.innerHTML = adminState.testimonials.map(t => `
        <div class="testimonial-item">
            <div class="stars">
                ${'<i class="fas fa-star"></i>'.repeat(t.rating)}${'<i class="far fa-star"></i>'.repeat(5 - t.rating)}
            </div>
            <p class="text">"${t.text}"</p>
            <div class="author">
                <div class="author-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="author-info">
                    <strong>${t.name}</strong>
                    <span>${t.city}</span>
                </div>
            </div>
            <div class="actions">
                <button class="btn btn-sm btn-secondary" onclick="editTestimonial(${t.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTestimonial(${t.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openTestimonialModal(id = null) {
    const modal = document.getElementById('testimonialModal');
    const title = document.getElementById('testimonialModalTitle');
    const form = document.getElementById('testimonialForm');

    if (id) {
        const testimonial = adminState.testimonials.find(t => t.id === id);
        if (testimonial) {
            title.textContent = 'Editar Depoimento';
            document.getElementById('testimonialId').value = testimonial.id;
            document.getElementById('testimonialName').value = testimonial.name;
            document.getElementById('testimonialCity').value = testimonial.city;
            document.getElementById('testimonialText').value = testimonial.text;
            document.getElementById('testimonialRating').value = testimonial.rating;
            updateStarRating(testimonial.rating);
        }
    } else {
        title.textContent = 'Adicionar Depoimento';
        form.reset();
        document.getElementById('testimonialId').value = '';
        updateStarRating(5);
    }

    modal.classList.add('active');
}

function closeTestimonialModal() {
    document.getElementById('testimonialModal').classList.remove('active');
}

function setupStarRating() {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            document.getElementById('testimonialRating').value = rating;
            updateStarRating(rating);
        });
    });
}

function updateStarRating(rating) {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function editTestimonial(id) {
    openTestimonialModal(id);
}

function deleteTestimonial(id) {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) return;
    adminState.testimonials = adminState.testimonials.filter(t => t.id !== id);
    saveState();
    renderTestimonials();
    showToast('Depoimento excluído!', 'error');
}

function handleTestimonialSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('testimonialId').value;
    const data = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('testimonialName').value,
        city: document.getElementById('testimonialCity').value,
        text: document.getElementById('testimonialText').value,
        rating: parseInt(document.getElementById('testimonialRating').value)
    };

    if (id) {
        const index = adminState.testimonials.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
            adminState.testimonials[index] = data;
        }
    } else {
        adminState.testimonials.push(data);
    }

    saveState();
    closeTestimonialModal();
    renderTestimonials();
    showToast('Depoimento salvo com sucesso!');
}

// ============ CONTACTS / MESSAGES ============
function renderContacts() {
    const container = document.getElementById('contactsList');

    if (adminState.messages.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-light);">Nenhuma mensagem recebida</p>';
        return;
    }

    container.innerHTML = adminState.messages.map(msg => `
        <div class="contact-item">
            <div class="contact-icon">
                <i class="fas fa-user"></i>
            </div>
            <div class="contact-info">
                <h4>${msg.name}</h4>
                <p>${msg.message || msg.text || 'Sem mensagem'}</p>
                <div class="meta">
                    <span><i class="fas fa-envelope"></i> ${msg.email}</span>
                    <span><i class="fas fa-phone"></i> ${msg.phone || 'Não informado'}</span>
                    <span><i class="fas fa-tag"></i> ${msg.interest || msg.type || 'Geral'}</span>
                </div>
            </div>
            <div class="actions">
                <a href="https://wa.me/${msg.phone ? msg.phone.replace(/\D/g, '') : '5511999999999'}" target="_blank" class="btn btn-sm btn-primary">
                    <i class="fab fa-whatsapp"></i>
                </a>
                <button class="btn btn-sm btn-danger" onclick="deleteMessage(${msg.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteMessage(id) {
    adminState.messages = adminState.messages.filter(m => m.id !== id);
    saveState();
    renderContacts();
    showToast('Mensagem excluída!', 'error');
}

function clearAllMessages() {
    if (!confirm('Tem certeza que deseja excluir todas as mensagens?')) return;
    adminState.messages = [];
    saveState();
    renderContacts();
    showToast('Todas as mensagens foram excluídas!', 'error');
}

// ============ SETTINGS ============
function loadSettings() {
    const s = adminState.settings;
    document.getElementById('companyName').value = s.companyName;
    document.getElementById('companyPhone').value = s.companyPhone;
    document.getElementById('companyAddress').value = s.companyAddress;
    document.getElementById('companyEmail').value = s.companyEmail;
    document.getElementById('companyWhatsapp').value = s.companyWhatsapp;
    document.getElementById('socialFacebook').value = s.socialFacebook;
    document.getElementById('socialInstagram').value = s.socialInstagram;
    document.getElementById('socialYoutube').value = s.socialYoutube;
    document.getElementById('socialLinkedin').value = s.socialLinkedin;
    document.getElementById('primaryColor').value = s.primaryColor;
    document.getElementById('secondaryColor').value = s.secondaryColor;
    document.getElementById('defaultTheme').value = s.defaultTheme;
}

function handleSettingsSubmit(e) {
    e.preventDefault();

    adminState.settings = {
        companyName: document.getElementById('companyName').value,
        companyPhone: document.getElementById('companyPhone').value,
        companyAddress: document.getElementById('companyAddress').value,
        companyEmail: document.getElementById('companyEmail').value,
        companyWhatsapp: document.getElementById('companyWhatsapp').value,
        socialFacebook: document.getElementById('socialFacebook').value,
        socialInstagram: document.getElementById('socialInstagram').value,
        socialYoutube: document.getElementById('socialYoutube').value,
        socialLinkedin: document.getElementById('socialLinkedin').value,
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        defaultTheme: document.getElementById('defaultTheme').value
    };

    saveState();
    showToast('Configurações salvas com sucesso!');

    // Apply settings to main site
    applySettingsToSite();
}

function applySettingsToSite() {
    // Update WhatsApp links
    const whatsappLinks = document.querySelectorAll('.whatsapp-float a, .social-btn.whatsapp');
    const whatsapp = adminState.settings.companyWhatsapp;
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${whatsapp}`;
    });

    // Update contact info in footer
    const contactAddress = document.getElementById('contactAddress');
    const contactPhone = document.getElementById('contactPhone');
    const contactEmail = document.getElementById('contactEmail');

    if (contactAddress) {
        contactAddress.innerHTML = adminState.settings.companyAddress.replace(',', '<br>');
    }
    if (contactPhone) {
        contactPhone.textContent = adminState.settings.companyPhone;
    }
    if (contactEmail) {
        contactEmail.textContent = adminState.settings.companyEmail;
    }
}

function exportData() {
    const data = {
        properties: adminState.properties,
        testimonials: adminState.testimonials,
        messages: adminState.messages,
        settings: adminState.settings,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imobprime_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dados exportados com sucesso!');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.properties) adminState.properties = data.properties;
            if (data.testimonials) adminState.testimonials = data.testimonials;
            if (data.messages) adminState.messages = data.messages;
            if (data.settings) adminState.settings = { ...adminState.settings, ...data.settings };

            saveState();
            loadSettings();
            updateDashboard();
            showToast('Dados importados com sucesso!');

            // Refresh current section
            navigateToSection(adminState.currentSection);
        } catch (err) {
            showToast('Erro ao importar arquivo!', 'error');
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    if (!confirm('ATENÇÃO: Isso excluirá TODOS os dados! Imóveis, mensagens e configurações serão apagados. Continuar?')) return;
    if (!confirm('Tem certeza absoluta? Esta ação não pode ser desfeita!')) return;

    localStorage.clear();
    adminState = {
        properties: [...properties],
        testimonials: [],
        messages: [],
        settings: {
            companyName: 'Neo Imóveis e Negócios',
            companyPhone: '(11) 9999-9999',
            companyAddress: 'Av. Paulista, 1000, São Paulo - SP',
            companyEmail: 'contato@imobprime.com',
            companyWhatsapp: '5511999999999',
            socialFacebook: '',
            socialInstagram: '',
            socialYoutube: '',
            socialLinkedin: '',
            primaryColor: '#2c3e50',
            secondaryColor: '#3498db',
            defaultTheme: 'modern'
        },
        uploadedImages: []
    };

    saveState();
    loadSettings();
    updateDashboard();
    showToast('Todos os dados foram apagados!', 'error');
}

// ============ UTILITIES ============
function saveState() {
    localStorage.setItem('admin_properties', JSON.stringify(adminState.properties));
    localStorage.setItem('admin_testimonials', JSON.stringify(adminState.testimonials));
    localStorage.setItem('admin_messages', JSON.stringify(adminState.messages));
    localStorage.setItem('admin_settings', JSON.stringify(adminState.settings));
    localStorage.setItem('uploaded_images', JSON.stringify(adminState.uploadedImages));
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = 'toast';
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'info') {
        toast.classList.add('info');
    }
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Compare modal functions
function closeCompareModalFn() {
    document.getElementById('compareModal').classList.remove('active');
}

function clearCompareList() {
    compareList = [];
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareUI();
    closeCompareModalFn();
    showToast('Lista de comparação limpa!');
}

// Initialize uploaded images display when uploads section is shown
const uploadsNavItem = document.querySelector('[data-section="uploads"]');
if (uploadsNavItem) {
    uploadsNavItem.addEventListener('click', () => {
        setTimeout(renderUploadedImages, 100);
    });
}

// Make functions globally available
window.editProperty = editProperty;
window.deleteProperty = deleteProperty;
window.viewProperty = viewProperty;
window.removeImage = removeImage;
window.removePropertyImage = removePropertyImage;
window.copyImageUrl = copyImageUrl;
window.editTestimonial = editTestimonial;
window.deleteTestimonial = deleteTestimonial;
window.openTestimonialModal = openTestimonialModal;
window.closeTestimonialModal = closeTestimonialModal;
window.deleteMessage = deleteMessage;
window.closeCompareModalFn = closeCompareModalFn;
window.clearCompareList = clearCompareList;

// ============ GITHUB AUTO-DEPLOY ============
const GITHUB_CONFIG = {
    owner: 'marcostheangels',
    repo: 'imoveis-html',
    branch: 'master'
};

function btoa_encrypt(text) {
    return btoa(unescape(encodeURIComponent(text)));
}

function atob_decrypt(encoded) {
    return decodeURIComponent(escape(atob(encoded)));
}

function getGithubToken() {
    const encoded = localStorage.getItem('gh_token_encrypted');
    if (encoded) {
        try {
            return atob_decrypt(encoded);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function saveGithubToken(token) {
    const encoded = btoa_encrypt(token);
    localStorage.setItem('gh_token_encrypted', encoded);
}

function isGithubConfigured() {
    return !!getGithubToken();
}

function promptGithubToken() {
    const token = prompt('Digite seu GitHub Personal Access Token (PAT):\n\nPara criar um token:\n1. Vá em GitHub → Settings → Developer settings\n2. Personal access tokens → Generate new token\n3. Selecione "repo" como escopo\n4. Copie o token e cole aqui');
    if (token) {
        saveGithubToken(token);
        showToast('Token GitHub salvo com sucesso!', 'success');
        return true;
    }
    return false;
}

async function deployToGithub() {
    if (!isGithubConfigured()) {
        const configured = promptGithubToken();
        if (!configured) {
            showToast('Deploy cancelado - token não configurado', 'error');
            return;
        }
    }

    const token = getGithubToken();
    showToast('Publicando no GitHub...', 'info');

    try {
        const files = ['index.html', 'admin.html', 'css/styles.css', 'css/themes.css', 'css/admin.css', 'js/data.js', 'js/main.js', 'js/admin.js'];
        const results = [];

        for (const file of files) {
            const content = await fetch(file).then(r => r.text());
            const path = file;

            const sha = await getFileSha(path, token);

            const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Update ${path} via admin panel - ${new Date().toLocaleString('pt-BR')}`,
                    content: btoa_encrypt(content),
                    branch: GITHUB_CONFIG.branch,
                    sha: sha
                })
            });

            if (response.ok) {
                results.push(`✓ ${path}`);
            } else {
                const error = await response.json();
                if (error.message === 'This file exists in the file system') {
                    showToast('Erro: GitHub Pages não pode atualizar arquivos que existem na branch. Usegh-pages branch.', 'error');
                    return;
                }
                results.push(`✗ ${path}: ${error.message}`);
            }
        }

        showToast('Publicado no GitHub com sucesso!', 'success');
        console.log('Deploy results:', results);

    } catch (error) {
        showToast('Erro ao publicar: ' + error.message, 'error');
        console.error('Deploy error:', error);
    }
}

async function getFileSha(path, token) {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}?ref=${GITHUB_CONFIG.branch}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.sha;
        }
    } catch (e) {
        console.log('File does not exist yet:', path);
    }
    return null;
}

function autoDeployOnSave() {
    const originalSaveState = saveState;
    saveState = function() {
        originalSaveState.apply(this, arguments);
        setTimeout(() => {
            if (isGithubConfigured()) {
                try {
                    deployToGithub();
                } catch (e) {
                    console.error('Deploy error:', e);
                    showToast('Erro no deploy automático', 'error');
                }
            }
        }, 500);
    };
}

autoDeployOnSave();

window.deployToGithub = deployToGithub;
window.promptGithubToken = promptGithubToken;
window.isGithubConfigured = isGithubConfigured;
