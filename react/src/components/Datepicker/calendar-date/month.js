import React from "react";
import { getMonthNameByIndex, getUpperLimitFromOptions, getProperFormattedDate, getLowerLimitFromOptions } from '../../../utils/calendar';
import { isUndefinedOrNull } from '../../../utils/utils';
import { FaCaretLeft, FaCaretRight } from 'react-icons/lib/fa';
import * as CONSTANTS from '../../../utils/constants'

class Month extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {month: '', year: ''};
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
    }

    isDisableNextMonth = () => {
        const { month, year, options } = this.props;
        
        const upperLimit = getUpperLimitFromOptions(options);
        if(isUndefinedOrNull(upperLimit)){
            return false;
        } else {
            const _month = (getProperFormattedDate(upperLimit, options).getMonth()) + 1;
            const _year = (getProperFormattedDate(upperLimit, options).getFullYear());
            return (month === _month && year === _year);
        }
    }
    
    isDisablePrevMonth = () => {
        
        const { month, year, options } = this.props;
        const lowerLimit = getLowerLimitFromOptions(options);
        if(isUndefinedOrNull(lowerLimit)){
            return false;
        } else {
            const _month = getProperFormattedDate(lowerLimit, options).getMonth() + 1;
            const _year = getProperFormattedDate(lowerLimit, options).getFullYear();
            return (month === _month && year === _year);
        }
    }


    render() {
        const { month, year } = this.props;

        return (
            <div className={`${CONSTANTS.CLASSES.VS_CALENDAR_MONTH} ${CONSTANTS.CLASSES.VS_TEXT_CENTER}`}>
                {
    
                    (this.isDisablePrevMonth())?
                    <FaCaretLeft className={`${CONSTANTS.CLASSES.VS_PULL_LEFT} ${CONSTANTS.CLASSES.VS_ICON} ${CONSTANTS.CLASSES.VS_DISABLED_ICON}`} />:
                    <FaCaretLeft className={`${CONSTANTS.CLASSES.VS_PULL_LEFT} ${CONSTANTS.CLASSES.VS_ICON}`} onClick={this.props.goToPrevMonth} />
                }
                    <span className={`${CONSTANTS.CLASSES.VS_MED_UPPER_CASE} ${CONSTANTS.CLASSES.VS_MONTH_NAME}`} onClick={this.props.goToSelectMonthYear}>{getMonthNameByIndex(month - 1)} {year}</span>
                {
                    (this.isDisableNextMonth())?
                    <FaCaretRight className={`${CONSTANTS.CLASSES.VS_PULL_RIGHT} ${CONSTANTS.CLASSES.VS_ICON} ${CONSTANTS.CLASSES.VS_DISABLED_ICON}`}/>:
                    <FaCaretRight className={`${CONSTANTS.CLASSES.VS_PULL_RIGHT} ${CONSTANTS.CLASSES.VS_ICON}`} onClick={this.props.goToNextMonth} />
                }                    
            </div>
        );
    }
}

export default Month;