// ==========================================
// SHOP EASY - REAL PRODUCTS
// ==========================================

const products = [];


// ==========================================
// LOAD REAL PRODUCTS
// ==========================================

fetch("https://dummyjson.com/products?limit=100")

    .then(response => {

        if (!response.ok) {
            throw new Error("Product API error");
        }

        return response.json();

    })

    .then(data => {

        data.products.forEach((item, index) => {

            products.push({

                id: item.id,

                name: item.title,

                price: Math.round(
                    item.price * 85
                ),

                originalPrice: Math.round(
                    (
                        item.price * 85
                    ) /
                    (
                        1 -
                        item.discountPercentage / 100
                    )
                ),

                category:
                    convertCategory(
                        item.category
                    ),

                apiCategory:
                    item.category,

                image:
                    item.images &&
                    item.images.length
                        ? item.images[0]
                        : item.thumbnail,

                images:
                    item.images &&
                    item.images.length
                        ? item.images
                        : [item.thumbnail],

                description:
                    item.description,

                rating:
                    item.rating,

                stock:
                    item.stock,

                brand:
                    item.brand ||
                    "ShopEasy",

                discount:
                    Math.round(
                        item.discountPercentage
                    )

            });

        });


        console.log(
            "Real products loaded:",
            products.length
        );


        if (
            typeof initializeShop ===
            "function"
        ) {

            initializeShop();

        }

    })

    .catch(error => {

        console.error(
            "Could not load products:",
            error
        );


        const grid =
            document.getElementById(
                "productGrid"
            );


        if (grid) {

            grid.innerHTML = `

                <div class="no-products">

                    <h2>
                        Unable to load products
                    </h2>

                    <p>
                        Please check your internet
                        connection and refresh the page.
                    </p>

                </div>

            `;

        }

    });


// ==========================================
// CATEGORY CONVERTER
// ==========================================

function convertCategory(category) {

    if (

        category === "smartphones" ||

        category === "tablets" ||

        category ===
            "mobile-accessories"

    ) {

        return "Mobile";

    }


    if (

        category === "laptops" ||

        category ===
            "computer-accessories"

    ) {

        return "Computers";

    }


    if (

        category === "mens-shirts" ||

        category === "mens-shoes" ||

        category === "mens-watches" ||

        category === "womens-dresses" ||

        category === "womens-shoes" ||

        category === "womens-bags" ||

        category ===
            "womens-jewellery" ||

        category ===
            "womens-watches" ||

        category === "tops" ||

        category === "sunglasses"

    ) {

        return "Fashion";

    }


    if (

        category === "beauty" ||

        category === "skin-care" ||

        category === "fragrances"

    ) {

        return "Beauty";

    }


    if (

        category ===
            "sports-accessories"

    ) {

        return "Sports";

    }


    if (

        category === "furniture" ||

        category ===
            "home-decoration" ||

        category ===
            "kitchen-accessories"

    ) {

        return "Home";

    }


    if (

        category === "groceries"

    ) {

        return "Home";

    }


    return "Electronics";

}