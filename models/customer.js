const mongoose = require('mongoose');

const customerSchema = mongoose.Schema(

{
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    customerId:{type:Number,required:true,unique:true},
    dob:{type:Date}
},
{
collection:'customers',
timestamps:true,
writeConcern:{
    w:'majority',
    j:true,
    wtimeout:30000
},
read:'nearest'
}
);

const Model = mongoose.model('Customer',customerSchema);
module.exports = Model;