const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const locationFilter = document.getElementById('locationFilter');
const applyFilters = document.getElementById('applyFilters');
const addProductSection = document.getElementById('addProductSection');
const addProductForm = document.getElementById('addProductForm');

// Get current user
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Only show add product form if user is a farmer
if (currentUser && currentUser.isFarmer) {
    addProductSection.style.display = 'block';
} else {
    addProductSection.style.display = 'none';
}

// Load products from localStorage
let products = JSON.parse(localStorage.getItem('products')) || [];

// Add Product Handler
if (addProductForm) {
    addProductForm.onsubmit = function (e) {
        e.preventDefault();
        // Get form values
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const location = document.getElementById('productLocation').value.trim();
        const unit = document.getElementById('productUnit').value.trim();
        const quantity = parseInt(document.getElementById('productQuantity').value);
        const minOrder = parseInt(document.getElementById('productMinOrder').value);
        const image = document.getElementById('productImage').value.trim() || 'https://via.placeholder.com/300x200?text=Product';
        const description = document.getElementById('productDescription').value.trim();
        const category = categoryFromName(name);

        // Create product object
        const product = {
            id: Date.now().toString(),
            name,
            category,
            price,
            unit,
            quantity,
            minOrder,
            description,
            farmerId: currentUser.id,
            farmerName: currentUser.farmName || currentUser.name,
            location,
            image
        };

        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        addProductForm.reset();
        alert('Product added successfully!');
        displayProducts(products);
        initLocationFilter();
    };
}

// Guess category from product name (simple logic)
function categoryFromName(name) {
    const n = name.toLowerCase();
    if (n.includes('wheat') || n.includes('rice') || n.includes('flour')) return 'grains';
    if (n.includes('milk') || n.includes('cheese') || n.includes('curd')) return 'dairy';
    if (n.includes('apple') || n.includes('mango') || n.includes('banana') || n.includes('fruit')) return 'fruits';
    if (n.includes('carrot') || n.includes('potato') || n.includes('onion') || n.includes('vegetable')) return 'vegetables';
    return '';
}

// Initialize location filter
function initLocationFilter() {
    locationFilter.innerHTML = '<option value="">All Locations</option>';
    const locations = [...new Set(products.map(p => p.location))];
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

// Display products
function displayProducts(productsToDisplay) {
    productsContainer.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productsContainer.innerHTML = '<p>No products found matching your criteria.</p>';
        return;
    }

    const productGrid = document.createElement('div');
    productGrid.className = 'product-grid';

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">₹${product.price.toFixed(2)} / ${product.unit}</div>
                <div class="product-farmer">From: ${product.farmerName}, ${product.location}</div>
                <div class="product-minorder">Min Order: ${product.minOrder} ${product.unit}</div>
                <p>${product.description}</p>
                <div class="product-actions">
                    <button class="btn view-details" data-id="${product.id}">View Details</button>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    productsContainer.appendChild(productGrid);

    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            showProductDetails(productId);
        });
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// Show product details in modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productModal = document.getElementById('productModal');
    const productDetail = document.getElementById('productDetail');

    productDetail.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image" style="background-image: url('${product.image}')"></div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="product-price">₹${product.price.toFixed(2)} / ${product.unit}</div>
                <div class="product-farmer">From: ${product.farmerName}, ${product.location}</div>
                <div class="product-minorder">Min Order: ${product.minOrder} ${product.unit}</div>
                <p>${product.description}</p>
                <div class="product-quantity">
                    <label for="detailQuantity">Quantity:</label>
                    <input type="number" id="detailQuantity" min="${product.minOrder}" max="${product.quantity}" value="${product.minOrder}">
                    <span>${product.unit}</span>
                </div>
                <button class="btn add-to-cart-detail" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

    productModal.style.display = 'block';

    document.querySelector('.add-to-cart-detail').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('detailQuantity').value);
        if (quantity < product.minOrder) {
            alert(`Minimum order is ${product.minOrder} ${product.unit}`);
            return;
        }
        addToCart(productId, quantity);
        productModal.style.display = 'none';
    });

    document.querySelector('#productModal .close').addEventListener('click', () => {
        productModal.style.display = 'none';
    });
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity < product.minOrder) {
        alert(`Minimum order is ${product.minOrder} ${product.unit}`);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            name: product.name,
            price: product.price,
            unit: product.unit,
            quantity,
            image: product.image,
            farmerName: product.farmerName
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    if (typeof updateCartCount === 'function') updateCartCount();

    alert(`${quantity} ${product.unit} of ${product.name} added to cart!`);
}

// Filter products
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const location = locationFilter.value;

    let filteredProducts = [...products];

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.farmerName.toLowerCase().includes(searchTerm)
        );
    }

    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (location) {
        filteredProducts = filteredProducts.filter(product => product.location === location);
    }

    displayProducts(filteredProducts);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initLocationFilter();
    displayProducts(products);

    if (applyFilters) {
        applyFilters.addEventListener('click', filterProducts);
    }

    const productModal = document.getElementById('productModal');
    if (productModal) {
        window.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.style.display = 'none';
            }
        });
    }
});