import http from "../Utilities/AxiosObject"
import IUserData from "../Utilities/Interfaces/IUserData"

class UserService {

    addAuthorization(token: string){
        http.defaults.headers.common['Authorization'] = token
    }

    getByUserUId(userUId: string){
        return http.get<IUserData>(`/users/${userUId}`)
    }

    getAll(){
        return http.get<Array<IUserData>>("/users")
    }

    addUser(user: IUserData){
        return http.post<IUserData>("/register", user)
    }

    deleteUser(userUId: string){
        return http.delete<any>(`/users/${userUId}`);
    }

    makeAdmin(userId: Number){
        return http.put<any>(`/users/admin/${userId}`)
    }
}

export default new UserService();