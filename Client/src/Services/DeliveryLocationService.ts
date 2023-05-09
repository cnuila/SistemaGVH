import http from "../Utilities/AxiosObject"
import IDeliveryLocationData from "../Utilities/Interfaces/IDeliveryLocationData"

class DeliveryLocationService {

    getById(id: number){
        return http.get<IDeliveryLocationData>(`/deliverylocations/${id}`)
    }

    getAll(){
        return http.get<Array<IDeliveryLocationData>>("/deliverylocations")
    }

    addDeliveryLocation(deliveryLocation: IDeliveryLocationData){
        return http.post<IDeliveryLocationData>("/deliverylocations", deliveryLocation)
    }

    deleteDeliveryLocation(id: number){
        return http.delete<any>(`/deliverylocations/${id}`);
    }

    updateDeliveryLocation(id: number, deliveryLocation: IDeliveryLocationData){
        return http.put<any>(`/deliverylocations/${id}`, deliveryLocation)
    }

    getDeliveryLocationNames(){
        return http.get<Array<string>>("/deliveryLocationsnames")
    }
}

export default new DeliveryLocationService();