const products = [
  { id: 1, name: "Standee Akrilik Ucapan Milad", priceBuy: 350000, priceRent: 75000, category: "Standee", img: "img/standee.jpg", rent: true },
  { id: 2, name: "Standee Akrilik Table", priceBuy: 50000, priceRent: 15000, category: "Standee", img: "img/standee_meja.jpg", rent: true },
  { id: 3, name: "Bunga Kawat Bulu", priceBuy: 45000, priceRent: 15000, category: "Standee", img: "img/bunga.jpg", rent: true },
  { id: 4, name: "Klepon 1 Toples", priceBuy: 50000, category: "Manisan", img: "img/klepon.jpg" },
  { id: 5, name: "Anyaman Piring", priceBuy: 5000, category: "Anyaman", img: "img/piring.jpg" },
  { id: 6, name: "Standee Akrilik - Blade", priceBuy: 35000, category: "Standee", img: "img/standee_blade.png" },
  { id: 7, name: "Standee Akrilik - Yelan", priceBuy: 30000, category: "Standee", img: "img/standee_yelan.png" },
  { id: 8, name: "Standee Akrilik - Kazuha", priceBuy: 30000, category: "Standee", img: "img/standee_kazuha.png" },
  { id: 13, name: "Permen", priceBuy: 500, category: "Manisan", img: "img/permen.jpg" },
  { id: 14, name: "Skincare", priceBuy: 45000, category: "Perawatan", img: "img/skincare.jpg" },
  { id: 15, name: "Gantungan Kunci - Jingliu", priceBuy: 10000, category: "Keychain", img: "img/ganci_jingliu.png" },
  { id: 16, name: "Gantungan Kunci - Jade", priceBuy: 12000, category: "Keychain", img: "img/ganci_jade.png" },
  { id: 17, name: "Poster A3 - Cinderella Gray", priceBuy: 15000, category: "Poster", img: "img/cinray.jpg" },
  { id: 18, name: "Poster A3 - Umamusume Season 3", priceBuy: 15000, category: "Poster", img: "img/s3.jpg" },
  { id: 19, name: "Poster A3 - Road to the Top", priceBuy: 15000, category: "Poster", img: "img/ova.jpg" },
  { id: 20, name: "Supoka Kitasan", priceBuy: 2500, category: "Photocard", img: "img/kitasan.jpg" },
  { id: 21, name: "Light Cone - Aventurine", priceBuy: 2000, category: "Photocard", img: "img/lc_aven.jpg" },
  { id: 22, name: "Sketch - Ruan Mei", priceBuy: 30000, category: "Sketch", img: "img/sketch_rm.jpg" },
  { id: 23, name: "Sketch - Phainon", priceBuy: 30000, category: "Sketch", img: "img/sketch_phainon.jpg" },
  { id: 24, name: "Sketch - Castorice", priceBuy: 30000, category: "Sketch", img: "img/sketch_casto.jpg" },
  { id: 25, name: "Sketch - Firefly", priceBuy: 30000, category: "Sketch", img: "img/sketch_firefly.jpg" },
  { id: 26, name: "Sketch - Blade", priceBuy: 30000, category: "Sketch", img: "img/sketch_blade.jpg" },
  { id: 27, name: "Sketch - Black Swan", priceBuy: 30000, category: "Sketch", img: "img/sketch_bs.jpg" },
  { id: 28, name: "Stiker Aventurine", priceBuy: 1000, category: "Sticker", img: "img/aven.png" },
  { id: 29, name: "Stiker Sparkle", priceBuy: 1000, category: "Sticker", img: "img/sparkle.png" },
  { id: 30, name: "Stiker Silver Wolf", priceBuy: 1000, category: "Sticker", img: "img/siwol.png" },
  { id: 31, name: "Stiker Topaz", priceBuy: 1000, category: "Sticker", img: "img/topaz.png" },
];

const container = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");

let cart = [];

