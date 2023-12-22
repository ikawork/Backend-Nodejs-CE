const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema(

{
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    employeeId:{type:Number,required:true,unique:true},
    department:{type:String,required:true},
    dob:{type:Date}
},
{
collection:'employees',
timestamps:true,
writeConcern:{
    w:'majority',
    j:true,
    wtimeout:30000
},
read:'nearest'
}
);

const Model = mongoose.model('Employee',employeeSchema);
module.exports = Model;