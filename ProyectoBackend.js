class Product{

    #stock

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
            thumbnail:this.thumbnail,
            code:this.code,
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

    addProducts({title,description,price,thumbnail,code,stock}){

        if(!title || !description || !price || !thumbnail || !code || !stock){
            throw new Error('Todos los campos son obligatorios');
        }
        const productCode= this.#products.find((p)=>p.code===code)
        if(productCode) throw new Error('Otro producto ya fue agregado con ese codigo')
        const id= ProductsManager.#generarNuevoId()
        const product=new Product({id,title,description,price,thumbnail,code,stock})
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

try{
    const p1= pm.addProducts({title:'Arroz', description:'legunbre', price: 150, thumbnail:'sin imagen', code: 'ACB1',   stock: 10})
    const p2= pm.addProducts({title: 'Arbejas', description:'legunbre', price: 200, thumbnail: 'sin imagen', code: 'ACB2', stock: 5})
    const p3= pm.addProducts({title:'Aceite', description:'aceite de cocina', price: 600, thumbnail:'sin imagen' , code: 'ACB3', stock: 15})
    const p4= pm.addProducts({title:'Sal', description:'condimento', price: 300,  thumbnail: 'sin imagen', code: 'ACB4', stock: 25})
    
    console.log(pm.getProducts().map((p)=>p.asPOJO()))
   
}
catch(error){
    console.log(error.message)
}

try{
    const productoId= pm.getProductsById(1).asPOJO()
    console.log(productoId)
}
catch(error){
    console.log(error.message)
}

