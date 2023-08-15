import http from "../Utilities/AxiosObject"
import IExpiredProductsData from "../Utilities/Interfaces/IExpiredProductsData"
import IAvgMonthlyDeliveredData from "../Utilities/Interfaces/IAvgMonthlyDeliveredData"
import IProductsByLocationData from "../Utilities/Interfaces/IProductsByLocationData"
import IExpiryPerProductsData from "../Utilities/Interfaces/IExpiryPerProductData"
class DashboardService {

    getProductsByLocation(locationId: number, month: number, year: string) {
        return http.get<Array<IProductsByLocationData>>(`/dashboard/PPL/${locationId}/${month}/${year}`)
    }

    getExpirationByProduct(productId: number) {
        return http.get<IExpiryPerProductsData>(`/dashboard/EPP/${productId}`)
    }

    getMonthlyDeliveries(locationId: number) {
        return http.get<Array<IAvgMonthlyDeliveredData>>(`/dashboard/MD/${locationId}`)
    }

    getExpiredProducts() {
        return http.get<Array<IExpiredProductsData>>('/dashboard/EP/')
    }
}

export default new DashboardService();