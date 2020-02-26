import React from "react";
import DatehierarchyView from "./datehierarchyView";

class DateHierarchy extends React.PureComponent {
    constructor(props) {
        super(props);              
        let yearList = [];
        this.state = { years: yearList};
    }
    
    updateDimensions() { 
        
    }

    render() {        
        return (
            <div>
                {/* <DatehierarchyView options={this.props.options} ></DatehierarchyView> */}
                <p>Date Hierarchy View</p>
            </div>
        )    
    }
}
export default DateHierarchy;