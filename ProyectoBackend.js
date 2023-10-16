class Product{

    #stock

    constructor({id,title,description,price,stock}){
        this.id = id
        this.title= title
        this.description=description
        this.price=price
        this.setStock(stock)
    }

    setStock(nuevoStock){
        if(nuevoStock < 0){
            throw new Error ('El stock no puede ser menor a cero')
        }
        this.#stock= nuevoStock
    }

    getStock(){
        return this.#stock
    } 

    asPOJO(){
        return{
            id:this.id,
            title:this.title,
            description:this.description,
            price:this.price,
            stock:this.#stock  
        }
    }
}

class ProductsManager{

    static #ultimoId=0
    #products

    constructor(){
        this.#products=[]
    }

    static #generarNuevoId(){
        return ++ProductsManager.#ultimoId
    }

    addProducts({title,description,price,stock}){
        const id= ProductsManager.#generarNuevoId()
        const product=new Product({id, title,description,price,stock})
        this.#products.push(product)
        return product
    }

    getProducts(){
        return this.#products
    }

    getProductsById(id){
       const productId= this.#products.find((p)=>p.id===id)
       if(!productId) throw new Error('Not found')
       return productId
    }
}

const pm= new ProductsManager()


const p1= pm.addProducts({title:'Arroz', description:'legunbre', price: 150, stock: 10})
const p2= pm.addProducts({title: 'Arbejas', description:'legunbre', price: 200, stock: 5})
const p3= pm.addProducts({title:'Aceite', description:'aceite de cocina', price: 600, stock: 15})
const p4= pm.addProducts({title:'Sal', description:'condimento', price: 300, stock: 25})


console.log(pm.getProducts())

console.log(pm.getProducts().map((p)=>p.asPOJO()))


try{
    const producto1= p1.setStock(-1)
    console.log(producto1)
}
catch(error){
    console.log(error.message)
}

try{
    const productoId= pm.getProductsById(6).asPOJO()
    console.log(productoId)
}
catch(error){
    console.log(error.message)
}

