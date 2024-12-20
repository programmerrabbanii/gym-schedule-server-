const expres=require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors=require('cors')
const app=expres()
const port=process.env.PORT || 5000

// middelwere
app.use(expres.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.2eupeky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const gymScheduleCollection=client.db('schedulDB').collection('schedules')

    app.post('/schedule', async (req,res)=>{
        const postSchedule=req.body;
        const result= await  gymScheduleCollection.insertOne(postSchedule)
        res.send(result)
    }) 

    app.get('/schedule', async (req,res)=>{
        const result= await gymScheduleCollection.find().toArray()
        res.send(result)
    }) 
    app.delete('/schedule/:id', async (req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result= await gymScheduleCollection.deleteOne(query)
        res.send(result)
    }) 
    app.get('/schedule/:id', async (req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result=await gymScheduleCollection.findOne(query)
        res.send(result)
    })
    app.patch('/schedule/:id', async (req,res)=>{
        try {
            const id=req.params.id;
            console.log(id);
            const data=req.body;
            const query={_id: new ObjectId(id)}
            const update={
                $set:{
                    title:data?.title,
                    day:  data?.day,
                    time: data?.time,
                    date: data?.data
                } 
     
            }
    
            const result=await gymScheduleCollection.updateOne(query,update,{upsert:true}) 
            console.log(result);
            res.send(result)
            
            
        } catch (error) {
            console.log(error);
            res.send({})
            
        }
       
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('my gym schedule server is running')
})
app.listen(port, ()=>{
    console.log(`this is my gym server is running on ${port}`);
}) 