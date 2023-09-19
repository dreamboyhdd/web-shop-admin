import { DecodeString } from ".";
export const GetCookie = (key = "") => {
    let objectCookies = localStorage.getItem("login");
    if (objectCookies !== "" && objectCookies !== null && objectCookies !== undefined) {
        let obj = JSON.parse(DecodeString(objectCookies));
        if (key === "All")
            return obj;

        if (key === "CustomerID")
            return obj?.CustomerID;

        else if (key === "CustomerCode")
            return obj?.CustomerCode;

        else if (key === "CustomerName")
            return obj?.CustomerName;

        else if (key === "Phone")
            return obj?.Phone;

        else if (key === "Email")
            return obj?.Email;

        else if (key === "Address")
            return obj?.Address;

        else if (key === "Company")
            return obj?.CustomerCompany;

        else if (key === "Verification")
            return obj?.Verification;

        else if (key === "PostOfficeId")
            return obj?.PostOfficeId;

        else if (key === "CustomerGroupId")
            return obj?.CustomerGroupId;

        else if (key === "TypeCustomer")
            return obj?.Type;

        else if (key === "FacebookId")
            return obj?.FacebookId;

        else if (key === "GoogleId")
            return obj?.GoogleId;

        else if (key === "BankNumber")
            return obj?.BankNumber;

        else if (key === "BankNumberName")
            return obj?.BankNumberName;

        else if (key === "BankName")
            return obj?.BankName;

        else if (key === "BankBranch")
            return obj?.BankBranch;

        else if (key === "City")
            return obj?.City;

        else if (key === "District")
            return obj?.District;

        else if (key === "Ward")
            return obj?.Ward;

        else if (key === "LinkAvatar")
            return (obj?.LinkAvatar !== "https://erp.vps.vn") ? obj?.LinkAvatar : "/assets/img/noimage.jpg";

        else
            return null;
    }
    else
        return null;
};