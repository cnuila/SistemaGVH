export default interface IProductDeliveryViewData {
    id: number | null,
    deliveryLocationId__name: string, 
    productId__description: string,
    expirationDate: string, 
    quantityDelivered: number,
    quantityReturned: number | null,
    soldPrice: number,
}

