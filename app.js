const express = require('express');
const path = require('path');
const {body , validationResult} = require('express-validator');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');

app.use(express.static('public'));   //For CSS files
app.use('/uploads',express.static('uploads'));  //For Saving uploaded Images
app.set('view engine', 'ejs');   //EJS Engine

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({storage: storage});

app.get('/form', (req,res)=>{  //For displaying create new user form : http://localhost:3001/form
    res.render('form-validate', {errors:null});
})

const validateFormWIthImage = [
    body('name').isLength({min:5}).withMessage('Name is required with minimum 5 chars'),
    body('age').isInt({ min: 18 }).withMessage('Age must be a number greater than 18'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('image').custom((value, {req})=>{
        if(!req.file){ //If file is not uploaded or added or selected
            throw new Error('Image is required');
        }
        return true
    })

]

app.post('/submit', upload.single('image'), validateFormWIthImage, (req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.render('form-validate',{errors:errors.array()});
    }
    const{name,email,age} = req.body;
    const imagePath = req.file.path;

    res.render('submission-validate', {name, email, age, imagePath})
})

const PORT = 3005;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});


//Install --> npm install path multer 
//npm install method-override express-validator ejs 
//npm install express 
//npm install body-parser
//npx nodemon app.js
