var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //

var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();

/*时间戳改日期--不传第二个参数返回年月日,传第二个参数返回年月日时分秒*/
function formatDateTime(inputTime, type) {
	var date = new Date(inputTime);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	if (type) {
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; //2017-12-12 12:23:34    
	} else {
		return y + '-' + m + '-' + d; //2017-12-12
	}
}
/**
 * 获取本、上、下周开始结束时间
 * @description 得到本、上、下周的起始、结束日期
 * @param {Number} n 不传或0代表本周，-1代表上周，1代表下周
 * @param {Number} type  0 开始时间  1 结束时间
 * @author Mt.flower
 */
function getWeek(n, type) { // 周
	let now = new Date()
	let day = now.getDay() //返回星期几的某一天;
	if (!type) {
		if (n == 1) {
			let dayNumber = day == 0 ? 0 : 7 - day
			now.setDate(now.getDate() + dayNumber + 1)
		} else if (n == -1) {
			let dayNumber = day == 0 ? 6 : day - 1
			now.setDate(now.getDate() - dayNumber - 7)
		} else {
			let dayNumber = day == 0 ? 6 : day - 1
			now.setDate(now.getDate() - dayNumber)
		}
	} else {
		if (n == 1) {
			let dayNumber = day == 0 ? 0 : 7 - day
			now.setDate(now.getDate() + dayNumber + 1 + 6) // 在周开始的日期上+6天=周结束
		} else if (n == -1) {
			let dayNumber = day == 0 ? 6 : day - 1
			now.setDate(now.getDate() - dayNumber - 7 + 6)
		} else {
			let dayNumber = day == 0 ? 0 : 7 - day
			now.setDate(now.getDate() + dayNumber)
		}
	}
	let date = now.getDate()
	let month = now.getMonth() + 1

	let s = now.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
	return s
}


//格局化日期：yyyy-MM-dd
export function formatDate(date, plusDay) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var myweekday = plusDay ? date.getDate() + 1 : date.getDate();

	if (mymonth < 10) {
		mymonth = "0" + mymonth;
	}
	if (myweekday < 10) {
		myweekday = "0" + myweekday;
	}
	return (myyear + "-" + mymonth + "-" + myweekday);
}

//获得某月的天数
function getMonthDays(myMonth) {
	var monthStartDate = new Date(nowYear, myMonth, 1);
	var monthEndDate = new Date(nowYear, myMonth + 1, 1);
	var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
	return days;
}

//获得本季度的开端月份
function getQuarterStartMonth() {
	var quarterStartMonth = 0;
	if (nowMonth < 3) {
		quarterStartMonth = 0;
	}
	if (2 < nowMonth && nowMonth < 6) {
		quarterStartMonth = 3;
	}
	if (5 < nowMonth && nowMonth < 9) {
		quarterStartMonth = 6;
	}
	if (nowMonth > 8) {
		quarterStartMonth = 9;
	}
	return quarterStartMonth;
}
// 调用方式,例如
// this.getWeek(-1, 0) // 获取上周开始日期
// this.getWeek(-1, 1) // 获取上周结束日期
// this.getWeek(0, 0) // 获取本周开始日期
// this.getWeek(0, 1) // 获取本周结束日期
// this.getWeek(1, 0) // 获取下周开始日期
// this.getWeek(1, 1) // 获取下周结束日期

//获得本周的开端日期
export function getWeekStartEndDate() {
	return [getWeek(0, 0), getWeek(0, 1)];
}

//获得本月的开端日期
export function getMonthStartEndDate() {
	var monthStartDate = new Date(nowYear, nowMonth, 1);
	var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
	return [formatDate(monthStartDate), formatDate(monthEndDate)];
}

//获得上月开端时候
function getLastMonthStartDate() {
	var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
	return formatDate(lastMonthStartDate);
}

//获得上月停止时候
function getLastMonthEndDate() {
	var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
	return formatDate(lastMonthEndDate);
}

//获得本季度的开端日期
function getQuarterStartDate() {

	var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
	return formatDate(quarterStartDate);
}

//或的本季度的停止日期
function getQuarterEndDate() {
	var quarterEndMonth = getQuarterStartMonth() + 2;
	var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
	return formatDate(quarterStartDate);
}

// 获得本年开始结束日期
export function getYearStartEndDate() {
	var yearStartDate = new Date(nowYear, 0, 1);
	var yearEndDate = new Date(nowYear, 11, 1);
	return [formatDate(yearStartDate), formatDate(yearEndDate)];
}
