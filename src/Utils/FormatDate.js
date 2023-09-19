
export const  FormatDate = (_date,format) => {
    if (_date !== null && typeof _date != 'undefined') {
        //let date = _date;
        let subStrDate = _date.substring(6);
        let parseIntDate = parseInt(subStrDate);
        let date = new Date(parseIntDate);

        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            nummonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        let getPaddedComp = function (comp) {
            return ((parseInt(comp) < 10) ? ('0' + comp) : comp)
        },
            formattedDate = format,
            o = {
                "y+": date.getFullYear(), // year
                "M+": months[date.getMonth()], //month text
                "k+": nummonths[date.getMonth()], //month number
                "d+": getPaddedComp(date.getDate()), //day
                "h+": getPaddedComp((date.getHours() > 12) ? date.getHours() % 12 : date.getHours()), //hour
                "H+": getPaddedComp(date.getHours()), //hour
                "m+": getPaddedComp(date.getMinutes()), //minute
                "s+": getPaddedComp(date.getSeconds()), //second
                "S+": getPaddedComp(date.getMilliseconds()), //millisecond,
                "b+": (date.getHours() >= 12) ? 'PM' : 'AM'
            };

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                formattedDate = formattedDate.replace(RegExp.$1, o[k]);
            }
        }
        return formattedDate;
    } else
        return 'N/A';
  };