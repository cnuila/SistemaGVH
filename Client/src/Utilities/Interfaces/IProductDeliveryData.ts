export default interface IProductData {
    id: number | null,
    deliveryLocationId__name: string, 
    productId__description: string,
    expirationDate: string, 
    quantityDelivered: number,
    quantityReturned: number,
    soldPrice: number,
}

