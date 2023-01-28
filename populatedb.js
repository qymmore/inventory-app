#! /usr/bin/env node

console.log('This script populates some categories, items and item instances to your database.');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const Category = require('./models/category')
const Item = require('./models/item')
const ItemInstance = require('./models/iteminstance')


const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const categories = []
const items = []
const iteminstances = []

function categoryCreate(name, cb) {
  const category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function itemCreate(title, category, cb) {
  itemdetail = { 
    title: title,
  }
  if (category != false) itemdetail.category = category
    
  const item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}


function itemInstanceCreate(item, status, description, price, inStock, link, cb) {
  iteminstancedetail = { 
    item: item,
    description: description,
    price: price,
    inStock: inStock,
    link: link,
  }    
  if (status != false) iteminstancedetail.status = status
    
  const iteminstance = new ItemInstance(iteminstancedetail);    
  iteminstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING ItemInstance: ' + iteminstance);
      cb(err, null)
      return
    }
    console.log('New ItemInstance: ' + iteminstance);
    iteminstances.push(iteminstance)
    cb(null, item)
  }  );
}


function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Food', callback);
        },
        function(callback) {
          categoryCreate('Makeup', callback);
        },
        function(callback) {
          categoryCreate('Household', callback);
        },
        function(callback) {
          categoryCreate('School', callback);
        },
        function(callback) {
          categoryCreate('Tools', callback);
        },
        function(callback) {
          categoryCreate("Gems", callback);
        },
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Egg sandwich', categories[0], callback);
        },
        function(callback) {
          itemCreate('POWERMATTE LIPSTICK', categories[1], callback);
        },
        function(callback) {
          itemCreate('Simply Essential™ Plush', categories[2], callback);
        },
        function(callback) {
          itemCreate('Nike Ya Elemental Graphic Backpack', categories[3], callback);
        },
        function(callback) {
          itemCreate('Compact Hammer Drill Kit', categories[4], callback);
        },
        function(callback) {
          itemCreate('Unicorn Themed Sequin & Gem Mix', categories[5], callback);
        },
        ],
        // optional callback
        cb);
}


function createItemInstances(cb) {
    async.parallel([
        function(callback) {
          itemInstanceCreate(items[0], 'Available', 'Lorem ipsum dolor sit amet', 9.99, 100, callback)
        },
        function(callback) {
          itemInstanceCreate(items[1], 'Available', 'Lorem ipsum dolor sit amet', 13.99, 10, 'https://www.narscosmetics.ca/CA/powermatte-lipstick/999NAC0000147.html?dwvar_999NAC0000147_color=4251133508&cgid=lips', callback)
        },
        function(callback) {
          itemInstanceCreate(items[2], 'Unavailable', 'Lorem ipsum dolor sit amet', 23.50, 0, 'https://www.bedbathandbeyond.ca/store/product/simply-essential-plush-shag-accent-rug/5572954?keyword=fluffy-rug', callback)
        },
        function(callback) {
          itemInstanceCreate(items[3], 'Available', 'Lorem ipsum dolor sit amet', 8.99, 20, 'https://www.sportchek.ca/categories/shop-by-sport/bags/backpacks/product/nike-ya-elemental-graphic-backpack-color-333748792_01-333748792.html#333748792%5Bcolor%5D=333748792_01',callback)
        },
        function(callback) {
          itemInstanceCreate(items[4], 'Unavailable', 'Lorem ipsum dolor sit amet', 5.99, 0, callback)
        },
        function(callback) {
          itemInstanceCreate(items[5], 'Available', 'Lorem ipsum dolor sit amet', 7.99, 100, 'https://canada.michaels.com/en/unicorn-themed-sequin-and-gem-mix-by-creatology/10689705.html', callback)
        },
        ],
        // Optional callback
        cb);
}

async.series([
    createCategories,
    createItems,
    createItemInstances,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ITEMInstances: '+iteminstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



