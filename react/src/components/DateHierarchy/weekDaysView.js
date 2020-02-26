import React from "react";

class WeekDaysView extends React.PureComponent {

    toggleWeekChild(week, showChild) {
        let years = [...this.props.years];
        week['showChild'] = showChild;
        this.setState({
            years: [...years]
        })
    }

    toggleWeekCheck(week, month, quarter, year, isCheck) {
        let weekObj = {
            year: year,
            quarter: quarter,
            month: month,
            week: week,
            isCheck: isCheck
        }
        this.props.onChangeWeek(weekObj);
    }

    toggleWeekDayCheck(day, week, month, quarter, year, isCheck) {
        let weekDayObj = {
            year: year,
            quarter: quarter,
            month: month,
            week: week,
            day: day,
            isCheck: isCheck
        }
        this.props.onChangeWeekDay(weekDayObj);
    }

    getWeekCheckBoxClass = (week) => {
        let flag = false;
        flag = week['state'] === -1 ? true : false;
        return (flag) ? 'VS-Check-Checkmark VS-Check-Partial' : 'VS-Check-Checkmark';
    }

    renderWeekDays = (day, week, month, quarter, year, weekDayIndex) => {
        let { isFilterView } = this.props;
        if (isFilterView === true && day.match === 0) {
            return ("")
        } else {
            return (
                <div className="VS-WeekDayRow" key={'day' + weekDayIndex}>
    
                    <label className="VS-Checkbox-Container"><div className="VS-Tooltip">{day.date+" "}<span className="VS-WEEKDAY">{day.day}</span><span className="VS-TooltiptextWeekDay">{day.date+" "}{month.month+" "}{year.year}</span></div>
                        {
                            (day.state) ?
                                <input className="VS-Checkbox" type="checkbox" checked={day.state} onChange={() => this.toggleWeekDayCheck(day, week, month, quarter, year, false)}></input> :
                                <input className="VS-Checkbox" type="checkbox" checked={day.state} onChange={() => this.toggleWeekDayCheck(day, week, month, quarter, year, true)}></input>
                        }
                        <span className="VS-Check-Checkmark"></span>
                    </label>
                </div>
            )
        }
    }

    renderWeeks = (week, month, quarter, year, weekIndex) => {
        let { isFilterView } = this.props;

        if (isFilterView === true && week.match === 0) {
            return ("")
        } else {
            return (
                <div className="VS-WeekRow" key={'week' + weekIndex}>
                    {
                        (week.showChild) ?
                            <span className="VS-Week-Plus-Minus VS-Minus" onClick={() => this.toggleWeekChild(week, false)}>-</span> :
                            <span className="VS-Week-Plus-Minus" onClick={() => this.toggleWeekChild(week, true)} >+</span>
                    }

                    <label className="VS-Checkbox-Container"><div className="VS-Tooltip">{week.week}<span className="VS-TooltiptextWeeks">{week.week+" "}{month.month+" "}{year.year}</span></div>

                        {
                            (week.state) ?
                                <input className="VS-Checkbox" type="checkbox" checked={week.state} onChange={() => this.toggleWeekCheck(week, month, quarter, year, false)}></input> :
                                <input className="VS-Checkbox" type="checkbox" checked={week.state} onChange={() => this.toggleWeekCheck(week, month, quarter, year, true)}></input>
                        }

                        <span className={this.getWeekCheckBoxClass(week)}></span>
                        {
                            (week.hasDisabled) ?
                                <div className="VS-Tooltip"><span className="VS-HasDisabledDot">
                                </span><span className="VS-TooltiptextLarge">Few days in this week are disabled</span></div>
                                : ""

                        }
                    </label>
                    {
                        (week.showChild && week.days) ?
                            week.days.map((day, weekDayIndex) => this.renderWeekDays(day, week, month, quarter, year, weekDayIndex)) : ''
                    }
                </div>
            )
        }
    }

    render() {
        const { options } = this.props;
        let year = this.props.year;
        let quarter = this.props.quarter;
        let month = this.props.month;
        if (this.props.options && this.props.options.showQuarters === true) {
            return (
                <div options={options}>
                    {month.weeks.map((week, weekIndex) => this.renderWeeks(week, month, quarter, year, weekIndex))}
                </div>
            )
        } else {
            return (
                <div options={options}>
                    {month.weeks.map((week, weekIndex) => this.renderWeeks(week, month, -1, year, weekIndex))}
                </div>
            )
        }
    }
}
export default WeekDaysView;