import { isUndefinedOrNull, isBlank, isValidDate, convertYYYYMMDD, getDateByFormat, getDateByFormatNew, ARROWS, convertYYYYMMDDByFormat, getYYYYMMDD, dateToYear, dateToMMYYYY, dateToQQYYYY } from "./utils";

export const DEFAULT_OPTIONS = {"displayFormat": "MM/DD/YYYY", disabledList: [], "iconAlignment":"Left", "dateStringAlignment": "Left", "isDisabled": false, "showButtons": false, "showClearIcon": false, "manualEntry": true, "showErrorMessage": false};
export const CLENDAR_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY"];
export const YEAR_FORMATS = ["YYYY", "MM/YYYY", "QQ/YYYY"];
export const CURRENT_YEAR = +(new Date().getFullYear());
export const CURRENT_MONTH = +(new Date().getMonth()) + 1;
export const WEEK_COUNT = 6;
// Calendar months names
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const MONTH_SHORT_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const WEEK_SHORT_NAMES = ["S", "M", "T", "W", "T", "F", "S"];
export const QUARTERS_NAMES = ["Q1", "Q2", "Q3", "Q4"];

// Function to check format is calendar type or not
export const isCalendarFormat = (displayFormat) => {
    return (CLENDAR_FORMATS.indexOf(displayFormat) !== -1)
}

// Function to check format is year type or not
export const isYearFormat = (displayFormat) => {
    return (YEAR_FORMATS.indexOf(displayFormat) !== -1)
}

// Function to check value is QQ/YYYY format using regex
export const isValidQQYYYYValue = (value) => {
    if(value && new RegExp(/Q[\d]{1}\/[\d]{4}/).test(value)){
        let _number = parseInt(value.charAt(1));
        let d = value.toString().split("/"),
                year = d[1];
        
        return (_number <= 4 && _number >= 1 && year.length === 4 && parseInt(year) > 999);
    } else {
        return false;
    }
}

// Function to check value is DD/MM/YYYY format using regex
export const isValidDDMMYYYYValue = (value) => {
    return new RegExp(/^[\d]{2}\/[\d]{2}\/[\d]{4}/).test(value);
}

// Function to check value is MM/YYYY format using regex
export const isValidMMYYYYValue = (value) => {
    return new RegExp(/^[\d]{2}\/[\d]{4}$/i).test(value);
}

// Function to check value is YYYY format using regex
export const isValidYYYYValue = (value) => {
    return new RegExp(/^[\d]{4}$/).test(value);
}

// Function to check format is DD/MM/YYYY
export const isDDMMYYYYFormat = (format) => {
    return (format === 'DD/MM/YYYY');
}

// Function to check format is MM/DD/YYYY
export const isMMDDYYYYFormat = (format) => {
    return (format === 'MM/DD/YYYY');
}

// Function to check format is QQ/YYYY
export const isQQYYYYFormat = (format) => {
    return (format === 'QQ/YYYY');
}

// Function to check format is MM/YYYY
export const isMMYYYYFormat =(format) => {
    return (format === 'MM/YYYY');
}

// Function to check format is YYYY
export const isYYYFormat =(format) => {
    return (format === 'YYYY');
}

// Get QQ/YYYY, MM/YYYY, YYYY format by display format
export function getDefaultQQMMYYYYDateByFormat(options){
    let _lowerDate = (options)? options.lowerLimit : '';
    let _format = (options)? options.displayFormat : '';

    let _val = "";
    
    if(isYYYFormat(_format)){
        let  _validDateYear = isValidOutsideRangeDateYear(dateToYear(), options);  
        _val = (_validDateYear || !isValidYYYYValue(_lowerDate))? dateToYear() : _lowerDate;
    } else if(isMMYYYYFormat(_format)){
        _lowerDate = dateToMMYYYY(_lowerDate);
        let _validMonthYear = isValidOutsideRangeDateMonthYear(dateToMMYYYY(), options);
        _val = (_validMonthYear || !isValidMMYYYYValue(_lowerDate))? dateToMMYYYY() : _lowerDate;
    } else if(isQQYYYYFormat(_format)){
        let  _validQQYear = isValidOutsideRangeDateQQYear(dateToQQYYYY(), options);
        _val = (_validQQYear || !isValidQQYYYYValue(_lowerDate))? dateToQQYYYY() : _lowerDate;
    }
    return _val;
}

