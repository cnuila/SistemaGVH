import http from "../Utilities/AxiosObject"
import IProductData from "../Utilities/Interfaces/IProductData"
import IProductViewData from "../Utilities/Interfaces/IProductViewData"

class ProductService {

    getById(id: number){
        return http.get<IProductData>(`/products/${id}`)
    }

    getAll(){
        return http.get<Array<IProductViewData>>("/products")
    }

    addProduct(product: IProductData){
        return http.post<IProductData>("/products", product)
    }

    deleteProduct(id: number){
        return http.delete<any>(`/products/${id}`);
    }

    updateProduct(id: any, product: IProductData){
        return http.put<any>(`/products/${id}`, product)
    }
}

export default new ProductService();