//express library 
var express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
var mongodb= require('mongodb');
var app = express()

app.set("view engine", "hbs");
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

//duong dan den database
var url = 'mongodb+srv://atn1644:12345@cluster0.qacoc.mongodb.net/test'
//import thu vien MongoDB
var MongoClient = require('mongodb').MongoClient;


app.get('/',async (req,res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    let product = await dbo.collection("product").find().toArray()
    res.render('home',{'product':product})
})

app.get('/add',(req,res)=>{
    res.render('add')
})

app.post("/add", async(req, res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picURL = req.body.txtPicture
    if (name.length <= 6) {
        res.render('add', { 'nameError': 'Name should not be longer than 5 characters'})
        return
    }
    let product = {
        'name': name,
        'price': price,
        'picURL': picURL
    }
    
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    await dbo.collection("product").insertOne(product);
    res.redirect('/')
})

app.post('/search', async(req,res)=>{
    let nameSearch = req.body.txtName
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    let products = await dbo.collection("product").find({$or: [{'name': new RegExp(nameSearch,'i')},{_id: nameSearch}]}).toArray()
    res.render('home',{'product':products})
})

// app.post('/ascending', async(req,res)=>{
//     let sortPrice = req.body.price

//     let server = await MongoClient.connect(url)

//     let dbo = server.db("ATNToys")

//     let results = await dbo.collection('product').find({'name': new RegExp(sortPrice,'i')}).sort({'price':1}).toArray()

//     res.render('home',{model:results})
// })

//PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running");
})







