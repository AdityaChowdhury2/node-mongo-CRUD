const express = require('express');
var bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const uri = "mongodb+srv://organicUser:1234@cluster0.dxvsi.mongodb.net/organicDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
    // res.send('Hello!!! I am Working...');
})
async function run() {
    try {
        await client.connect();
        // database and collection code goes here
        const db = client.db("organicDb");
        const productCollection = db.collection("products");
        console.log('Database Connection Established')
        //Read data from database code here
        app.get('/products', (req, res) => {
            productCollection.find({})
                .toArray((err, document) => {
                    res.send(document)
                })
        })
        // Create data code here
        app.post('/addProduct', (req, res) => {
            const product = req.body;
            productCollection.insertOne(product)
                .then(() => {
                    res.redirect('/')
                });
        })
        //Delete data code here
        app.delete('/delete/:id', (req, res) => {
            productCollection.deleteOne({ _id: ObjectId(req.params.id) })
                .then(result => {
                    res.send(result.deletedCount > 0)
                })
            // console.log();
        })
        //Get Single Product
        app.get('/product/:id', (req, res) => {
            productCollection.find({ _id: ObjectId(req.params.id) })
                .toArray((err, document) => {
                    res.send(document[0])
                })
        })
        //Update data code here
        app.patch('/update/:id', (req, res) => {

            productCollection.updateOne({ _id: ObjectId(req.params) },
                { $set: { price: req.body.price, quantity: req.body.quantity } })
                .then(result => {
                    res.send(result.modifiedCount > 0)
                })
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
// client.connect(err => {
//     const collection = client.db("organicDb").collection("products");
//     // perform actions on the collection object
//     const product = { name: '', price: 25, quantity: 20 };
//     collection.insertOne(product)
//         .then(result => {
//             console.log(result, "one product added")
//         })
//     console.log('Database connection established')
//     // client.close();
// });
app.listen(4000, () => {
    console.log('listening on http://localhost:4000')
});