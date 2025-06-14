// // DOM Elements
// const farmInfo = document.getElementById('farmInfo');
// const editFarmInfoBtn = document.getElementById('editFarmInfo');
// const farmerProducts = document.getElementById('farmerProducts');
// const addProductBtn = document.getElementById('addProductBtn');
// const farmerOrders = document.getElementById('farmerOrders');
// const productFormModal = document.getElementById('productFormModal');
// const productForm = document.getElementById('productForm');
// const productFormTitle = document.getElementById('productFormTitle');

// // Initialize dashboard
// function initDashboard() {
//     const user = JSON.parse(localStorage.getItem('currentUser'));
    
//     if (!user || !user.isFarmer) {
//         window.location.href = 'index.html';
//         return;
//     }
    
//     displayFarmInfo(user);
//     displayFarmerProducts(user.id);
//     // displayFarmerOrders(user.id); // In a real app, you would implement this
// }

// // Display farm information
// function displayFarmInfo(user) {
//     farmInfo.innerHTML = `
//         <p><strong>Farm Name:</strong> ${user.farmName || 'Not set'}</p>
//         <p><strong>Location:</strong> ${user.location || 'Not set'}</p>
//         <p><strong>Status:</strong> ${user.verified ? 'Verified' : 'Pending verification'}</p>
//     `;
// }

// // Display farmer's products
// function displayFarmerProducts(farmerId) {
//     const products = JSON.parse(localStorage.getItem('products')) || [];
//     const farmerProductsList = products.filter(p => p.farmerId === farmerId);
    
//     if (farmerProductsList.length === 0) {
//         farmerProducts.innerHTML = '<p>You have no products listed yet.</p>';
//         return;
//     }
    
//     const productsGrid = document.createElement('div');
//     productsGrid.className = 'farmer-products-grid';
    
//     farmerProductsList.forEach(product => {
//         const productCard = document.createElement('div');
//         productCard.className = 'farmer-product-card';
//         productCard.innerHTML = `
//             <h3>${product.name}</h3>
//             <p>Category: ${product.category}</p>
//             <p>Price: $${product.price.toFixed(2)} / ${product.unit}</p>
//             <p>Available: ${product.quantity} ${product.unit}</p>
//             <div class="farmer-product-actions">
//                 <button class="edit-product" data-id="${product.id}">Edit</button>
//                 <button class="delete-product" data-id="${product.id}">Delete</button>
//             </div>
//         `;
//         productsGrid.appendChild(productCard);
//     });
    
//     farmerProducts.innerHTML = '';
//     farmerProducts.appendChild(productsGrid);
    
//     // Add event listeners to edit/delete buttons
//     document.querySelectorAll('.edit-product').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             editProduct(e.target.getAttribute('data-id'));
//         });
//     });
    
//     document.querySelectorAll('.delete-product').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             if (confirm('Are you sure you want to delete this product?')) {
//                 deleteProduct(e.target.getAttribute('data-id'));
//             }
//         });
//     });
// }

// // Add new product
// if (addProductBtn) {
//     addProductBtn.addEventListener('click', () => {
//         productFormTitle.textContent = 'Add New Product';
//         productForm.reset();
//         productFormModal.style.display = 'block';
//     });
// }

// // Edit product
// function editProduct(productId) {
//     const products = JSON.parse(localStorage.getItem('products')) || [];
//     const product = products.find(p => p.id === productId);
    
//     if (!product) return;
    
//     productFormTitle.textContent = 'Edit Product';
//     document.getElementById('productId').value = product.id;
//     document.getElementById('productName').value = product.name;
//     document.getElementById('productCategory').value = product.category;
//     document.getElementById('productPrice').value = product.price;
//     document.getElementById('productQuantity').value = product.quantity;
//     document.getElementById('productUnit').value = product.unit;
//     document.getElementById('productDescription').value = product.description;
    
//     productFormModal.style.display = 'block';
// }

// // Delete product
// function deleteProduct(productId) {
//     let products = JSON.parse(localStorage.getItem('products')) || [];
//     products = products.filter(p => p.id !== productId);
//     localStorage.setItem('products', JSON.stringify(products));
    
//     const user = JSON.parse(localStorage.getItem('currentUser'));
//     displayFarmerProducts(user.id);
// }

// // Save product (add or edit)
// if (productForm) {
//     productForm.addEventListener('submit', (e) => {
//         e.preventDefault();
        
