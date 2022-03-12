let express = require("express");
let bodyparser = require("body-parser");
let mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;

const app = express();
app.use(express.static(__dirname));

app.use(bodyparser.json())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({
    extends:true
}))

mongoose.connect('mongodb://127.0.0.1:27017/Callendar');
let db = mongoose.connection;

db.on('error', ()=>console.log("Erreur connexion"));
db.once('open',()=>console.log("Connect to database"));

// add
app.post("/add",(req,res)=>{
    let title = req.body.title;
    let start = req.body.start;
    let end = req.body.end;
    let statut = req.body.statut;
    let color = "#"+Math.floor(Math.random()*16777216).toString(16);
    let data = {
        "title":title,
        "start":start,
        "end":end,
        "statut":statut,
        "color": color
    }
    console.log(data);
    db.collection('TodoList').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
    });
    return res.redirect('index.html');
})
//  Display data
app.get("/all",(req,res)=>{
    db.collection("TodoList").find({}).toArray(function(err, result) {
        if (err) throw err;
        return res.send(result);
    });
})

// Delete data
app.get("/delete/:id",(req,res)=>{
    let GetId = req.params.id.substring(1);
    db.collection("TodoList").deleteOne({"_id":ObjectId(GetId)}, function(err, obj) {
        if (err) throw err;
    });
    return res.redirect('/');
});

// Page d'accueil
app.get("/",(req,res)=>{
    res.set({
        "Allow-acces-Allow-Origin": '*',
    })
    return res.redirect('index.html');
}).listen(3000);

