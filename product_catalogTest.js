

//var server = require("./")
var PRODUCTS = require("./product_catalog");

// initialize Product Catalog DB
//PRODUCTS.initProductCatalog();


////// GET products sorted by Sku
//PRODUCTS.getProductsSortedBySku( function(err, products) {
//    if (err) {
//        console.log('ERROR: ' +JSON.stringify(err));
//    } else if (products) {
//        console.log('Number of Products: ' +products.length);
//        products.forEach(function (row) {
//            console.log('    row: ' + JSON.stringify(row) );
//        });
//    }
//});


////// GET a Product by its SKU
//PRODUCTS.getProductBySku('10000213A', function(err, prod) {
//    if (err) {
//        console.log('ERROR: ' + JSON.stringify(err));
//    } else if (prod) {
//        console.log('Product found: '  + JSON.stringify(prod));
//    }
//});


////// GET products sorted by Name
//PRODUCTS.getProductsSortedByName( function(err, products) {
//    if (err) {
//        console.log('ERROR: ' +JSON.stringify(err));
//    } else if (products) {
//        console.log('Number of Products: ' +products.length);
//        products.forEach(function (row) {
//            console.log('    row: ' + JSON.stringify(row) );
//        });
//    }
//});


////// GET a Product by its name
//PRODUCTS.getProductByName('Moto G (8GB) - Black', function(err, prod) {
//    if (err) {
//        console.log('ERROR: ' + JSON.stringify(err));
//    } else if (prod) {
//        console.log('Product found: '  + JSON.stringify(prod));
//    }
//});

var newProd = {
    Sku: 'A1', Name: 'Power for Moto X', Type: 'Accessory', 
    Price:5, 'Color': 'Blue', "field1": 100,
    "obj1": {
        "Key1":1, "Key2":"50W", "Field1": "Value1", "Field2": "Value2"
    }
};

PRODUCTS.createProduct(newProd, function(err, result) {
    if (err) {
        console.log('ERROR: ' + JSON.stringify(err));
    } else if (result) {
        console.log('Result: '  + JSON.stringify(result));
    }
    
});


//PRODUCTS.deleteProduct(newProd , function(err, result) {
//    if (err) {
//        console.log('ERROR: ' + JSON.stringify(err));
//    } else if (result) {
//        console.log('Result: '  + JSON.stringify(result));
//    }
//    
//});

//PRODUCTS.updateProduct(newProd, function(err, result) {
//    if (err) {
//        console.log('ERROR: ' + JSON.stringify(err));
//    } else if (result) {
//        console.log('Result: '  + JSON.stringify(result));
//    }
//    
//});

