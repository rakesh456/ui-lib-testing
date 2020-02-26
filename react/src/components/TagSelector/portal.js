import React from "react";
import ReactDOM from 'react-dom';

let tagSelectorModal = null;

class TagSelectorPortal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }
    
    componentDidMount() {
        const uuid = this.props.uuid;
        tagSelectorModal = document.getElementById(uuid);

        if(uuid && tagSelectorModal){
        
            tagSelectorModal.appendChild(this.el);
            if(this.el && tagSelectorModal){
                tagSelectorModal.appendChild(this.el);
            }
        }
    }

    componentDidUpdate(prevProps) {
    }

    componentWillUnmount() {
        if(tagSelectorModal){
            // tagSelectorModal.removeChild(this.el);
        }
    }


    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el,
        );
    }
}

export default TagSelectorPortal;