import React from "react";
import { WEEK_SHORT_NAMES } from '../../../utils/calendar';
import * as CONSTANTS from '../../../utils/constants'

class Week extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {month: new Date().getMonth(), year: new Date().getFullYear() };
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {}

    render() {
        const weekItems = WEEK_SHORT_NAMES.map((number, index) =>
            <span className={`${CONSTANTS.CLASSES.VS_DAY} ${CONSTANTS.CLASSES.VS_MED_UPPER_CASE}`} key={index}>{number}</span>
        );
    
        return (
            <div className={`${CONSTANTS.CLASSES.VS_CALENDAR_WEEK}`}>
                {weekItems}
            </div>
        );
    }
}

export default Week;