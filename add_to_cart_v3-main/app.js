let listProductHTML = document.querySelector(".listProduct"); // Ambil elemen DOM untuk daftar produk
let listCartHTML = document.querySelector(".listCart"); // Ambil elemen DOM untuk daftar keranjang
let iconCart = document.querySelector(".icon-cart"); // Ambil elemen DOM untuk ikon keranjang
let iconCartSpan = document.querySelector(".icon-cart span"); // Ambil elemen DOM untuk penanda jumlah produk di ikon keranjang
let body = document.querySelector("body"); // Ambil elemen body untuk manipulasi kelas
let closeCart = document.querySelector(".close"); // Ambil elemen DOM untuk tombol tutup keranjang
let products = []; // Array untuk menyimpan data produk dari products.json
let cart = []; // Array untuk menyimpan data keranjang

// Event listener untuk membuka/menutup keranjang
iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart"); // Toggle kelas showCart pada elemen body
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart"); // Toggle kelas showCart pada elemen body
});

// Fungsi untuk menambahkan data produk ke HTML
const addDataToHTML = () => {
  if (products.length > 0) {
    // Cek apakah ada data produk
    products.forEach((product) => {
      // Iterasi melalui array produk
      let newProduct = document.createElement("div"); // Buat elemen div baru
      newProduct.dataset.id = product.id; // Set atribut data-id dengan ID produk
      newProduct.classList.add("item"); // Tambahkan kelas item
      newProduct.innerHTML = `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`; // Isi HTML elemen dengan data produk
      listProductHTML.appendChild(newProduct); // Tambahkan elemen produk ke daftar produk di HTML
    });
  }
};

// Event listener untuk menangani klik tombol Add To Cart
listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target; // Ambil elemen yang diklik
  if (positionClick.classList.contains("addCart")) {
    // Cek apakah elemen yang diklik adalah tombol Add To Cart
    let id_product = positionClick.parentElement.dataset.id; // Ambil ID produk dari atribut data-id
    addToCart(id_product); // Panggil fungsi untuk menambah produk ke keranjang
  }
});

// Fungsi untuk menambah produk ke keranjang
const addToCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex(
    (value) => value.product_id == product_id
  ); // Cari indeks produk di array keranjang
  if (cart.length <= 0) {
    // Jika keranjang kosong
    cart = [
      {
        product_id: product_id,
        quantity: 1, // Tambahkan produk dengan kuantitas 1
      },
    ];
  } else if (positionThisProductInCart < 0) {
    // Jika produk belum ada di keranjang
    cart.push({
      product_id: product_id,
      quantity: 1, // Tambahkan produk dengan kuantitas 1
    });
  } else {
    // Jika produk sudah ada di keranjang
    cart[positionThisProductInCart].quantity += 1; // Tambah kuantitas produk
  }
  addCartToHTML(); // Perbarui tampilan keranjang
  addCartToMemory(); // Simpan data keranjang ke localStorage
};

// Fungsi untuk menyimpan data keranjang ke localStorage
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart)); // Simpan data keranjang dalam bentuk JSON
};

// Fungsi untuk menampilkan data keranjang ke HTML
const addCartToHTML = () => {
  listCartHTML.innerHTML = ""; // Kosongkan daftar keranjang di HTML
  let totalQuantity = 0; // Variabel untuk menyimpan total kuantitas produk
  if (cart.length > 0) {
    // Jika ada data di keranjang
    cart.forEach((item) => {
      // Iterasi melalui array keranjang
      totalQuantity += item.quantity; // Tambahkan kuantitas ke total
      let newItem = document.createElement("div"); // Buat elemen div baru
      newItem.classList.add("item"); // Tambahkan kelas item
      newItem.dataset.id = item.product_id; // Set atribut data-id dengan ID produk

      let positionProduct = products.findIndex(
        (value) => value.id == item.product_id
      ); // Cari produk berdasarkan ID di array produk
      let info = products[positionProduct]; // Ambil informasi produk
      newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `; // Isi HTML elemen dengan data keranjang
      listCartHTML.appendChild(newItem); // Tambahkan elemen ke daftar keranjang di HTML
    });
  }
  iconCartSpan.innerText = totalQuantity; // Perbarui total kuantitas di ikon keranjang
};

// Event listener untuk menangani perubahan kuantitas di keranjang
listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target; // Ambil elemen yang diklik
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    // Cek apakah elemen yang diklik adalah tombol plus atau minus
    let product_id = positionClick.parentElement.parentElement.dataset.id; // Ambil ID produk dari atribut data-id
    let type = "minus"; // Default tipe adalah minus
    if (positionClick.classList.contains("plus")) {
      // Jika tombol plus diklik
      type = "plus"; // Ubah tipe ke plus
    }
    changeQuantityCart(product_id, type); // Panggil fungsi untuk mengubah kuantitas
  }
});

// Fungsi untuk mengubah kuantitas produk di keranjang
const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex(
    (value) => value.product_id == product_id
  ); // Cari indeks produk di array keranjang
  if (positionItemInCart >= 0) {
    // Jika produk ditemukan di keranjang
    let info = cart[positionItemInCart]; // Ambil informasi produk
    switch (type) {
      case "plus":
        cart[positionItemInCart].quantity += 1; // Tambah kuantitas produk
        break;
      default:
        let changeQuantity = cart[positionItemInCart].quantity - 1; // Kurangi kuantitas produk
        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity; // Perbarui kuantitas
        } else {
          cart.splice(positionItemInCart, 1); // Hapus produk dari keranjang jika kuantitas 0
        }
        break;
    }
  }
  addCartToHTML(); // Perbarui tampilan keranjang
  addCartToMemory(); // Simpan data keranjang ke localStorage
};

// Inisialisasi aplikasi
const initApp = () => {
  fetch("products.json") // Ambil data produk dari file JSON
    .then((response) => response.json()) // Parsing JSON dari response
    .then((data) => {
      products = data; // Simpan data produk ke array
      addDataToHTML(); // Tambahkan produk ke HTML

      if (localStorage.getItem("cart")) {
        // Cek jika ada data keranjang di localStorage
        cart = JSON.parse(localStorage.getItem("cart")); // Ambil data keranjang dari localStorage
        addCartToHTML(); // Tampilkan keranjang di HTML
      }
    });
};
initApp(); // Panggil fungsi untuk memulai aplikasi
