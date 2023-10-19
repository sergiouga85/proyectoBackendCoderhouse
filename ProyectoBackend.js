
const {promises:fs} = require ('fs')
const { json } = require('stream/consumers')

class Product{
 
    constructor({id,title,description,price,thumbnail,code,stock}){
        this.id = id
        this.title= title
        this.description=description
        this.price=price
        this.thumbnail=thumbnail
        this.code=code
        this.setStock(stock)
    }

    setStock(nuevoStock){
        if(nuevoStock < 0){
            throw new Error ('El stock no puede ser menor a cero')
        }
        this.stock= nuevoStock
    }

    getStock(){
        return this.stock
    } 

    
}

class ProductsManager{

    static #ultimoId= 0
    #products

    constructor({path}){
        this.path=path
        this.#products=[]
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

    async #readProducts(){
        const productsEnJson = await fs.readFile(this.path,'utf-8')
        this.#products = JSON.parse(productsEnJson)
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
        const product=new Product({id,title,description,price,thumbnail,code,stock})
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

async function main(){
    
    const pm= new ProductsManager({path:'products.json'})
    await pm.init()
    const p1= await pm.addProducts({title:'Arroz', description:'legunbre', price: 150, thumbnail:'sin imagen', code: 'ACB1', stock: 10})
    const p3= await pm.addProducts({title:'Aceite', description:'aceite de cocina', price: 600, thumbnail:'sin imagen' , code: 'ACB3', stock: 15})
    console.log( await pm.getProducts()) 
    const productoUpdate= await pm.updateProducts(1,{title: 'Arbejas', description:'legunbre', price: 200, thumbnail: 'sin imagen', code: 'ACB2', stock: 5})
    console.log( await pm.getProducts()) 
    const productDelete= await pm.deleteProducts(1)
    console.log( await pm.getProducts()) 
}

main()

