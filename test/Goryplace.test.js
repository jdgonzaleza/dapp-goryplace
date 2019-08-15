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
      assert.equal(productCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount, 'id is correct')
      assert.equal(event.name, 'goryJugo', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')
      await await goryplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected;
      await await goryplace.createProduct('goryJugo', 0, {from: seller}).should.be.rejected;
    })

    
  })
  
})