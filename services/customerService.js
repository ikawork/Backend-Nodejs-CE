const CustomerModel = require('../models/customer');
const ApiResponse = require('../utils/ApiResponse');

module.exports = {

    getAllCustomers: async(req,res) =>{

        try{
            const customers = await CustomerModel.find({});
            ApiResponse.success(res,customers);
        }catch(error){
            ApiResponse.failure(res,error,'error_ongetAllCustomers');
        }
    },

    getCustomer: async(req,res) => {
        try {
            const customer = await CustomerModel.findById(req.params.id);
            ApiResponse.success(res,customer);
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_getCustomer');
        }
    },

    addCustomer: async (req,res) =>{


        try{
            const body = req.body;
            const requiredFields = ['firstName','lastName','customerId'];
            for(const field of requiredFields){
                if (!body[field]) {
                    return ApiResponse.failure(res,{},`${field} is missing`,400);
                }
            }
            const result = await CustomerModel(body).save();
            ApiResponse.success(res,result); 
        }catch(error){
            ApiResponse.failure(res,error,'error_on_addCustomer');
        }
    },

    updateCustomer: async (req,res) => {
        try {
            const rec = await CustomerModel.findByIdAndUpdate({
                _id:req.params.id
            },{
                $set:req.body
            },{
                new:true
            });
            if(!rec){
                return ApiResponse.failure(res,{},'record_not_found',404);
            }
            ApiResponse.success(res,rec);
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_updateCustomer');
        }
    },

    search: async(req,res) =>{
        try {
            const query = req.query;
            let skip = 0;
            let limit = 10;
            if (query.skip) {
                skip = +query.skip;
            }
            if (query.limit) {
                limit =+query.limit;
            }
            const queryForSearch = {};
            if (req.query.searchText) {
                queryForSearch.$or = [
                    {
                        firstName:new RegExp(`.*${req.query.searchText}.*`,"i")
                    },{
                        lastName:new RegExp(`.*${req.query.searchText}.*`,"i")
                    },{
                        customerId: new RegExp(`.*${req.query.searchText}.*`,"i")
                    }]
            }
            const result = await CustomerModel.find(queryForSearch)
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