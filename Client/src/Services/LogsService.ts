import http from "../Utilities/AxiosObject"
import ILogsData from "../Utilities/Interfaces/ILogsData"
class LogsService {

    getLogs() {
        return http.get<Array<ILogsData>>(`/Logs`)
    }

}

export default new LogsService();