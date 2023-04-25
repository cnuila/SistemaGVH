import { AlertColor } from "@mui/material";

export default interface Message {
    show: boolean,
    text: string,
    type: AlertColor, 
}