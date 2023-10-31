import {PORT,PRODUCTOS_JSON} from './config.js'
import express from 'express'
import {ProductsManager} from './ProductsManager.js'

const pm= new ProductsManager(PRODUCTOS_JSON)

const app=express()

app.get('/products',async (req, res)=>{
    const limit=parseInt(String(req.query.limit));
    try{
        const products= await pm.getAll({limit})
        res.json(products)
    }catch(error){
        res.json({
            status:'error',
            message: error.message
        })
    }

}) 

app.get('/products/:id', async (req, res)=>{
    const id= parseInt(req.params.id)
    try{
        const products = await pm.getById(id)
        res.json(products)
    } catch(error){
        res.json({
            status:'error',
            message: error.message
        })
    }
}) 

app.get('/',(req, res)=>{
    res.sendFile('index.html', {root:'./views'})
}) 

app.listen(PORT, ()=>{
    console.log(`conectado y escuchando en puerto ${PORT}`)
})