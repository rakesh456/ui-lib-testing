import React from "react";
import { Button } from 'reactstrap';
import * as CONSTANTS from '../../../utils/constants'

class Buttons extends React.PureComponent {
    componentDidMount() {}

    componentDidUpdate(prevProps) {}

    selectButtonClick = () => {
        this.props.onSelectButtonClick();
    }
    
    clearButtonClick = () => {
        this.props.onClearButtonClick();
    }

    render() {
        const _primaryButton = (this.props.options && this.props.options.dateButtonPrimary)? this.props.options.dateButtonPrimary : "Select";
        const _secondaryButton = (this.props.options && this.props.options.dateButtonSecondary)? this.props.options.dateButtonSecondary : "Clear";
        
        return (
            <div className={`${CONSTANTS.CLASSES.VS_CALENDAR_BUTTON}`}>
                <Button className={`${CONSTANTS.CLASSES.VS_CLEAR_BUTTON} ${CONSTANTS.CLASSES.VS_PULL_LEFT}`} onClick={() => this.clearButtonClick()}>{_secondaryButton}</Button>
                <Button className={`${CONSTANTS.CLASSES.VS_SELECT_BUTTON} ${CONSTANTS.CLASSES.VS_PULL_RIGHT}`} onClick={() => this.selectButtonClick()}>{_primaryButton}</Button>
            </div>
        );
    }
}

export default Buttons;