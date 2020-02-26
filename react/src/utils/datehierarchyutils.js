export const DEFAULT_OPTIONS = { 'lowerLimit': new Date().getFullYear(), 'upperLimit': new Date().getFullYear() + 1, "showQuarters": true, 'showWeeks': false, 'disabledList': [] };

export const MONTH_NAMES = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export const MONTH_SHORT_NAMES = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export const MONTH_SHORT_NAMES_TITLE_CASE = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const WEEK_NAMES = ["week1", "week2", "week3", "week4", "week5", "week6"];

// Function to reset options with default options
export const resetDateHierarchyOptions = (options) => {
	return { ...DEFAULT_OPTIONS, ...options };
}

export const getMonthDays = (month, year, disabledList, callback) => {
	const months30 = [4, 6, 9, 11];
	const leapYear = year % 4 === 0;
	let day = month === 2
		? leapYear
			? 29
			: 28
		: (months30.indexOf(month) !== -1)
			? 30
			: 31;
	var days = [];
	var hasDisabled = false;
	for (let i = 1; i <= day; i++) {
		var dayObj = { day: i, state: 0, match: 0, date: i, fullDate: month+'/'+ i +'/'+ year }
		days.push(dayObj);
		if (month > 9 && dayObj.day > 9) {
			if (disabledList.includes(month + '/' + dayObj.day + '/' + year)) {
				days.pop();
				hasDisabled = true;
			}
		}
		if (month > 9 && dayObj.day < 10) {
			if (disabledList.includes(month + '/0' + dayObj.day + '/' + year) || disabledList.includes(month + '/' + dayObj.day + '/' + year)) {
				days.pop();
				hasDisabled = true;
			}
		}
		if (month < 10 && dayObj.day > 9) {
			if (disabledList.includes('0' + month + '/' + dayObj.day + '/' + year) || disabledList.includes(month + '/' + dayObj.day + '/' + year)) {
				days.pop();
				hasDisabled = true;
			}
		}
		if (month < 10 && dayObj.day < 10) {
			if (disabledList.includes(month + '/' + dayObj.day + '/' + year) || disabledList.includes('0' + month + '/0' + dayObj.day + '/' + year) || disabledList.includes('0' + month + '/' + dayObj.day + '/' + year) || disabledList.includes(month + '/0' + dayObj.day + '/' + year)) {
				days.pop();
				hasDisabled = true;
			}
		}
	}
	callback({ 'days': days, 'hasDisabled': hasDisabled });
}

