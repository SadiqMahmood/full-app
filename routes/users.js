const Joi = require('joi');
var express = require('express');
const mongoose = require('mongoose');
// const func = require('joi/lib/types/func');
var router = express.Router();
const path = require('path');


var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const Faculty = mongoose.model('Faculty', new mongoose.Schema({ 
    facultyID: {type: Number, required:'this field is required',unique:true},
    name:{ type: String, required: 'this field is required', minlength: 3},
    gender: { type: String, required: 'this field is required', lowercase: true, enum: ['male','female'] },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'this field is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    address : {
        street_address: { type: String, required: 'this field is required' },
        city:  { type: String, required: 'this field is required' },
        country:  { type: String, required: 'this field is required' }
    },
    course_code:  { type: String, required: 'this field is required', minlength: 3 },
    phone_number: { type: Number, required: 'this field is required'}

})); 
 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {viewpoint: "Faculty data"});
});

router.get('/database', (req,res) => {
  Faculty.find((err,docs)=>{
      if(!err){
          res.render("DBFile",{list: docs});
      }
      else{
          console.log('error in retriving faculty List');
      }
  })
  
});

router.post('/', (req,res)=>{
  if (req.body._id == '')
  insertRecord(req, res);
  else
  updateRecord(req, res);   
});
module.exports = router;

function insertRecord(req,res){
  var faculty = new Faculty({
      facultyID: req.body.facultyID,
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      address: {
          street_address: req.body.street_address,
          city: req.body.city,
          country: req.body.country
      },
      course_code: req.body.course_code,
      phone_number: req.body.phone_number
  });
  faculty.save((err,doc)=>{
      if(!err) 
          res.redirect('DBFile');
      else{
              if(err.name == 'ValidationError'){
              handleValidationError(err,req.body);
              res.render("/",{
                  viewTitle : "Insert Faculty Credentials",
                  Faculty: req.body
              });
              }
              else
              console.log ('error occured during the posting'+err);
      }
  });
}
router.get('/delete/:id',(req,res)=>{
  Faculty.findByIdAndRemove(req.params.id,(err,doc)=>{
      if(!err){
          res.redirect('../database');
      }
      else{
          console.log('Error in employee delete:'+ err);
      }
  })
});


function handleValidationError(err,body){
 for(field in err.errors){
     switch(err.errors[field].path){
          case 'facultyID':
             body['facultyIDError'] = err.errors[field].message;
             break;
          case 'name':
              body['nameError'] = err.errors[field].message;
              break;
          case 'gender':
              body['genderError'] = err.errors[field].message;
              break;
          case 'email':
              body['emailError'] = err.errors[field].message;
              break;
          case 'address.street_address':
              body['street_addressError'] = err.errors[field].message;
              break;
          case 'address.city':
              body['cityError'] = err.errors[field].message;
              break;
          case 'address.country':
              body['countryError'] = err.errors[field].message;
              break;
          case 'course_code':
              body['course_codeError'] = err.errors[field].message;
              break;
          case 'phone_number':
              body['phone_numberError'] = err.errors[field].message;
              break;
          default:
              break;


     }
 }
}


