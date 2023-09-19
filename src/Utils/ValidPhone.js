export const  ValidPhone = (phone) => {
    let RegPhone = new RegExp(/(0)+([0-9]{9})\b/g);
    if (!RegPhone.test(phone)) {
        return "form-error";
    }
    else
        return "";
}