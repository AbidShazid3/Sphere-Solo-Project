const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
}

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// verify jwt middleware
const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' });
        }
        req.user = decoded;
        next();
    })
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ltb0gzh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)

        const jobsCollection = client.db('sphereSolo').collection('jobs');
        const bidsCollection = client.db('sphereSolo').collection('bids');

        // jwt
        app.post('/jwt', async (req, res) => {
            const email = req.body;
            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.cookie('token', token, cookieOptions).send({ success: true })
        })

        app.post('/logout', async (req, res) => {
            res.clearCookie('token', { ...cookieOptions, maxAge: 0 }).send({ success: true });
        })

        // job related
        app.post('/job', verifyToken, async (req, res) => {
            const jobData = req.body;
            const result = await jobsCollection.insertOne(jobData);
            res.send(result);
        })

        app.get('/jobs', async (req, res) => {
            const result = await jobsCollection.find().toArray();
            res.send(result);
        })

        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.findOne(query);
            res.send(result);
        })

        app.get('/jobs/:email', verifyToken, async (req, res) => {
            const tokenEmail = req.user.email;
            const email = req.params.email;

            if (tokenEmail !== email) {
                return res.status(403).send({ message: 'forbidden access' })
            }
            const query = { 'buyer.email': email }
            const result = await jobsCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.deleteOne(query)
            res.send(result);
        })

        app.put('/job/:id', async (req, res) => {
            const id = req.params.id;
            const jobData = req.body;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    ...jobData,
                },
            }
            const result = await jobsCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

        // get all jobs data for pagination
        app.get('/all-jobs', async (req, res) => {
            const size = parseInt(req.query.size);
            const page = parseInt(req.query.page) - 1;
            const search = req.query.search;

            const filter = req.query.filter;
            let query = {
                job_title: { $regex: search, $options: 'i'}
            };
            if (filter) query.category = filter;

            const sort = req.query.sort;
            let options = {}
            if(sort) options = {sort: {deadline : sort === 'asc' ? 1 : -1}}
            
            const result = await jobsCollection.find(query, options).skip(page * size).limit(size).toArray();
            res.send(result);
        })

        // get all jobs data for count
        app.get('/jobs-count', async (req, res) => {

            const filter = req.query.filter;
            const search = req.query.search;
            let query = {
                job_title: { $regex: search, $options: 'i'}
            };
            if (filter) query.category = filter;

            const count = await jobsCollection.countDocuments(query);
            res.send({count})
        })

        // bids related
        app.post('/bid', async (req, res) => {
            const bidData = req.body;
            // checking is there save data
            const query = {
                email: bidData.email,
                jobId: bidData.jobId,
            }
            const alreadyApplied = await bidsCollection.findOne(query)
            if (alreadyApplied) {
                return res.status(400).send('Already Applied' );
            }

            const result = await bidsCollection.insertOne(bidData);
            
            // update bid count in jobs collection
            const updateDoc = {
                $inc: {bid_count: 1},
            }
            const jobQuery = {_id: new ObjectId(bidData.jobId)}
            const updateBidCount = await jobsCollection.updateOne(jobQuery, updateDoc)
            res.send(result);
        })

        app.get('/my-bids/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const result = await bidsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/bidRequests/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { "buyer.email": email }
            const result = await bidsCollection.find(query).toArray();
            res.send(result);
        })

        // bid requests accept/reject/complete update
        app.patch('/bid/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const status = req.body;
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: status,
            }
            const result = await bidsCollection.updateOne(query, updateDoc);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Server World!')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})