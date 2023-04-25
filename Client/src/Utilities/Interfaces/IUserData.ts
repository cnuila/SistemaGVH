export default interface IUserData {
    id: number | null,
    userName: string, 
    userUId: string | null,
    firstName: string, 
    lastName: string,
    isAdmin: boolean | null,
    password: string
}