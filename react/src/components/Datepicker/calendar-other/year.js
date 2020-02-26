import React, { Fragment } from "react";
import {
    QUARTERS_NAMES,
    getSelectedMonth,
    getSelectedYear,
    isEqual,
    getYYYYForLowerLimit,
    getYYYYForUpperLimit,
    getMonthIndex,
    isMMYYYYFormat
} from "../../../utils/calendar";
import {
    splitArray,
    guid
} from "../../../utils/utils";
import MonthsView from "./months-view";
import YearsView from "./years-view";
import * as CONSTANTS from '../../../utils/constants'

class Year extends React.PureComponent {
    constructor(props) {
        super(props);
        const { options } = this.props;
        const { lowerMonthLimit, lowerYearLimit } = getYYYYForLowerLimit(options);
        const { upperMonthLimit, upperYearLimit } = getYYYYForUpperLimit(options);
        let year = new Date().getFullYear();
        year = parseInt(year);

        this.state = { year: year, isYearSelected: false, currentDateMonth: "", selectedYear: "", isDisabledPrev: ((year - 11) < lowerYearLimit) ? true : false, isDisabledNext: ((year + 1) >= upperYearLimit)? true : false, upperYearLimit: upperYearLimit, lowerYearLimit: lowerYearLimit, lowerMonthLimit: lowerMonthLimit, upperMonthLimit: upperMonthLimit };

        this.updateNextPrev();
    }
    
    componentDidMount() {
        const { selectedValue, options } = this.props;
        if (selectedValue) {
            if (options.displayFormat === 'YYYY') {
                this.setState({
                    selectedYear: selectedValue,
                    year: selectedValue
                });
            } else {
                this.setState({
                    currentDateMonth: getSelectedMonth(selectedValue),
                    selectedYear: getSelectedYear(selectedValue),
                    year: getSelectedYear(selectedValue)
                })
            }
        }
    }

    componentDidUpdate(prevProps) {
        this.updateNextPrev();
    }

    updateNextPrev() {
        const { options } = this.props;
        const { lowerMonthLimit, lowerYearLimit } = getYYYYForLowerLimit(options);
        const { upperMonthLimit, upperYearLimit } = getYYYYForUpperLimit(options);
        let { year } = this.state;
        year = parseInt(year);

        this.setState({ isDisabledNext: ((year + 1) >= upperYearLimit) ? true : false, isDisabledPrev: ((year - 11) < lowerYearLimit) ? true : false, upperYearLimit: upperYearLimit, lowerYearLimit: lowerYearLimit, lowerMonthLimit: lowerMonthLimit, upperMonthLimit: upperMonthLimit });
    }

    onSelectYearHandler = (year) => {
        this.setState({
            isYearSelected: true,
            year: year
        });

        const options = this.props.options;
        if (options.displayFormat === 'YYYY') {
            this.props.onYearSelect(year.toString());
        }
    }

    onSelectMonthHandler = (month) => {
        this.setState({
            isYearSelected: true
        });

        this.props.onYearSelect(getMonthIndex(month) + '/' + this.state.year);
    }

    onSelectQuarterHandler = (quarter) => {
        this.setState({
            isYearSelected: true
        });

        this.props.onYearSelect(quarter + '/' + this.state.year);
    }

    onGoToSelectYearHandler = () => {
        this.setState({
            isYearSelected: false
        });
    }

    getQuarters = () => {
        return splitArray(QUARTERS_NAMES, 2);
    }

    getCalendarQuartersClass = () => {
        return `${CONSTANTS.CLASSES.VS_CALENDAR_CONTAINER} ${CONSTANTS.CLASSES.VS_MODAL} ${CONSTANTS.CLASSES.VS_SHAPE_ROUNDED_FILL_FOR_QUARTER}`;
    }
    
    checkYearIsEnabled = (year) => {
        const {disabledList} = this.props.options;

        return (disabledList && disabledList.length > 0 && year)? ((disabledList.indexOf(year.toString()) !== -1)? false : true) : true;
    }
    
    checkQQMMIsEnabled = (qqmm, year) => {
        const {disabledList, displayFormat} = this.props.options;
        if(qqmm && year){
            qqmm = (isMMYYYYFormat(displayFormat))? getMonthIndex(qqmm.toString()) : qqmm;
            const _val = qqmm + '/' + year;
            return (disabledList && disabledList.length > 0 && _val)? ((disabledList.indexOf(_val.toString()) !== -1)? false : true) : true;
        } else {
            return true;
        }
    }

    renderQuarterValue = (quarter, index) => {
        const activeClass = (isEqual(this.state.currentDateMonth, quarter)) ? 'VS-Active' : '';
        const { lowerMonthLimit, upperMonthLimit, lowerYearLimit, upperYearLimit, year } = this.state;
        const _l = (lowerMonthLimit)? parseInt(lowerMonthLimit.charAt(1)) : 1;
        const _u = (upperMonthLimit)? parseInt(upperMonthLimit.charAt(1)) : 4;
        const _q = parseInt(quarter.charAt(1));
        const isEnabled = this.checkQQMMIsEnabled(quarter, year);
        
        return (
            <Fragment key={guid()}>
                {
                    ((lowerMonthLimit && lowerYearLimit && lowerYearLimit === year && _q < _l) || (upperMonthLimit && upperYearLimit && upperYearLimit === year && _q > _u) || (!isEnabled)) ?
                        <span className={`${CONSTANTS.CLASSES.VS_MONTH_QUARTER} ${CONSTANTS.CLASSES.VS_DISABLED}`}>{quarter}</span>:
                        <span className={`${activeClass} ${CONSTANTS.CLASSES.VS_MONTH_QUARTER}`} onClick={() => this.onSelectQuarterHandler(quarter)}>{quarter}</span>
                }
            </Fragment>
        );
    }

    renderQuarterRow = (quarters, index) => {
        const rows = quarters.map((date, index1) => {
            return this.renderQuarterValue(date, index1)
        });

        return (
            <div className={`${CONSTANTS.CLASSES.VS_DATE_ROW_FLEX}`} key={guid()}>{rows}</div>
        )
    }

    goToNextYearHandler = () => {
        const { year } = this.state;
        const currentDateYear = year + 1;
        
        this.setState({
            year: parseInt(currentDateYear)
        });
    }
    
    goToPrevYearHandler = () => {
        const { year } = this.state;
        const currentDateYear = year - 1;
        
        this.setState({
            year: parseInt(currentDateYear)
        });
    }

    render() {
        const { year, isYearSelected, currentDateMonth } = this.state;
        const { selectedValue, options } = this.props;
        const isQuarter = (options.displayFormat === 'QQ/YYYY');

        return (
            <div>
                {
                    (year && !isYearSelected) ?
                        <YearsView options={options} style={this.props.style} onSelectYear={this.onSelectYearHandler} selectedValue={selectedValue}></YearsView>
                        :
                        (isQuarter) ?
                            <div className={this.getCalendarQuartersClass()} style={this.props.style}>
                                <Fragment>
                                    {this.getQuarters().map((row, index) => this.renderQuarterRow(row, index))}
                                </Fragment>
                            </div> :
                            <MonthsView options={options} currentDateMonth={currentDateMonth} currentDateYear={year} style={this.props.style} showHeaderSelection={true} goToSelectYear={this.onGoToSelectYearHandler} onSelectMonth={this.onSelectMonthHandler} goToPrevYear={this.goToPrevYearHandler} goToNextYear={this.goToNextYearHandler}></MonthsView>
                }
            </div>
        );
    }
}

export default Year;