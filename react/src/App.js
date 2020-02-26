import React from 'react';
//import logo from './logo.svg';
import './App.css';
import DatePicker from './components/Datepicker/index'

//import TagSelector from './components/TagSelector/tag-selector'
import './components/DateHierarchy/date-hierarchy.scss';
import DatehierarchyView from './components/DateHierarchy/datehierarchyView';
import TagSelector from './components/TagSelector/tag-selector';
import './components/TagSelector/tag-selector.scss';
//import './components/TagSelector/tag-selector.scss';
import  './components/Datepicker/date-picker.scss';
import {
  isUndefinedOrNull
} from "./utils/utils";
import {
  resetTagSelectorOptions
} from "./utils/tagselectorutils";


let datepickeroptions =  '{"displayFormat": "DD/MM/YYYY", "iconAlignment":"left", "showErrorMessage": true, "dateStringAlignment": "left", "lowerLimit": "08/08/2015", "upperLimit": "30/09/2022", "validationMessages": [{"inValidFormat": "Invalid DOB"}, { "outsideRange": ""}] , "isDisabled": false, "showButtons": true, "dateButtonPrimary": "", "showClearIcon": false, "manualEntry": true, "disabledList": ["01/12/2019", "15/10/2020", "01/11/2020", "20/11/2019"], "indicatorList": [{ "dates": ["01/10/2019","02/11/2019"], "color": "#333" }, { "dates": ["02/09/2019","01/08/2019"], "color": "#ff0000" }]}';

let optionsDatePicker = JSON.parse(datepickeroptions);
 
/* let tagselectoptions = '{"placeholder": "Select", "maxItemCounter": 2, "searchWithHelper": true, "canRemoveAll": true, "allowNewValue": true, "showHierarchy": false}';

let optionsTagSelect = JSON.parse(tagselectoptions); */

let datehieraoptions = {"lowerLimit": "2000", "upperLimit": "2020", "showQuarters": true, "showWeeks": true, "height":"300","disabledList":["01/01/2000","q4/2000","w1/05/2000", "08/01/2000", "2002","01/2001"]}

//let optionsDateHiera = JSON.parse(datehieraoptions); 
let optionsTag = {"placeholder":"Select skills","allowNewValue":true,"maxItemCounter":"3", "data": [{ "value": "Javascript", "key": "Javascript" }, {"value": "CSS", "key": "CSS" }, { "value": "JQuery", "key": "JQuery" }, { "value": "Angular", "key": "Angular" }, { "value": "MonogDB", "key": "MonogDB" },{ "value": "NodeJs", "key": "NodeJs" }]}
optionsTag = (isUndefinedOrNull(optionsTag)) ? resetTagSelectorOptions({}) : resetTagSelectorOptions(optionsTag);
function onFocusHandler() {
  console.log("onFocusHandler called")
  }
  function onBlurHandler() {
   console.log("onBlurHandler called")
  } 
 
  function onSelectHandler(e){
    console.log("onSelectHandler called")
  }
function onKeyupHandler(){
  console.log("onKeyUpHandler called")
}
function onInputHandler(){
  console.log("onInputHandler called")
}

function onKeydownHandler(){
  console.log("onKeydownHandler called")
}

function onChangeHandler(){
  console.log("onChangeHandler called")
}

function App() {
  return (
    <div className="App">
     <DatePicker options={optionsDatePicker} onSelect={onSelectHandler} onFocus={onFocusHandler} onBlur={onBlurHandler} onChange={onChangeHandler} onInput={onInputHandler} onKeyUp={onKeyupHandler} onKeyDown={onKeydownHandler}></DatePicker>
     <br/>
    <DatehierarchyView options={datehieraoptions} onFocus={onFocusHandler} onBlur={onBlurHandler} onChange={onChangeHandler} onInput={onInputHandler} onKeyUp={onKeyupHandler} onKeyDown={onKeydownHandler}></DatehierarchyView> 
    <br/> 
    <TagSelector options={optionsTag} onFocus={onFocusHandler} onChange={onChangeHandler} onBlur={onBlurHandler} onKeyUp={onKeyupHandler} onKeyDown={onKeydownHandler} onInput={onInputHandler}></TagSelector>
    </div>
  );
}

export default App;