export const getChildren = function (year, showWeeks, disabledList, callback) {
	let quarterArray = [];
	var hasDisabled = false;
	for (let i = 0; i < 4; i++) {
		let quarter = {
			"quarter": "Q" + (i + 1),
			"searchString": "q" + (i + 1),
			"showChild": false,
			"state": 0,
			"match": 0,
			"hasDisabled": false,
			"months": []
		};
		quarterArray.push(quarter);
		if (disabledList.includes(quarter.quarter + '/' + year) || disabledList.includes(quarter.quarter.toLowerCase() + '/' + year)) {
			quarterArray.pop();
			hasDisabled = true;
		}
		for (let j = 0; j < 3; j++) {
			var month = {
				"month": MONTH_SHORT_NAMES_TITLE_CASE[3 * i + j],
				"searchString": MONTH_NAMES[3 * i + j],
				"showChild": false,
				"state": 0,
				"match": 0,
				"hasDisabled": false
			};
			quarter["months"].push(month);
			if (MONTH_SHORT_NAMES_TITLE_CASE.indexOf(month.month) + 1 > 9) {
				if (disabledList.includes(MONTH_SHORT_NAMES_TITLE_CASE.indexOf(month.month) + 1 + '/' + year)) {
					quarter["months"].pop();
					quarter.hasDisabled = true;
				}
			}
			if (MONTH_SHORT_NAMES_TITLE_CASE.indexOf(month.month) + 1 < 10) {
				if (disabledList.includes(MONTH_SHORT_NAMES_TITLE_CASE.indexOf(month.month) + 1 + '/' + year) || disabledList.includes('0' + (MONTH_SHORT_NAMES_TITLE_CASE.indexOf(month.month) + 1) + '/' + year)) {
					quarter["months"].pop();
					quarter.hasDisabled = true;
				}
			}
		}
	}

	if (showWeeks === false) {
		quarterArray.forEach((quarter) => {
			quarter.months.forEach((month) => {
				var mno = MONTH_SHORT_NAMES_TITLE_CASE.indexOf(month.month);
				getMonthDays(mno + 1, year, disabledList, (Days) => {
					month["days"] = Days.days;
					month['hasDisabled'] = Days.hasDisabled;
				});
			})
		})
	} else {
		quarterArray.forEach((quarter) => {
			quarter.months.forEach((month) => {
				var mno = MONTH_SHORT_NAMES_TITLE_CASE.indexOf(month.month);
				getMonthWeeks(mno + 1, year, disabledList, (Weeks) => {
					month["weeks"] = Weeks.weeks;
					month['hasDisabled'] = Weeks.hasDisabled;
				})
			});
		})
	}
	callback({ 'quarter': quarterArray, 'hasDisabled': hasDisabled });
}
export const getMonths = function (year, showWeeks, disabledList, callback) {
	let months = [];
	let hasDisabled = false;
	let oneToEleven = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	if (showWeeks === false) {
		oneToEleven.forEach((i, index) => {
			getMonthDays(i + 1, year, disabledList, (Days) => {
				var monthObj = {
					"month": MONTH_SHORT_NAMES_TITLE_CASE[i],
					"searchString": MONTH_NAMES[i],
					"showChild": false,
					"state": 0,
					"match": 0,
					"days": Days.days,
					'hasDisabled': Days.hasDisabled
				}
				months.push(monthObj);
				if ((MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1) > 9) {
					if (disabledList.includes(MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1 + '/' + year)) {
						months.pop();
						hasDisabled = true;
					}
				}
				if ((MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1) < 10) {
					if (disabledList.includes('0' + (MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1) + '/' + year) || disabledList.includes((MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1) + '/' + year)) {
						months.pop();
						hasDisabled = true;
					}
				}
			});
		});
		
		callback({ "months": months, "hasDisabled": hasDisabled });
	} else {
		oneToEleven.forEach((i, index) => {
			getMonthWeeks(i + 1, year, disabledList, (Weeks) => {
				var monthObj = {
					"month": MONTH_SHORT_NAMES_TITLE_CASE[i],
					"searchString": MONTH_NAMES[i],
					"showChild": false,
					"state": 0,
					"match": 0,
					"hasDisabled": Weeks.hasDisabled,
					"weeks": Weeks.weeks
				}
				months.push(monthObj);
				if ((MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1) > 9) {
					if (disabledList.includes(MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1 + '/' + year)) {
						months.pop();
						hasDisabled = true;
					}
				}
				if ((MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1) < 10) {
					if (disabledList.includes('0' + (MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1) + '/' + year) || disabledList.includes((MONTH_SHORT_NAMES_TITLE_CASE.indexOf(monthObj.month) + 1) + '/' + year)) {
						months.pop();
						
						hasDisabled = true;
					}
				}
			});
		});
		callback({ "months": months, "hasDisabled": hasDisabled });
	}
}
export const getSearchObj = function (options) {
	let { lowerLimit, upperLimit, showWeeks, showQuarters } = options;
	if (lowerLimit > 999 && upperLimit > 999 && (lowerLimit <= upperLimit) && lowerLimit % 1 === 0 && upperLimit % 1 === 0) {
		lowerLimit = parseInt(lowerLimit);
		let searchObj = [];
		let index = 0;
		let monthLevel = 2;
		let weekLevel = 3;
		let dayLevel = 3;
		while (lowerLimit <= upperLimit) {
			searchObj.push({ searchKey: "" + lowerLimit, level: 1, index: index });
			lowerLimit++;
			index++;
		}
		if (showQuarters === true) {
			searchObj.push({ searchKey: "q1", level: 2, index: 0 });
			searchObj.push({ searchKey: "q2", level: 2, index: 1 });
			searchObj.push({ searchKey: "q3", level: 2, index: 2 });
			searchObj.push({ searchKey: "q4", level: 2, index: 3 });
			monthLevel = 3;
			weekLevel = 4;
			dayLevel++;
		}

		MONTH_NAMES.forEach((month, index) => {
			searchObj.push({ searchKey: month, level: monthLevel, index: (showQuarters === false) ? index : (index % 3) });
		});

		if (showWeeks === true) {
			WEEK_NAMES.forEach((week, index) => {
				searchObj.push({ searchKey: week, level: weekLevel, index: index });
			});
			dayLevel++;
		}
		for (let day = 1; day <= 31; day++) {
			searchObj.push({ searchKey: "" + day, level: dayLevel, index: day - 1 });
		}
		return searchObj;
	}
}

