export default interface IProductViewData {
    id: number | null,
    code: string, 
    description: string,
    cost: number, 
    sellingPrice: number,
    quantity: number,
    providerId: number | null,
    providerName: string, 
}