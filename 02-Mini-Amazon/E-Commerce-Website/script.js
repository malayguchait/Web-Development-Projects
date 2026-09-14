// ==========================================
// SHOP EASY - ADVANCED JAVASCRIPT
// ==========================================


let currentProducts = [];

let currentPage = 1;

const productsPerPage = 12;

let currentCategory = "All";

let searchText = "";


// ==========================================
// CART
// ==========================================

function getCart() {

    return JSON.parse(
        localStorage.getItem(
            "shopEasyCart"
        )
    ) || [];

}


function saveCart(cart) {

    localStorage.setItem(
        "shopEasyCart",
        JSON.stringify(cart)
    );

}


function updateCartCount() {

    const cart = getCart();

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const element =
        document.getElementById(
            "cartCount"
        );


    if (element) {

        element.textContent =
            count;

    }

}


// ==========================================
// WISHLIST
// ==========================================

function getWishlist() {

    return JSON.parse(
        localStorage.getItem(
            "shopEasyWishlist"
        )
    ) || [];

}


function saveWishlist(wishlist) {

    localStorage.setItem(
        "shopEasyWishlist",
        JSON.stringify(wishlist)
    );

}


function updateWishlistCount() {

    const wishlist =
        getWishlist();


    const element =
        document.getElementById(
            "wishlistCount"
        );


    if (element) {

        element.textContent =
            wishlist.length;

    }

}


function toggleWishlist(id) {

    let wishlist =
        getWishlist();


    if (
        wishlist.includes(id)
    ) {

        wishlist =
            wishlist.filter(
                item => item !== id
            );


        showToast(
            "Removed from wishlist ❤️"
        );

    }

    else {

        wishlist.push(id);

        showToast(
            "Added to wishlist ❤️"
        );

    }


    saveWishlist(wishlist);

    updateWishlistCount();

    displayCurrentPage();

}


// ==========================================
// INITIALIZE
// ==========================================

