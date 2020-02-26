import {
    sortBy
} from "./utils";

export const DEFAULT_OPTIONS = { 'placeholder': 'Search', 'listItems': [], 'allowNewValue': false, 'maxItemCounter': 0, 'showHelper': false, 'canRemoveAll': true, 'readOnly': false, 'showHierarchy': false };

// Function to reset options with default options
export const resetTagSelectorOptions = (options) => {
    return { ...DEFAULT_OPTIONS, ...options };
}
 
// Function to reset options with default options
export const isValidJsonFormat = (showHierarchy, json) => {
    let isValidFormat = true;
    let key;
    if (!json || json.length <= 0) {
        isValidFormat = false;
    } else {
        if (showHierarchy === true) {
            json.forEach((item) => {
                for (key in item) {
                    isValidFormat = (typeof key === 'string' && typeof item[key] === 'object')
                }
            });
        } else {
            json.forEach((item) => {
                for (key in item) {
                    isValidFormat = (typeof key === 'string' && typeof item[key] === 'string')
                }
            });
        }
    }
    return isValidFormat;
}

const getField = o => o.value

function objectFindByKey(array, key) {
    let returnArray = [];
    array.forEach((item) => {
        if(item[key] && item[key] !== 'undefined'){
            returnArray = [...item[key]];
        }
    });
    return returnArray;
}


// Function to reset options with default options
export const sortListingByType = (showHierarchy, json) => {
    let data = [];
    if (!json || json.length <= 0) {
        return [];
    } else {
        if (showHierarchy === true) {
            let _keys = [];
            
            json.forEach((item) => {
                let prop;
                for(prop in item) {
                    _keys.push(prop);
                }
            });
            _keys.sort();
            _keys.forEach((key) => {
                let result_obj = objectFindByKey(json, key);
                const sortByField = sortBy(getField)
                result_obj.sort(sortByField);
                data.push({[key]: result_obj});
            });
        } else {
            const sortByField = sortBy(getField)
            json.sort(sortByField)
            data = [...json];
        }
    }
    return data;
}