//         const user = JSON.parse(localStorage.getItem('currentUser'));
//         let products = JSON.parse(localStorage.getItem('products')) || [];
        
//         const productId = document.getElementById('productId').value;
//         const isEdit = !!productId;
        
//         const productData = {
//             id: isEdit ? productId : Date.now().toString(),
//             name: document.getElementById('productName').value,
//             category: document.getElementById('productCategory').value,
//             price: parseFloat(document.getElementById('productPrice').value),
//             quantity: parseInt(document.getElementById('productQuantity').value),
//             unit: document.getElementById('productUnit').value,
//             description: document.getElementById('productDescription').value,
//             farmerId: user.id,
//             farmerName: user.farmName,
//             location: user.location,
//             image: 'https://via.placeholder.com/300x200?text=Product' // In a real app, you would handle image upload
//         };
        
//         if (isEdit) {
//             // Update existing product
//             products = products.map(p => p.id === productId ? productData : p);
//         } else {
//             // Add new product
//             products.push(productData);
//         }
        
//         localStorage.setItem('products', JSON.stringify(products));
//         productFormModal.style.display = 'none';
//         displayFarmerProducts(user.id);
//     });
// }

// // Close product form modal
// if (productFormModal) {
//     const closeButtons = productFormModal.querySelectorAll('.close');
//     closeButtons.forEach(btn => {
//         btn.addEventListener('click', () => {
//             productFormModal.style.display = 'none';
//         });
//     });
    
//     window.addEventListener('click', (e) => {
//         if (e.target === productFormModal) {
//             productFormModal.style.display = 'none';
//         }
//     });
// }

// // Edit farm info
// if (editFarmInfoBtn) {
//     editFarmInfoBtn.addEventListener('click', () => {
//         const user = JSON.parse(localStorage.getItem('currentUser'));
//         const newFarmName = prompt('Enter your farm name:', user.farmName || '');
//         const newLocation = prompt('Enter your location:', user.location || '');
        
//         if (newFarmName !== null && newLocation !== null) {
//             // Update user info
//             user.farmName = newFarmName;
//             user.location = newLocation;
            
//             // Update in "database"
//             let users = JSON.parse(localStorage.getItem('users')) || [];
//             users = users.map(u => u.id === user.id ? user : u);
            
//             localStorage.setItem('users', JSON.stringify(users));
//             localStorage.setItem('currentUser', JSON.stringify(user));
            
//             // Update displayed info
//             displayFarmInfo(user);
            
//             // Update products with new farm name
//             let products = JSON.parse(localStorage.getItem('products')) || [];
//             products = products.map(p => {
//                 if (p.farmerId === user.id) {
//                     return {
//                         ...p,
//                         farmerName: newFarmName,
//                         location: newLocation
//                     };
//                 }
//                 return p;
//             });
//             localStorage.setItem('products', JSON.stringify(products));
//         }
//     });
// }

