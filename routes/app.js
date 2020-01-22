const UserController = require('../contoller/UserContoller');
const auth = require('../middleware/auth');
const express = require('express');
const PORT = process.env.PORT || 3100;
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    return res.send(" welcome to  TaylorFit project");
})

app.post('/register', (req, res) =>{
    UserController.signUp(req, res);
});

app.post('/login', (req, res) =>{
    UserController.signIn(req, res);
});

app.post('/customer/register', auth, (req,  res) =>{
    UserController.createCustomer(req, res);
});

app.post('/gigs/register', auth, (req, res) =>{
    UserController.createGig(req, res);
});

app.post('/gigs/update', auth, (req, res) =>{
    UserController.updateGig(req, res);
});

app.get('/customers', auth, (req, res) =>{
    UserController.getCustomers(req, res);
});

app.get('/gigs', auth, (req, res) =>{
    UserController.getGigs(req, res);
});


app.listen(PORT, () =>{
    console.log("server running on", PORT);   
})

