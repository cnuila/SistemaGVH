import http from "../Utilities/AxiosObject"
import IProductDeliveryData from "../Utilities/Interfaces/IProductDeliveryData"
import IProductDeliveryViewData from "../Utilities/Interfaces/IProductDeliveryViewData"

class ProductDeliveryService {

    getById(id: number){
        return http.get<IProductDeliveryData>(`/productdelivery/${id}`)
    }

    getAll(){
        return http.get<Array<IProductDeliveryViewData>>("/productdelivery")
    }

    getAllWithReturns(){
        return http.get<Array<IProductDeliveryViewData>>("/productdelivery/returns")
    }

    addProductDelivery(productDelivery: IProductDeliveryData){
        return http.post<IProductDeliveryData>("/productdelivery", productDelivery)
    }

    deleteProductDelivery(id: number){
        return http.delete<any>(`/productdelivery/${id}`);
    }

    updateProductDelivery(id: number, productDelivery: IProductDeliveryData){
        return http.put<any>(`/productdelivery/${id}`, productDelivery)
    }

}

export default new ProductDeliveryService();