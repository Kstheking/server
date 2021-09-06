var express = require('express')
var router = express.Router();
var jwt = require('jsonwebtoken');

const products = [
  {
    id: 1,
    imageSource: "assets/images/donuts/blueDonut.svg",
    name: "Blue Donut",
    price: 34,
    quantity: 10,
    quantityInCart: 0
  },
  {
    id: 2,
    imageSource: "assets/images/donuts/darkOrangeDonut.svg",
    name: "Dark Orange Donut",
    price: 34,
    quantity: 10,
    quantityInCart: 0
  },
  {
    id: 3,
    imageSource: "assets/images/donuts/greenDonut.svg",
    name: "Green Donut",
    price: 34,
    quantity: 0,
    quantityInCart: 10
  },
  {
    id: 4,
    imageSource: "assets/images/donuts/lightBlueDonut.svg",
    name: "Light Blue Donut",
    price: 34,
    quantity: 10,
    quantityInCart: 0
  },
  {
    id: 5,
    imageSource: "assets/images/donuts/orangeDonut.svg",
    name: "Orange Donut",
    price: 34,
    quantity: 10,
    quantityInCart: 0
  },
  {
    id: 6,
    imageSource: "assets/images/donuts/pinkDonut.svg",
    name: "Pink Donut",
    price: 34,
    quantity: 0,
    quantityInCart: 10
  },
  {
    id: 7,
    imageSource: "assets/images/donuts/purpleDonut.svg",
    name: "Purple Donut",
    price: 34,
    quantity: 10,
    quantityInCart: 0
  },
  {
    id: 8,
    imageSource: "assets/images/donuts/violetDonut.svg",
    name: "Violet Donut",
    price: 34,
    quantity: 10,
    quantityInCart: 0
  },
];

var checkIfLoggedIn = (req, res, next) => {
  var token = req.get('X-AUTH-HEADER');
  var user = jwt.decode(token);
  if (user && user.user) {
    return next();
  }
  return res.status(403).json({msg: 'Please login to access this information'});
};

router.get('/', (req, res) => {
  var query = (req.query['q'] || '').toLowerCase();
  if(query == "") return res.status(200).json(products);
  if (query) {
    const foundProducts = products.filter(
      (product) => product.name.toLowerCase().indexOf(query) != -1);
    return res.status(200).json(foundProducts);
  }
  return res.status(200).json(products);
});

router.get('/:id', (req, res) => {
  let productId = req.params.id;
  const foundProduct = products.find((product) => product.id == productId);
  if (foundProduct) {
    res.json(foundProduct);
  } else {
    return res.status(400).json({msg: 'Product with id ' + productId + ' not found.'})
  }
});

router.post('/', checkIfLoggedIn, (req, res) => {
  let product = req.body;

  if (product.id) {
    return res.status(400)
        .json({msg: 'Product seems to already have an id assigned'});
  }

  product.id = products.length + 1;
  products.push(product);
  return res.status(200).json(product);
});

router.patch('/:id',checkIfLoggedIn, (req, res) => {
  let productId = req.params.id;//change it to use names
  const foundProduct = products.find((product) => product.id == productId);
  if (foundProduct) {
    let changeInQuantity = req.body.changeInQuantity;
    foundProduct.quantity += changeInQuantity;
    foundProduct.quantityInCart -= changeInQuantity;
    return res.status(200).json({msg: 'Successfully updated cart'});
  }
  return res.status(400).json({msg: 'Product with id ' + productId + ' not found.'});
});

module.exports = router;