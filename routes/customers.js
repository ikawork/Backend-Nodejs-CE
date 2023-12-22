var express = require('express');
var router = express.Router();
var ApiSecurity = require('../middlewares/apiSecurity');

var CustomerService  = require('../services/customerService');


router.get('/all',ApiSecurity.reuqireLogin,CustomerService.getAllCustomers);
router.get('/search',CustomerService.search);
router.get('/:id',CustomerService.getCustomer);
router.post('/',ApiSecurity.requirePermits('customer.add'),CustomerService.addCustomer);
router.put('/:id',ApiSecurity.requirePermits('customer.update','customer.add'),CustomerService.updateCustomer);

module.exports = router;