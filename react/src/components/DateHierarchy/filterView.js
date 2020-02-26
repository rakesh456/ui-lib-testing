import React from "react";
import { getSearchObj, quarterChangeCallback, monthChangeCallback, weekChangeCallback, dayChangeCallback, weekDayChangeCallback, getListOfYears } from "../../utils/datehierarchyutils";
import { isUndefinedOrNull, isBlank } from "../../utils/utils";
import YearDisplay from "./yearDisplay";
const checkPartialState = obj => obj.state === -1;
const stateRegExZero = /\"state\":0/gi // eslint-disable-line
const stateRegExOne = /\"state\":1/gi // eslint-disable-line
const stateRegExMinus = /\"state\":-1/gi // eslint-disable-line
const matchRegEx = /\"match\":0/gi // eslint-disable-line
const matchRegExOne = /\"match\":1/gi // eslint-disable-line
const checkOneState = obj => obj.state === 1;

class FilterView extends React.PureComponent {
    constructor(props) {
        super(props);
        let { options } = this.props;

        let searchObj = getSearchObj(options);
        this.state = { filteredYears: [], latestFilterYears: [], searchValue: "", searchObj: searchObj, maxLevel: -1, isSelectAllSearchResult: true, selectAllResultState: true, isNoDataFound: false, isAddCurrentSelection: false, isExcludeFromSelection: false, restoreFilterArray: [] };
    }

    getYears() {
        return this.state.filteredYears;
    }

    componentDidMount() {        
        this.setState({ filteredYears: [...this.props.listOfYears] });
    }

    componentDidUpdate(prevProps, next) {
        if (prevProps.searchValue !== this.props.searchValue || isUndefinedOrNull(this.state.searchValue)) {
            this.onSearchValueChangeHandler(this.props.searchValue);
        }
    }

    onAddCurrentSelectionChange = ({ target }) => {
        this.setState({
            isAddCurrentSelection: target.checked,
            isExcludeFromSelection: !target.checked
        });
        this.props.onAddToSelectionAndExcludeFromSelectionChange(target.checked);
    }

    onExcludeFromSelectionChange = ({ target }) => {
        this.setState({
            isExcludeFromSelection: target.checked,
            isAddCurrentSelection: !target.checked,
        });
        this.props.onAddToSelectionAndExcludeFromSelectionChange(!target.checked);
    }

    onSelectSearchResultChange = ({ target }) => {
        this.props.onUpdateSearchResultCheckbox(target.checked);
        this.setState({
            isSelectAllSearchResult: target.checked
        });

        let { filteredYears, latestFilterYears, restoreFilterArray } = this.state;
        let newYears = "";

        if (target.checked === false) {
            newYears = JSON.stringify(filteredYears).replace(stateRegExMinus, '"state":0');
            newYears = newYears.replace(stateRegExOne, '"state":0');
            this.setState({
                restoreFilterArray: [...filteredYears],
                filteredYears: [...JSON.parse(newYears)]
            });
            this.props.onFilteredDataChange([...filteredYears]);
        } else {
            if(restoreFilterArray && restoreFilterArray.length > 0){
                this.setState({
                    filteredYears: [...restoreFilterArray],
                    restoreFilterArray: [],
                });
                this.props.onFilteredDataChange([...restoreFilterArray]);
            } else {
                this.setState({
                    filteredYears: JSON.parse(JSON.stringify(latestFilterYears)),
                    selectAllResultState: true,
                    isSelectAllSearchResult: true,
                    restoreFilterArray: [],
                });
                this.props.onFilteredDataChange([...latestFilterYears]);
            }
        }
    }

    getMaxLevel(arr) {
        const maxValueOfY = Math.max(...arr.map((item) => item.level), 0);
        return maxValueOfY;
    }

    itemExists(arr, level, index, val) {
        return (arr.filter(item => (item.level === level && item.searchKey === val.toString().toLowerCase().replace(/ /g, '')))).length >= 1;
    }

    searchStringExists(arr, level, searchKey) {
        return (arr.filter(item => (item.level === level && item.searchKey === (searchKey).toString()))).length >= 1;
    }

