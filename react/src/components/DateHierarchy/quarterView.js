import React from "react";
import MonthView from "./monthView";

class QuarterView extends React.PureComponent {

    toggleQuarterChild(quarter, showChild) {
        let years = [...this.props.years];
        quarter['showChild'] = showChild;
        this.setState({
            years: [...years]
        })
    }

    toggleQuarterCheck(quarter, year, isCheck) {
        let quarterObj = {
            year: year,
            quarter: quarter,
            isCheck: isCheck
        }
        this.props.onChangeQuarter(quarterObj);
    }

    getQuarterCheckBoxClass = (quarter) => {
        let flag = false;
        flag = (quarter.state === -1) ? true : false;
        return (flag) ? 'VS-Check-Checkmark VS-Check-Partial' : 'VS-Check-Checkmark';

    }

    onChangeMonthHandler = (monthObj) => {
        this.props.onChangeMonth(monthObj);
    }

    onChangeDayHandler = (dayObj) => {
        this.props.onChangeDay(dayObj);
    }

    onChangeWeek = (weekObj) => {
        this.props.onChangeWeek(weekObj);
    }

    onChangeWeekDay = (weekDayObj) => {
        this.props.onChangeWeekDay(weekDayObj);
    }

    renderQuarter = (quarter, year, quarterIndex) => {
        let { options, isFilterView } = this.props;
        let quarterName = (quarter && quarter.quarter) ? quarter.quarter : '';
        if (isFilterView === true && quarter.match === 0) {
            return ("")
        } else {
            return (
                <div className="VS-QuarterRow" key={'quarter' + quarterIndex}>
                    {
                        (quarter.showChild) ?
                            <span className="VS-Quarter-Plus-Minus VS-Minus" onClick={() => this.toggleQuarterChild(quarter, false)}>-</span> :
                            <span className="VS-Quarter-Plus-Minus" onClick={() => this.toggleQuarterChild(quarter, true)}>+</span>
                    }
                    <label className="VS-Checkbox-Container">

                        <div className="VS-Tooltip">{quarterName}<span className="VS-TooltiptextQuarter">{quarterName+" "}{year.year}</span></div>
                        {
                            (quarter.state) ?
                                <input className="VS-Checkbox" type="checkbox" checked={quarter.state} onChange={() => this.toggleQuarterCheck(quarter, year, false)}></input> :
                                <input className="VS-Checkbox" type="checkbox" checked={quarter.state} onChange={() => this.toggleQuarterCheck(quarter, year, true)}></input>
                        }
                        <span className={this.getQuarterCheckBoxClass(quarter)}></span>
                        {
                            (quarter.hasDisabled) ?
                                <div className="VS-Tooltip"><span className="VS-HasDisabledDot">
                                </span><span className="VS-TooltiptextLarge">Few months in this quarter are disabled</span></div> : ""
                        }
                    </label>
                    {
                        (quarter.showChild && quarter.months) ?
                            <MonthView options={options} isFilterView={isFilterView} years={this.props.years} quarter={quarter} year={year} onChange={this.onChangeHandler} onChangeMonth={this.onChangeMonthHandler} onChangeDay={this.onChangeDayHandler} onChangeWeek={this.onChangeWeek} onChangeWeekDay={this.onChangeWeekDay}></MonthView>
                            : ''
                    }

                </div>
            )
        }
    }

    render() {
        const { options } = this.props;
        let year = this.props.year;
        return (
            <div options={options} onChange={this.props.onChangeHandler}>
                {
                    year.quarters.map((quarter, quarterIndex) => this.renderQuarter(quarter, year, quarterIndex))
                }
            </div>
        )

    }
}
export default QuarterView;