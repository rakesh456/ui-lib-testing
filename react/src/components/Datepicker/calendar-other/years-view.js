import React, { Fragment } from "react";
import { FaCaretLeft, FaCaretRight } from 'react-icons/lib/fa';
import {
    isEqual,
    getYearsList,
    getSelectedYear,
    getYYYYForLowerLimit,
    getYYYYForUpperLimit,
} from "../../../utils/calendar";

import {
    guid,
    splitArray
} from "../../../utils/utils";
import * as CONSTANTS from '../../../utils/constants'

class YearsView extends React.PureComponent {
    constructor(props) {
        super(props);
        const { options, showHeaderSelection } = this.props;
        const { lowerYearLimit } = getYYYYForLowerLimit(options);
        const { upperYearLimit } = getYYYYForUpperLimit(options);
        let year = new Date().getFullYear();
        // let year = upperYearLimit;
        year = parseInt(year);
        this.state = { year: year, isDisabledPrev: ((year - 11) < lowerYearLimit) ? true : false, isDisabledNext: ((year + 1) >= upperYearLimit)? true : false, showHeaderSelection: (showHeaderSelection === true), displayYearName: ""};
    }
    
    componentDidMount() {
        const { selectedValue, options } = this.props;
        if (selectedValue) {
            if (options.displayFormat === 'YYYY' || options.displayFormat === 'DD/MM/YYYY' || options.displayFormat === 'MM/DD/YYYY') {
                this.setState({
                    selectedYear: selectedValue,
                    year: selectedValue
                });
            } else {
                const _selectedYear = getSelectedYear(selectedValue);
                this.setState({
                    selectedYear: _selectedYear,
                    year: _selectedYear
                })
            }
        }
        this.updateNextPrev();
    }

    componentDidUpdate(prevProps) {
        this.updateNextPrev();
    }

    updateNextPrev() {
        const { options } = this.props;
        const { lowerYearLimit } = getYYYYForLowerLimit(options);
        const { upperYearLimit } = getYYYYForUpperLimit(options);
        let { year } = this.state
        year = parseInt(year);
        
        const _array = getYearsList(year);
        let displayYearName = _array[0] + '-' + _array[11];

        this.setState({ isDisabledNext: ((year + 1) >= upperYearLimit) ? true : false, isDisabledPrev: ((year - 11) < lowerYearLimit) ? true : false, upperYearLimit: upperYearLimit, lowerYearLimit: lowerYearLimit, displayYearName: displayYearName });
    }
    
    getYears = () => {
        const { year } = this.state;
        const _array = getYearsList(year);
        return splitArray(_array, 3);
    }
    
    onSelectYearHandler = (year) => {
        this.props.onSelectYear(year);
    }
    
    goToNextYear = () => {
        this.setState({
            year: parseInt(this.state.year) + 12
        });
    }

    goToPrevYear = () => {
        this.setState({
            year: parseInt(this.state.year) - 12
        });
    }

    getCalendarYearClass = () => {
        return `${CONSTANTS.CLASSES.VS_CALENDAR_CONTAINER} ${CONSTANTS.CLASSES.VS_MODAL} ${CONSTANTS.CLASSES.VS_SHAPE_ROUNDED_FILL_FOR_YEAR}`;
    }
    
    checkYearIsEnabled = (year) => {
        const {disabledList} = this.props.options;

        return (disabledList && disabledList.length > 0 && year)? ((disabledList.indexOf(year.toString()) !== -1)? false : true) : true;
    }

    renderYearValue = (year, index) => {
        const activeClass = (isEqual(this.state.selectedYear, year)) ? `${CONSTANTS.CLASSES.VS_ACTIVE}` : '';
        const { lowerYearLimit, upperYearLimit } = this.state;
        const isEnabled = this.checkYearIsEnabled(year);
        return (
            <Fragment key={guid()}>
                {
                    ((lowerYearLimit && lowerYearLimit > year) || (upperYearLimit && upperYearLimit < year) || (!isEnabled)) ?
                        <span className={`${activeClass} ${CONSTANTS.CLASSES.VS_YEAR} ${CONSTANTS.CLASSES.VS_DISABLED}`} >{year}</span> :
                        <span className={`${activeClass} ${CONSTANTS.CLASSES.VS_YEAR}`} onClick={() => this.onSelectYearHandler(year)}>{year}</span>
                }
            </Fragment>
        );
    }

    renderYearRow = (years, index) => {
        const rows = years.map((date, index1) => {
            return this.renderYearValue(date, index1)
        });

        return (
            <div className={`${CONSTANTS.CLASSES.VS_DATE_ROW}`} key={guid()}>{rows}</div>
        )
    }

    render() {
        const { isDisabledPrev, isDisabledNext, showHeaderSelection, displayYearName } = this.state;
        return (
            <div className={this.getCalendarYearClass()} style={this.props.style}>
                <Fragment>
                    <div className={`${CONSTANTS.CLASSES.VS_CALENDAR_MONTH} ${CONSTANTS.CLASSES.VS_TEXT_CENTER}`}>
                        {
                            // isDisabledPrev
                            (isDisabledPrev) ?
                                <FaCaretLeft className={`${CONSTANTS.CLASSES.VS_PULL_LEFT} ${CONSTANTS.CLASSES.VS_ICON} ${CONSTANTS.CLASSES.VS_DISABLED_ICON}`} /> :
                                <FaCaretLeft className={`${CONSTANTS.CLASSES.VS_PULL_LEFT} ${CONSTANTS.CLASSES.VS_ICON}`}  onClick={this.goToPrevYear} />
                        }
                        {
                            (showHeaderSelection)? 
                            <span className={`${CONSTANTS.CLASSES.VS_MED_UPPER_CASE} ${CONSTANTS.CLASSES.VS_MONTH_NAME}`} >{displayYearName}</span> : ''
                        }
                        {
                            (isDisabledNext) ?
                                <FaCaretRight className={`${CONSTANTS.CLASSES.VS_PULL_RIGHT} ${CONSTANTS.CLASSES.VS_ICON} ${CONSTANTS.CLASSES.VS_DISABLED_ICON}`} /> :
                                <FaCaretRight className={`${CONSTANTS.CLASSES.VS_PULL_RIGHT} ${CONSTANTS.CLASSES.VS_ICON}`} onClick={this.goToNextYear} />
                        }
                    </div>
                    {this.getYears().map((row, index) => this.renderYearRow(row, index))}
                </Fragment>
            </div>
        );
    }
}

export default YearsView;