import faker from 'faker'

export const productsFaker = ()=>{
    let products = []
    for (let i=1;i<=5;i++){
        products.push({
            nombre : faker.commerce.productName(),
            precio : faker.commerce.price(),
            thumbnail : faker.image.image()
        })
    }
    console.log(products)
    return {products}
}