// Get date by options
export function checkValueByDisplayFormat(date, options, callback){
    if(options.displayFormat && isYearFormat(options.displayFormat)){
        if(isValidQQYYYYValue(date) || isValidMMYYYYValue(date) || isValidYYYYValue(date)){
            callback(date, false, false);
        } else {
            if(isQQYYYYFormat(options.displayFormat)){
                let _date = dateToQQYYYY(date);
                let _validFormat = isValidQQYYYYValue(_date, options); 
                let _validOutRange = isValidOutsideRangeDateQQYear(_date, options);
                callback(_date, !_validFormat, !_validOutRange);
            } else if(isMMYYYYFormat(options.displayFormat)){
                let _date = dateToMMYYYY(date);
                let _validFormat = isValidMMYYYYValue(_date, options); 
                let _validOutRange = isValidOutsideRangeDateMonthYear(_date, options);
                callback(_date, !_validFormat, !_validOutRange);
            } else if(isYYYFormat(options.displayFormat)){
                let _date = dateToYear(date);
                let _validFormat = isValidYYYYValue(_date, options); 
                let _validOutRange = isValidOutsideRangeDateYear(_date, options);
                callback(_date, !_validFormat, !_validOutRange);
            } else {
                callback("", true, false);
            }
        }
    } else {
        if(date){
            let _date = getDateByFormatNew(date, options.displayFormat);
            let _dateNew = convertYYYYMMDDByFormat(_date, options.displayFormat);
            let  _validFormat = (isValidDate(_dateNew));
            let  _validOutRange = isValidOutsideRangeDate(_dateNew, options);
            
            callback(_date, !_validFormat, !_validOutRange);
        } else {
            callback("", true, false);
        }
    }
}

// Function to get date by display format
export const getConvertedDate = (date, displayFormat) => {
    let  _date = convertYYYYMMDDByFormat(date, displayFormat);
    return (!isValidDate(_date))? null : getYYYYMMDD(_date);
}

// Function to convert date to YYYY-MM-DD valid date
export const getConvertedDateYYYYMMDDD = (date) => {
    let d = date.toString().split("/"),
        month = '' + d[0],
        day = '01',
        year = d[1];

    if (month.length < 2) month = '0' + month;

    return [year, month, day].join('-');
}

// Function to get upper limit date from option
export function getUpperLimitFromOptions(options){
    return (options && options.upperLimit)? ((isValidDate(options.upperLimit))? options.upperLimit : null) : null;
}

// Function to get lower limit date from option
export function getLowerLimitFromOptions(options){
    return (options && options.lowerLimit)? ((isValidDate(options.lowerLimit))? options.lowerLimit : null) : null;
}

// Function to get proper formatted date from options new
export const getProperFormattedDateNew = (date, options) => {
    return new Date(currentFormatToYYYYMMDDNew(date, options));
}

// Function to get current formatted date
export const currentFormatToYYYYMMDDNew = (date, options) => {
    return convertYYYYMMDD(getDateByFormatNew(date, options.displayFormat), options);
}

// Function to get proper formatted date from options
export const getProperFormattedDate = (date, options) => {
    return new Date(currentFormatToYYYYMMDD(date, options));
}

// Function to get month from date
export const getSelectedMonthFromDate = (date, options) => {
    const _date = new Date(currentFormatToYYYYMMDD(date, options));
    return _date.getMonth();
}

// Function to get year from date
export const getSelectedYearFromDate = (date, options) => {
    const _date = new Date(currentFormatToYYYYMMDD(date, options));
    return _date.getFullYear();
}

// Function to convert date to YYYYMMDD format
export const currentFormatToYYYYMMDD = (date, options) => {
    return convertYYYYMMDD(getDateByFormat(date, (options)? options.displayFormat : 'MM/DD/YYYY'), options);
}