    onSearchValueChangeHandler(searchValue) {
        searchValue = (searchValue) ? searchValue.toLowerCase() : '';
        searchValue = searchValue.replace(/ /g, '');

        let { searchObj } = this.state;        
        const { options } = this.props;
        let listOfYears = getListOfYears(options.lowerLimit, options.upperLimit, options.showWeeks, options.showQuarters, options.disabledList);

        let { showWeeks, showQuarters } = this.props.options;
        let _years = listOfYears.map(a => Object.assign({}, a));


        if (!isUndefinedOrNull(searchValue)) {
            let searchResult = [];

            let isStartWithQ = searchValue.startsWith('q');
            let isStartWithWeek = (searchValue.startsWith('w') || searchValue.startsWith('we') || searchValue.startsWith('wee') || searchValue.startsWith('week'));
            if (showQuarters === true) {

                if (showWeeks === true) {
                    searchResult = searchObj.filter(searchElement => {
                        if (isStartWithQ === true && searchElement.level === 2 && searchElement.searchKey.includes(searchValue)) {
                            return true;
                        } else if (isStartWithWeek === true && searchElement.level === 4 && searchElement.searchKey.includes(searchValue)) {
                            return true;
                        } else if (isStartWithQ === false && searchValue <= 99 && searchElement.searchKey === searchValue && searchElement.level !== 1 && searchElement.level !== 2 && searchElement.level !== 4) {
                            return true;
                        } else if ((isStartWithQ === false && searchElement.searchKey.includes(searchValue) && (searchValue > 99 || (searchElement.level !== 1 && searchElement.level !== 2 && searchElement.level !== 4 && searchElement.level !== 5))) || (searchElement.searchKey === searchValue && searchElement.level === 1)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                } else {
                    searchResult = searchObj.filter(searchElement => {
                        if (isStartWithQ === true && searchElement.level === 2 && searchElement.searchKey.includes(searchValue)) {
                            return true;
                        } else if (isStartWithQ === false && searchValue <= 99 && searchElement.searchKey === searchValue && searchElement.level !== 1 && searchElement.level !== 2) {
                            return true;
                        } else if ((isStartWithQ === false && searchElement.searchKey.includes(searchValue) && (searchValue > 99 || (searchElement.level !== 1 && searchElement.level !== 2 && searchElement.level !== 4))) || (searchElement.searchKey === searchValue && searchElement.level === 1)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
            } else {
                if (showWeeks === true) {
                    searchResult = searchObj.filter(searchElement => {
                        if (isStartWithWeek === true && searchElement.level === 3 && searchElement.searchKey.includes(searchValue)) {
                            return true;
                        } else if (isStartWithWeek === false && searchValue <= 99 && searchElement.searchKey === searchValue && searchElement.level !== 1 && searchElement.level !== 3) {
                            return true;
                        } else if ((isStartWithQ === false && searchElement.searchKey.includes(searchValue) && (searchValue > 99 || (searchElement.level !== 1 && searchElement.level !== 3 && searchElement.level !== 4))) || (searchElement.searchKey === searchValue && searchElement.level === 1)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                } else {
                    searchResult = searchObj.filter(searchElement => {
                        if (isStartWithQ === true && searchElement.level === 2 && searchElement.searchKey.includes(searchValue)) {
                            return true;
                        } else if (isStartWithQ === false && searchValue <= 99 && searchElement.searchKey === searchValue && searchElement.level !== 1) {
                            return true;
                        } else if ((isStartWithQ === false && searchElement.searchKey.includes(searchValue) && (searchValue > 99 || (searchElement.level !== 1 && searchElement.level !== 3))) || (searchElement.searchKey === searchValue && searchElement.level === 1)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
            }

            searchResult.sort((a, b) => {
                if (a.level > b.level) return -1
                return a.level < b.level ? 1 : 0
            });

            let maxLevel = this.getMaxLevel(searchResult);
            _years.forEach((year, yearIndex) => {
                const foundYear = this.itemExists(searchResult, 1, yearIndex, year.year);
                _years[yearIndex]['match'] = _years[yearIndex]['state'] = (foundYear) ? 1 : 0;

                if (showQuarters === true) {
                    let quarters = year['quarters'];
                    if (foundYear || (maxLevel === 2 && searchResult.length === 4)) {
                        let newQuarters = JSON.stringify(quarters).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');

                        _years[yearIndex]['state'] = _years[yearIndex]['match'] = 1;
                        _years[yearIndex]['quarters'] = [...JSON.parse(newQuarters)];

                    } else {
                        if (maxLevel === 1) {
                            _years[yearIndex]['quarters'] = [...quarters];
                        } else {
                            quarters.forEach((quarter, quarterIndex) => {

                                let foundQuarter = false;

                                if (!foundYear) {
                                    foundQuarter = this.itemExists(searchResult, 2, quarterIndex, quarter.quarter);
                                    _years[yearIndex]['quarters'][quarterIndex]['match'] = _years[yearIndex]['quarters'][quarterIndex]['state'] = (foundQuarter) ? 1 : 0;
                                }

                                let months = quarter['months'];
                                if (foundQuarter) {
                                    let newMonths = JSON.stringify(months).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');
                                    _years[yearIndex]['quarters'][quarterIndex]['months'] = [...JSON.parse(newMonths)];
                                    _years[yearIndex]['match'] = 1;
                                } else {
                                    if (maxLevel === 2) {
                                        _years[yearIndex]['quarters'][quarterIndex]['months'] = [...months];
                                    } else {
                                        months.forEach((month, monthIndex) => {
                                            let foundMonth = false;
                                            if (!foundQuarter) {
                                                foundMonth = this.searchStringExists(searchResult, 3, month.searchString);
                                                _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['match'] = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['state'] = (foundMonth) ? 1 : 0;
                                            }

                                            if (showWeeks === true) {
                                                let weeks = month['weeks'];

                                                if (foundMonth || (maxLevel === 4 && searchResult.length === weeks.length)) {
                                                    let newWeeks = JSON.stringify(weeks).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');
                                                    _years[yearIndex]['state'] = 1;
                                                    _years[yearIndex]['quarters'][quarterIndex]['state'] = 1;
                                                    _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['match'] = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['state'] = 1;
                                                    _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'] = [...JSON.parse(newWeeks)];

                                                } else {
                                                    if (maxLevel === 3) {

                                                        let newWeeks = JSON.stringify(weeks).replace(stateRegExOne, '"state":0');

                                                        _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'] = [...JSON.parse(newWeeks)];
                                                    } else {

                                                        weeks.forEach((week, weekIndex) => {
                                                            let foundWeek = false;
                                                            if (!foundMonth) {
                                                                foundWeek = this.itemExists(searchResult, 4, weekIndex, week.week);
                                                                _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['match'] = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['state'] = (foundWeek) ? 1 : 0;
                                                            }

                                                            let newDays = JSON.stringify(week['days']).replace(stateRegExOne, '"state":0');
                                                            let days = [...JSON.parse(newDays)];

                                                            if (foundWeek) {
                                                                let newDays = JSON.stringify(days).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');

                                                                _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['days'] = [...JSON.parse(newDays)];
                                                            } else {
                                                                if (maxLevel === 4) {
                                                                    _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['days'] = [...days];
                                                                } else {

                                                                    days.forEach((day, dayIndex) => {
                                                                        let foundDay = false;

                                                                        if (!foundWeek) {
                                                                            foundDay = this.searchStringExists(searchResult, 5, day.date);

                                                                            _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['days'][dayIndex]['match'] = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['days'][dayIndex]['state'] = (foundDay) ? 1 : 0;
                                                                        }

                                                                        if (dayIndex >= days.length - 1 && !foundYear && !foundQuarter && !foundMonth && !foundWeek) {
                                                                            let updatedDays = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['days'];

                                                                            let sum = updatedDays.reduce((a, b) => +a + +b.state, 0);
                                                                            _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['state'] = (sum === updatedDays.length) ? 1 : (sum === 0) ? _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['state'] : -1;
                                                                        }
                                                                    });

                                                                    let matchDays = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['days'];

                                                                    let isMathcOne = JSON.stringify(matchDays).match(matchRegExOne);
                                                                    _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['match'] = (isMathcOne === null) ? 0 : 1;

                                                                    _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'][weekIndex]['showChild'] = true;
                                                                }
                                                            }

                                                            if (weekIndex >= weeks.length - 1 && !foundYear && !foundQuarter && !foundMonth) {
                                                                let sum = weeks.reduce((a, b) => +a + +b.state, 0);
                                                                let isPartial = weeks.some(checkPartialState);

                                                                _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['state'] = (sum === weeks.length) ? 1 : (sum === 0 && !isPartial) ? _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['state'] : -1;
                                                            }
                                                        });

                                                        let matchWeeks = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['weeks'];
                                                        let isMathcOne = JSON.stringify(matchWeeks).match(matchRegExOne);
                                                        _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['match'] = (isMathcOne === null) ? 0 : 1;

                                                        _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['showChild'] = true;
                                                    }
                                                }
                                            } else {
                                                let days = month['days'];

                                                if (foundMonth || (maxLevel === 3 && searchResult.length === days.length)) {
                                                    let newDays = JSON.stringify(days).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');
                                                    _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['days'] = [...JSON.parse(newDays)];
                                                } else {
                                                    if (maxLevel === 3) {
                                                        let newDays = JSON.stringify(days).replace(stateRegExOne, '"state":0');
                                                        _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['days'] = [...JSON.parse(newDays)];
                                                    } else {
                                                        days.forEach((day, dayIndex) => {
                                                            let foundDay = false;
                                                            if (!foundMonth) {
                                                                foundDay = this.searchStringExists(searchResult, 4, day.date);
                                                                // foundDay = this.itemExists(searchResult, 4, dayIndex, day.day);
                                                                _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['days'][dayIndex]['match'] = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['days'][dayIndex]['state'] = (foundDay) ? 1 : 0;
                                                            }

                                                            if (dayIndex >= days.length - 1 && !foundYear && !foundQuarter && !foundMonth) {
                                                                let updatedDays = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['days'];

                                                                let sum = updatedDays.reduce((a, b) => +a + +b.state, 0);
                                                                _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['state'] = (sum === updatedDays.length) ? 1 : (sum === 0) ? _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['state'] : -1;
                                                            }
                                                        });

                                                        let matchDays = _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['days'];
                                                        let isMathcOne = JSON.stringify(matchDays).match(matchRegExOne);
                                                        _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['match'] = (isMathcOne === null) ? 0 : 1;

                                                        _years[yearIndex]['quarters'][quarterIndex]['months'][monthIndex]['showChild'] = true;
                                                    }
                                                }
                                            }

                                            if (monthIndex >= months.length - 1 && !foundYear && !foundQuarter) {
                                                let sum = months.reduce((a, b) => +a + +b.state, 0);
                                                _years[yearIndex]['quarters'][quarterIndex]['state'] = (sum === 3) ? 1 : (sum === 0) ? _years[yearIndex]['quarters'][quarterIndex]['state'] : -1;
                                                _years[yearIndex]['quarters'][quarterIndex]['showChild'] = true;

                                            }
                                        });

                                        let matchMonths = _years[yearIndex]['quarters'][quarterIndex]['months'];
                                        let isMathcOne = JSON.stringify(matchMonths).match(matchRegExOne);
                                        _years[yearIndex]['quarters'][quarterIndex]['match'] = (isMathcOne === null) ? 0 : 1;

                                    }
                                }

                                if (quarterIndex >= quarters.length - 1 && !foundYear) {
                                    let sum = quarters.reduce((a, b) => +a + +b.state, 0);
                                    _years[yearIndex]['state'] = (sum === 4) ? 1 : (sum === 0) ? _years[yearIndex]['state'] : -1;
                                    if (sum === 4) {
                                        let newQuarters = JSON.stringify(quarters).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');

                                        _years[yearIndex]['match'] = 1;
                                        _years[yearIndex]['quarters'] = [...JSON.parse(newQuarters)];
                                    }
                                }
                            });

                            let matchQuarters = _years[yearIndex]['quarters'];
                            let isMathcOne = JSON.stringify(matchQuarters).match(matchRegExOne);
                            _years[yearIndex]['match'] = (isMathcOne === null) ? 0 : 1;
                            _years[yearIndex]['showChild'] = true;
                        }
                    }
                } else {
                    let months = year['months'];

                    if (foundYear) {
                        let newMonths = JSON.stringify(months).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');
                        _years[yearIndex]['months'] = [...JSON.parse(newMonths)];
                    } else {
                        if (maxLevel === 1) {
                            _years[yearIndex]['months'] = [...months];
                        } else {
                            months.forEach((month, monthIndex) => {
                                let foundMonth = false;

                                if (!foundYear) {
                                    foundMonth = this.searchStringExists(searchResult, 2, month.searchString);
                                    _years[yearIndex]['months'][monthIndex]['match'] = _years[yearIndex]['months'][monthIndex]['state'] = (foundMonth) ? 1 : 0;
                                }

                                if (showWeeks === true) {
                                    let weeks = month['weeks'];

                                    if (foundMonth || (maxLevel === 3 && searchResult.length === weeks.length)) {
                                        _years[yearIndex]['state'] = 1;
                                        _years[yearIndex]['months'][monthIndex]['state'] = 1;                                        
                                        let newWeeks = JSON.stringify(weeks).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');
                                        _years[yearIndex]['months'][monthIndex]['weeks'] = [...JSON.parse(newWeeks)];

                                    } else {

                                        if (maxLevel === 2) {
                                            let newWeeks = JSON.stringify(weeks).replace(stateRegExOne, '"state":0');
                                            _years[yearIndex]['months'][monthIndex]['weeks'] = [...JSON.parse(newWeeks)];
                                        } else {

                                            weeks.forEach((week, weekIndex) => {
                                                let foundWeek = false;
                                                if (!foundMonth) {
                                                    foundWeek = this.itemExists(searchResult, 3, weekIndex, week.week);
                                                    _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['match'] = _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['state'] = (foundWeek) ? 1 : 0;
                                                }

                                                let newDays = JSON.stringify(week['days']).replace(stateRegExOne, '"state":0');
                                                let days = [...JSON.parse(newDays)];

                                                if (foundWeek) {
                                                    _years[yearIndex]['state'] = 1;
                                                    _years[yearIndex]['months'][monthIndex]['state'] = 1;

                                                    let newDays = JSON.stringify(days).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');
                                                    _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['days'] = [...JSON.parse(newDays)];
                                                } else {
                                                    if (maxLevel === 3) {
                                                        _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['days'] = [...days];
                                                    } else {
                                                        days.forEach((day, dayIndex) => {
                                                            let foundDay = false;
                                                            if (!foundWeek) {
                                                                foundDay = this.searchStringExists(searchResult, 4, day.date);


                                                                _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['days'][dayIndex]['match'] = _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['days'][dayIndex]['state'] = (foundDay) ? 1 : 0;

                                                            }

                                                            if (dayIndex >= days.length - 1 && !foundYear && !foundMonth && !foundWeek) {
                                                                let updatedDays = _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['days'];
                                                                let sum = updatedDays.reduce((a, b) => +a + +b.state, 0);

                                                                _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['state'] = (sum === updatedDays.length) ? 1 : (sum === 0) ? _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['state'] : -1;
                                                            }
                                                        });

                                                        let matchDays = _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['days'];
                                                        let isMathcOne = JSON.stringify(matchDays).match(matchRegExOne);
                                                        _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['match'] = (isMathcOne === null) ? 0 : 1;

                                                        _years[yearIndex]['months'][monthIndex]['weeks'][weekIndex]['showChild'] = true;
                                                    }
                                                }

                                                if (weekIndex >= weeks.length - 1 && !foundYear && !foundMonth) {
                                                    let sum = weeks.reduce((a, b) => +a + +b.state, 0);
                                                    let isPartial = weeks.some(checkPartialState);

                                                    _years[yearIndex]['months'][monthIndex]['state'] = (sum === weeks.length) ? 1 : (sum === 0 && !isPartial) ? _years[yearIndex]['months'][monthIndex]['state'] : -1;
                                                }
                                            });

                                            let matchWeeks = _years[yearIndex]['months'][monthIndex]['weeks'];
                                            let isMathcOne = JSON.stringify(matchWeeks).match(matchRegExOne);

                                            _years[yearIndex]['months'][monthIndex]['match'] = (isMathcOne === null) ? 0 : 1;
                                            _years[yearIndex]['months'][monthIndex]['showChild'] = true;
                                        }
                                    }
                                } else {
                                    let days = month['days'];

                                    if (foundMonth || (maxLevel === 3 && searchResult.length === days.length)) {
                                        let newDays = JSON.stringify(days).replace(stateRegExZero, '"state":1').replace(matchRegEx, '"match":1');
                                        _years[yearIndex]['months'][monthIndex]['days'] = [...JSON.parse(newDays)];
                                    } else {
                                        if (maxLevel === 2) {
                                            let newDays = JSON.stringify(days).replace(stateRegExOne, '"state":0');
                                            _years[yearIndex]['months'][monthIndex]['days'] = [...JSON.parse(newDays)];
                                        } else {
                                            days.forEach((day, dayIndex) => {
                                                let foundDay = false;
                                                if (!foundMonth) {
                                                    foundDay = this.searchStringExists(searchResult, 3, day.date);
                                                    _years[yearIndex]['months'][monthIndex]['days'][dayIndex]['match'] = _years[yearIndex]['months'][monthIndex]['days'][dayIndex]['state'] = (foundDay) ? 1 : 0;

                                                }

                                                if (dayIndex >= days.length - 1 && !foundYear && !foundMonth) {
                                                    let updatedDays = _years[yearIndex]['months'][monthIndex]['days'];
                                                    let sum = updatedDays.reduce((a, b) => +a + +b.state, 0);

                                                    _years[yearIndex]['months'][monthIndex]['state'] = (sum === updatedDays.length) ? 1 : (sum === 0) ? _years[yearIndex]['months'][monthIndex]['state'] : -1;
                                                }
                                            });
                                            let matchDays = _years[yearIndex]['months'][monthIndex]['days'];
                                            let isMathcOne = JSON.stringify(matchDays).match(matchRegExOne);

                                            _years[yearIndex]['months'][monthIndex]['match'] = (isMathcOne === null) ? 0 : 1;
                                            _years[yearIndex]['months'][monthIndex]['showChild'] = true;
                                        }
                                    }
                                }

                                if (monthIndex >= months.length - 1 && !foundYear) {
                                    let sum = months.reduce((a, b) => +a + +b.state, 0);
                                    _years[yearIndex]['state'] = (sum === 12) ? 1 : (sum === 0) ? _years[yearIndex]['state'] : -1;
                                }

                            });

                            let matchMonths = _years[yearIndex]['months'];
                            let isMathcOne = JSON.stringify(matchMonths).match(matchRegExOne);

                            _years[yearIndex]['match'] = (isMathcOne === null) ? 0 : 1;
                            _years[yearIndex]['showChild'] = true;
                        }
                    }
                }
            });

            let isPartial = _years.some(checkPartialState);
            let isOne = _years.some(checkOneState);

            let newYears = JSON.parse(JSON.stringify(_years));

            this.setState({
                filteredYears: [..._years],
                latestFilterYears: [...newYears],
                searchValue: searchValue,
                isNoDataFound: (isPartial === false && isOne === false),
                maxLevel: maxLevel
            });

            this.props.onFilteredDataChange(_years);
            

        } else if (isBlank(searchValue)) {
            this.props.onFilteredDataChange(_years);
            this.setState({
                isNoDataFound: true
            });
        } else {
            let newYears = JSON.parse(JSON.stringify(_years));
            this.setState({
                filteredYears: [..._years],
                latestFilterYears: [...newYears],
                searchValue: searchValue,
                maxLevel: -1
            });
            this.props.onFilteredDataChange(_years);
        }
    }

    updateSelectAllCheckboxHandler = (years, yearObj) => {
        this.updateResultState([...years], yearObj, true, false, false, false, false);
    }

    onChangeQuarterHandler = (quarterObj) => {
        let years = [...this.getYears()];
        let { showWeeks } = this.props.options;
        quarterChangeCallback(years, showWeeks, quarterObj, (years) => {
            this.setState({
                filteredYears: [...years]
            })

            this.updateResultState([...years], quarterObj, false, true, false, false, false);

        });
    }

    onChangeMonthHandler = (monthObj) => {
        let years = [...this.getYears()];
        let { showWeeks, showQuarters } = this.props.options;
        monthChangeCallback(years, showWeeks, showQuarters, monthObj, (years) => {
            this.setState({
                filteredYears: [...years]
            });

            this.updateResultState([...years], monthObj.month, false, false, true, false, false);

        });
    }

    onChangeWeekHandler = (weekObj) => {
        let years = [...this.getYears()];
        let { showQuarters } = this.props.options;
        weekChangeCallback(years, showQuarters, weekObj, (years) => {
            this.setState({
                filteredYears: [...years]
            });

            this.updateResultState([...years], weekObj.week, false, false, false, true, false);
        });
    }

    onChangeDayHandler = (dayObj) => {
        let years = [...this.getYears()];
        let { showQuarters } = this.props.options;
        dayChangeCallback(years, showQuarters, dayObj, (years) => {
            this.setState({
                filteredYears: [...years]
            })
            this.updateResultState([...years], dayObj.day, false, false, false, false, true);
        });
    }

    onChangeWeekDayHandler = (weekDaysObj) => {
        let years = [...this.getYears()];
        let { showQuarters } = this.props.options;
        weekDayChangeCallback(years, showQuarters, weekDaysObj, (years) => {
            this.setState({
                filteredYears: [...years]
            })
            this.updateResultState([...years], weekDaysObj.day, false, false, false, false, true);
        });
    }

    updateResultState = (years, obj, isYear, isQuarter, isMonth, isWeek, isDay) => {
        let isZero = false;
        let { showQuarters, showWeeks } = this.props.options;
        years.forEach((year) => {
            if(isYear){
                if (year.state === 0 && year.match === 1) {
                    isZero = true;
                }
            } else {
                if (showQuarters) {
                    year.quarters.forEach((quarter) => {
                        if(isQuarter){
                            if (quarter.state === 0 && quarter.match === 1) {
                                isZero = true;
                            }
                        } else {
                            quarter.months.forEach((month) => {
                                if(isMonth){
                                    if (month.state === 0 && month.match === 1) {
                                        isZero = true;
                                    }
                                } else {
                                    if (showWeeks) {
                                        month.weeks.forEach((week) => {
                                            if (isWeek === true) {
                                                if (week.state === 0 && week.match === 1) {
                                                    isZero = true;
                                                }
                                            } else {
                                                week.days.forEach((day) => {
                                                    if (isDay === true) {
                                                        if (day.state === 0 && day.match === 1) {
                                                            isZero = true;
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    } else if (isDay === true) {
                                        month.days.forEach((day) => {
                                            if (day.state === 0 && day.match === 1) {
                                                isZero = true;
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    year.months.forEach((month) => {
                        if(isMonth){
                            if (month.state === 0 && month.match === 1) {
                                isZero = true;
                            }
                        } else {
                            if (showWeeks) {
                                month.weeks.forEach((week) => {
                                    if (isWeek === true) {
                                        if (week.state === 0 && week.match === 1) {
                                            isZero = true;
                                        }
                                    } else {
                                        week.days.forEach((day) => {
                                            if (isDay === true) {
                                                if (day.state === 0 && day.match === 1) {
                                                    isZero = true;
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                month.days.forEach((day) => {
                                    if (day.state === 0 && day.match === 1) {
                                        isZero = true;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

        let isPartial = years.some(checkPartialState);
        let isOne = years.some(checkOneState);

        this.setState({
            selectAllResultState: !isZero,
            isSelectAllSearchResult: (isPartial === false && isOne === false) ? false : true
        });
    }

    getScrollbarClass() {
        const { isShowAddToCurrentSelection } = this.props;
        return (isShowAddToCurrentSelection === true) ? 'VS-FilterViewYear VS-ScrollbarHeight1' : 'VS-FilterViewYear VS-ScrollbarHeight2';
    }

    getCheckBoxClass = () => {
        return 'VS-Check-Checkmark';
    }

    checkSelectAllSearchResultValues = () => {
        const { selectAllResultState } = this.state;
        return (selectAllResultState);
    }
    
    getScrollHeight = () => {
        let { height } = this.props.options;
        const { isShowAddToCurrentSelection } = this.props;
        let newHeight = (isShowAddToCurrentSelection === true)? height - 130 : height - 102;
        let fixedHeight = (isShowAddToCurrentSelection === true)? "70px" : "98px";
        return (!isUndefinedOrNull(height) && height >= 200)? (newHeight) + 'px' : fixedHeight;
    }

    render() {
        const { options } = this.props;
        const { filteredYears, isSelectAllSearchResult, isAddCurrentSelection, isExcludeFromSelection, isNoDataFound } = this.state;
        const { exclusions, isShowAddToCurrentSelection } = this.props;
        return (
            <div>
                {
                    (isNoDataFound === true && isSelectAllSearchResult === true) ?
                        <label className="VS-NoResult">No Result Found!</label> : ''
                }
                <div className="mrgL34">
                    {
                        (isNoDataFound === false)?
                        (this.checkSelectAllSearchResultValues()) ?
                            <label className="VS-Checkbox-Container VS-Action">Select All Search Results
                                    <input className="VS-Checkbox" type="checkbox" checked={isSelectAllSearchResult} onChange={(e) => this.onSelectSearchResultChange(e)}></input>
                                <span className="VS-Check-Checkmark"></span>
                            </label> :
                            <label className="VS-Checkbox-Container VS-Action">Select All Search Results
                                    <input className="VS-Checkbox" type="checkbox" checked={isSelectAllSearchResult} onChange={(e) => this.onSelectSearchResultChange(e)}></input>
                                <span className="VS-Check-Checkmark VS-Check-Partial"></span>
                            </label> : ''
                    }
                    {
                        (isNoDataFound === false) ?
                            <hr className="VS-HorizontalLine"></hr> : ''
                    }
                    {
                        (isNoDataFound === false && isShowAddToCurrentSelection === true) ?
                            <label className="VS-Checkbox-Container VS-Action">Add To Previous Selection
                            <input className="VS-Checkbox" type="checkbox" checked={isAddCurrentSelection} onChange={(e) => this.onAddCurrentSelectionChange(e)}></input>
                                <span className={this.getCheckBoxClass()}></span>
                            </label>
                            : ''
                    }
                    {
                        (isNoDataFound === false) ?
                            <label className="VS-Checkbox-Container VS-Action">{(exclusions && exclusions.length > 0) ? 'Add To Previous Exclusions' : 'Exclude From Selection'}
                                <input className="VS-Checkbox" type="checkbox" checked={isExcludeFromSelection} onChange={(e) => this.onExcludeFromSelectionChange(e)}></input>
                                <span className={this.getCheckBoxClass()}></span>
                            </label>
                        : ''
                    }
                    {
                        (isNoDataFound === false) ?
                            <hr className="VS-HorizontalLine"></hr> : ''
                    }
                </div>
                <div id="VS-Scrollbar" style={{minHeight: this.getScrollHeight(), maxHeight: this.getScrollHeight()}} className={this.getScrollbarClass()} options={options}>
                    <YearDisplay options={options} isFilterView={true} years={filteredYears} onChangeQuarter={this.onChangeQuarterHandler} onChangeMonth={this.onChangeMonthHandler} onChangeDay={this.onChangeDayHandler} onChangeWeek={this.onChangeWeekHandler} onChangeWeekDay={this.onChangeWeekDayHandler} onUpdateSelectAllCheckbox={this.updateSelectAllCheckboxHandler}></YearDisplay>
                </div>
            </div>
        )
    }
}
export default FilterView;