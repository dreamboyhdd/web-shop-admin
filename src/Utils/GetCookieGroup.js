import { DecodeString } from ".";
export const GetCookieGroup = (key) => {
    let objG = JSON.parse(DecodeString(localStorage.getItem("GroupInfo")));
    if (key === "IsChooseCustomer")
        return objG?.IsChooseCustomer;

    if (key === "IsLoginGroup" && objG.GroupId === 0) {
        return "person";
    }
    else if (key === "IsLoginGroup" && objG.GroupId !== 0) {
        return "group";
    }

    if (key === "GroupId")
        return objG?.GroupId;
    if (key === "GroupName")
        return objG?.GroupName;
    if (key === "Customers")
        return objG?.Customers;
    if (key === "CustomerIds" && objG?.IsChooseCustomer === "Fail")
        return objG?.CustomerIds;
    if (key === "CustomerIds" && objG?.IsChooseCustomer === "True")
        return "";
};