import { useCookies } from "react-cookie";
export const  GetCookieValue = () => {
    let objectCookies = localStorage.getItem("LoginData");
    if(objectCookies!=="" && objectCookies!==null && objectCookies!==undefined){
        return objectCookies;
    }
    else
    return null;
};