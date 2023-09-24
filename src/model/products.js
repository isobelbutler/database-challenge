const db = require('../database/db.js');
module.exports = { listProducts, searchProducts, getProduct };

// Challenge 1: List all products

const retrieve_products = db.prepare(/*sql*/ `
    SELECT
        id,
        name,
        quantity_per_unit,
        /* £%.2f = '£' is literal £; % is value placeholder; .2 is how many dec places; f is that it's a floating point num */
        FORMAT('£%.2f', unit_price) AS unit_price,
        units_in_stock,
        /* can do normal multiplication (e.g. price * stock AS stock_value) */
        FORMAT('£%.2f', unit_price * units_in_stock) AS stock_value,
        units_on_order
    FROM products
    `);

function listProducts() {
  const products = retrieve_products.all();
  console.log(products);
  return products;
}

// Challenge 2: Search for products

const search_products = db.prepare(/*sql*/ `
    SELECT
        id,
        name
    FROM products
    /* LIKE is a SQL pattern matching operator */
    WHERE name LIKE ?   
`);

function searchProducts(search_input) {
  // wrapping the search_input in % returns anything that contains the search_input
  return search_products.all(`%${search_input}%`);
}

// Challenge 3 and 4: Get specific product and add category info

const retrieve_specific_product = db.prepare(/*sql*/ `
    SELECT
        products.id,
        products.name,
        /* need AS in this instance because the alias is used in routes/product.js */
        categories.name AS category_name,
        categories.description AS category_description
    FROM products
    /* JOIN links the two common columnns from the different tables */
    JOIN categories ON products.category_id = categories.id
    /* select the data where ? matches shared id */
    WHERE products.id = ?
`);

function getProduct(id) {
  return retrieve_specific_product.get(id);
}
