const express = require('express')
const app = express()
const port = 4000
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID
require("dotenv").config();


app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nt3jq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db(process.env.DB_NAME).collection("activities");
    const volunteersCollection = client.db(process.env.DB_NAME).collection("volunteers");
    console.log("Database connected")

    app.post('/addActivity', (req, res) => {
        const products = req.body;
        collection.insertOne(products)
            .then(result => {
                // console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/activities', (req, res) => {
        collection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    })

    app.post('/addVolunteer', (req, res) => {
        const volunteerInfo = req.body;
        volunteersCollection.insertOne(volunteerInfo)
            .then(result => {
                // console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/registeredActivities', (req, res) => {
        volunteersCollection.find({ email: req.query.email })
            .toArray((err, document) => {
                res.send(document)
            })
    })
    app.get('/volunteerList', (req, res) => {
        volunteersCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.get('/activity/:id', (req, res) => {
        collection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.delete('/deleteUser/:id', (req, res) => {
        volunteersCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

});
app.get("/", (req, res) => {
    res.send(`<h1 style='text-align:center'>Welcome to Volunteer Network Database</h1>`)
})


app.listen(process.env.PORT || port)