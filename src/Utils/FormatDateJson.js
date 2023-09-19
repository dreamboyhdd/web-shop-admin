export const FormatDateJson = (date, key = 0) => {
    if (date === undefined) {
        let data = 'N/A'
        return data;
    }

    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        h = d.getHours(),
        m = d.getMinutes(),
        s = d.getSeconds()

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;


    // 0 Lấy Tháng/ngày/năm Giờ:phut:Giây
    // 2 Lấy năm/Tháng
    // 3 Lấy ngày/tháng/năm Giờ:phut:Giây
    // 4 Lấy Tháng/Năm
    // 5 Lấy ngày/tháng/năm 
    // 6 Lấy ngày/tháng

    if (key === 0)
        return [month, day, year].join('/') + ' ' + [h, m, s].join(':');
    else if (key === 2)
        return [year, month].join('-');
    else if (key === 3)
        return [day, month, year].join('/') + ' ' + [h, m].join(':');
    else if (key === 4)
        return [month, year].join('-');
    else if (key === 5)
        return [day, month, year].join('/');
    else if (key === 6)
        return [day, month].join('-');
    else if (key === 7)
        return [year, month, day].join('-');
    else if (key === 8)
        return [year, month, day].join('-') + ' ' + [h, m, s].join(':');
    else
        return [month, day, year].join('/');

}