export const getQuarterObject = (quarter, showChild, state, months) => {
	return {
		"quarter": quarter,
		"showChild": showChild,
		"state": state,
		"match": 0,
		"months": [...months]
	};
}

export const getYearObject = (year, showChild, state, children, showQuarters) => {
	if (showQuarters === true) {
		return {
			"year": year,
			"showChild": showChild,
			"state": state,
			"match": 0,
			"quarters": [...children]
		};
	} else {
		return {
			"year": year,
			"showChild": showChild,
			"state": state,
			"match": 0,
			"months": [...children]
		};
	}
}

export const getMonthObject = (month, showChild, state, daysWeeks, showWeeks) => {
	return (showWeeks === true) ? {
		"month": month,
		"showChild": showChild,
		"state": state,
		"match": 0,
		"weeks": [...daysWeeks]
	} : {
			"month": month,
			"showChild": showChild,
			"state": state,
			"match": 0,
			"days": [...daysWeeks]
		};
}

export const getWeekObject = (week, showChild, state, days) => {
	return {
		"week": week,
		"showChild": showChild,
		"state": state,
		"match": 0,
		"days": [...days]
	};
}

export const getDayObject = (date, day, state) => {
	return {
		"date": date,
		"day": day,
		"match": 0,
		"state": state
	};
}

const subFilterMonths = (months, showWeeks, callback) => {
	let _months = [];
	months.forEach((mn) => {
		if (showWeeks === true) {
			let _weeks = [];
			let weeks = [...mn['weeks']];
			weeks.forEach((wk) => {
				let _days = [];
				let days = [...wk['days']];
				days.forEach((dy) => {
					_days.push(getDayObject(dy.date, dy.day, 1));
				});

				_weeks.push(getWeekObject(wk.week, false, 1, [..._days]));
			});
			_months.push(getMonthObject(mn.month, false, 1, [..._weeks], true));
		} else {
			let _days = [];
			var days = [...mn['days']];
			days.forEach((dy) => {
				_days.push(getDayObject(dy.date, dy.day, 1));
			});

			_months.push(getMonthObject(mn.month, false, 1, [..._days], false));
		}
	});
	callback(_months);
}

const subFilterQuarters = (year, quarters, showWeeks, showQuarters, callback) => {
	let yearState = 0;
	let _quarters = [];
	quarters.forEach((quarter) => {
		var quarterName = quarter['quarter'].toString();
		let _months = [];
		var months = [...quarter['months']];
		months.forEach((month) => {
			if (showWeeks === true) {
				let _weeks = [];
				var weeks = [...month['weeks']];
				weeks.forEach((week) => {
					let _days = [];
					var days = [...week['days']];
					days.forEach((day) => {
						_days.push(getDayObject(day.date, day.day, 1));
					});

					_weeks.push(getWeekObject(week.week, false, 1, [..._days]));
				});

				_months.push(getMonthObject(month.month, false, 1, [..._weeks], true));
			} else {
				let _days = [];
				var days = [...month['days']];
				days.forEach((day) => {
					_days.push(getDayObject(day.date, day.day, 1));
				});

				_months.push(getMonthObject(month.month, false, 1, [..._days], false));
			}
		});
		_quarters.push(getQuarterObject(quarterName, true, 1, [..._months]));
	});
	callback(yearState, _quarters);
}

export let fullListOfYears = [];

export const getFilterListOfYears = (years, showWeeks, showQuarters, disabledList) => {
	let _years = [];
	years.forEach((yr) => {
		if (showQuarters === true) {
			let quarters = [...yr['quarters']];

			subFilterQuarters(yr, quarters, showWeeks, showQuarters, (_yearState, _quarters) => {
				_years.push(getYearObject(yr.year, true, 1, [..._quarters], showQuarters));

				fullListOfYears = [..._years];
			});
		} else {
			let months = [...yr['months']];
			subFilterMonths(months, showWeeks, (_months) => {
				_years.push(getYearObject(yr.year, true, 1, [..._months], showQuarters));
			});
		}
	});
}

