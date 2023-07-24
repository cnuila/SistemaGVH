import http from "../Utilities/AxiosObject"
import IExpiredProductsData from "../Utilities/Interfaces/IExpiredProductsData"
import IMonthlyDeliveriesData from "../Utilities/Interfaces/IMonthlyDeliveriesData"
import IProductsByLocationData from "../Utilities/Interfaces/IProductsByLocationData"
import ISellsByZoneData from "../Utilities/Interfaces/ISellsByZoneData"

class DashboardService {

    getProductsByLocation(locationId: number) {
        return http.get<Array<IProductsByLocationData>>(`/dashboard/PPL/${locationId}`)
    }

    getExpirationByProduct(productId: number) {
        return http.get<number>(`/dashboard/EPP/${productId}`)
    }

    getSellsByZone() {
        return http.get<Array<ISellsByZoneData>>('/dashboard/SBZ')
    }

    getMonthlyDeliveries(year: string) {
        return http.get<Array<IMonthlyDeliveriesData>>(`/dashboard/MD/${year}`)
    }

    getExpiredProducts() {
        return http.get<Array<IExpiredProductsData>>('/dashboard/EP/')
    }
}

export default new DashboardService();