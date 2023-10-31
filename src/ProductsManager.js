import fs from 'fs/promises'
 
export class ProductsManager{

    static #ultimoId= 0
    #products

    constructor(ruta){
        this.ruta=ruta
    }

    async getAll(query={}){
        const json = await fs.readFile(this.ruta,'utf-8')
        const {limit}=query
        const data=JSON.parse(json)
        if(limit){
            if(limit>data.length){
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
        

    async #readProducts(){
        const productsEnJson = await fs.readFile(this.ruta,'utf-8')
        this.#products = JSON.parse(productsEnJson)

    }

    async init(){
        try{
        await this.#writeProducts()
        }catch{
            await this.#writeProducts()
        }
        if(this.#products.length ==0){
            ProductsManager.#ultimoId=0
        }else{
            ProductsManager.#ultimoId = this.#products.at(-1).id
        }

    }

    static #generarNuevoId(){
        return ++ProductsManager.#ultimoId
    }

    async #writeProducts(){
        await fs.writeFile(this.path,JSON.stringify(this.#products))
    }

    async addProducts({title,description,price,thumbnail,code,stock}){

        if(!title || !description || !price || !thumbnail || !code || !stock){
            throw new Error('Todos los campos son obligatorios');
        }
        const productCode= this.#products.find((p)=>p.code===code)
        if(productCode) throw new Error('Otro producto ya fue agregado con ese codigo')
        const id= ProductsManager.#generarNuevoId()
        const product= new Product({id,title,description,price,thumbnail,code,stock})
        await this.#readProducts()
        this.#products.push(product)
        await this.#writeProducts()
        return product
    }

    async getProducts(){
        await this.#readProducts()
        return this.#products
    }

    getProductsById(id){
       const productId= this.#products.find((p)=>p.id===id)
       if(!productId) throw new Error('Not found')
       return productId
    }

    async updateProducts(id,{title,description,price,thumbnail,code,stock}){
         const index = this.#products.findIndex((p)=>p.id === id)
        if(index != -1){
            await this.#readProducts()
            this.#products[index] = new Product({id,title,description,price,thumbnail,code,stock});
            await this.#writeProducts()
            return this.#products
        }
    }

    async deleteProducts(id){
        const index = this.#products.findIndex((p)=>p.id === id)
        if(index != -1){
            await this.#readProducts()
            this.#products.splice(index,1)
            this.#products.forEach((p, i) => {
                p.id = ++i;
              });
            await this.#writeProducts()
            return this.#products
        }
    }
}