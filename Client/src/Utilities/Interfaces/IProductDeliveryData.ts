export default interface IProductDeliveryData {
    id: number | null,
    deliveryLocationId: number | null, 
    productId: number | null,
    expirationDate: string, 
    quantityDelivered: number,
    quantityReturned: number | null,
    soldPrice: number,
    deliveryDate: string, 
}

