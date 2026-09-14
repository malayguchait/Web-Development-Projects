// ==========================================
// SHOP EASY - ADVANCED CART
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


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    const container =
        document.getElementById(
            "cartContainer"
        );


    const summary =
        document.getElementById(
            "cartSummary"
        );


    if (!container) return;


    const cart =
        getCart();


    if (
        cart.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Looks like you haven't added
                    anything yet.
                </p>

                <a
                    href="index.html"
                    class="shop-btn"
                >
                    Start Shopping →
                </a>

            </div>

        `;


        summary.innerHTML = "";

        return;

    }


    container.innerHTML = "";


    let subtotal = 0;


    cart.forEach(
        item => {

            const itemTotal =
                item.price *
                item.quantity;


            subtotal +=
                itemTotal;


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "cart-item";


            element.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    class="cart-item-image"
                    onerror="
                        this.src='https://dummyjson.com/image/200x200/eeeeee/555555?text=Product'
                    "
                >


                <div class="cart-item-details">

                    <span class="cart-category">
                        ${item.category || "Product"}
                    </span>

                    <h3>
                        ${item.name}
                    </h3>

                    <p class="cart-price">
                        ₹${item.price.toLocaleString("en-IN")}
                    </p>

                </div>


                <div class="quantity-controls">

                    <button
                        onclick="
                            decreaseQuantity(
                                ${item.id}
                            )
                        "
                    >
                        −
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        onclick="
                            increaseQuantity(
                                ${item.id}
                            )
                        "
                    >
                        +
                    </button>

                </div>


                <div class="item-total">

                    ₹${itemTotal.toLocaleString("en-IN")}

                </div>


                <button
                    class="remove-btn"
                    onclick="
                        removeFromCart(
                            ${item.id}
                        )
                    "
                >
                    🗑
                </button>

            `;


            container.appendChild(
                element
            );

        }
    );


    // ======================================
    // DELIVERY
    // ======================================

    let delivery = 0;


    if (
        subtotal < 2000
    ) {

        delivery = 50;

    }


    // ======================================
    // DISCOUNT
    // ======================================

    let discount = 0;


    if (
        subtotal >= 5000
    ) {

        discount =
            Math.round(
                subtotal * 0.05
            );

    }


    const total =
        subtotal +
        delivery -
        discount;


    // ======================================
    // SUMMARY
    // ======================================

    summary.innerHTML = `

        <h2>
            Order Summary
        </h2>


        <div class="summary-row">

            <span>
                Subtotal
            </span>

            <span>
                ₹${subtotal.toLocaleString("en-IN")}
            </span>

        </div>


        <div class="summary-row">

            <span>
                Delivery
            </span>

            <span>

                ${
                    delivery === 0
                    ? "FREE"
                    : "₹50"
                }

            </span>

        </div>


        ${
            discount > 0
            ? `

                <div
                    class="summary-row
                    discount-row"
                >

                    <span>
                        5% Discount
                    </span>

                    <span>
                        -₹${discount.toLocaleString("en-IN")}
                    </span>

                </div>

              `
            : ""
        }


        <hr>


        <div class="summary-total">

            <span>
                Total
            </span>

            <strong>
                ₹${total.toLocaleString("en-IN")}
            </strong>

        </div>


        ${
            subtotal < 2000
            ? `

                <div class="free-delivery-message">

                    🚚 Add ₹${
                        (
                            2000 -
                            subtotal
                        ).toLocaleString(
                            "en-IN"
                        )
                    } more for FREE delivery!

                </div>

              `
            : `

                <div class="free-delivery-message">

                    🎉 You have FREE delivery!

                </div>

              `
        }


        <button
            class="checkout-btn"
            onclick="checkout()"
        >
            🔒 Proceed to Checkout
        </button>


        <button
            class="clear-cart-btn"
            onclick="clearCart()"
        >
            Clear Cart
        </button>

    `;

}


// ==========================================
// INCREASE
// ==========================================

function increaseQuantity(id) {

    const cart =
        getCart();


    const item =
        cart.find(
            product =>
                product.id === id
        );


    if (item) {

        item.quantity++;

    }


    saveCart(cart);

    displayCart();

}


// ==========================================
// DECREASE
// ==========================================

function decreaseQuantity(id) {

    const cart =
        getCart();


    const item =
        cart.find(
            product =>
                product.id === id
        );


    if (!item) return;


    if (
        item.quantity > 1
    ) {

        item.quantity--;

    }

    else {

        removeFromCart(id);

        return;

    }


    saveCart(cart);

    displayCart();

}


// ==========================================
// REMOVE
// ==========================================

function removeFromCart(id) {

    let cart =
        getCart();


    cart =
        cart.filter(
            item =>
                item.id !== id
        );


    saveCart(cart);

    displayCart();

}


// ==========================================
// CLEAR
// ==========================================

function clearCart() {

    const cart =
        getCart();


    if (
        cart.length === 0
    ) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to clear your cart?"
        );


    if (confirmed) {

        localStorage.removeItem(
            "shopEasyCart"
        );


        displayCart();

    }

}


// ==========================================
// CHECKOUT
// ==========================================

function checkout() {

    const cart =
        getCart();


    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty!"
        );

        return;

    }


    alert(
        "🎉 Order placed successfully!\n\n" +
        "Thank you for shopping with ShopEasy!\n\n" +
        "This is a demo checkout."
    );


    localStorage.removeItem(
        "shopEasyCart"
    );


    displayCart();

}


// ==========================================
// INITIAL LOAD
// ==========================================

displayCart();