function initializeShop() {

    currentProducts =
        [...products];


    updateCartCount();

    updateWishlistCount();

    displayCurrentPage();

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayCurrentPage() {

    const grid =
        document.getElementById(
            "productGrid"
        );


    if (!grid) return;


    const start =
        (
            currentPage - 1
        ) *
        productsPerPage;


    const end =
        start +
        productsPerPage;


    const pageProducts =
        currentProducts.slice(
            start,
            end
        );


    grid.innerHTML = "";


    if (
        pageProducts.length === 0
    ) {

        grid.innerHTML = `

            <div class="no-products">

                <div class="no-products-icon">
                    🔍
                </div>

                <h2>
                    No Products Found
                </h2>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;


        updateProductCount();

        createPagination();

        return;

    }


    pageProducts.forEach(
        product => {

            const card =
                createProductCard(
                    product
                );


            grid.appendChild(card);

        }
    );


    updateProductCount();

    createPagination();

}


// ==========================================
// PRODUCT CARD
// ==========================================

function createProductCard(product) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "product-card";


    const wishlist =
        getWishlist();


    const isWishlisted =
        wishlist.includes(
            product.id
        );


    const stars =
        createStars(
            product.rating
        );


    card.innerHTML = `

        <div class="image-container">

            ${
                product.discount > 0
                ? `
                    <span class="discount-badge">
                        ${product.discount}% OFF
                    </span>
                  `
                : ""
            }


            <button
                class="wishlist-btn
                ${
                    isWishlisted
                    ? "active"
                    : ""
                }"
                onclick="
                    toggleWishlist(
                        ${product.id}
                    )
                "
            >
                ${
                    isWishlisted
                    ? "❤️"
                    : "♡"
                }
            </button>


            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
                loading="lazy"
                onerror="
                    this.src='https://dummyjson.com/image/500x400/eeeeee/555555?text=Product'
                "
            >

        </div>


        <div class="product-info">

            <span class="product-category">
                ${product.category}
            </span>


            <h3>
                ${product.name}
            </h3>


            <div class="rating">

                ${stars}

                <span>
                    ${product.rating}
                </span>

            </div>


            <p class="description">
                ${product.description}
            </p>


            <div class="price-row">

                <span class="price">
                    ₹${product.price.toLocaleString("en-IN")}
                </span>

                <span class="original-price">
                    ₹${product.originalPrice.toLocaleString("en-IN")}
                </span>

            </div>


            <p
                class="
                    stock
                    ${
                        product.stock < 10
                        ? "low-stock"
                        : ""
                    }
                "
            >

                ${
                    product.stock < 10
                    ? "⚠️ Only "
                    : "✓ "
                }

                ${product.stock}

                ${
                    product.stock < 10
                    ? " left"
                    : " in stock"
                }

            </p>


            <div class="product-buttons">

                <button
                    class="view-btn"
                    onclick="
                        openModal(
                            ${product.id}
                        )
                    "
                >
                    👁 View
                </button>


                <button
                    class="add-cart-btn"
                    onclick="
                        addToCart(
                            ${product.id}
                        )
                    "
                >
                    🛒 Add
                </button>

            </div>

        </div>

    `;


    return card;

}


// ==========================================
// STAR RATING
// ==========================================

function createStars(rating) {

    const rounded =
        Math.round(rating);


    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars +=
            i <= rounded
            ? "★"
            : "☆";

    }


    return `
        <span class="stars">
            ${stars}
        </span>
    `;

}


// ==========================================
// SEARCH
// ==========================================

function searchProducts() {

    const input =
        document.getElementById(
            "searchInput"
        );


    searchText =
        input.value
            .toLowerCase()
            .trim();


    applyFilters();

}


const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchProducts
    );

}


// ==========================================
// CATEGORY FILTER
// ==========================================

function filterCategory(category) {

    currentCategory =
        category;


    currentPage = 1;


    applyFilters();


    const section =
        document.getElementById(
            "products"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    currentProducts =
        products.filter(
            product => {

                const categoryMatch =
                    currentCategory ===
                    "All" ||
                    product.category ===
                    currentCategory;


                const searchMatch =

                    product.name
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    product.description
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    product.category
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    product.brand
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                return (
                    categoryMatch &&
                    searchMatch
                );

            }
        );


    currentPage = 1;


    displayCurrentPage();

}


// ==========================================
// SORT
// ==========================================

function sortProducts() {

    const select =
        document.getElementById(
            "sortSelect"
        );


    const value =
        select.value;


    if (value === "price-low") {

        currentProducts.sort(
            (a, b) =>
                a.price - b.price
        );

    }

    else if (
        value === "price-high"
    ) {

        currentProducts.sort(
            (a, b) =>
                b.price - a.price
        );

    }

    else if (
        value === "rating"
    ) {

        currentProducts.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }

    else if (
        value === "name"
    ) {

        currentProducts.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }

    else if (
        value === "discount"
    ) {

        currentProducts.sort(
            (a, b) =>
                b.discount - a.discount
        );

    }

    else {

        currentProducts =
            products.filter(
                product => {

                    const categoryMatch =
                        currentCategory ===
                        "All" ||
                        product.category ===
                        currentCategory;


                    const searchMatch =
                        product.name
                            .toLowerCase()
                            .includes(
                                searchText
                            );


                    return (
                        categoryMatch &&
                        searchMatch
                    );

                }
            );

    }


    currentPage = 1;

    displayCurrentPage();

}


// ==========================================
// PAGINATION
// ==========================================

function createPagination() {

    const container =
        document.getElementById(
            "pagination"
        );


    if (!container) return;


    const totalPages =
        Math.ceil(
            currentProducts.length /
            productsPerPage
        );


    container.innerHTML = "";


    if (totalPages <= 1) return;


    const previous =
        document.createElement(
            "button"
        );


    previous.textContent =
        "←";


    previous.disabled =
        currentPage === 1;


    previous.onclick =
        function () {

            if (
                currentPage > 1
            ) {

                currentPage--;

                displayCurrentPage();

                window.scrollTo({
                    top: 500,
                    behavior: "smooth"
                });

            }

        };


    container.appendChild(
        previous
    );


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent = i;


        if (
            i === currentPage
        ) {

            button.className =
                "active";

        }


        button.onclick =
            function () {

                currentPage = i;

                displayCurrentPage();

                window.scrollTo({
                    top: 500,
                    behavior: "smooth"
                });

            };


        container.appendChild(
            button
        );

    }


    const next =
        document.createElement(
            "button"
        );


    next.textContent =
        "→";


    next.disabled =
        currentPage === totalPages;


    next.onclick =
        function () {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                displayCurrentPage();

                window.scrollTo({
                    top: 500,
                    behavior: "smooth"
                });

            }

        };


    container.appendChild(
        next
    );

}


// ==========================================
// PRODUCT COUNT
// ==========================================

function updateProductCount() {

    const element =
        document.getElementById(
            "productCountText"
        );


    if (element) {

        element.textContent =
            `${currentProducts.length} products found`;

    }

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    const cart =
        getCart();


    const existing =
        cart.find(
            item =>
                item.id === id
        );


    if (existing) {

        if (
            existing.quantity <
            product.stock
        ) {

            existing.quantity++;

        }

        else {

            showToast(
                "Maximum available stock reached!"
            );

            return;

        }

    }

    else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            category: product.category,

            quantity: 1

        });

    }


    saveCart(cart);

    updateCartCount();


    showToast(
        `${product.name} added to cart 🛒`
    );

}


// ==========================================
// MODAL
// ==========================================

function openModal(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    document.getElementById(
        "modalImage"
    ).src =
        product.image;


    document.getElementById(
        "modalName"
    ).textContent =
        product.name;


    document.getElementById(
        "modalCategory"
    ).textContent =
        product.category;


    document.getElementById(
        "modalRating"
    ).innerHTML =
        createStars(
            product.rating
        ) +
        ` ${product.rating}/5`;


    document.getElementById(
        "modalDescription"
    ).textContent =
        product.description;


    document.getElementById(
        "modalBrand"
    ).textContent =
        `Brand: ${product.brand}`;


    document.getElementById(
        "modalPrice"
    ).textContent =
        `₹${product.price.toLocaleString("en-IN")}`;


    document.getElementById(
        "modalOriginalPrice"
    ).textContent =
        `₹${product.originalPrice.toLocaleString("en-IN")}`;


    document.getElementById(
        "modalDiscount"
    ).textContent =
        `${product.discount}% OFF`;


    document.getElementById(
        "modalStock"
    ).textContent =
        product.stock < 10
        ? `⚠️ Only ${product.stock} left in stock`
        : `✓ ${product.stock} items in stock`;


    const thumbnails =
        document.getElementById(
            "modalThumbnails"
        );


    thumbnails.innerHTML = "";


    product.images
        .slice(0, 5)
        .forEach(
            image => {

                const img =
                    document.createElement(
                        "img"
                    );


                img.src = image;


                img.onclick =
                    function () {

                        document.getElementById(
                            "modalImage"
                        ).src =
                            image;

                    };


                thumbnails.appendChild(
                    img
                );

            }
        );


    document.getElementById(
        "modalAddButton"
    ).onclick =
        function () {

            addToCart(
                product.id
            );

        };


    document.getElementById(
        "productModal"
    ).classList.add(
        "show"
    );

}


function closeModal() {

    document.getElementById(
        "productModal"
    ).classList.remove(
        "show"
    );

}


// ==========================================
// WISHLIST DISPLAY
// ==========================================

function showWishlist() {

    const wishlist =
        getWishlist();


    const container =
        document.getElementById(
            "wishlistContainer"
        );


    container.innerHTML = "";


    if (
        wishlist.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-wishlist">

                <div>
                    ❤️
                </div>

                <h3>
                    Your wishlist is empty
                </h3>

                <p>
                    Add products you love.
                </p>

            </div>

        `;

    }

    else {

        wishlist.forEach(
            id => {

                const product =
                    products.find(
                        item =>
                            item.id === id
                    );


                if (!product) return;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "wishlist-item";


                item.innerHTML = `

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div>

                        <h3>
                            ${product.name}
                        </h3>

                        <strong>
                            ₹${product.price.toLocaleString("en-IN")}
                        </strong>

                    </div>

                    <button
                        onclick="
                            addToCart(
                                ${product.id}
                            )
                        "
                    >
                        🛒
                    </button>

                    <button
                        onclick="
                            toggleWishlist(
                                ${product.id}
                            )
                        "
                    >
                        ❌
                    </button>

                `;


                container.appendChild(
                    item
                );

            }
        );

    }


    document.getElementById(
        "wishlistModal"
    ).classList.add(
        "show"
    );

}


function closeWishlist() {

    document.getElementById(
        "wishlistModal"
    ).classList.remove(
        "show"
    );

}


// ==========================================
// DARK MODE
// ==========================================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark-mode"
    );


    const dark =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        "shopEasyDarkMode",
        dark
    );

}


// Load saved theme
if (
    localStorage.getItem(
        "shopEasyDarkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark-mode"
    );

}


// ==========================================
// TOAST
// ==========================================

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".toast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "show"
            );

        },
        10
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );


            setTimeout(
                () => {

                    toast.remove();

                },
                300
            );

        },
        2200
    );

}


// ==========================================
// CLOSE MODALS
// ==========================================

window.addEventListener(
    "click",
    function(event) {

        const productModal =
            document.getElementById(
                "productModal"
            );


        const wishlistModal =
            document.getElementById(
                "wishlistModal"
            );


        if (
            event.target ===
            productModal
        ) {

            closeModal();

        }


        if (
            event.target ===
            wishlistModal
        ) {

            closeWishlist();

        }

    }
);