// Function to format options
export const formatOptions = (options) => {
    let  newOptions = {...options}
    newOptions['displayFormat'] = (isCalendarFormat(options.displayFormat) || isYearFormat(options.displayFormat))? options.displayFormat : DEFAULT_OPTIONS.displayFormat;
    let  displayFormat = newOptions['displayFormat'];

    if(options.lowerLimit){
        newOptions['lowerLimit'] = (isQQYYYYFormat(displayFormat) || isYYYFormat(displayFormat))? options.lowerLimit :((!isMMYYYYFormat(displayFormat))? getConvertedDate(options.lowerLimit, displayFormat) : getConvertedDateYYYYMMDDD(options.lowerLimit));
    }
    
    if(options.upperLimit){
        newOptions['upperLimit'] = (isQQYYYYFormat(displayFormat) || isYYYFormat(displayFormat))? options.upperLimit : ((!isMMYYYYFormat(displayFormat))? getConvertedDate(options.upperLimit, displayFormat) : getConvertedDateYYYYMMDDD(options.upperLimit));
    }

    if(options.disabledList && options.disabledList.length > 0){
        if(isYYYFormat(displayFormat)){
            newOptions['disabledList'] = [...options.disabledList] 
        } else {
            let _array = [];
            options.disabledList.forEach((ele) => {
                if(isQQYYYYFormat(displayFormat) && (isValidQQYYYYValue(ele) || isValidYYYYValue(ele))){
                    _array.push(ele)
                } else if(isMMYYYYFormat(displayFormat) && (isValidMMYYYYValue(ele) || isValidYYYYValue(ele))){
                    _array.push(ele)
                } else if(isCalendarFormat(displayFormat)){
                    let formattedDate = (isValidDDMMYYYYValue(ele))?  getConvertedDate(ele, displayFormat) : ele;
                    _array.push(formattedDate);
                    // _array.push(ele);
                }
            });
            newOptions['disabledList'] = [..._array] 
        }
    }
    if(options.indicatorList && options.indicatorList.length > 0){
        let _array = [];
        options.indicatorList.forEach((ele) => {
            let  _dates = [];
            if(ele && ele.dates && ele.dates.length > 0){
                ele.dates.forEach((date) => {
                    _dates.push(getConvertedDate(date, displayFormat));
                });
            }
            _array.push({'dates': _dates, 'color': ele.color});
        });
        newOptions['indicatorList'] = [..._array] 
    }

    return newOptions;
}

// Function to get full month name by index value
export function getMonthShortNameByIndex(index) {
    let  _index = (index)? index : 0;
    return MONTH_SHORT_NAMES[_index].toUpperCase();
}

// Function to get full month name by index value
export function getMonthNameByIndex(index) {
    let  _index = (index)? index : 0;
    return MONTH_NAMES[_index].toUpperCase();
}

// Function to get short month name by index value
export function getMonthIndex(month) {
    return zeroPad(MONTH_SHORT_NAMES.indexOf(month) + 1, 2);
}

