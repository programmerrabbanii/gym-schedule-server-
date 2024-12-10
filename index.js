const expres=require('express')
const cors=require('cors')
const app=expres()
const port=process.env.PORT || 5000

// middelwere
app.use(expres.json())
app.use(cors())

app.get('/', (req,res)=>{
    res.send('my gym schedule server is running')
})
app.listen(port, ()=>{
    console.log(`this is my gym server is running on ${port}`);
}) 