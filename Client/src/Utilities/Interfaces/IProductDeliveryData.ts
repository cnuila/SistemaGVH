export default interface IProductData {
    id: number | null,
    deliveryLocationId__name: string, 
    productId__description: string,
    expirationDate: Date, 
    quantityDelivered: number,
    quantityReturned: number,
    soldPrice: number,
}

