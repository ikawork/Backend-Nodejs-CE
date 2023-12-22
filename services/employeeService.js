const EmployeeModel = require('../models/employee');
const ApiResponse = require('../utils/ApiResponse');

module.exports = {

 getAllEmployees:async(req,res)=>{
    try {
        const employees = await EmployeeModel.find({});
        ApiResponse.success(res,employees);
    } catch (error) {
        ApiResponse.failure(res,error,'error_on_getAllEmployees');
    }
 },

 getEmployee: async (req,res) =>{
    try{
        const employee = await EmployeeModel.findById(req.params.id);
        ApiResponse.success(res,employee);
    } catch(error){
        ApiResponse.failure(res,error,'error_on_getEmployee');
    }
 },

 addEmployee:async(req,res)=>{

    try{
        const body = req.body;
        const requiredFields = ['firstName','lastName','employeeId','department'];
        for(const field of requiredFields){
            if(!body[field]){
                return ApiResponse.failure(res,{},`${field} is missing`, 400);
            }
        }
        const result = await new EmployeeModel(body).save();
        ApiResponse.success(res,result);
    }catch(error){
        ApiResponse.failure(res,error,'error_on_addEmployee');
    }
},

 updateEmployee:async(req,res)=>{

    try {
        const rec = await EmployeeModel.findByIdAndUpdate({
            _id: req.params.id
        },{
            $set:req.body
        },{
            new: true
        });
        if(!rec){
            return ApiResponse.failure(res,{},'record_not_found',404);
        }
        ApiResponse.success(res,rec);        
    } catch (error) {
        ApiResponse.failure(res,error,'error_on_updateEmployee');
    }
},

 search:async(req,res) => {

    try {
        const query = req.query;
        let skip =0;
        let limit =10;
        if(query.skip){
            skip =+query.skip;
        }
        if(query.limit){
            limit =+query.limit;
        }
        const queryForSearch ={};
        if(req.query.serachText){
            queryForSearch.$or=[
                {
                    firstName:new RegExp(`.*${req.query.searchText}.*`, "i")
                },{
                    lastName:new RegExp(`.*${req.query.searchText}.*`, "i")
                },{
                    employeeId:new RegExp(`.*${req.query.searchText}.*`, "i")
                },
            ]
        }
        const result = await EmployeeModel.find(queryForSearch)
        .sort({createdAt:1})
        .skip(skip)
        .limit(limit)
        .lean();
        ApiResponse.success(res,result);

    } catch (error) {
        ApiResponse.failure(res,error,'error_on_search');
    }

 }
};