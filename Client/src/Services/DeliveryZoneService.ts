import http from "../Utilities/AxiosObject"
import IDeliveryZoneData from "../Utilities/Interfaces/IDeliveryZoneData"

class DeliveryZoneService {

    getById(id: number){
        return http.get<IDeliveryZoneData>(`/deliveryzones/${id}`)
    }

    getAll(){
        return http.get<Array<IDeliveryZoneData>>("/deliveryzones")
    }

    addDeliveryZone(deliveryZone: IDeliveryZoneData){
        return http.post<IDeliveryZoneData>("/deliveryzones", deliveryZone)
    }

    deleteDeliveryZone(id: number){
        return http.delete<any>(`/deliveryzones/${id}`);
    }

    updateDeliveryZone(id: number, deliveryZone: IDeliveryZoneData){
        return http.put<any>(`/deliveryzones/${id}`, deliveryZone)
    }
}

export default new DeliveryZoneService();