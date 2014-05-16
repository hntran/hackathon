/* 
 * Interface to a simple Product Catalog implemented in CouchDB, node.js, and cradle
 * 
 * Requirements:
 * 1. CouchDB       // from Apache
 * 
 * 2. node.js       
 *      sudo npm install node
 * 
 * 3. cradle        
 *      https://github.com/flatiron/cradle
 *      npm install cradle
 *      
 *      
 *      
 *  A product document must contain following fields:
 *      1.  SKU     used internally as ID 
 *      2.  Name    
 *      3.  Type    Device, Accessory
 *      
 *  Optional fields
 *      4.  Price   
 *      5.  Color  
 *      6.  attachments     
 *      
 *      
 */

//  Configuration 
var HOST = 'http://localhost';
var PORT = 5984;
var DB_NAME = "products";
var DB_DESIGN = "productcatalog";
var ADMIN_USER = 'admin';           // required for design 
var ADMIN_PSWD = 'admin2'; 


// required modules
var cradle = require("cradle");
var request = require("request");

// Couch connection and DB
var connection = new(cradle.Connection)(HOST, PORT, 
                      { cache: true, raw: false, orceSave: true,
                        auth: { username: ADMIN_USER, password: ADMIN_PSWD } 
                      });
var db = connection.database(DB_NAME);

// check for existence, create new if not exist
initProductCatalog = function() {
    db.exists(function (err, exists) {
        if (err) {
          console.log('error', err);
        } else if (exists) {
          console.log('database ' +DB_NAME + '  exists.');
        } else {
          console.log('database  ' +DB_NAME + ' does not exists. creating it');
          db.create();
          /* populate design documents */

          console.log('database  ' +DB_NAME + ' created successfully');
        }
      });
};


// GET a product by SKU
getProductBySku = function(sku, callback) {
    console.log('  ***** GET product with SKU='+sku);
    db.get(sku,  function(err, doc) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }
        return callback(err, doc);
    });
};


// GET a product by name
getProductByName = function(name, callback) {
    console.log('  ***** GET product with Name=['+name +']');
    db.view(DB_DESIGN + '/byName', { key: name }, function (err, product) {
    if (err) {
        console.log('ERROR: ' +err);
    }
    return callback(err, product);
  });
};




// GET list of all products sorted by SKU
getProductsSortedBySku = function(callback) {
    console.log('  ***** list all products sorted by SKU');
    db.view(DB_DESIGN + '/byId', function (err, prods) {
    if (err) {
        console.log('ERROR: ' +err);
    }
    return callback(err, prods);
  });
};


// GET list of all products sorted by Name
getProductsSortedByName = function(callback) {
    console.log('  ***** list all products sorted by Name');
    db.view(DB_DESIGN + '/byName', function (err, prods) {
    if (err) {
        console.log('ERROR: ' +err);
    }
    return callback(err, prods);
  });
};


// Creates and inserts Products
createProduct = function(product, callback) {
    validateRequiredFields(product);
    validateNotExist(product.Sku);
    
    console.log('  **** create product: ' + JSON.stringify(product));
    db.save(product.Sku, product, function(err, result) {
        if (err) {
            console.log('ERROR: ' +err);
        }
        return callback(err, result);
    });
};


// Updates an existing product with new values.
// Only the fields specified in the argument product will be updated
updateProduct = function(newProduct, callback) {
    validateExist(newProduct.Sku, function(err, existingProduct) {
        console.log('  **** update product: ' + JSON.stringify(existingProduct) 
                + '\n\twith new values: '  + JSON.stringify(newProduct));
        
        // update new fields/values to existingProduct
        for (var prop in newProduct) {
            if (newProduct.hasOwnProperty(prop)) {
                existingProduct[prop] = newProduct[prop];
            }
        };

        db.save(existingProduct.Sku, existingProduct, function(err, result) {
            if (err) {
                console.log('ERROR: ' +err);
            }
            return callback(err, result);
        });
    });
};

// Deletes an existing product
deleteProduct = function(product, callback) {
    validateExist(product.Sku, function(err, existingProduct) {
        console.log('  **** delete product: ' + JSON.stringify(existingProduct));
        db.remove(product.Sku, existingProduct._rev, function(err, result) {
            if (err) {
                console.log('ERROR: ' +err);
            }
            return callback(err, result);
        });
    });
};



// Bulk updates all products with newKeyValues.
// Keys can be any field name except "_id", "_rev", and "Sku"
updateAll = function(newKeyValuess, callback) {
    console.log('  ***** updating all products with new Field-Values: ' + JSON.stringify(newKeyValues));
    db.view(DB_DESIGN + '/byId', function (err, prods) {
        if (err) {
            console.log('ERROR: ' +err);
        }
        
        prods.forEach(function(prod) {
            for (var key in newKeyValues) {
                
            }
        });
        
        return callback(err, prods);
    });
};



// Validates that a product with given Sku does exist and returns it
validateExist = function(sku, callback) {
    if (!sku) { throw( "requires a valid SKU" ); }

    db.get(sku,  function(err, prod) {
        if (err || !prod) {
            console.log('ERROR: SKU '+sku +' does not exist');
            throw('SKU '+sku +' does not exist');
        }
        
        return callback(err, prod);
    });
}


// Validates that product does contain the required fields: Sku, Name, and Type
validateRequiredFields = function(product) {
    function require(field) {
        if (!product[field]) { throw( " Product must have field: " + field ); }
    };

    require("Sku");
    require("Name");
    require("Type");
    console.log('Product has all required fields');
};

// Validates that a product with the given Sku does not exist
validateNotExist = function(sku) {
    if (!sku) { throw( "requires a valid SKU" ); }
    
    db.get(sku,  function(err, prod) {
        if (!err || prod) {
            console.log('ERROR: SKU '+sku +' already exists');
            throw('SKU '+sku +' already exists');
        }
    });
}

    

exports.initProductCatalog = initProductCatalog;
exports.getProductBySku = getProductBySku;
exports.getProductByName = getProductByName;
exports.getProductsSortedBySku = getProductsSortedBySku;
exports.getProductsSortedByName = getProductsSortedByName;

exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
//exports.updateAll = updateProduct;