import http from "../Utilities/AxiosObject"
import IProviderData from "../Utilities/Interfaces/IProviderData"

class ProviderService {

    getById(id: number){
        return http.get<IProviderData>(`/providers/${id}`)
    }

    getAll(){
        return http.get<Array<IProviderData>>("/providers")
    }

    addProvider(provider: IProviderData){
        return http.post<IProviderData>("/providers", provider)
    }

    deleteProvider(id: number){
        return http.delete<any>(`/providers/${id}`);
    }

    updateProvider(id: number, provider: IProviderData){
        return http.put<any>(`/providers/${id}`, provider)
    }
}

export default new ProviderService();