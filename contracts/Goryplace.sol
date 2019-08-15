pragma solidity ^0.5.0;

contract Goryplace {
  string public name;
  uint public productCount = 0;
  mapping(uint => Product) public products;

  struct Product {
    uint id;
    string name;
    uint price;
    address payable owner;
    bool purchased;
  }

  event ProductCreated(
    uint id,
    string name,
    uint price,
    address payable owner,
    bool purchased
  );
  event ProductPurchased(
    uint id,
    string name,
    uint price,
    address payable owner,
    bool purchased
  );
  constructor() public {
    name = "la goryTienda";
  }

  function createProduct(string memory _name, uint _price) public {
     // validate name was inputed
    require(bytes(_name).length> 0);

    // validate price
    require(_price > 0, 'price must be gratter than 0');
    productCount++;
    products[productCount] = Product(productCount, _name, _price, msg.sender, false ); // create product
    emit ProductCreated(productCount, _name, _price, msg.sender, false );
  }

  function purchaseProduct(uint _id) public payable {
    Product memory _product = products[_id]; //Fetch product
    address payable _seller = _product.owner; // Fetch owner

    require(_product.id > 0 && _product.id <= productCount, 'the product does not exists' );
    require(msg.value >= _product.price, 'You dont have money');
    require(!_product.purchased, 'The product has been sold');

    _product.owner = msg.sender;
    _product.purchased = true;
    products[_id] = _product;
    address(_seller).transfer(msg.value);
    emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true );

  }

}