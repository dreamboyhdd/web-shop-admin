export const FirstOrLastDayinMonth = (date, key, totalday) => {
    if (key == 1) {  // trả về ngày đầu tháng
        let FirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return FirstDay;
    }
    else if (key == 2) { // công theo ngày đưa vào
        let FirstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + totalday);
        return FirstDay;
    }
    else if (key == 3) { // công theo ngày đưa vào
        let FirstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        return FirstDay;
    }
    else if (key == 4) {  // trả về ngày đầu tháng
        let FirstDay = new Date(date.getFullYear(), date.getMonth(),date.getDate(), 0,0,0);
        return FirstDay;
    }
    else // trả về ngày cuối tháng
    {
        let LastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return LastDay;

    }
};