export const getFilterListOfYears1 = (_years, showWeeks, showQuarters, disabledList) => {
	let newYears = _years.map(a => ({ ...a }));

	newYears.forEach((year, yearIndex) => {
		if (showQuarters === true) {
			let quarters = (newYears[yearIndex] && newYears[yearIndex]['quarters']) ? newYears[yearIndex]['quarters'] : [];
			newYears[yearIndex]['state'] = 1;
			quarters.forEach((quarter, quarterIndex) => {
				let months = (quarters && quarters[quarterIndex] && quarters[quarterIndex]['months']) ? quarters[quarterIndex]['months'] : [];
				newYears[yearIndex]['quarters'][quarterIndex]['state'] = 1;
				months.forEach((month, monthIndex) => {
					newYears[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['state'] = 1;
					if (showWeeks === true) {
						let weeks = newYears[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'];
						newYears[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['state'] = 1;
						weeks.forEach((week, weekIndex) => {
							let days = newYears[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['days'];
							newYears[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['state'] = 1;
							days.forEach((day, dayIndex) => {
								newYears[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['days'][dayIndex]['state'] = 1;
							});
						});
					} else {
						let days = newYears[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['days'];
						days.forEach((day, dayIndex) => {
							newYears[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['days'][dayIndex]['state'] = 1;
						});
					}
				});
			});
		} else if (showQuarters === false) {
			let months = (newYears[yearIndex] && newYears[yearIndex]['months']) ? newYears[yearIndex]['months'] : [];
			newYears[yearIndex]['state'] = 1;
			months.forEach((month, monthIndex) => {
				newYears[yearIndex]['months'][monthIndex]['state'] = 1;
				if (showWeeks === true) {
					let weeks = newYears[yearIndex]['months'][monthIndex]['weeks'];
					newYears[yearIndex]['months'][monthIndex]['state'] = 1;
					weeks.forEach((week, weekIndex) => {
						let days = newYears[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['days'];
						newYears[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['state'] = 1;
						days.forEach((day, dayIndex) => {
							newYears[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['days'][dayIndex]['state'] = 1;
						});
					});
				} else {
					let days = newYears[yearIndex]['months'][monthIndex]['days'];
					days.forEach((day, dayIndex) => {
						newYears[yearIndex]['months'][monthIndex]['days'][dayIndex]['state'] = 1;
					});
				}
			});
		}
	});
	fullListOfYears = [...newYears];
}

export const getListOfYears = function (lowerLimit, upperLimit, showWeeks, showQuarters, disabledList) {
	if (lowerLimit > 999 && upperLimit > 999 && (lowerLimit <= upperLimit) && lowerLimit % 1 === 0 && upperLimit % 1 === 0) {
		lowerLimit = parseInt(lowerLimit);
		upperLimit = parseInt(upperLimit);
		let years = [];
		var list = [];
		for (var i = lowerLimit; i <= upperLimit; i++) {
			list.push(i);
		}
		if (showQuarters === true) {
			list.forEach((lowerLimit) => {
				getChildren(lowerLimit, showWeeks, disabledList, (Quarters) => {
					var year = {
						"year": lowerLimit,
						"searchString": lowerLimit.toString().toLowerCase(),
						"showChild": false,
						"state": 0,
						"match": 0,
						"quarters": Quarters.quarter,
						'hasDisabled': Quarters.hasDisabled
					}
					years.push(year);
					if (disabledList.includes(year.year.toString())) {
						years.pop();
					}
					lowerLimit++;
				})
			});
		}
		if (showQuarters === false) {
			list.forEach((lowerLimit) => {
				getMonths(lowerLimit, showWeeks, disabledList, (Months) => {
					var year = {
						"year": lowerLimit,
						"searchString": lowerLimit.toString().toLowerCase(),
						"showChild": false,
						"state": 0,
						"match": 0,
						"hasDisabled": Months.hasDisabled,
						"months": Months.months
					}
					years.push(year);
					if (disabledList.includes(year.year.toString())) {
						years.pop();
					}
					lowerLimit++;
				})
			});
		}
		getFilterListOfYears([...years], showWeeks, showQuarters, disabledList);
		return years;
	} else {
		lowerLimit = 2;
		upperLimit = 1;
		let years = [];
		while (lowerLimit <= upperLimit) {
			var year = {
				"year": lowerLimit,
				"searchString": lowerLimit.toString().toLowerCase(),
				"showChild": false,
				"state": 0,
				"match": 0,
				"hasDisabled": false,
				"quarters": getChildren(lowerLimit)
			}
			years.push(year);
			lowerLimit++;
		}
		getFilterListOfYears([...years], showWeeks, showQuarters, disabledList);
		return years;
	}
}

export const getMonthWeeks = function (month_number, year, disabledList, callback) {
	var firstOfMonth = new Date(year, month_number - 1, 1);
	var lastOfMonth = new Date(year, month_number, 0);
	var used = firstOfMonth.getDay() + lastOfMonth.getDate();
	var weeks = [];
	var hasDisabled = false;
	var start = 1;
	var weekdays = new Array(7);
	weekdays[0] = "Sun";
	weekdays[1] = "Mon";
	weekdays[2] = "Tue";
	weekdays[3] = "Wed";
	weekdays[4] = "Thu";
	weekdays[5] = "Fri";
	weekdays[6] = "Sat";
	for (let weekNo = 1; weekNo <= Math.ceil(used / 7); weekNo++) {
		var weekObj = {
			'week': "Week " + weekNo,
			'searchString': "week " + weekNo,
			'state': 0,
			"match": 0,
			'hasDisabled': false,
			'showChild': false,
			'days': []
		}
		for (var i = start; i < (lastOfMonth).getDate() + 1; i++) {
			var monthDate = new Date(year, month_number - 1, i);
			var dayObj = { date: i, searchString: i.toString().toLowerCase(), day: weekdays[monthDate.getDay()], state: 0, match: 0 ,fullDate: month_number+'/'+i+'/'+year};
			weekObj.days.push(dayObj);
			if (month_number > 9 && dayObj.date > 9) {
				if (disabledList.includes(month_number + '/' + dayObj.date + '/' + year)) {
					weekObj.days.pop();
					weekObj['hasDisabled'] = true;
				}
			}
			if (month_number > 9 && dayObj.date < 10) {
				if (disabledList.includes(month_number + '/' + dayObj.date + '/' + year) || disabledList.includes(month_number + '/0' + dayObj.date + '/' + year)) {
					weekObj.days.pop();
					weekObj['hasDisabled'] = true;
				}
			}
			if (month_number < 10 && dayObj.date > 9) {
				if (disabledList.includes(month_number + '/' + dayObj.date + '/' + year) || disabledList.includes('0' + month_number + '/' + dayObj.date + '/' + year)) {
					weekObj.days.pop();
					weekObj['hasDisabled'] = true;
				}
			}
			if (month_number < 10 && dayObj.date < 10) {
				if (disabledList.includes('0' + month_number + '/0' + dayObj.date + '/' + year) || disabledList.includes(month_number + '/' + dayObj.date + '/' + year) || disabledList.includes('0' + month_number + '/' + dayObj.date + '/' + year) || disabledList.includes(month_number + '/0' + dayObj.date + '/' + year)) {
					weekObj.days.pop();
					weekObj['hasDisabled'] = true;
				}
			}
			if (monthDate.getDay() === 6) {
				start = i + 1;
				break;
			}
		}
		weeks.push(weekObj);
		if (month_number > 9) {
			if (disabledList.includes((weekObj.week).charAt(0) + (weekObj.week).charAt(5) + '/' + month_number + '/' + year) || disabledList.includes((weekObj.week).charAt(0).toLowerCase() + (weekObj.week).charAt(5) + '/' + month_number + '/' + year)) {
				weeks.pop();
				hasDisabled = true
			}
		}
		if (month_number < 10) {
			if (disabledList.includes((weekObj.week).charAt(0) + (weekObj.week).charAt(5) + '/0' + month_number + '/' + year) || disabledList.includes((weekObj.week).charAt(0).toLowerCase() + (weekObj.week).charAt(5) + '/0' + month_number + '/' + year) || disabledList.includes((weekObj.week).charAt(0) + (weekObj.week).charAt(5) + '/' + month_number + '/' + year) || disabledList.includes((weekObj.week).charAt(0).toLowerCase() + (weekObj.week).charAt(5) + '/' + month_number + '/' + year)) {
				weeks.pop();
				hasDisabled = true
			}
		}
	}
	callback({ 'weeks': weeks, 'hasDisabled': hasDisabled });
}

// Function to check string is quarter value
export const isQuarterVal = (val) => {
	let _val = (val) ? val.toString() : '';
	return (_val === '1' || _val === '2' || _val === '3' || _val === '4' || _val === 'Q1' || _val === 'Q2' || _val === 'Q3' || _val === 'Q4' || _val === 'Q' || _val === 'q1' || _val === 'q2' || _val === 'q3' || _val === 'q4' || _val === 'q');
}

// Function to check string is month value
export const isMonthVal = (val) => {
	let _val = (val) ? val.toString() : '';
	let isExists = false;
	MONTH_SHORT_NAMES.forEach((month) => {
		let n = (month.indexOf(_val.toLowerCase()) !== -1);
		if (n === true) {
			isExists = true;
		}
	});
	return isExists;
}

// Function to check string is weeks value
export const isWeekVal = (val) => {
	let _val = (val) ? val.toString() : '';
	let isExists = false;
	WEEK_NAMES.forEach((month) => {
		let n = (month.indexOf(_val.toLowerCase()) !== -1);
		if (n === true) {
			isExists = true;
		}
	});
	return isExists;
}

// Function to check string is day value
export const isDayVal = (val) => {
	let _val = (val) ? parseInt(val) : '';
	return (_val <= 1 || _val <= 31);
}

//Function to convert 1 to 0 and 0 to 1
export const opposite = (number) => {
	return (number === -1)? -1 : (number === 1) ? 0 : 1;
}


export const quarterChangeCallback = (years, showWeeks, quarterObj, callback) => {
	let { quarter, year } = quarterObj;
	let stateSum = 0;

	quarter.state = (quarterObj.isCheck === true) ? 1 : 0;

	for (var i = 0; i < year.quarters.length; i++) {
		stateSum += year.quarters[i]["state"];
	}
	if (quarterObj.isCheck === true) {
		year.state = (stateSum < year.quarters.length) ? -1 : 1;
	} else {
		year.state = (stateSum < year.quarters.length) ? (stateSum === 0) ? 0 : -1 : 1;
	}
	quarter.months.forEach((element, qindex1) => {
		quarter.months[qindex1]['state'] = quarter.state;
		if (showWeeks === true) {
			quarter.months[qindex1]['weeks'].forEach((element, qindex2) => {
				quarter.months[qindex1]['weeks'][qindex2]['state'] = quarter.state;
				if (quarter.months[qindex1]['weeks'][qindex2]['days']) {
					quarter.months[qindex1]['weeks'][qindex2]['days'].forEach((element, qindex3) => {
						quarter.months[qindex1]['weeks'][qindex2]['days'][qindex3]['state'] = quarter.state;
					})
				}
			})
		}
		else {
			if (quarter.months[qindex1]['days']) {
				quarter.months[qindex1]['days'].forEach((element, qindex2) => {
					quarter.months[qindex1]['days'][qindex2]['state'] = quarter.state;
				})
			}
		}
	});
	callback([...years]);
}

export const monthChangeCallback = (years, showWeeks, showQuarters, monthObj, callback) => {

	let { month, quarter, year } = monthObj;
	let mstateSum = 0;
	let qstateSum = 0;

	if (monthObj.isCheck === true) {
		month.state = 1;
		if (showQuarters === true) {
			for (var i = 0; i < quarter.months.length; i++) {
				mstateSum += quarter.months[i]["state"];
			}
			quarter.state = (mstateSum < quarter.months.length) ? -1 : 1;

			for (var j = 0; j < year.quarters.length; j++) {
				qstateSum += year.quarters[j]["state"];
			}
			year.state = (qstateSum < year.quarters.length) ? -1 : 1;
		}
		if (showWeeks === true) {
			let weeks = month.weeks;
			weeks.forEach((element, index) => {
				weeks[index]['state'] = 1;
				if (weeks[index]['days']) {
					weeks[index]['days'].forEach((element, index1) => {
						weeks[index]['days'][index1]['state'] = 1;
					})
				}
			});
		} else {
			let days = month.days;
			if (days) {
				days.forEach((element, index) => {
					days[index]['state'] = 1;
				});
			}
		}
		if (showQuarters === false) {
			for (j = 0; j < year.months.length; j++) {
				qstateSum += year.months[j]["state"];
			}
			year.state = (qstateSum < year.months.length) ? -1 : 1;
		}
		callback([...years]);
	} else {
		let stateSum = 0;
		let qstateSum = 0;
		month.state = 0;
		if (showQuarters === true) {
			for (i = 0; i < quarter.months.length; i++) {
				stateSum += quarter.months[i]["state"];
			}
			quarter.state = (stateSum < quarter.months.length) ? (stateSum === 0) ? 0 : -1 : 1;

			for (j = 0; j < year.quarters.length; j++) {
				if (year.quarters[j]['state'] === -1) {
					qstateSum = -1;
					break;
				}
				qstateSum += year.quarters[j]["state"];
			}
			year.state = (qstateSum !== 0) ? (qstateSum < year.quarters.length) ? -1 : 1 : 0;
		}
		if (showWeeks === true) {
			let weeks = month.weeks;
			weeks.forEach((element, index) => {
				weeks[index]['state'] = 0;
				if (weeks[index]['days']) {
					weeks[index]['days'].forEach((element, index1) => {
						weeks[index]['days'][index1]['state'] = 0;
					})
				}
			});
		} else {
			let days = month.days;
			if (days) {
				days.forEach((element, index) => {
					days[index]['state'] = 0;
				});
			}
		}
		if (showQuarters === false) {
			for (j = 0; j < year.months.length; j++) {
				if (year.months[j]['state'] === -1) {
					qstateSum = -1;
					break;
				}
				qstateSum += year.months[j]["state"];
			}
			year.state = (qstateSum !== 0) ? (qstateSum < year.months.length) ? -1 : 1 : 0;
		}

		callback([...years]);
	}
}


export const weekChangeCallback = (years, showQuarters, weekObj, callback) => {
	let { week, month, quarter, year, isCheck } = weekObj;
	if (isCheck === true) {
		let wstateSum = 0;
		let qstateSum = 0;
		let mstateSum = 0;
		week.state = 1;
		if (week.days) {
			week.days.forEach((element, index) => {
				week.days[index]['state'] = 1;
			});
		}
		for (var j = 0; j < month.weeks.length; j++) {
			wstateSum += month.weeks[j]["state"];
		}
		month.state = (wstateSum < month.weeks.length) ? -1 : 1;
		if (showQuarters === true) {
			for (var k = 0; k < quarter.months.length; k++) {
				mstateSum += quarter.months[k]["state"];
			}
			quarter.state = (mstateSum < quarter.months.length) ? -1 : 1;

			for (var i = 0; i < year.quarters.length; i++) {
				qstateSum += year.quarters[i]["state"];
			}
			year.state = (qstateSum < year.quarters.length) ? -1 : 1;
		}
		if (showQuarters === false) {
			for (k = 0; k < year.months.length; k++) {
				mstateSum += year.months[k]["state"];
			}
			year.state = (mstateSum < year.months.length) ? -1 : 1;
		}
		callback([...years]);
	}
	else {
		let wstateSum = 0;
		let qstateSum = 0;
		let mstateSum = 0;
		week.state = 0;
		if (week.days) {
			week.days.forEach((element, index) => {
				week.days[index]['state'] = 0;
			});
		}
		for (j = 0; j < month.weeks.length; j++) {
			wstateSum += month.weeks[j]["state"];
		}
		month.state = (wstateSum < month.weeks.length) ? (wstateSum === 0) ? 0 : -1 : 1;

		if (showQuarters === true) {
			for (k = 0; k < quarter.months.length; k++) {
				mstateSum += quarter.months[k]["state"];
			}
			quarter.state = (mstateSum < quarter.months.length) ? (mstateSum === 0) ? 0 : -1 : 1;

			for (i = 0; i < year.quarters.length; i++) {
				if (year.quarters[i]['state'] === -1) {
					qstateSum = -1;
					break;
				}
				qstateSum += year.quarters[i]["state"];
			}
			year.state = (qstateSum < year.quarters.length) ? (qstateSum === 0) ? 0 : -1 : 1;
		}
		if (showQuarters === false) {
			for (k = 0; k < year.months.length; k++) {
				mstateSum += year.months[k]["state"];
			}
			year.state = (mstateSum < year.months.length) ? (mstateSum === 0) ? 0 : -1 : 1;
		}
		callback([...years]);
	}
}

export const dayChangeCallback = (years, showQuarters, dayObj, callback) => {
	let { day, month, quarter, year, isCheck } = dayObj;

	let dstateSum = 0;
	let qstateSum = 0;
	let mstateSum = 0;

	if (isCheck === true) {
		day['state'] = 1;
		for (var j = 0; j < month.days.length; j++) {
			dstateSum += month.days[j]["state"];
		}
		month.state = (dstateSum < month.days.length) ? -1 : 1;
		if (showQuarters === true) {
			for (var k = 0; k < quarter.months.length; k++) {
				mstateSum += quarter.months[k]["state"];
			}
			quarter.state = (mstateSum < quarter.months.length) ? -1 : 1;

			for (var i = 0; i < year.quarters.length; i++) {
				qstateSum += year.quarters[i]["state"];
			}
			year.state = (qstateSum < year.quarters.length) ? -1 : 1;
		}
		if (showQuarters === false) {
			for (k = 0; k < year.months.length; k++) {
				mstateSum += year.months[k]["state"];
			}
			year.state = (mstateSum < year.months.length) ? -1 : 1;
		}
		callback([...years]);
	}
	else {
		day.state = 0;
		for (j = 0; j < month.days.length; j++) {
			dstateSum += month.days[j]["state"];
		}
		month.state = (dstateSum < month.days.length) ? (dstateSum === 0) ? 0 : -1 : 1;
		if (showQuarters === true) {
			for (k = 0; k < quarter.months.length; k++) {
				mstateSum += quarter.months[k]["state"];
			}
			quarter.state = (mstateSum < quarter.months.length) ? (mstateSum === 0) ? 0 : -1 : 1;

			for (i = 0; i < year.quarters.length; i++) {
				if (year.quarters[i]['state'] === -1) {
					qstateSum = -1;
					break;
				}
				qstateSum += year.quarters[i]["state"];
			}
			year.state = (qstateSum < year.quarters.length) ? (qstateSum === 0) ? 0 : -1 : 1;
		}
		if (showQuarters === false) {
			for (i = 0; i < year.months.length; i++) {
				if (year.months[i]['state'] === -1) {
					qstateSum = -1;
					break;
				}
				qstateSum += year.months[i]["state"];
			}
			year.state = (qstateSum < year.months.length) ? (qstateSum === 0) ? 0 : -1 : 1;
		}
		callback([...years]);
	}
}

export const weekDayChangeCallback = (years, showQuarters, weekDaysObj, callback) => {
	let { day, week, month, quarter, year, isCheck } = weekDaysObj;

	let wstateSum = 0;
	let qstateSum = 0;
	let mstateSum = 0;
	let wdstateSum = 0;
	if (isCheck === true) {
		day.state = 1;
		for (var n = 0; n < week.days.length; n++) {
			wdstateSum += week.days[n]["state"];
		}
		week.state = (wdstateSum < week.days.length) ? -1 : 1;

		for (var j = 0; j < month.weeks.length; j++) {
			wstateSum += month.weeks[j]["state"];
		}
		month.state = (wstateSum < month.weeks.length) ? -1 : 1;
		if (showQuarters === true) {
			for (var k = 0; k < quarter.months.length; k++) {
				mstateSum += quarter.months[k]["state"];
			}
			quarter.state = (mstateSum < quarter.months.length) ? -1 : 1;

			for (var i = 0; i < year.quarters.length; i++) {
				qstateSum += year.quarters[i]["state"];
			}
			year.state = (qstateSum < year.quarters.length) ? -1 : 1;
		}
		if (showQuarters === false) {
			for (k = 0; k < year.months.length; k++) {
				mstateSum += year.months[k]["state"];
			}
			year.state = (mstateSum < year.months.length) ? -1 : 1;
		}
		callback([...years]);
	}
	else {
		day.state = 0;

		for (n = 0; n < week.days.length; n++) {
			wdstateSum += week.days[n]["state"];
		}
		week.state = (wdstateSum < week.days.length) ? (wdstateSum === 0) ? 0 : -1 : 1;
		for (j = 0; j < month.weeks.length; j++) {
			wstateSum += month.weeks[j]["state"];
		}
		month.state = (wstateSum < month.weeks.length) ? (wstateSum === 0) ? 0 : -1 : 1;
		if (showQuarters === true) {
			for (k = 0; k < quarter.months.length; k++) {
				mstateSum += quarter.months[k]["state"];
			}
			quarter.state = (mstateSum < quarter.months.length) ? (mstateSum === 0) ? 0 : -1 : 1;

			for (i = 0; i < year.quarters.length; i++) {
				if (year.quarters[i]['state'] === -1) {
					qstateSum = -1;
					break;
				}
				qstateSum += year.quarters[i]["state"];
			}
			year.state = (qstateSum < year.quarters.length) ? (qstateSum === 0) ? 0 : -1 : 1;
		}
		if (showQuarters === false) {
			for (i = 0; i < year.months.length; i++) {
				if (year.months[i]['state'] === -1) {
					qstateSum = -1;
					break;
				}
				qstateSum += year.months[i]["state"];
			}
			year.state = (qstateSum < year.months.length) ? (qstateSum === 0) ? 0 : -1 : 1;
		}
		callback([...years]);
	}
}