// // Initialize page
// document.addEventListener('DOMContentLoaded', initDashboard);

 // DOM Elements
        const farmInfo = document.getElementById('farmInfo');
        const editFarmInfoBtn = document.getElementById('editFarmInfo');
        const farmerProducts = document.getElementById('farmerProducts');
        const addProductBtn = document.getElementById('addProductBtn');
        const productFormModal = document.getElementById('productFormModal');
        const productForm = document.getElementById('productForm');
        const productFormTitle = document.getElementById('productFormTitle');
        const logoutBtn = document.getElementById('logoutBtn');
        const closeModalBtns = document.querySelectorAll('.close, .cancel-btn');

        // Initialize dashboard
        function initDashboard() {
            const user = JSON.parse(localStorage.getItem('currentUser '));
            
            if (!user || !user.isFarmer) {
                window.location.href = 'index.html';
                return;
            }
            
            displayFarmInfo(user);
            displayFarmerProducts(user.id);
        }

        // Display farm information
        function displayFarmInfo(user) {
            farmInfo.innerHTML = `
                <p><strong>Farm Name:</strong> ${user.farmName || 'Not set'}</p>
                <p><strong>Location:</strong> ${user.location || 'Not set'}</p>
                <p><strong>Email:</strong> ${user.email || 'Not set'}</p>
                <p><strong>Phone:</strong> ${user.phone || 'Not set'}</p>
            `;
        }

        // Display farmer's products
        function displayFarmerProducts(farmerId) {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const farmerProductsList = products.filter(p => p.farmerId === farmerId);
            
            if (farmerProductsList.length === 0) {
                farmerProducts.innerHTML = '<p>You have no products listed yet.</p>';
                return;
            }
            
            farmerProducts.innerHTML = '';
            
            farmerProductsList.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'farmer-product-card';
                productCard.innerHTML = `
                    <h3>${product.name}</h3>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Price:</strong> ₹${product.price.toFixed(2)} per ${product.unit}</p>
                    <p><strong>Available:</strong> ${product.quantity} ${product.unit}</p>
                    <p><strong>Description:</strong> ${product.description || 'None'}</p>
                    <div class="farmer-product-actions">
                        <button class="btn btn-outline edit-product" data-id="${product.id}">Edit</button>
                        <button class="btn btn-outline delete-product" data-id="${product.id}">Delete</button>
                    </div>
                `;
                farmerProducts.appendChild(productCard);
            });
            
            // Add event listeners to edit/delete buttons
            document.querySelectorAll('.edit-product').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    editProduct(e.target.getAttribute('data-id'));
                });
            });
            
            document.querySelectorAll('.delete-product').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (confirm('Are you sure you want to delete this product?')) {
                        deleteProduct(e.target.getAttribute('data-id'));
                    }
                });
            });
        }

        // Add new product
        addProductBtn.addEventListener('click', () => {
            productFormTitle.textContent = 'Add New Product';
            document.getElementById('productId').value = '';
            productForm.reset();
            productFormModal.style.display = 'block';
        });

        // Edit product
        function editProduct(productId) {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const product = products.find(p => p.id === productId);
            
            if (!product) return;
            
            productFormTitle.textContent = 'Edit Product';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productUnit').value = product.unit;
            document.getElementById('productDescription').value = product.description || '';
            
            productFormModal.style.display = 'block';
        }

        // Delete product
        function deleteProduct(productId) {
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products = products.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(products));
            
            const user = JSON.parse(localStorage.getItem('currentUser '));
            displayFarmerProducts(user.id);
        }

        // Save product (add or edit)
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const user = JSON.parse(localStorage.getItem('currentUser '));
            let products = JSON.parse(localStorage.getItem('products')) || [];
            
            const productId = document.getElementById('productId').value;
            const isEdit = !!productId;
            
            const productData = {
                id: isEdit ? productId : 'product_' + Date.now(),
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: parseFloat(document.getElementById('productPrice').value),
                quantity: parseInt(document.getElementById('productQuantity').value),
                unit: document.getElementById('productUnit').value,
                description: document.getElementById('productDescription').value,
                farmerId: user.id,
                farmerName: user.farmName || user.name,
                location: user.location || 'Unknown',
                image: 'https://via.placeholder.com/300x200?text=Product'
            };
            
            if (isEdit) {
                // Update existing product
                products = products.map(p => p.id === productId ? productData : p);
            } else {
                // Add new product
                products.push(productData);
            }
            
            localStorage.setItem('products', JSON.stringify(products));
            productFormModal.style.display = 'none';
            displayFarmerProducts(user.id);
        });

        // Edit farm info
        editFarmInfoBtn.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('currentUser '));
            const newFarmName = prompt('Enter your farm name:', user.farmName || '');
            const newLocation = prompt('Enter your location:', user.location || '');
            
            if (newFarmName !== null && newLocation !== null) {
                // Update user info
                user.farmName = newFarmName;
                user.location = newLocation;
                
                // Save updated user
                localStorage.setItem('currentUser ', JSON.stringify(user));
                
                // Update products with new farm name
                let products = JSON.parse(localStorage.getItem('products')) || [];
                products = products.map(p => {
                    if (p.farmerId === user.id) {
                        return {
                            ...p,
                            farmerName: newFarmName,
                            location: newLocation
                        };
                    }
                    return p;
                });
                localStorage.setItem('products', JSON.stringify(products));
                
                // Update displayed info
                displayFarmInfo(user);
                displayFarmerProducts(user.id);
            }
        });

        // Close modals
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                productFormModal.style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === productFormModal) {
                productFormModal.style.display = 'none';
            }
        });

        // Logout
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('current User ');
            window.location.href = 'index.html';
        });

        // Initialize page
        document.addEventListener('DOMContentLoaded', initDashboard);