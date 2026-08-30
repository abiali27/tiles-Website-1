// --- Product and Cart Management ---

const products = [
  { id: 1, name: "Ceramic Tiles", price: 20, stock: 5, image: "https://jumanji.livspace-cdn.com/magazine/wp-content/uploads/sites/2/2024/10/14130155/different-types-of-ceramic-tile-designs.jpg" },
  { id: 2, name: "Porcelain Tiles", price: 15, stock: 3, image: "https://cdn.prod.website-files.com/611e33de5446a74e18a9324c/6419f8ed14c757e094b277db_porcelain%20tiles%20pros%20and%20cons.webp" },
  { id: 3, name: "Mosaic Tiles", price: 18, stock: 0, image: "https://thetileshouse.com/wp-content/uploads/2023/08/IMG_6192.jpeg" },
  { id: 4, name: "Marble Tiles", price: 30, stock: 2, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80" },
  { id: 5, name: "Granite Tiles", price: 25, stock: 1, image: "https://images.unsplash.com/photo-1560448204-4a0a1a0a1a1a?auto=format&fit=crop&w=1350&q=80" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsGrid = document.getElementById("productsGrid");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const paymentSuccess = document.getElementById("payment-success");

// Render products with stock check
function renderProducts() {
  productsGrid.innerHTML = "";
  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    const isOutOfStock = product.stock === 0;

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>₹${product.price.toFixed(2)} per sq. ft.</p>
        <p>Stock: ${product.stock}</p>
        <button data-id="${product.id}" ${isOutOfStock ? "disabled" : ""}>
          ${isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    `;

    productsGrid.appendChild(productCard);
  });
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart with stock check
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stock === 0) {
    alert("Sorry, this product is out of stock.");
    return;
  }

  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    if (cartItem.quantity < product.stock) {
      cartItem.quantity++;
    } else {
      alert("You have reached the maximum stock for this product.");
      return;
    }
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  alert(`${product.name} added to cart.`);
  renderCart();
  renderProducts();
}

// Render cart items with quantity controls
function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: ₹0.00";
    checkoutBtn.disabled = true;
    return;
  }

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <span>${item.name}</span>
      <div>
        <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
      </div>
      <span>₹${(item.price * item.quantity).toFixed(2)}</span>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
  checkoutBtn.disabled = false;
}

// Remove item from cart
function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    renderProducts();
  }
}

// Change quantity with stock check
function changeQuantity(index, action) {
  if (index < 0 || index >= cart.length) return;

  const item = cart[index];
  const product = products.find(p => p.id === item.id);
  if (!product) return;

  if (action === "increase") {
    if (item.quantity < product.stock) {
      item.quantity++;
    } else {
      alert("Reached maximum stock for this product.");
      return;
    }
  } else if (action === "decrease") {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      removeFromCart(index);
      return;
    }
  }
  saveCart();
  renderCart();
  renderProducts();
}

// Event listeners
productsGrid.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON" && e.target.hasAttribute("data-id")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    addToCart(productId);
  }
});

cartItemsContainer.addEventListener("click", e => {
  if (e.target.classList.contains("remove-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    removeFromCart(index);
  } else if (e.target.classList.contains("qty-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    const action = e.target.getAttribute("data-action");
    changeQuantity(index, action);
  }
});

// --- Stripe Checkout Integration ---

checkoutBtn.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Prepare line items for Stripe in INR paise
  const lineItems = cart.map(item => ({
    price_data: {
      currency: "inr",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100), // price in paise
    },
    quantity: item.quantity,
  }));

  try {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineItems }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe Checkout
    } else {
      alert("Failed to create checkout session.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error processing payment.");
  }
});

// --- Success Page Bill Fetching (run only on success.html) ---

async function fetchAndRenderBill() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  if (!sessionId) return;

  const billContainer = document.getElementById("bill");
  if (!billContainer) return;

  try {
    const res = await fetch(`/checkout-session?session_id=${sessionId}`);
    const session = await res.json();

    if (session.error) {
      billContainer.textContent = "Failed to load bill.";
      return;
    }

    const lineItems = session.line_items.data;
    let billHtml = "<h2>Order Summary</h2><ul>";
    let total = 0;

    lineItems.forEach(item => {
      const amount = (item.amount_subtotal / 100).toFixed(2);
      total += item.amount_subtotal;
      billHtml += `<li>${item.description} x ${item.quantity} = ₹${amount}</li>`;
    });

    billHtml += `</ul><h3>Total Paid: ₹${(total / 100).toFixed(2)}</h3>`;
    billContainer.innerHTML = billHtml;
  } catch (error) {
    billContainer.textContent = "Error loading bill.";
  }
}

// Run initial renders
if (productsGrid) renderProducts();
if (cartItemsContainer) renderCart();
if (window.location.pathname.endsWith("success.html")) {
  fetchAndRenderBill();
}
