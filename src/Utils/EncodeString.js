export const  EncodeString = (string) => {
    if (string.trim() !== "") {
        return btoa(encodeURIComponent(string));
    } else
        return '';
};