export default interface IProductData {
    id: number | null,
    deliveryLocationId: number, 
    productId: number,
    expirationDate: Date, 
    quantityDelivered: number,
    quantityReturned: number,
    soldPrice: number,
}

