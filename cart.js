        const cartItems = document.getElementById('cartItems');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const cartSummary = document.getElementById('cartSummary');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartDelivery = document.getElementById('cartDelivery');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        // Display cart items
        function displayCart() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                cartSummary.style.display = 'none';
                return;
            }
            
            emptyCartMessage.style.display = 'none';
            cartSummary.style.display = 'block';
            cartItems.innerHTML = '';
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <p>From: ${item.farmerName}</p>
                        <p class="cart-item-price">Rs${(item.price).toFixed(2)} / ${item.unit}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-id="${item.productId}">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.productId}">
                        <button class="increase-quantity" data-id="${item.productId}">+</button>
                    </div>
                    <div class="cart-item-price">
                        Rs${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button class="remove-item" data-id="${item.productId}">Remove</button>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.decrease-quantity').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    updateQuantity(e.target.getAttribute('data-id'), -1);
                });
            });
            
            document.querySelectorAll('.increase-quantity').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    updateQuantity(e.target.getAttribute('data-id'), 1);
                });
            });
            
            // Add event listeners to quantity inputs
            document.querySelectorAll('.cart-item-quantity input').forEach(input => {
                input.addEventListener('change', (e) => {
                    setQuantity(e.target.getAttribute('data-id'), parseInt(e.target.value));
                });
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    removeItem(e.target.getAttribute('data-id'));
                });
            });
            
            // Update summary
            updateSummary();
        }

        // Update quantity of an item in the cart
        function updateQuantity(productId, change) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(item => item.productId === productId);
            
            if (item) {
                item.quantity += change;
                
                // Remove if quantity is 0 or less
                if (item.quantity <= 0) {
                    cart = cart.filter(item => item.productId !== productId);
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
            }
        }

        // Set specific quantity for an item
        function setQuantity(productId, quantity) {
            if (quantity < 1) return;
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(item => item.productId === productId);
            
            if (item) {
                item.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
            }
        }

        // Remove item from cart
        function removeItem(productId) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.productId !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }

        // Update cart summary
        function updateSummary() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const delivery = subtotal > 0 ? 5.99 : 0; // Flat delivery fee
            
            cartSubtotal.textContent = `Rs${subtotal.toFixed(2)}`;
            cartDelivery.textContent = `Rs${delivery.toFixed(2)}`;
            cartTotal.textContent = `Rs${(subtotal + delivery).toFixed(2)}`;
        }

        // Checkout
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                const user = JSON.parse(localStorage.getItem('currentUser  '));
                
                if (!user) {
                    alert('Please login to proceed to checkout');
                    return;
                }
                
                alert('Order placed successfully!');
                localStorage.removeItem('cart');
                displayCart();
            });
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            displayCart();
        });