// Function to return padding zero to string
export const zeroPad = (n, width, z)  =>{
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// Function to return days by month and year
export const getMonthDays = (month = CURRENT_MONTH, year = CURRENT_YEAR) => {
    const months30 = [4, 6, 9, 11];
    const leapYear = year % 4 === 0;

    return month === 2
        ? leapYear
            ? 29
            : 28
        : (months30.indexOf(month) !== -1)
            ? 30
            : 31;
}

// Function to return previous month value by month and year
export const getPreviousMonth = (month, year) => {
    const prevMonth = (month > 1) ? month - 1 : 12;
    const prevMonthYear = (month > 1) ? year : year - 1;

    return { month: prevMonth, year: prevMonthYear };
}

// Function to return next month value by month and year
export const getNextMonth = (month, year) => {
    const nextMonth = (month < 12) ? month + 1 : 1;
    const nextMonthYear = (month < 12) ? year : year + 1;

    return { month: nextMonth, year: nextMonthYear };
}

// Function to get first day of the month by month, year
export const getMonthFirstDay = (month = CURRENT_MONTH, year = CURRENT_YEAR) => {
    return +(new Date(`${year}-${zeroPad(month, 2)}-01`).getDay()) + 1;
}

// Funtion to create temporary array of null by number
export const createBlankArray = (number) => {
    let  _array = [];
    for (let index = 0; index < number; index++) {
        _array.push(null);
    }
    return _array;
}

// Constructor to current, previous and next month days arrays.
export default (month = CURRENT_MONTH, year = CURRENT_YEAR) => {
    const monthDays = getMonthDays(month, year);
    const monthFirstDay = getMonthFirstDay(month, year);

    const daysFromPrevMonth = monthFirstDay - 1;
    const daysFromNextMonth = (WEEK_COUNT * 7) - (daysFromPrevMonth + monthDays);
    
    const { month: prevMonth, year: prevMonthYear } = getPreviousMonth(month, year);
    const { month: nextMonth, year: nextMonthYear } = getNextMonth(month, year);
    
    const prevMonthDays = getMonthDays(prevMonth, prevMonthYear);
    
    const _array0 = createBlankArray(daysFromPrevMonth);
    const prevMonthDates = _array0.map((n, index) => {
        const day = index + 1 + (prevMonthDays - daysFromPrevMonth);
        return [prevMonthYear.toString(), zeroPad(prevMonth, 2), zeroPad(day, 2)];
    });
    
    const _array1 = createBlankArray(monthDays);
    const thisMonthDates = _array1.map((n, index) => {
        const day = index + 1;
        return [year.toString(), zeroPad(month, 2), zeroPad(day, 2)];
    });
    
    const _array2 = createBlankArray(daysFromNextMonth);
    const nextMonthDates = _array2.map((n, index) => {
        const day = index + 1;
        return [nextMonthYear.toString(), zeroPad(nextMonth, 2), zeroPad(day, 2)];
    });


    Array.prototype.push.apply(prevMonthDates, thisMonthDates);
    Array.prototype.push.apply(prevMonthDates, nextMonthDates);
    return prevMonthDates;
}

// Function to get year list based on current year
export const getYearsList = (year) => {
    year = (year)? year : new Date().getFullYear();
    let  array = [];
    for (let index = -1; index < 11; index++) {
        array.push(year - index);
    }
    return array.reverse();
}

// (bool) Checks if a value is a date - this is just a simple check
export const isDate = date => {
    const isDate = Object.prototype.toString.call(date) === '[object Date]';
    const isValidDate = date && !isNaN(date.valueOf());

    return isDate && isValidDate;
}

// (bool) Checks if two date values are of the same month and year
export const isSameMonth = (date, basedateMonth, basedateYear) => {
    if (!(isDate(date))) return false;

    const dateMonth = +(date.getMonth()) + 1;
    const dateYear = date.getFullYear();

    return (+basedateMonth === +dateMonth) && (+basedateYear === +dateYear);
}

// (bool) Checks if two date values are the same day
export const isSameDay = (date, basedate = new Date()) => {
    if (!(isDate(date) && isDate(basedate))) return false;
    const basedateDate = basedate.getDate();
    const basedateMonth = +(basedate.getMonth()) + 1;
    const basedateYear = basedate.getFullYear();

    const dateDate = date.getDate();
    const dateMonth = +(date.getMonth()) + 1;
    const dateYear = date.getFullYear();

    return (basedateDate === dateDate) && (basedateMonth === dateMonth) && (basedateYear === dateYear);
}

// (string) Formats the given date as YYYY-MM-DD
// Months and Days are zero padded
export const getIsoDate = (date = new Date()) => {
    if (!isDate(date)) return null;
    return [
        date.getFullYear(),
        zeroPad(+date.getMonth() + 1, 2),
        zeroPad(+date.getDate(), 2)
    ].join('-');
}

// (bool) Function to check date is between from and to date
export const checkDateInBetween = (date, from, to) => {
    if(isDate(date)){
        let  _from = (!isUndefinedOrNull(from))? new Date(from) : null; 
        let  _to = (!isUndefinedOrNull(to))? new Date(to) : null; 
        
        if(isUndefinedOrNull(_from) && isUndefinedOrNull(_to)){
            return true;
        } else if(!isDate(_from) && isDate(_to) && date.getTime() <= _to.getTime()){
            return true;
        } else if(!isDate(_to) && isDate(from) && date.getTime() >= from.getTime()){
            return true;
        } else if(isDate(from) && isDate(_to) && (date.getTime() < from.getTime() || date.getTime() > _to.getTime())){
            return false;
        } else if(isDate(from) && isDate(_to)){
            let  _fromDt = new Date(from);
            if(date.getTime() >= _fromDt.getTime() && date.getTime() <= _to.getTime()){
                return true;
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false;
    }
}

// Function to validate formatted date
export function isValidFormattedDate(date, options) {
    let _date = convertYYYYMMDD(date, options);
    return (isDate(new Date(_date)));
}

// Function to validate date is between lower and upper limit for QQ/YYYY format
export const isValidOutsideRangeDateQQYear = (date, options) => {
    const { lowerMonthLimit, lowerYearLimit } = getYYYYForLowerLimit(options);
    const { upperMonthLimit, upperYearLimit } = getYYYYForUpperLimit(options); 
    
    let _validate = false;
    if(isUndefinedOrNull(lowerMonthLimit) && isUndefinedOrNull(upperMonthLimit) && isUndefinedOrNull(lowerYearLimit) && isUndefinedOrNull(upperYearLimit)){
        return true;
    } else {
        let d = date.toString().split("/"),
                qq = d[0],
                year = parseInt(d[1]);
        
        if(lowerYearLimit && upperYearLimit && (year >= lowerYearLimit && year <= upperYearLimit)){
            _validate = true;
        } else if(lowerYearLimit && !upperYearLimit && year >= lowerYearLimit){
            _validate = true;
        } else if(!lowerYearLimit && upperYearLimit && year <= upperYearLimit){
            _validate = true;
        } 
    
        if(_validate === true){
            let _l = (lowerMonthLimit)? parseInt(lowerMonthLimit.charAt(1)) : 1;
            let _u = (upperMonthLimit)? parseInt(upperMonthLimit.charAt(1)) : 4;
            let _q = parseInt(qq.charAt(1));
          
            if((year === lowerYearLimit && _q < _l) || (year === upperYearLimit && _q > _u)){
                _validate = false;
            }

            const {disabledList} = options;
            if(qq && year){
                const _val = qq + '/' + year;
                _validate = (disabledList && disabledList.length > 0 && _val)? ((disabledList.indexOf(_val.toString()) !== -1)? false : _validate) : _validate;
            } 
        }
        return _validate;
    }
}

// Function to validate date is between lower and upper limit for YYYY format
export const isValidOutsideRangeDateYear = (year, options) => {
    const { lowerYearLimit } = getYYYYForLowerLimit(options);
    const { upperYearLimit } = getYYYYForUpperLimit(options);
    const { disabledList } = options;

    let _validate = true;
    if(lowerYearLimit && upperYearLimit && (year < lowerYearLimit || year > upperYearLimit)){
        _validate = false;
    } else if(lowerYearLimit && !upperYearLimit && year < lowerYearLimit){
        _validate = false;
    } else if(!lowerYearLimit && upperYearLimit && year > upperYearLimit){
        _validate = false;
    } else if(disabledList && disabledList.length > 0 && year){
        _validate = ((disabledList.indexOf(year.toString()) !== -1)? false : true);
    }
        
    return _validate;
}

// Function to validate date is between lower and upper limit for MM/YYYY format
export const isValidOutsideRangeDateMonthYear = (date, options) => {
    const { lowerMonthLimit, lowerYearLimit } = getYYYYForLowerLimit(options);
    const { upperMonthLimit, upperYearLimit } = getYYYYForUpperLimit(options);

    let d = date.toString().split("/"),
        month = parseInt(d[0]),
        year = parseInt(d[1]);

    let _date = new Date(year, (month - 1), 1);  
    let _lowerLimit = new Date(lowerYearLimit, (lowerMonthLimit - 1), 1);   
    _lowerLimit.setDate(1);
    _lowerLimit.setHours(-1);  
    let _upperLimit = new Date(upperYearLimit, upperMonthLimit, 1); 
    _upperLimit.setDate(1);
    _upperLimit.setHours(-1);  
    
    const _validate = checkDateInBetween(_date, isValidDate(_lowerLimit)? _lowerLimit : null, isValidDate(_upperLimit)? _upperLimit : null);
    if(_validate){
        const {disabledList} = options;
        if(month && year){
            const _month = zeroPad(month, 2);
            const _val = _month + '/' + year;
            return (disabledList && disabledList.length > 0 && _val)? ((disabledList.indexOf(_val.toString()) !== -1)? false : _validate) : _validate;
        } else {
            return _validate;
        }
    }

    return _validate;
}

// Function to validate date is between lower and upper limit for MM/DD/YYYY or DD/MM/YYYY format
export const isValidOutsideRangeDate = (date, options) => {
    const lowerLimit = getLowerLimitFromOptions(options);
    const upperLimit = getUpperLimitFromOptions(options);
    
    const _date = new Date(convertYYYYMMDD(getDateByFormat(getProperFormattedDateNew(date, options), options.displayFormat), options));
    const _lowerLimit = new Date(convertYYYYMMDD(getDateByFormat(lowerLimit, options.displayFormat), options));
    const _upperLimit = (upperLimit)? new Date(convertYYYYMMDD(getDateByFormat(upperLimit, options.displayFormat), options)) : upperLimit;

    const isValid = (checkIsInValidLowerUpper(options) || checkDateInBetween(_date, _lowerLimit, _upperLimit));
    
    return (isValid && !dateIsInDisabledList(_date, options));
}

// Function to reset options with default options
export const resetOptions = (options) => {
    return {...DEFAULT_OPTIONS, ...options};
}

// Function to return YYYY format for lower limit
export const getYYYYForLowerLimit = (options) => {
    return (options && options.lowerLimit)? getYYYYFromOption(options.lowerLimit, options, true) : {};
}

// Function to return YYYY format for upper limit
export const getYYYYForUpperLimit = (options) => {
    return (options && options.upperLimit)? getYYYYFromOption(options.upperLimit, options, false) : {};
}

// Function to return lower/upper limit from option 
export const getYYYYFromOption = (limit, options, flag) => {
    if(limit){
        if(isQQYYYYFormat(options.displayFormat)){
            let d = limit.toString().split("/"),
                    qq = d[0],
                    year = parseInt(d[1]);

            return (flag)? {lowerMonthLimit: qq, lowerYearLimit: year} : {upperMonthLimit: qq, upperYearLimit: year}
        } else if(isMMYYYYFormat(options.displayFormat)){
            const _date = new Date(limit);
            if(isDate(_date)){
                const year= _date.getFullYear();
                const month = zeroPad(_date.getMonth() + 1, 2);
                return (flag)? {lowerMonthLimit: month, lowerYearLimit: year} : {upperMonthLimit: month, upperYearLimit: year}
            } else {
                return {};
            }
        } else if(isYYYFormat(options.displayFormat)){
            const _date = new Date(limit);
            if(isDate(_date)){
                const year= _date.getFullYear();
                return (flag)? {lowerYearLimit: (year && isValidYYYYValue(parseInt(year)))? year : ""} : {upperYearLimit: (year && isValidYYYYValue(parseInt(year)))? year : ""}
            } else {
                return {};
            }
        }  else if(isDDMMYYYYFormat(options.displayFormat) || isMMDDYYYYFormat(options.displayFormat)){
            const _date = new Date(currentFormatToYYYYMMDD(limit, options));
            return (flag)? {lowerMonthLimit: (isValidDate(_date))? (_date.getMonth() + 1) : "", lowerYearLimit: (isValidDate(_date))? _date.getFullYear() : ""} : {upperMonthLimit: (isValidDate(_date))? (_date.getMonth() + 1) : "",upperYearLimit:  (isValidDate(_date))? _date.getFullYear() : ""}
        } else {
            return {};
        }
    } else {
        return {};
    }
}

// Function to get selected year
export const getSelectedYear = (value) => {
    return (value)? value.split("/")[1] : ''
}

// Function to get selected month
export const getSelectedMonth = (value) => {
    return (value)? value.split("/")[0] : ''
}

// Function to check two values are equal or not
export const isEqual = (val1, val2) => {
    return (val1 && val2 && val1.toString() === val2.toString())
}

// Function to get invalid date message. Return default message if not defined.
export const getInvalidDateMessage = (validationMessages, isInvalidDate, isInvalidRangeDate) => {
    let  _msg = (isInvalidDate)? 'Invalid Date' : ((isInvalidRangeDate)? 'Outside allowed range' : '');

    if(!validationMessages || validationMessages.length <= 0){
       return _msg;
    }

    validationMessages.forEach((msg) => {
        if(!isBlank(msg['inValidFormat']) && isInvalidDate){
            _msg = msg['inValidFormat'];
        } else if(!isBlank(msg['outsideRange']) && isInvalidRangeDate && _msg === ''){
            _msg = msg['outsideRange'];
        }
    });
    return _msg;
}

// Recursive funtion to get valid next date by charcode
export const getNewUpdateDateByArrow = (selectedDate, isRecursive, options, displayFormat, lowerLimit, upperLimit, charCode, isCtrl, isMonth) => {
    const _date = (isRecursive === true)? selectedDate : convertYYYYMMDD(getDateByFormatNew(selectedDate, displayFormat), options);
    let newdate = new Date(_date);

    // Check full year or month is disabled
    if(!checkFullMonthOrYearDisabled(newdate, options.disabledList) && isRecursive === true){
        let counter = (charCode === ARROWS.left || charCode === ARROWS.up)? -1 : 1;
        newdate.setMonth(newdate.getMonth() + counter);

        let _lDate = new Date(lowerLimit);
        _lDate.setDate(_lDate.getDate());
        let _uDate = (upperLimit)? new Date(upperLimit) : upperLimit;

        let isValidDate = checkDateInBetween(newdate, _lDate, _uDate);
        let disabled = checkFullMonthOrYearDisabled(newdate, options.disabledList);
        return (dateIsInDisabledList(newdate, options) || !disabled)? getNewUpdateDateByArrow(newdate, true, options, displayFormat, lowerLimit, upperLimit, charCode, isCtrl, isMonth) : ((isValidDate)? getDateByFormat(newdate, displayFormat) : getDateByFormatNew(selectedDate, displayFormat));
    } else {
        let day = (charCode === ARROWS.left)? -1 : (charCode === ARROWS.right)? 1 : (charCode === ARROWS.down)? 7 : -7; 
        if(isCtrl){
            day = (charCode === ARROWS.left || charCode === ARROWS.up)? -365 : 365;
        }
        
        if(isMonth){
            let counter = (charCode === ARROWS.left || charCode === ARROWS.up)? -1 : 1;
            let month = (newdate.getMonth());
            if(dateIsInDisabledList(newdate, options)){
                newdate.setDate(newdate.getDate() + counter);
                newdate.setFullYear(newdate.getFullYear());
            } else {
                newdate.setMonth(month + counter);
                newdate.setFullYear(newdate.getFullYear());
            }
        } else if(isCtrl){
            let counter = (charCode === ARROWS.left || charCode === ARROWS.up)? -1 : 1;
            let year = (newdate.getFullYear());
            let month = (newdate.getMonth());
    
            if(dateIsInDisabledList(newdate, options)){
                newdate.setDate(newdate.getDate() + counter);
                newdate.setFullYear(year);
            } else {
                newdate.setMonth(month);
                newdate.setFullYear(year + counter);
            }
        } else {
            newdate.setDate(newdate.getDate() + day);
        }
        
        let _lDate = new Date(lowerLimit);
        _lDate.setDate(_lDate.getDate());
        let _uDate = (upperLimit)? new Date(upperLimit) : upperLimit;
        
        let isValidDate = checkDateInBetween(newdate, _lDate, _uDate);
       
        if(dateIsInDisabledList(newdate, options)){
            return getNewUpdateDateByArrow(newdate, true, options, displayFormat, lowerLimit, upperLimit, charCode, isCtrl, isMonth);
        } else {
            return (isValidDate)? getDateByFormat(newdate, displayFormat) : getDateByFormatNew(selectedDate, displayFormat);
        }
    }
}

// Function to check date is disabled list or not
export const checkIsInValidLowerUpper = (options) => {
    const lowerLimit = getLowerLimitFromOptions(options);
    const upperLimit = getUpperLimitFromOptions(options);

    const isInValidLowerUpper = ((isUndefinedOrNull(lowerLimit) || !isValidDate(lowerLimit)) && (isUndefinedOrNull(upperLimit) || !isValidDate(upperLimit)));
    return isInValidLowerUpper;
}

// Function to check date is disabled list or not
export const dateIsInDisabledList = (newdate, options) => {
    let _flag = false;

    
    if(options.disabledList && options.disabledList.length > 0){
        const _newDate = new Date(newdate);
        if(_newDate && isValidDate(_newDate)){
            const _mmyyyy = (_newDate.getMonth() + 1 + '/' + _newDate.getFullYear()).toString();
            const _yyyy = (_newDate.getFullYear()).toString();
            if(options.disabledList.indexOf(_yyyy) !== -1 || options.disabledList.indexOf(_mmyyyy) !== -1 || options.disabledList.indexOf('0'+_mmyyyy) !== -1){
                _flag = true;
            }
        }

        if(_flag === false){
            options.disabledList.forEach((ele) => {
                if((new Date(newdate).getTime() === new Date(ele).getTime())){
                    _flag = true;
                };
            });
        }
    } 
    return _flag;
}

// Function to check value is disabled list or not
export const valueIsInDisabledList = (value, options) => {
    let  _flag = false;

    if(options.disabledList && options.disabledList.length > 0){
        _flag = options.disabledList.indexOf(value) > -1;
    } 
    return _flag;
}


// Recursive funtion to get valid next date by charcode
export const getNewUpdateValueByArrow = (value, isRecursive, options, displayFormat, lowerLimit, upperLimit, charCode, isCtrl, isMonth) => {
    if(valueIsInDisabledList(value, options)){
        let _newVal = '';
        
        if(displayFormat === 'MM/YYYY'){
            let d = value.toString().split("/"),
                month = parseInt(d[0]),
                year = parseInt(d[1]);
    
                month = (month <= 11)? month + 1 : 1;
            const _month = zeroPad(month, 2);
            _newVal = _month + '/' + ((month === 1)? year + 1 : year);
        } else if (displayFormat === 'YYYY'){
            _newVal = (parseInt(value) + 1).toString();
        } else if (displayFormat === 'QQ/YYYY'){
            let d = value.toString().split("/"),
                qq = d[0],
                _q = parseInt(qq.charAt(1)),
                year = parseInt(d[1]);

                _q = (_q <= 3)? _q + 1 : 1;
            const _qq = 'Q' + _q;
            _newVal = _qq + '/' + ((_q === 1)? year + 1 : year);
        }
        return getNewUpdateValueByArrow(_newVal, true, options, displayFormat, lowerLimit, upperLimit, charCode, isCtrl, isMonth);
    } else {
        return value;
    }
}

// Function to check value is left or not
export const isLeft = (value) => {
    return (value.toLowerCase()) === 'left';
}

// Function to check value is right or not
export const isRight = (value) => {
    return (value.toLowerCase()) === 'right';
}

// Function to return number of character allowed by display format
export const checkAllowedChars = (displayFormat, value) => {
    let _maxChar = (isMMYYYYFormat(displayFormat) || isQQYYYYFormat(displayFormat))? 7 : (isYYYFormat(displayFormat))? 4 : 10;
    return (value.length <= _maxChar);
}

// Function to return number of character allowed by display format
export const checkFullMonthOrYearDisabled = (_date, disabledList) => {
    let _flag = true;
    const _newDate = new Date(_date);
    if(_newDate && isValidDate(_newDate) && disabledList){
        const _mmyyyy = (_newDate.getMonth() + 1 + '/' + _newDate.getFullYear()).toString();
        const _yyyy = (_newDate.getFullYear()).toString();
        if(disabledList.indexOf(_yyyy) !== -1 || disabledList.indexOf(_mmyyyy) !== -1 || disabledList.indexOf('0'+_mmyyyy) !== -1){
            _flag = false;
        }
    }
    return _flag;
}

