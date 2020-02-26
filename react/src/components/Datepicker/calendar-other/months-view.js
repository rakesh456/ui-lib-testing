import React, { Fragment } from "react";
import { FaCaretLeft, FaCaretRight } from 'react-icons/lib/fa';
import {
    isEqual,
    isCalendarFormat,
    MONTH_SHORT_NAMES,
    CURRENT_YEAR,
    getMonthIndex,
    isMMYYYYFormat,
    getYYYYForLowerLimit,
    getYYYYForUpperLimit
} from "../../../utils/calendar";

import {
    guid,
    splitArray
} from "../../../utils/utils";
import * as CONSTANTS from '../../../utils/constants'

class MonthsView extends React.PureComponent {
    constructor(props) {
        super(props);
        const { options, showHeaderSelection } = this.props;
        const { lowerYearLimit } = getYYYYForLowerLimit(options);
        const { upperYearLimit } = getYYYYForUpperLimit(options);
        const currentDateYear = (this.props.currentDateYear)? this.props.currentDateYear : CURRENT_YEAR;
        const year = parseInt(currentDateYear);
        this.state = { sDisabledNext: (year >= upperYearLimit) ? true : false, isDisabledPrev: (year <= lowerYearLimit) ? true : false, showHeaderSelection: (showHeaderSelection === true), year: year};
    }
    
    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        this.updateNextPrev();
    }

    updateNextPrev() {
        const { options } = this.props;
        const { lowerYearLimit } = getYYYYForLowerLimit(options);
        const { upperYearLimit } = getYYYYForUpperLimit(options);
        const currentDateYear = (this.props.currentDateYear)? this.props.currentDateYear : CURRENT_YEAR;
        const year = parseInt(currentDateYear);
        this.setState({ isDisabledNext: (year >= upperYearLimit) ? true : false, isDisabledPrev: (year <= lowerYearLimit) ? true : false });
    }
    
    getMonths = () => {
        return splitArray(MONTH_SHORT_NAMES, 3);
    }
    
    onSelectMonthHandler = (month) => {
        this.props.onSelectMonth(month);
    }

    getCalendarMonthClass = () => {
        return `${CONSTANTS.CLASSES.VS_CALENDAR_CONTAINER} ${CONSTANTS.CLASSES.VS_MODAL} ${CONSTANTS.CLASSES.VS_SHAPE_ROUNDED_FILL_FOR_MONTH}`;
    }
    
    checkQQMMIsEnabled = (qqmm, year) => {
        const {options} = this.props;
        let {disabledList, displayFormat} = options;
        const { lowerMonthLimit, lowerYearLimit } = getYYYYForLowerLimit(options);
        const { upperMonthLimit, upperYearLimit } = getYYYYForUpperLimit(options);
        const currentDateYear = (this.props.currentDateYear)? this.props.currentDateYear : CURRENT_YEAR;
        
        if(qqmm && year){
            qqmm = (isMMYYYYFormat(displayFormat))? getMonthIndex(qqmm.toString()) : qqmm;
            const _val = qqmm + '/' + year;
            const _monthNumber = (isCalendarFormat(displayFormat))? parseInt(getMonthIndex(qqmm)) : parseInt(qqmm);

            // Disabled lower limit and upper limit month
            if(((currentDateYear === lowerYearLimit && _monthNumber < parseInt(lowerMonthLimit)) || (currentDateYear === upperYearLimit && _monthNumber > parseInt(upperMonthLimit)))){
                return false;
            }

            // Disabled month if current year in disabled list
            if(disabledList.indexOf(currentDateYear.toString()) !== -1){
                return false;
            }
            
            // const _monthNumber = parseInt(getMonthIndex(qqmm));
            const _qmy = _monthNumber + '/' + currentDateYear;
            if(disabledList.indexOf(_qmy.toString()) !== -1 || disabledList.indexOf('0' + _qmy.toString()) !== -1){
                return false;
            }

            return (disabledList && disabledList.length > 0 && _val)? ((disabledList.indexOf(_val.toString()) !== -1)? false : true) : true;
        } else {
            return true;
        }
    }

    renderMonthValue = (month, index) => {
        const activeClass = (isEqual(this.props.currentDateMonth, month)) ? 'VS-Active' : '';
        const { lowerMonthLimit, upperMonthLimit, lowerYearLimit, upperYearLimit, year } = this.state;
        const isEnabled = this.checkQQMMIsEnabled(month, year);
        return (
            <Fragment key={guid()}>
                {
                    ((lowerMonthLimit && lowerYearLimit && lowerYearLimit === year && lowerMonthLimit > getMonthIndex(month)) || (upperMonthLimit && upperYearLimit && upperYearLimit === year && upperMonthLimit < getMonthIndex(month)) || (!isEnabled)) ?
                        <span className={`${activeClass} ${CONSTANTS.CLASSES.VS_MONTH_QUARTER} ${CONSTANTS.CLASSES.VS_DISABLED}`}>{month}</span>:
                        <span className={`${activeClass} ${CONSTANTS.CLASSES.VS_MONTH_QUARTER}`} onClick={() => this.onSelectMonthHandler(month)}>{month}</span>
                }
            </Fragment>
        );
    }

    renderMonthRow = (months, index) => {
        const rows = months.map((date, index1) => {
            return this.renderMonthValue(date, index1)
        });

        return (
            <div className={`${CONSTANTS.CLASSES.VS_DATE_ROW_FLEX}`} key={guid()}>{rows}</div>
        )
    }

    render() {
        const { showHeaderSelection, isDisabledPrev, isDisabledNext } = this.state;
        const currentDateYear = (this.props.currentDateYear)? this.props.currentDateYear : CURRENT_YEAR;
        return (
            <div className={this.getCalendarMonthClass()} style={this.props.style}>
                {
                    (showHeaderSelection)? 
                        <div className={`${CONSTANTS.CLASSES.VS_CALENDAR_MONTH} ${CONSTANTS.CLASSES.VS_TEXT_CENTER}`}>
                            {
                                (isDisabledPrev) ?
                                    <FaCaretLeft className={`${CONSTANTS.CLASSES.VS_PULL_LEFT} ${CONSTANTS.CLASSES.VS_ICON} ${CONSTANTS.CLASSES.VS_DISABLED_ICON}`} /> :
                                    <FaCaretLeft className={`${CONSTANTS.CLASSES.VS_PULL_LEFT} ${CONSTANTS.CLASSES.VS_ICON}`} onClick={this.props.goToPrevYear} />
                            }
                            <span className={`${CONSTANTS.CLASSES.VS_MED_UPPER_CASE} ${CONSTANTS.CLASSES.VS_MONTH_NAME}`} onClick={this.props.goToSelectYear}>{currentDateYear}</span>
                            {
                                (isDisabledNext) ?
                                    <FaCaretRight className={`${CONSTANTS.CLASSES.VS_PULL_RIGHT} ${CONSTANTS.CLASSES.VS_ICON} ${CONSTANTS.CLASSES.VS_DISABLED_ICON}`} /> :
                                    <FaCaretRight className={`${CONSTANTS.CLASSES.VS_PULL_RIGHT} ${CONSTANTS.CLASSES.VS_ICON}`} onClick={this.props.goToNextYear} />
                            }
                        </div> : ''
                }
                <Fragment>
                    {this.getMonths().map((row, index) => this.renderMonthRow(row, index))}
                </Fragment>
            </div>
        );
    }
}

export default MonthsView;