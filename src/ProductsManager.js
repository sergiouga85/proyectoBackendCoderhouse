import fs from 'fs/promises'
 
export class ProductsManager{

    constructor(ruta){
        this.ruta=ruta
    }

    async getAll(query={}){
        const json = await fs.readFile(this.ruta,'utf-8')
        const {limit}=query
        const data=JSON.parse(json) 
        if(limit){ 
            if(limit>data.length || parseInt(limit)<=0){
                throw new Error('Limite invalido') 
            }
            return data.slice(0, parseInt(limit));
        }        
        return data
    }

    async getById(id){
        const json= await fs.readFile(this.ruta, 'utf-8')
        const products= JSON.parse(json)
        return products.find(p=> p.id === id)
    }
        
}