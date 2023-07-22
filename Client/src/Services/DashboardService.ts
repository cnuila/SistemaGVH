import http from "../Utilities/AxiosObject"
import IProductsByLocationData from "../Utilities/Interfaces/IProductsByLocationData"

class DashboardService {

    getProductsByLocation(locationId: number) {
        return http.get<Array<IProductsByLocationData>>(`/dashboard/${locationId}`)
    }


}

export default new DashboardService();