import React from "react";
import WeekDaysView from "./weekDaysView";

class MonthView extends React.PureComponent {

    toggleMonthChild(month, showChild) {
        let years = [...this.props.years];
        month['showChild'] = showChild;
        this.setState({
            years: [...years]
        })
    }

    toggleMonthCheck(month, quarter, year, isCheck) {
        let monthObj = {
            year: year,
            quarter: quarter,
            month: month,
            isCheck: isCheck
        }
        this.props.onChangeMonth(monthObj);
    }

    toggleDayCheck(day, month, quarter, year, isCheck) {
        let dayObj = {
            day: day,
            month: month,
            quarter: quarter,
            year: year,
            isCheck: isCheck
        }
        this.props.onChangeDay(dayObj);
    }

    onChangeWeek = (weekObj) => {
        this.props.onChangeWeek(weekObj);
    }

    onChangeWeekDay = (weekDaysObj) => {
        this.props.onChangeWeekDay(weekDaysObj);
    }

    getMonthCheckBoxClass = (month) => {
        let flag = false;
        flag = month['state'] === -1 ? true : false;
        return (flag) ? 'VS-Check-Checkmark VS-Check-Partial' : 'VS-Check-Checkmark';
    }

    renderDay = (day, month, quarter, year, dayIndex) => {
        let { isFilterView } = this.props;
        if (isFilterView === true && day.match === 0) {
            return ("")
        } else {
            return (
                <div className="VS-DayRow" key={'day' + dayIndex}>

                    <label className="VS-Checkbox-Container"><div className="VS-Tooltip">{day.day}<span className="VS-TooltiptextWeekDay">{day.day+" "}{month.month+" "}{year.year}</span></div>
                        {
                            (day.state) ?
                                <input className="VS-Checkbox" type="checkbox" checked={day.state} onChange={() => this.toggleDayCheck(day, month, quarter, year, false)}></input> :
                                <input className="VS-Checkbox" type="checkbox" checked={day.state} onChange={() => this.toggleDayCheck(day, month, quarter, year, true)}></input>
                        }
                        <span className="VS-Check-Checkmark"></span>
                    </label>
                </div>
            )
        }
    }

    renderMonth = (month, quarter, year, monthIndex) => {
        let { options, isFilterView } = this.props;
        if (isFilterView === true && month.match === 0) {
            return ("")
        } else {
            return (
                <div className="VS-MonthRow" key={'month' + monthIndex}>
                    {
                        (month.showChild) ?
                            <span className="VS-Month-Plus-Minus VS-Minus" onClick={() => this.toggleMonthChild(month, false)}>-</span> :
                            <span className="VS-Month-Plus-Minus" onClick={() => this.toggleMonthChild(month, true)} >+</span>
                    }
                    <label className="VS-Checkbox-Container"><div className="VS-Tooltip">{month.month}<span className="VS-TooltiptextQuarter">{month.month+" "}{year.year}</span></div>
                        {
                            (month.state) ?
                                <input className="VS-Checkbox" type="checkbox" checked={month.state} onChange={() => this.toggleMonthCheck(month, quarter, year, false)}></input> :
                                <input className="VS-Checkbox" type="checkbox" checked={month.state} onChange={() => this.toggleMonthCheck(month, quarter, year, true)}></input>
                        }
                        <span className={this.getMonthCheckBoxClass(month)}></span>
                        {
                            (month.hasDisabled) ? (month.days) ?
                                <div className="VS-Tooltip"><span className="VS-HasDisabledDot">
                                </span><span className="VS-TooltiptextLarge">Few Days in this Month are disabled</span></div> : <div className="VS-Tooltip"><span className="VS-HasDisabledDot">
                                </span><span className="VS-TooltiptextLarge">Few Weeks in this Month are disabled</span></div> : ""
                        }
                    </label>
                    {(month.showChild && (month.weeks || month.days)) ?
                        options.showWeeks ?
                            <WeekDaysView options={options} isFilterView={isFilterView} years={this.props.years} year={year} quarter={quarter} month={month} onChangeWeek={this.onChangeWeek} onChangeWeekDay={this.onChangeWeekDay}></WeekDaysView> :
                            <div options={options}>{month.days.map((days, dayIndex) => this.renderDay(days, month, quarter, year, dayIndex))}</div> : ''
                    }

                </div>
            )
        }
    }

    render() {
        const { options } = this.props;
        let year = this.props.year;
        if (options.showQuarters === true) {
            let quarter = this.props.quarter;
            return (
                <div options={options}>
                    {quarter.months.map((month, monthIndex) => this.renderMonth(month, quarter, year, monthIndex))}
                </div>
            )
        }
        else {
            return (
                <div>
                    {year.months.map((month, monthIndex) => this.renderMonth(month, -1, year, monthIndex))}
                </div>
            )
        }
    }
}
export default MonthView;