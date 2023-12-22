var express = require('express');
var router = express.Router();
var ApiSecurity = require('../middlewares/apiSecurity');

var  EmployeeService = require('../services/employeeService');

router.get('/all',ApiSecurity.reuqireLogin,EmployeeService.getAllEmployees);
router.get('/search',EmployeeService.search);
router.get('/:id',EmployeeService.getEmployee);
router.post('/',ApiSecurity.requirePermits('employee.add'),EmployeeService.addEmployee);
router.put('/:id',ApiSecurity.requirePermits('employee.update','employee.add'),EmployeeService.updateEmployee);

module.exports = router;