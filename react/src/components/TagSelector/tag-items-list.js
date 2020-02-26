import React from "react";
import { Button } from 'reactstrap';
import {
    guid,
    isUndefinedOrNull
} from "../../utils/utils";
import { CountryService } from '../../services/CountryService';

class ItemsList extends React.PureComponent {
    constructor(props) {
        super(props);
        const { maxItemCounter } = this.props.options;
        this.state = { selectedItems: [], maxItemCounter: maxItemCounter, newlyAddedElements: [] };
        this.countryservice = new CountryService();
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        let element = document.querySelector('.VS-ItemIndexed');
        if(!isUndefinedOrNull(element)){
            element.scrollIntoView({behavior: "auto", block: "end"});
        }
    }

    selectItem(event, item) {
        this.props.onSelect(item);
    }

    getUlListClass = () => {
        const { allowNewValue } = this.props.options;
        const { filteredlistItems, noDataFound } = this.props;
        return "VS-AutocompleteItems " + ((noDataFound && (!filteredlistItems || filteredlistItems.length <= 0)) ? ((allowNewValue === true) ? 'VS-AddNewItem' : 'VS-NoData') : '');
    }

    getLiListClass = (item, index) => {
        let foundValue = [];
        if (this.props.selectedItems) {
            foundValue = this.props.selectedItems.filter((obj) => obj.key === item.key);
        }
        const { currentItemIndex } = this.props;
        return (((currentItemIndex === index) ? 'VS-ItemIndexed ' : '') + ((foundValue && foundValue.length > 0) ? "VS-ItemSelected VS-LiItems" : "VS-LiItems"));
    }

    getHeirarchyLiListClass = (element, ind, index) => {
        let foundValue = false;
        if (this.props.selectedItems && element) {
            if (this.props.selectedItems.some(o => o.value === element.value)) {
                foundValue = true;
            }
        }
        const { currentItemIndex, currentHierarchyItemIndex } = this.props;
        return (((currentItemIndex === ind && currentHierarchyItemIndex === index) ? 'VS-ItemIndexed ' : '') + ((foundValue) ? "VS-ItemSelected VS-LiItems" : "VS-LiItems"));
        // return ((foundValue) ? "VS-ItemSelected VS-LiItems" : "VS-LiItems");
    }

    renderSubitem(item, index) {
        // const { currentHierarchyItemIndex } = this.props;
        // if(currentHierarchyItemIndex === item.length){
        //     this.props.updateHierarchyIndex();
        // }
        const _uuid = guid();
        const items = Object.keys(item).map((ele, ind) => {
            return <li className={this.getHeirarchyLiListClass(item[ele], ind, index)} onClick={(e) => this.selectItem(e, item[ele])} key={ind + '_span'}> <span className='VS-CodeText'>{item[ele].value}</span> </li>;
        });

        return (
            <div key={_uuid}>
                {items}
            </div>
        )
    }

    renderHeirarchyItem(item, index) {
        const items = Object.keys(item).map((ele, index1) => {
            return (
                <div key={guid()} className='VS-HeirarchyItems'>
                    {
                        (item[ele] && item[ele].length > 0) ? <li className='VS-HeirarchyTitle' key={index1 + '_key'}> {ele} </li> : ''
                    }
                    <ul key={index1 + '_val'}> {this.renderSubitem(item[ele], index)} </ul>
                </div>
            );
        });

        return (items)
    }

    renderHeirarchyItems() {
        const { allowNewValue } = this.props.options;
        const { filteredlistItems, listItems } = this.props;

        return (
            <ul className={this.getUlListClass()}>
                {
                    (listItems && listItems.length > 0) ?
                        (filteredlistItems && filteredlistItems.length > 0) ?
                            filteredlistItems.map((item, index) => this.renderHeirarchyItem(item, index))

                            : (allowNewValue === true) ? 'Do you want to add "' + this.state.searchValue + '" to list' : 'No Data Found' :
                            // : (allowNewValue === true) ? 'Do you want to add "' + this.props.searchValue + '" to list' : 'No Data Found' :
                        'No List Items'
                }
            </ul>
        );
    }

    getTooltipClassNames = (index, isLeft) => {
        return ((this.props.filteredlistItems && (index + 1) >= this.props.filteredlistItems.length)? 'VS-TooltipText VS-TooltipText-Top' : 'VS-TooltipText') + ((isLeft === true)? ' VS-Left' : ' VS-Right');
    }

    renderTooltip = (index, val, isLeft) => {
        return ((val && val.length >= 20)? <span className={this.getTooltipClassNames(index, isLeft)}>{val}</span> : '');
    }

    renderLIItem(item, index) {
        const { selectedItems } = this.state;
        const { showHelper } = this.props.options;

        if (!selectedItems || selectedItems.length <= 0) {
            return <li className={this.getLiListClass(item, index)} key={index + '_item'} onClick={(e) => this.selectItem(e, item)}><span className='VS-CodeText VS-PullLeft'>{item.value}{this.renderTooltip(index, item.value, true)}</span>{(showHelper === true) ? <span className="VS-HelperText VS-PullRight">{item.key}{this.renderTooltip(index, item.key, false)}</span> : ''}</li>
        } else {
            let itemFound = selectedItems.filter((obj) => obj.key === item.key);
            return (
                (itemFound.length) ?
                    null : <li className={this.getLiListClass(item, index)} key={index + '_item'} onClick={(e) => this.selectItem(e, item)}><span className='VS-CodeText VS-PullLeft'>{item.value}</span> {(showHelper === true) ? <span className="VS-HelperText VS-PullRight">{item.key}</span> : ''}</li>
            );
        }
    }

    renderULItems() {
        const { allowNewValue, showHierarchy } = this.props.options;
        const { filteredlistItems, listItems } = this.props;
        return (
            <ul className={this.getUlListClass()}>
                {
                    (listItems && listItems.length > 0) ?
                        (filteredlistItems && filteredlistItems.length > 0) ?
                            filteredlistItems.map((item, index) => this.renderLIItem(item, index))
                            : (allowNewValue === true && showHierarchy === false) ? this.addItemButton() : 'No Data Found' :
                        'No List Items'
                }
            </ul>
        );
    }

    addItemButton = () => {
        return (
            <span>{

                <span>Do you want to add "{this.props.searchValue.value}" to list? <br /><Button className="VS-AddButton" onClick={() => this.addNewItem(this.props.searchValue)}>ADD</Button></span>
                // <span>Do you want to add "{this.props.searchValue}" to list? <br /><Button className="VS-AddButton" onClick={() => this.addNewItem(this.props.searchValue)}>ADD</Button></span>
            }
            </span>
        )
    }

    addNewItem = () => {
        this.props.addNewItem(this.props.searchValue);
    }

    getContainerClass = () => {
        return "VS-Scrollbar VS-TagSelectorContainer VS-modal";
    }

    render() {
        const { showHierarchy } = this.props.options;
        return (
            <div id="VS-Scrollbar" className={this.getContainerClass()} style={this.props.style}>
                {
                    (showHierarchy === true) ?
                        this.renderHeirarchyItems()
                        : this.renderULItems()
                }
            </div>
        );
        // return ( <div >test</div>);
    }
}

export default ItemsList;