// Render produk
function renderProducts(list) {
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
  <img src="${p.img}" alt="${p.name}">
  <h3>${p.name}</h3>

  <p>
    ${
      p.rent
        ? `Beli: Rp ${p.priceBuy.toLocaleString()}<br>Sewa: Rp ${p.priceRent.toLocaleString()} / hari`
        : `Rp ${p.priceBuy.toLocaleString()}`
    }
  </p>

  <div class="btn-group">
    <button class="buy-btn">Beli</button>
    ${p.rent ? `<button class="rent-btn">Sewa</button>` : ""}
  </div>
`;


    // Tombol beli
    card.querySelector(".buy-btn").addEventListener("click", () => {
  addToCart({ ...p, price: p.priceBuy, mode: "buy" });
    });

    // Tombol sewa
    if (p.rent) {
      card.querySelector(".rent-btn").addEventListener("click", () => {
        addToCart({ ...p, price: p.priceRent, mode: "rent" });
      });
    }

    container.appendChild(card);
  });
}

// Tambahkan barang ke keranjang
function addToCart(product) {
  let days = 1;

  // Kalau mode sewa → minta jumlah hari
  if (product.mode === "rent") {
    days = parseInt(prompt("Berapa hari sewa?"), 10);
    if (isNaN(days) || days <= 0) days = 1;
  }

  const existing = cart.find(
    item => item.id === product.id && item.mode === product.mode
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      ...product,
      qty: 1,
      days: product.mode === "rent" ? days : 1
    });
  }

  updateCartModal();
}


// Update isi modal keranjang
function updateCartModal() {
  const list = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");

  list.innerHTML = "";
  let sum = 0;

  cart.forEach(item => {
    const subtotal =
      item.mode === "rent"
        ? item.price * item.days * item.qty
        : item.price * item.qty;

    sum += subtotal;

    const li = document.createElement("li");
    li.classList.add("cart-row");

    li.innerHTML = `
      <span class="cart-name">
        ${item.name}
        ${
          item.mode === "rent"
            ? `<small>(Sewa ${item.days} hari)</small>`
            : `<small>(Beli)</small>`
        }
      </span>

      <div class="cart-controls">
        <button class="qty-minus">−</button>
        <span class="qty">${item.qty}</span>
        <button class="qty-plus">+</button>
      </div>

      <span class="cart-price">Rp ${subtotal.toLocaleString()}</span>

      <button class="remove-item">✖</button>
    `;

    // Tambah jumlah
    li.querySelector(".qty-plus").addEventListener("click", () => {
      item.qty++;
      updateCartModal();
    });

    // Kurangi jumlah
    li.querySelector(".qty-minus").addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty--;
      } else {
        cart = cart.filter(
          x => !(x.id === item.id && x.mode === item.mode)
        );
      }
      updateCartModal();
    });

    // Hapus item
    li.querySelector(".remove-item").addEventListener("click", () => {
      cart = cart.filter(
        x => !(x.id === item.id && x.mode === item.mode)
      );
      updateCartModal();
    });

    list.appendChild(li);
  });

  // Total harga
  total.textContent = "Total: Rp " + sum.toLocaleString();

  // Badge jumlah item
  document.getElementById("cart-count").textContent = cart.reduce(
    (a, b) => a + b.qty,
    0
  );
}

// Filter produk
function filterProducts() {
  const q = searchInput.value.toLowerCase();
  const cat = categorySelect.value;

  const filtered = products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(q);
    const matchesCat = cat === "Semua" || p.category === cat;
    return matchesQuery && matchesCat;
  });

  renderProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);

renderProducts(products);

// Modal
const openCartBtn = document.getElementById("open-cart");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");

openCartBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
});

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});



// ============================
// CHECKOUT
// ============================

// Apakah ada barang sewaan?
function isRentCart() {
  return cart.some(i => i.rent);
}

document.getElementById("wa-checkout").onclick = () => {
  let msg = "";

  cart.forEach(i => {
    if (i.rent) {
      msg += `${i.name} (Sewa ${i.days} hari, qty ${i.qty}) - Rp ${(i.price * i.days * i.qty).toLocaleString()}\n`;
    } else {
      msg += `${i.name} x${i.qty} - Rp ${(i.price * i.qty).toLocaleString()}\n`;
    }
  });

  msg = isRentCart()
    ? "*PESANAN SEWA*\n" + msg
    : "*PESANAN BELI*\n" + msg;

  window.open(
    `https://wa.me/62895806601800?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
};

document.getElementById("email-checkout").onclick = () => {
  let msg = "";

  cart.forEach(i => {
    if (i.rent) {
      msg += `${i.name} (Sewa ${i.days} hari, qty ${i.qty}) - Rp ${(i.price * i.days * i.qty).toLocaleString()}\n`;
    } else {
      msg += `${i.name} x${i.qty} - Rp ${(i.price * i.qty).toLocaleString()}\n`;
    }
  });

  msg = isRentCart()
    ? "PESANAN SEWA\n\n" + msg
    : "PESANAN BELI\n\n" + msg;

  window.location.href =
    `mailto:alfan32220@gmail.com?subject=Order&body=${encodeURIComponent(msg)}`;
};

document.getElementById("ig-checkout").onclick = () => {
  window.open("https://instagram.com/sunaookamii", "_blank");
};


