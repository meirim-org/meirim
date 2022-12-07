function calcBussinessDate(tmp) {
    if (tmp.getDay() === 4 && tmp.getHours() > 19) {
        tmp.setDate(tmp.getDate()+3);
        setHour(tmp);
    } else if (tmp.getDay() === 5)	{
        tmp.setDate(tmp.getDate()+2);
        setHour(tmp);
    } else if (tmp.getDay() === 6 || tmp.getHours() > 19)	{
        tmp.setDate(tmp.getDate()+1);
        setHour(tmp);
    } else if (tmp.getHours() < 10) {
        setHour(tmp);
    }	
    return tmp; 
 }

 function setHour(tmp) {
    tmp.setHours(10);
    tmp.setMinutes(0);
    tmp.setSeconds(0);
 }

 function getUnixTime(tmp) {
    return parseInt(tmp.getTime()/1000)
 }

 module.exports = {
    calcBussinessDate,
    getUnixTime
 }