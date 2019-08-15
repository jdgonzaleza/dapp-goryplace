const Goryplace = artifacts.require('../contracts/Goryplace.sol')
require('chai')
  .use(require('chai-as-promised'))
  .should()
contract('Goryplace', ([deployer, seller, buyer]) => {
  let goryplace
  before( async () => {
    goryplace = await Goryplace.deployed()
  })

  describe('deployment', async () => {
    it('should deply successfully', async () => {
      const address = await goryplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
    it('should have a name', async () => {
      const name = await goryplace.name()
      assert.equal(name,'la goryTienda')
    })

  })

  describe('Products', async () => {
    let result, productCount
    before( async () => {
      result = await goryplace.createProduct('goryJugo', web3.utils.toWei('1', 'Ether'), {from: seller})
      productCount =await goryplace.productCount()
    })

    it('should create a product', async () => {
      //SUCCESS
      assert.equal(productCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount, 'id is correct')
      assert.equal(event.name, 'goryJugo', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')
      //Failure
      await await goryplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected;
      await await goryplace.createProduct('goryJugo', 0, {from: seller}).should.be.rejected;
    })

    it('should list products', async () => {
      const product = await goryplace.products(productCount)
      assert.equal(product.id.toNumber(), productCount, 'id is correct')
      assert.equal(product.name, 'goryJugo', 'name is correct')
      assert.equal(product.price, '1000000000000000000', 'price is correct')
      assert.equal(product.owner, seller, 'owner is correct')
      assert.equal(product.purchased, false, 'purchased is correct')
    })

    it('should sell product', async () => {
      //Track seller balance
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)

      result = await goryplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')})
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount, 'id is correct')
      assert.equal(event.name, 'goryJugo', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')

      //Check seller receive the funds
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)

      let price
      price = web3.utils.toWei('1', 'Ether')
      price = new web3.utils.BN(price)

      const expectedBalance = oldSellerBalance.add(price)
      assert.equal(newSellerBalance.toString(), expectedBalance.toString())

      //FAILURE: Buy product that does not exist
      await goryplace.purchaseProduct(1111, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
      //FAILURE: Buy without enough money
      await goryplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected
      // FAILURE: Buy a product that is already been sold.
      await goryplace.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
    })


  })

})