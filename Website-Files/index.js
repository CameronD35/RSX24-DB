
import Graph from './modules/lineChart.js';

import createHTMLChildElement from './modules/createElement.js';

import logoAnimationSetup from './modules/logoAnimation.js';

let dashMode = 0;

//import setupSlider from './modules/slider.js';

// BEGIN SETUP CODE

let currentTab = 'MainButton';
let tabsArray = [];
let boxElements = [];
let timerState = false;

let treesInfo = "";

const startTime_T = -350;
const endTime_T = 900;
let currentTime_T = -350;


let currentPage = 0;

let graphArray = [];

// Indicates if the page was just started or not
let pageStart = true;

let popUpScreenOpen = false;
let onSettings;

let num = 0;

// SETTINGS

let lightMode = false;
let graphRange;

// Timer Interval is measured in seconds

let globalIntervalLength = 1000;
let ruduceMotion = false;


// Object of page properties; names of box classes and box titles
const pageProperties = {
    0: {
        CSSClassNames: ['SO2', 'MisStat', 'Pres', 'Mag', 'Alt', 'Temp'],

        titles: ['SO₂ Concentration', 'Mission Status', 'Pressure', 'Magnetosphere', 'Altitude', 'Temperature']

    },

    1: {
        CSSClassNames: ['SO2', 'MisStat', 'Pres', 'Alt', 'Temp'],

        titles: ['SO₂ Concentration', 'Mission Status', 'Pressure', 'Altitude', 'Temperature']
    },

    2: {
        CSSClassNames: ['SO2', 'MisStat', 'Pres', 'Alt', 'Temp'],

        titles: ['SO₂ Concentration', 'Mission Status', 'Pressure', 'Altitude', 'Temperature']
    },

    3: {

        CSSClassNames: ['Mag', 'MisStat', 'Pres', 'Alt', 'Temp'],

        titles: ['Magnetosphere', 'Mission Status', 'Pressure', 'Altitude', 'Temperature']
    }
}

const timerEvents_inT = [-300, 3, 186]

// END SETUP CODE


// Object full of functions for managing the page
let pageManage = {
    // '0' is the main page, the rest correspond to capsule #s
    0: function(CSSClasses, boxTitles){

        //console.log('Creating MAIN page.')

        createBoxStructure(document.querySelector('.boxContainer'), 2, [[false, 2], [true, 4]], CSSClasses, boxTitles);
        //createSO2Box(document.querySelector(".SO2BoxContent"), 2);
        createMissionStagesBox(document.querySelector('.MisStatBoxContent'), 3, ['GSE', 'TE-1', 'TE-2'], timerState, null, timerEvents_inT);
        updateTimerEvents();
        createCapsuleStatusBox(document.querySelector('.MisStatBoxContent'), 3, null, false);
        
        createPressureBox(document.querySelector('.PresBoxContent'), 3);
        

        //createMagnetosphereCircle(document.querySelector('.MagBoxContent'));

        createAltitudeBox(document.querySelector('.AltBoxContent'), 3, 1);
        createAltitudeTable(document.querySelector('.atmosphericLayerTable'), 3, 1);

        createTemperatureBox(document.querySelector('.TempBoxContent'), 3);
    
        setCurrentBoxes(CSSClasses);
        //console.log(boxElements);

        if(!pageStart){
            capsule1.changeParent(document.querySelector('.SO2BoxContent'), capsule1.so2Section);
            capsule1.sulfurDioxideChartSVG.resize(250, 300);
            capsule1.changeParent(document.querySelector('.pressureMeterContainer'), capsule1.pressureMeter);
            capsule1.changeParent(document.querySelector('.temperatureMeterContainer'), capsule1.temperatureMeter);
            capsule1.changeParent(document.querySelector('.capStatAltContainer'), capsule1.altitudeOutput);

            capsule2.changeParent(document.querySelector('.SO2BoxContent'), capsule2.so2Section);
            capsule2.sulfurDioxideChartSVG.resize(250, 300);
            capsule2.changeParent(document.querySelector('.pressureMeterContainer'), capsule2.pressureMeter);
            capsule2.changeParent(document.querySelector('.temperatureMeterContainer'), capsule2.temperatureMeter);
            capsule2.changeParent(document.querySelector('.capStatAltContainer'), capsule2.altitudeOutput);

            capsule3.changeParent(document.querySelector('.pressureMeterContainer'), capsule3.pressureMeter);
            capsule3.changeParent(document.querySelector('.temperatureMeterContainer'), capsule3.temperatureMeter);
            capsule3.changeParent(document.querySelector('.MagBoxContent'), capsule3.magnetosphereCircle);
            capsule3.changeParent(document.querySelector('.capStatAltContainer'), capsule3.altitudeOutput);

            updateAltitudeTable(3, [capsule1.atmospherpicLayer, capsule2.atmospherpicLayer, capsule3.atmospherpicLayer]);
        }

        document.documentElement.style.setProperty('--numOfCapsules', 3);
        //Tets function -- Not to be used in final deployment
        //magRad(0, 12);
    },

    1: function(CSSClasses, boxTitles){
        //console.log('Creating first page.');

        createBoxStructure(document.querySelector('.boxContainer'), 2, [[false, 2], [true, 3]], CSSClasses, boxTitles, [60, 40]);
        //createSO2Box();
        createMissionStagesBox(document.querySelector('.MisStatBoxContent'), 3, ['GSE', 'TE-1', 'TE-2'], timerState, null, timerEvents_inT);
        updateTimerEvents();


        createPressureBox(document.querySelector('.PresBoxContent'), 1, 1);

        createAltitudeBox(document.querySelector('.AltBoxContent'), 1, 1);
        createAltitudeTable(document.querySelector('.atmosphericLayerTable'), 1, 1);

        createTemperatureBox(document.querySelector('.TempBoxContent'), 1);
        setCurrentBoxes(CSSClasses);
        //console.log(boxElements);

        capsule1.changeParent(document.querySelector('.SO2BoxContent'), capsule1.so2Section);
        capsule1.changeParent(document.querySelector('.MisStatBoxContent'), capsule1.missionStatusPoints);
        capsule1.changeParent(document.querySelector('.pressureMeterContainer'), capsule1.pressureMeter);
        capsule1.changeParent(document.querySelector('.temperatureMeterContainer'), capsule1.temperatureMeter);
        capsule1.changeParent(document.querySelector('.capStatAltContainer'), capsule1.altitudeOutput);

        capsule1.sulfurDioxideChartSVG.resize(300, 400);
        document.documentElement.style.setProperty('--numOfCapsules', 1);
        updateAltitudeTable(1, [capsule1.atmospherpicLayer]);
        updateCapsuleSpecifiedStatus("Altitude Sensor", Math.floor(Math.random()*3), capsule1);
        updateCapsuleSpecifiedStatus("Communications", Math.floor(Math.random()*3), capsule1);
        updateCapsuleSpecifiedStatus("Pressure Sensor", Math.floor(Math.random()*3), capsule1);
        updateCapsuleSpecifiedStatus("Sulfur Dioxide Sensor", Math.floor(Math.random()*3), capsule1);
        updateCapsuleSpecifiedStatus("Temperature Sensor", Math.floor(Math.random()*3), capsule1);

    },

    2: function(CSSClasses, boxTitles){
        //console.log('Creating second page.');

        createBoxStructure(document.querySelector('.boxContainer'), 2, [[false, 2], [true, 3]], CSSClasses, boxTitles, [60, 40]);
        //createSO2Box();
        createMissionStagesBox(document.querySelector('.MisStatBoxContent'), 3, ['GSE', 'TE-1', 'TE-2'], timerState, null, timerEvents_inT);
        updateTimerEvents();
        // createMissionStatusBox(document.querySelector('.MisStatBoxContent'), 3, ['GSE', 'TE-1', 'TE-2', '???'], timerState);
        createPressureBox(document.querySelector('.PresBoxContent'), 1, 1);

        createAltitudeBox(document.querySelector('.AltBoxContent'), 1, 2);
        createAltitudeTable(document.querySelector('.atmosphericLayerTable'), 1, 2);

        createTemperatureBox(document.querySelector('.TempBoxContent'), 1);
        //capsule1.changeParent(document.getElementById('box3'), capsule1.sulfurDioxideBar);
        setCurrentBoxes(CSSClasses);
        //console.log(boxElements);

        capsule2.changeParent(document.querySelector('.SO2BoxContent'), capsule2.so2Section);
        capsule2.changeParent(document.querySelector('.MisStatBoxContent'), capsule2.missionStatusPoints);
        capsule2.changeParent(document.querySelector('.pressureMeterContainer'), capsule2.pressureMeter);
        capsule2.changeParent(document.querySelector('.temperatureMeterContainer'), capsule2.temperatureMeter);
        capsule2.changeParent(document.querySelector('.capStatAltContainer'), capsule2.altitudeOutput);

        capsule2.sulfurDioxideChartSVG.resize(300, 400);
        document.documentElement.style.setProperty('--numOfCapsules', 1);
        updateAltitudeTable(1, [capsule2.atmospherpicLayer]);
        updateCapsuleSpecifiedStatus("Altitude Sensor", Math.floor(Math.random()*3), capsule2);
        updateCapsuleSpecifiedStatus("Communications", Math.floor(Math.random()*3), capsule2);
        updateCapsuleSpecifiedStatus("Pressure Sensor", Math.floor(Math.random()*3), capsule2);
        updateCapsuleSpecifiedStatus("Sulfur Dioxide Sensor", Math.floor(Math.random()*3), capsule2);
        updateCapsuleSpecifiedStatus("Temperature Sensor", Math.floor(Math.random()*3), capsule2);
    },

    3: function(CSSClasses, boxTitles){
        //console.log('Creating third page.');

        createBoxStructure(document.querySelector('.boxContainer'), 2, [[false, 2], [true, 3]], CSSClasses, boxTitles, [60, 40]);
        //createSO2Box();
        createMissionStagesBox(document.querySelector('.MisStatBoxContent'), 3, ['GSE', 'TE-1', 'TE-2'], timerState, null, timerEvents_inT);
        updateTimerEvents();
        createPressureBox(document.querySelector('.PresBoxContent'), 1, 3);

        createAltitudeBox(document.querySelector('.AltBoxContent'), 1, 3);
        createAltitudeTable(document.querySelector('.atmosphericLayerTable'), 1, 3);

        createTemperatureBox(document.querySelector('.TempBoxContent'), 1);
        //capsule1.changeParent(document.getElementById('box3'), capsule1.sulfurDioxideBar);
        setCurrentBoxes(CSSClasses);
        //console.log(boxElements);

        capsule3.changeParent(document.querySelector('.MisStatBoxContent'), capsule3.missionStatusPoints);
        capsule3.changeParent(document.querySelector('.pressureMeterContainer'), capsule3.pressureMeter);
        capsule3.changeParent(document.querySelector('.temperatureMeterContainer'), capsule3.temperatureMeter);
        capsule3.changeParent(document.querySelector('.MagBoxContent'), capsule3.magnetosphereCircle);
        capsule3.changeParent(document.querySelector('.capStatAltContainer'), capsule3.altitudeOutput);

        document.documentElement.style.setProperty('--numOfCapsules', 1);
        updateAltitudeTable(1, [capsule3.atmospherpicLayer]);
        updateCapsuleSpecifiedStatus("Altitude Sensor", Math.floor(Math.random()*3), capsule3);
        updateCapsuleSpecifiedStatus("Communications", Math.floor(Math.random()*3), capsule3);
        updateCapsuleSpecifiedStatus("Pressure Sensor", Math.floor(Math.random()*3), capsule3);
        updateCapsuleSpecifiedStatus("Magnetometer Sensor", Math.floor(Math.random()*3), capsule3);
        updateCapsuleSpecifiedStatus("Temperature Sensor", Math.floor(Math.random()*3), capsule3);
    },

    open: function(boxContainer){
        document.querySelector(boxContainer).style.opacity = '0';
        //console.log('whats good');
        document.querySelector(boxContainer).style.animation = `0.5s showElements`
        setTimeout(() => {
            document.querySelector(boxContainer).style = '';
            disableTabs(tabsArray, false);
        }, 500)
    },

    close: function(boxArray){
        //console.log(`func arr length: ${boxArray.length}, glob arr length: ${boxElements.length}`)
        if (boxArray.length != 0){
            boxElements = [];
            pageStart = false;

            //console.log(`elements : ${boxArray}`)
            for(let i = 0; i < boxArray.length; i++){
                let currentElement = document.querySelector(`.${boxArray[i]}`);

                
                if(currentElement.hasChildNodes()){
                        currentElement.replaceChildren();
                        currentElement.style.animation = `0.5s hideElements`;
                    //console.log(boxArray);
                }
            }
            setTimeout(() => {
                document.querySelector('.boxContainer').replaceChildren();
                //console.log('deleting stuff');
            }, 400);
        }
    }
}

class CapsuleObject {

    constructor(capsuleNumber, testNum, hasSO2Sensor, hasMagnetometer){
        this.parent = false;
        this.capsuleNumber = capsuleNumber;
        this.generalStatus = 1;
        this.generalStatusDot;
        

        if(hasSO2Sensor){
            this.so2Section = createSO2Structure(capsuleNumber, document.querySelector('.SO2BoxContent'));
            this.sulfurDioxideBar = createSO2Bar(capsuleNumber, this.so2Section, testNum);
            this.sulfurDioxideChartArray = createSO2Graph(capsuleNumber, this.so2Section);

            this.sulfurDioxideChart = this.sulfurDioxideChartArray[0];

            this.sulfurDioxideChartSVG = this.sulfurDioxideChartArray[1];

            //console.log(this.sulfurDioxideChart);

            this.missionStatusPoints = createCapsuleStatusBox(cleanElement(document.querySelector('.MisStatBoxContent')), 1, ['Altitude Sensor', 'Communications', 'Pressure Sensor', 'Sulfur Dioxide Sensor', 'Temperature Sensor'], true, capsuleNumber);

            this.specifiedStatus = {
                "Altitude Sensor": 1,
                "Communications": 1,
                "Pressure Sensor": 1,
                "Sulfur Dioxide Sensor": 1,
                "Temperature Sensor": 1
            }
        }


        //console.log(this.missionStatusPoints)

        this.pressureMeter = createPressureMeter(document.querySelector('.pressureMeterContainer'), capsuleNumber, true, testNum);

        if (hasMagnetometer){
            this.magnetosphereCircle = createMagnetosphereCircle(document.querySelector('.MagBoxContent'));
            this.missionStatusPoints = createCapsuleStatusBox(cleanElement(document.querySelector('.MisStatBoxContent')), 1, ['Altitude Sensor', 'Communications', 'Pressure Sensor', 'Magnetosphere Sensor', 'Temperature Sensor'], true, capsuleNumber);

            this.specifiedStatus = {
                "Altitude Sensor": 1,
                "Communications": 1,
                "Pressure Sensor": 1,
                "Magnetometer Sensor": 1,
                "Temperature Sensor": 1
            }
        }

        this.altitude = num;
        this.atmospherpicLayer = 1;
        //console.log(document.querySelector('.capStatAltContainer'))
        this.altitudeOutput = createAltitudeDataDisplay(capsuleNumber, document.querySelector('.capStatAltContainer'), testNum);
        // 10km, 50km, 85km, 500km
        this.temperatureMeter = createTemperatureMeter(document.querySelector('.temperatureMeterContainer'), capsuleNumber, true, testNum);

        this.data = {
            pressureData: [],

            altitudeData: [],

            temperatureData: [],

            sulfurDioxideData: [],

            magnetosphereData: []
        }

        //console.log(this.sulfurDioxideBar);
    }

    changeParent(newParent, objectElement){
        newParent.appendChild(objectElement);
        this.parent = newParent;
    }

}

class Setting {
    // range is in an array format: [min, max]
    constructor(name, description, range, onOffBool, performanceBool, defaultRangeVal, stepVal, func){
        this.name = name;
        this.description = description;
        this.onOffBool = onOffBool;
        this.performanceBool = performanceBool;
        this.func = func;
        //console.log(this.func)

        if (this.onOffBool){
            this.active = false;
            this.switchToggle = createSwitchToggle(this.name, this);
            console.log(this.switchToggle)
        }

        if (range){
            if (typeof range[0] === 'number' && (range[0] < range[1])){

                if (typeof range[1] === 'number'){

                    this.min = range[0]
                    this.max = range[1];
                    this.stepVal = stepVal;

                } else {return;}

            } else {return;}

            if (defaultRangeVal) {this.defaultRangeVal = defaultRangeVal;}
            else {this.defaultRangeVal = this.min;}

            this.slider = createSettingSlider(this.name, this, [this.min, this.max], this.defaultRangeVal, this.stepVal);
        }
    }

    createSettingBox(container){
        let settingContainer = createHTMLChildElement(container, 'div', 'settingContainer', null, `settingContainer${this.name}`);
        let settingInfoBox = createHTMLChildElement(settingContainer, 'div', 'settingInfoBox', null, `settingInfoBox${this.name}`);
        let settingTitle = createHTMLChildElement(settingInfoBox, 'div', 'settingTitle', this.name, `setting${this.name}`);
        let settingDesc = createHTMLChildElement(settingInfoBox, 'div', 'settingDesc', this.description, `setting${this.name}Desc`);

        let settingInputBox = createHTMLChildElement(settingContainer, 'div', 'settingInputBox', null, `settingInputBox${this.name}`);
        let settingInput;
        let settingSlider;

        if (this.performanceBool) {
            let speedIconBox;
            let speedIcon;
        }

        if (this.onOffBool){
            
            settingInputBox.append(this.switchToggle);

            // });
        } else if (this.min && this.max){
            
            settingInputBox.append(this.slider);
            setupSettingSlider(this);


        } else {
            console.log('setting cannot exist.');
        }
    }
}



// This sets up the different tabs accessible in the top right navigation
// It gives the tabs their animations and functions to be used upon hover and click respectively

function setupTabs(tabs){
    for(let i = 0; i < tabs.length; i++){
        document.getElementById(tabs[i]).addEventListener('click', () => {    

            if(currentPage != i){
                console.log(tabsArray);
                disableTabs(tabsArray, true);
                currentTab = tabs[i];
                currentPage = i;
                updateTabs(tabs);

                pageManage.close(boxElements);
                //console.log('closing');
                setTimeout(() => {
                    pageManage[i](pageProperties[i].CSSClassNames, pageProperties[i].titles)
                        
                    if (!pageStart){
                            pageManage.open('.boxContainer');
                            console.log('opening');
                    }

                }, 500)
                //console.log(currentPage);

            }


            randomizeBackground();

        })
    }
}

// This gives the navigation tabs the ability to listen to mouse events and update accordingly
function updateTabs(tabs){
    for (let i = 0; i < tabs.length; i++){
        if (tabs[i] != currentTab){
            document.getElementById(tabs[i]).style.setProperty('opacity', '0.2');
        } else{
            document.getElementById(tabs[i]).style.setProperty('opacity', '1');
        }
    }
}

// Sets up the slider and input section
function setupSlider(slider, valueDisplay, maxVal){
    //console.log('slider value: ' + slider.value);
    slider.addEventListener('mousedown', () => { turnYellow();});

    slider.addEventListener('mouseup', async () => {
        turnWhite();
        currentTime_T = slider.value - 350;
        let sign = getCurrentTimeSign(currentTime_T);

        changeTime(sign, currentTime_T);
        //console.log('test');

        // DATABASE CODE
        //console.log(await sendDataToPython("http://127.0.01:5000/dashboard", slider.value));
        //document.querySelector('.randomNumberThing').textContent = await sendDataToPython("http://127.0.01:5000/dashboard", slider.value);


    });

    slider.addEventListener('input', () => {
        valueDisplay.value = `${slider.value}`;
    });

    valueDisplay.onkeydown = async function(key){

        if(key.keyCode == 13){
            turnWhite();
            if(slider.value > maxVal){
                //console.log(valueDisplay);
                slider.value = maxVal;
                valueDisplay.value = maxVal;
            } else {
                slider.value = `${valueDisplay.value}`;
            }
            currentTime_T = slider.value - 350;
            let sign = getCurrentTimeSign(currentTime_T);

            changeTime(sign, currentTime_T);
            valueDisplay.blur();
            //console.log(await sendDataToPython("http://127.0.01:5000/dashboard", slider.value));
            //document.querySelector('.randomNumberThing').textContent = await sendDataToPython("http://127.0.01:5000/dashboard", slider.value);

            //console.log(slider.value);
        }
        
    }

    valueDisplay.addEventListener('input', () => {
        turnYellow();

        if (valueDisplay.value.length > valueDisplay.maxLength){
            valueDisplay.value = valueDisplay.value.slice(0, valueDisplay.maxLength);
        }
    });

    function turnYellow(){
        valueDisplay.style.setProperty('color', `var(--secondaryColor)`);
        valueDisplay.style.setProperty('font-size', `18px`);
    }

    function turnWhite(){
        valueDisplay.style.setProperty('color', `var(--mainColor)`);
        valueDisplay.style.setProperty('font-size', `12px`);
    }
}



// This manages and creates the navigation located in the top right
function createNavigation(parent, count){

    let main = createHTMLChildElement(parent, 'li', 'hoverBig', 'MAIN', `MainButton`);
    tabsArray.push(main.id);

    for (let i = 1; i <= count; i++){
        let currentElement = createHTMLChildElement(parent, 'li', 'hoverBig', null, `C${i}Button`);
        tabsArray.push(currentElement.id);

        let currentImage = createHTMLChildElement(currentElement, 'img', 'capsuleLogo', null, `capsuleLogo${i}`);
        currentImage.src = `../Image-Assets/C${i}.webp`;
    }

    let infoButtonBox = createHTMLChildElement(parent, 'li', 'infoButtonBox');
    let infoButton = createHTMLChildElement(infoButtonBox, 'div', 'infoButton');
    let infoLetter = createHTMLChildElement(infoButton, 'span', 'infoLetter', 'i')


    let settingsIconBox = createHTMLChildElement(parent, 'li', 'settingsButtonBox', null);
    let settingsIcon = createHTMLChildElement(settingsIconBox, 'img', 'settingsButton', null);
    settingsIcon.src = `../Image-Assets/SettingsIcon.webp`;

    setupTabs(tabsArray);
    updateTabs(tabsArray);
}

// This utilizes the above functions to create the 'skeleton' of the page, which will be used across all tabs (TF)
function createPageLayout(){
    createNavigation(document.getElementById('navList'), 3);
    logoAnimationSetup(document.getElementById('logo'));
    setupSlider(document.querySelector('.slider'), document.querySelector('.sliderNumInput'), 1349);
}


// This creates the main boxes found in the center of the page, allows customization of the # of boxes in each row and adjusts width accordingly
// rows: integer; definies how many rows will be present
// rowLengths: array; allows definition of the boxes in each row and their lengths.
// rowsLength format: [[auto-length, boxes amount #1], [auto-length, boxes amount #2], ...]] auto-length: boolean, boxes amount #i: integer
// NOTE: rows == rowLengths.length

function createBoxStructure(parent, rows, rowLengths, boxNames, titles, height){
    //console.log('im beign called')
    let boxNumber = 1;

    let boxWidth = [];

    let rowHeights = [];
    
    // Checks to see if auto-length is set to true and if so autosets the length. 
    // Else, it uses CSS definied length
    for (let d = 0; d < rowLengths.length; d++){
        rowLengths[d][0]? boxWidth.push(100/rowLengths[d][1]) : boxWidth.push('');
    }

    //console.log(boxWidth);

    for(let i = 1; i <= rows; i++){

        let currentRow = createHTMLChildElement(parent, 'div', 'dashRow', null, `dashRow${i}`);

        // if a height argument is passed, set the height of rows
        if (height) { currentRow.style.height = `${height[i-1]}%`; }

        for(let j = 1; j <= rowLengths[i-1][1]; j++){

            let currentBox = createHTMLChildElement(currentRow, 'div', [boxNames[boxNumber - 1], 'box'], null, `box${boxNumber}`);

            let currentTitle = createHTMLChildElement(currentBox, 'div', 'boxTitle', titles[boxNumber - 1], `boxTitle${boxNumber}`);

            let currentContentBox = createHTMLChildElement(currentBox, 'div', [`${boxNames[boxNumber - 1]}BoxContent`, 'boxContent'], null, `boxContent${boxNumber}`);

            boxNumber++;

            //console.log(rowLengths[i-1][0]);

            //console.log(boxWidth);
            rowLengths[i-1][0] ? (currentBox.style.width = `${boxWidth[i-1]}%`): '';
        }
    }
}

function createSO2Structure(capsuleNumber, container){
    let so2Section = createHTMLChildElement(container, 'div', 'SO2Section', null, `SO2Section${capsuleNumber}`);

    return so2Section;
}

function createSO2Bar(capsuleNumber, container, testNum) {

    let SO2BarGraphic = createHTMLChildElement(container, 'div', 'SO2BarGraphic', null, `SO2BarGraphic${capsuleNumber}`);

    let currentSO2Container = createHTMLChildElement(container, 'div', 'SO2BarContainer', null, `SO2BarContainer${capsuleNumber}`);

    let currentSO2Box = createHTMLChildElement(currentSO2Container, 'div', `SO2BarBox`, null, `SO2BarBox${capsuleNumber}-P${currentPage}`);

    let currentSO2Num = createHTMLChildElement(currentSO2Box, 'div', 'SO2Num', `${testNum}`, `SO2Num${capsuleNumber}`);

    let currentSO2Unit = createHTMLChildElement(currentSO2Num, 'div', 'SO2Unit', 'ppm', `SO2Unit${capsuleNumber}`);
    
    //console.log(currentSO2Container);

    return currentSO2Container;
}

function createSO2Graph(capsuleNumber, container){

    let currentSvgContainer = createHTMLChildElement(container, 'div', 'svgContainer', null, `svgContainer${capsuleNumber}-P${currentPage}`);


        let currentGraph = new Graph(250, 300, {top: 20, bottom: 20, right: 30, left: 30}, `#${currentSvgContainer.id}`, null, ['time', 'concentration'], ['red', 'blue'], 'SO2Chart');

        graphArray.push(currentGraph);

        currentGraph.create();
    
        return [currentSvgContainer, currentGraph];
}


//console.log(createSO2Bar(5, document.getElementById('box1')));

// Creates the stages and timer buttons in the 'mission status' box. Intended to be global
function createMissionStagesBox(container, numOfCapsules, stages, timerRunning, capsuleNumber, timeInTArray){

    //console.log(`timer state: ${timerState}`);

    let stageCont = createHTMLChildElement(container, 'div', 'stageContainer');

    let timeCont = createHTMLChildElement(container, 'div', 'timeContainer');

    for(let i = 0; i < stages.length; i++){

        let currentStageBox = createHTMLChildElement(stageCont, 'div', ['stageBox', stages[i]], stages[i], `stageBox${i+1}`);

        let currentTimeText = createHTMLChildElement(timeCont, 'div', 'timeText', `T${getCurrentTimeSign(timeInTArray[i])}${timeInTArray[i]}`, `timeText${i+1}`);

        let timerID;

        currentTimeText.addEventListener('mouseover', () => {
            let timeUntilEvent_sec = -(currentTime_T - timeInTArray[i])
            //currentTimeText.style.fontSize = '0.8vw';
            currentTimeText.style.opacity = 0.5;


            if (timeUntilEvent_sec > 0){
                timeUntilEvent_sec = -(currentTime_T - timeInTArray[i])
                currentTimeText.textContent = `in ${timeUntilEvent_sec} sec`;
                if (timerState) {
                    timerID = setInterval(() => {
                        timeUntilEvent_sec = -(currentTime_T - timeInTArray[i]);
                        currentTimeText.textContent = `in ${timeUntilEvent_sec} sec`;
                        //console.log('running timer event update');

                        if (timeUntilEvent_sec <= 0){
                            currentTimeText.textContent = `Active`;
                        }

                    }, 1);
                }
            } else {
                currentTimeText.textContent = `Active`;
            }
        });

        currentTimeText.addEventListener('mouseout', () => {
            //currentTimeText.style.fontSize = '1vw';
            currentTimeText.style.opacity = 1;
            currentTimeText.textContent = `T${getCurrentTimeSign(timeInTArray[i])}${timeInTArray[i]}`;

            clearInterval(timerID);
        });

    }

    let timerControlsCont = createHTMLChildElement(container, 'div', 'timerControlsContainer');

    let timer = createHTMLChildElement(timerControlsCont, 'div', 'missionTimer', `T${currentTime_T}`);

    let startButton = createHTMLChildElement(timerControlsCont, 'div', 'startButton');

    let startText = createHTMLChildElement(startButton, 'div', ('startText'), returnValueBasedOnCriteria(timerRunning, "STOP MISSION", "START MISSION"));

    let startCircle = createHTMLChildElement(startButton, 'div', 'startCircle');

    startButton.style.backgroundColor = returnValueBasedOnCriteria(timerRunning, 'rgba(230,0, 0, 0.2)', 'rgba(255,255, 255, 0.2)');
    

    startButton.addEventListener('mouseenter', () => {
        startCircle = document.querySelector('.startCircle');
        startCircle.style.transitionTimingFunction = 'cubic-bezier(0.77, 0, 0.175, 1)';
        startCircle.style.width = '27vmax';
        startCircle.style.height = '27vmax';
        startText.style.color = 'var(--timerHoverColor)';

    });


    startButton.addEventListener('mouseleave', () => {
        startCircle = document.querySelector('.startCircle');
        startCircle.style.transitionTimingFunction = ' cubic-bezier(0.23, 1, 0.825, 0)';
        startCircle.style.width = '0%';
        startCircle.style.height = '0%';
        startText.style.color = 'var(--timerNoHoverColor)';
    });

    startButton.addEventListener('click', () => {
        if(!timerState){
            startGlobalTimer();
        } else {
            stopGlobalTimer();
        }

    });

    let restartButton = createHTMLChildElement(timerControlsCont, 'div', 'restartTimerButton');

    let restartArrow = createHTMLChildElement(restartButton, 'img', 'restartArrow');
    restartArrow.src = '../Image-Assets/RestartArrow.webp';

    restartButton.addEventListener('mouseenter', () => {
        restartArrow.style.animation = `1s cubic-bezier(0.77, 0, 0.175, 1) reverseLogo`;
    });

    restartButton.addEventListener('mouseleave', () => {
        restartArrow.style.animation = `1s cubic-bezier(0.77, 0, 0.175, 1) spinLogo`;
    });

    restartButton.addEventListener('click', () => {
        stopGlobalTimer();
        restartGlobalTimer();

    });
}

function startGlobalTimer(){

    if (!timerState) {timerState = !timerState;}
    let startButton = document.querySelector('.startButton');
        
    if (timerState){
        beginGlobalTimer(globalIntervalLength);
    }

    document.documentElement.style.setProperty('--timerStateColor', 'var(--rsxRed)');
    document.documentElement.style.setProperty('--timerHoverColor', 'white');

    if(dashMode != 2){
        let startText = document.querySelector('.startText');
        startText.textContent = 'STOP MISSION';
    } else {
        startButton.innerHTML = `<div class="startText"></div> <img class="startButtonImg" src="../Image-Assets/StopButton.webp"> <div class="startCircle" id="startCircle"></div>`;
    }
    
    
    startButton.style.backgroundColor = ('rgba(230,0, 0, 0.2)');
}

function stopGlobalTimer(){

    if (timerState) {timerState = !timerState;}
    let startText = document.querySelector('.startText');
    let startButton = document.querySelector('.startButton');

    document.documentElement.style.setProperty('--timerStateColor', 'rgba(255,255,255,1)');
    document.documentElement.style.setProperty('--timerHoverColor', 'black');
    
    if(dashMode != 2){
        let startText = document.querySelector('.startText');
        startText.textContent = 'START MISSION';
    } else {
        startButton.innerHTML = `<img class="startButtonImg" src="../Image-Assets/StartButton.webp"> <div class="startCircle" id="startCircle"></div>`;
    }
    
    startButton.style.backgroundColor = ('rgba(255,255, 255, 0.2)');
}

// Creates the status of the capsules. If singleCapsule is true, i9t lists the components of that capsule, otheriwse a general status for all capsules is provided
function createCapsuleStatusBox(container, numOfCapsules, statusPointsArray, singleCapsule, capsuleNumber){

    let capStatCont = createHTMLChildElement(container, 'div', 'capStatContainer');

    if(!singleCapsule){

        for (let i = 1; i <= numOfCapsules; i++){

            let currentStatBox = createHTMLChildElement(capStatCont, 'div', 'capStatBox', null, `capStatBox${i}`);
    
            let currentText = createHTMLChildElement(currentStatBox, 'div', 'capStatText', `Capsule ${i}`, `capStatText${i}`);
    
            let currentDot = createHTMLChildElement(currentStatBox, 'div', 'capStatDot', null, `capStatDot${i}`);
        }

        //console.log('yreyuwgfsf')

        return;

    } else {
        for(let j = 1; j <= statusPointsArray.length; j++){
            //console.log('test');
            let currentStatusPointText = createHTMLChildElement(capStatCont, 'div', 'capStatPoint', statusPointsArray[j-1], `capStatPoint${statusPointsArray[j-1].substring(0, 4)}-${capsuleNumber}`, statusPointsArray[j-1]);

        }

        return capStatCont;
    }

}

function updateCapsuleGeneralStatus(newStatus, capsuleObj){
    let currentStatus = capsuleObj.generalStatus;

    capsuleObj.generalStatus = newStatus

    updateStatusPointColor(capsuleObj);
}

function updateCapsuleSpecifiedStatus(statusTitle, newStatus, capsuleObj){


    let oldSpecificStatus = capsuleObj.specifiedStatus[statusTitle];
    let statusPointElement = document.getElementById(`capStatPoint${statusTitle.substring(0, 4)}-${capsuleObj.capsuleNumber}`);

    if (oldSpecificStatus === newStatus){
        
        let statusColor = getStatusColor(newStatus);

        statusPointElement.style.color = statusColor;

        return;

    }


    capsuleObj.specifiedStatus[statusTitle] = newStatus;

    console.log("yooo", capsuleObj.specifiedStatus[statusTitle]);

    let statusColor = getStatusColor(newStatus);

    statusPointElement.style.color = statusColor;
    //statusPointElement.style.textShadow = `0px 0px 5px ${statusColor}`;



}


function updateStatusPointColor(capsuleObj) {
    if (currentPage == 0){

        ifElementExists(document.getElementById(`capStatDot${capsuleObj.capsuleNumber}`), (elem) => {
            elem.style.backgroundColor = getStatusColor(capsuleObj.generalStatus)
        });

    } else {

        console.log(`You are on capsule ${currentPage}`);
        
    }
}

function getStatusColor(status){
    if (status == 2){ 

        return 'var(--rsxGreen)';

    } else if (status == 1) {

        return 'var(--rsxOrange)';

    } else {

        return 'var(--rsxRed)';

    }
}



function createPressureBox(container, numOfCapsules, capsuleNumber){

    let pressCont = createHTMLChildElement(container, 'div', 'pressureMeterContainer', null)

}

function createPressureMeter(container, capsuleNumber, includeLogo, num){

        let currentPressureBox = createHTMLChildElement(container, 'div', 'pressureMeterBox', null, `pressureMeterBox${capsuleNumber}`);

            currentPressureBox.style.setProperty('width',`calc(75%/var(--numOfCapsules))`);
            currentPressureBox.style.setProperty('margin',`0 calc(3vw/var(--numOfCapsules))`);

            if (includeLogo){
                let currentLogoBox = createHTMLChildElement(currentPressureBox, 'div', 'pressureMeterLogoBox', null, `pressureMeterLogoBox${capsuleNumber}`);

                let currentLogo = createHTMLChildElement(currentLogoBox, 'img', 'pressureMeterCapsuleLogo', null, `pressureMeterCapsuleLogo${capsuleNumber}`);
                currentLogo.src = `../Image-Assets/C${capsuleNumber}.webp`;
            }

            let currentMeter = createHTMLChildElement(currentPressureBox, 'div', 'pressureMeter', null, `pressureMeter${capsuleNumber}`);

            let currentTextBox = createHTMLChildElement(currentMeter, 'div', 'pressureTextBox', null, `pressureTextBox${capsuleNumber}`);

            let currentText = createHTMLChildElement(currentTextBox, 'div', 'pressureText', num, `pressureText${capsuleNumber}`);

            let currentUnit = createHTMLChildElement(currentTextBox, 'div', 'pressureUnit', 'atm', `pressureUnit${capsuleNumber}`);

            let currentFillBox = createHTMLChildElement(currentMeter, 'div', 'pressureMeterFillBox', null, `pressureMeterFillBox${capsuleNumber}`);

            let currentFill = createHTMLChildElement(currentFillBox, 'div', 'pressureMeterFill', null, `pressureMeterFill${capsuleNumber}`);

            return currentPressureBox;
}


function createMagnetosphereCircle(container){

    let outerCircle = createHTMLChildElement(container, 'div', 'outerCircle', null);
    
    let innerCircle = createHTMLChildElement(outerCircle, 'div', 'innerCircle', null);

    let magNumber = createHTMLChildElement(outerCircle, 'div', 'magNumber', '99999');

    return outerCircle;

}

function createAltitudeBox(container, numOfCapsules, startCapsule){

    let altContainer = createHTMLChildElement(container, 'div', 'capStatAltContainer');
    let tableElement = createHTMLChildElement(container, 'table', 'atmosphericLayerTable');

}

function createAltitudeDataDisplay(capsuleNumber, container, testNum){

    let currentStatBox = createHTMLChildElement(container, 'div', 'capAltStatBox', null, `capAltStatBox${capsuleNumber}`);

    let currentText = createHTMLChildElement(currentStatBox, 'div', 'capAltStatText', `Capsule ${capsuleNumber}`, `capAltStatText${capsuleNumber}`);

    let currentData = createHTMLChildElement(currentStatBox, 'div', 'capAltStatData', `${testNum} km.`, `capAltStatData${capsuleNumber}`);

    return currentStatBox;
}

function createAltitudeTable(container, numOfCapsules, startCapsule){

    let layerArray = ['Exosphere', 'Thermosphere', 'Mesosphere', 'Stratosphere', 'Troposphere'];

    for (let i = 1; i <= layerArray.length; i++){

        let currentTableRow = createHTMLChildElement(container, 'tr', 'atmosphericLayerRow', null, `atmosphericLayerRow${i}`)

        let currentTableHeader = createHTMLChildElement(currentTableRow, 'th', 'atmosphericLayerHeader', layerArray[i-1], `atmosphericLayerHeader${i}`)

        for (let j = 1; j <= numOfCapsules; j++) {

            let currentTableCell = createHTMLChildElement(currentTableRow, 'td', 'atmosphericLayerCell', null, `atmosphericLayerCell${i}-${j + startCapsule - 1}`);

            let currentTableCellImage = createHTMLChildElement(currentTableCell, 'img', 'atmosphericLayerCellImage', null, `atmosphericLayerCellImage${i}-${j + startCapsule - 1}`);

            currentTableCellImage.src = `../Image-Assets/C${j + startCapsule - 1}.webp`;

        }
    }

}

function updateAltitudeTable(capsuleNum, toPosition, fromPosition){

    for(let i = 1; i <= 5; i++){

        let currentCell = document.getElementById(`atmosphericLayerCell${i}-${capsuleNum}`);
        cleanElement(currentCell);
        
    }

        let intendedCell = document.getElementById(`atmosphericLayerCell${6-toPosition}-${capsuleNum}`);

        let currentImageBox = createHTMLChildElement(intendedCell, 'img', 
            'atmosphericLayerCellImage', null, `atmosphericLayerCellImage${6-toPosition}-${capsuleNum}`);

        ifElementExists(currentImageBox, () => {currentImageBox.src = `../Image-Assets/C${capsuleNum}.webp`;});

}

function createTemperatureBox(container, numOfCapsules, capsuleNumber){
    
    let tempCont = createHTMLChildElement(container, 'div', 'temperatureMeterContainer', null);

}



function createTemperatureMeter(container, capsuleNumber, includeLogo, num){

        let currentTemperatureBox = createHTMLChildElement(container, 'div', 'temperatureMeterBox', null,`temperatureMeterBox${capsuleNumber}`);
        currentTemperatureBox.style.setProperty('height',`calc(51%/var(--numOfCapsules))`);
        currentTemperatureBox.style.setProperty('margin',`calc(8vh/var(--numOfCapsules)) 0`);

        if (includeLogo){

            let currentLogoBox = createHTMLChildElement(currentTemperatureBox, 'div', 'temperatureMeterLogoBox', null, `temperatureMeterLogoBox${capsuleNumber}`);

            let currentLogo = createHTMLChildElement(currentLogoBox, 'img', 'temperatureMeterCapsuleLogo', null, `temperatureMeterCapsuleLogo${capsuleNumber}`);
            currentLogo.src = `../Image-Assets/C${capsuleNumber}.webp`;

        }

        let currentMeter = createHTMLChildElement(currentTemperatureBox, 'div', 'temperatureMeter', null, `temperatureMeter${capsuleNumber}`);

        let currentText = createHTMLChildElement(currentMeter, 'div', 'temperatureText', `${num}°C`, `temperatureText${capsuleNumber}`);

        let currentFillBox = createHTMLChildElement(currentMeter, 'div', 'temperatureMeterFillBox', null, `temperatureMeterFillBox${capsuleNumber}`);

        let currentFill = createHTMLChildElement(currentFillBox, 'div', 'temperatureMeterFill', null, `temperatureMeterFill${capsuleNumber}`);

        return currentTemperatureBox;
}

function setCurrentBoxes(CSSClassArray){
    boxElements = [];

    for(let i = 0; i < CSSClassArray.length; i++){
        boxElements.push(CSSClassArray[i]);
    }

    //console.log('box titles: ' + boxElements.join(', '));
}

function disableTabs(tabs, value) {
    if (value){
        for(let i = 0; i < tabs.length; i++){

            document.getElementById(tabs[i]).classList.add('nonClickable');

        }
    } else {
        for(let i = 0; i < tabs.length; i++){

            document.getElementById(tabs[i]).classList.remove('nonClickable');

        }
    }

}

async function sendDataToPython(endpoint, data){
    let number = 0;

    const res = await axios.post(endpoint, {
        value: data
    })

    .then((response) => {
            number = response.data[data > Object.keys(response.data).length ? Object.keys(response.data).length : data];
            //console.log(Object.keys(response.data).length);
            //console.log(data);
    })
    
    .catch((err) => {
        console.error(err);
        console.log("Make sure that your python app is running.")
    })

    return (number);
}

function ifElementExists(element, func) {
    if (element) {
        //console.log('work');
        return func(element);
    }

    else {
        //console.log('no work');
    }
}

function cleanElement(element){
    if(element && element.hasChildNodes()){
        element.replaceChildren();

        return element;
    }
}


// Creates the animation for the backgorund by moving elemments by random percenatges (0 - 20%)
function randomizeBackground(){
    for(let i = 1; i <= 3; i++){
        document.getElementById(`backgroundElem${i}`).style.transform = `translate(${Math.round(Math.random() * 20)}%, ${Math.round(Math.random() * 20)}%)`;
        // document.getElementById(`backgroundElem${i}`).style.transform = `rotate(${Math.round(Math.random() * 30)}deg)`;
        // document.getElementById(`backgroundElem${i}`).style.transform = `scale(${100 - Math.round(Math.random() * 10)}%)`;
    }
}

setInterval(() => {
    ++num;
    ifElementExists(document.getElementById('capAltStatData3'), () => {
        document.getElementById('capAltStatData3').innerText = num;
    });
}, 1)


// Function call that sets the website page to the main page on startup

pageManage[0](['SO2', 'MisStat', 'Pres', 'Mag', 'Alt', 'Temp'], ['SO₂ Concentration', 'Mission Status', 'Pressure', 'Magnetosphere', 'Altitude', 'Temperature']);

let capsule1 = new CapsuleObject(1, 56, true, false);

let capsule2 = new CapsuleObject(2, 77, true, false);

let capsule3 = new CapsuleObject(3, 78, false, true);

document.querySelector('.boxContainer').replaceChildren();

pageManage[0](['SO2', 'MisStat', 'Pres', 'Mag', 'Alt', 'Temp'], ['SO₂ Concentration', 'Mission Status', 'Pressure', 'Magnetosphere', 'Altitude', 'Temperature']);

createPageLayout();

let popUpScr = document.querySelector('.popUpScreen');
popUpScr.style.width = '0';
popUpScr.style.height = '0';

capsule1.changeParent(document.querySelector('.SO2BoxContent'), capsule1.so2Section);
capsule1.changeParent(document.querySelector('.pressureMeterContainer'), capsule1.pressureMeter);
capsule1.changeParent(document.querySelector('.temperatureMeterContainer'), capsule1.temperatureMeter);
capsule1.changeParent(document.querySelector('.capStatAltContainer'), capsule1.altitudeOutput);

capsule2.changeParent(document.querySelector('.SO2BoxContent'), capsule2.so2Section);
capsule2.changeParent(document.querySelector('.pressureMeterContainer'), capsule2.pressureMeter);
capsule2.changeParent(document.querySelector('.temperatureMeterContainer'), capsule2.temperatureMeter);
capsule2.changeParent(document.querySelector('.capStatAltContainer'), capsule2.altitudeOutput);


capsule3.changeParent(document.querySelector('.pressureMeterContainer'), capsule3.pressureMeter);
capsule3.changeParent(document.querySelector('.temperatureMeterContainer'), capsule3.temperatureMeter);
capsule3.changeParent(document.querySelector('.MagBoxContent'), capsule3.magnetosphereCircle);
capsule3.changeParent(document.querySelector('.capStatAltContainer'), capsule3.altitudeOutput);



let graphRangeSetting = new Setting('Graph Range', 'Set the desired range for all graphs.', [5, 100], false, true, 50, 1, (domainLength) => {
    capsule1.sulfurDioxideChartSVG.changeDomain(domainLength);
    capsule2.sulfurDioxideChartSVG.changeDomain(domainLength);
});

let timeChangeLengthSetting = new Setting('Timer Interval', 'Set the time between timer seconds.', [0.5, 10], false, false, 1, 0.5, (intervalLength) => {

    globalIntervalLength = intervalLength * 1000;
    console.log(timerState);
    stopGlobalTimer();
    

});

let reducedMotionSetting = new Setting('Reduce Motion', 'Reduce motion across the dashboard.', false, true, false, null, null, () => {console.log('qewjdfyubvewauyfdktewrfyiwefwefr')});



function createSettingsMenu(){
    let popUpCont = document.querySelector('.popUpContainer');

    let contentCont = document.querySelector('.popUpContentContainer');

    console.log(contentCont);

    let graphRangeSettingBox = graphRangeSetting.createSettingBox(contentCont);

    let timeChangeLengthSettingBox = timeChangeLengthSetting.createSettingBox(contentCont);
    
    let reducedMotionSettingBox = reducedMotionSetting.createSettingBox(contentCont);
    setTimeout(resizeToggleSwitch, 500);

}

function createInfoMenu(){
    let popUpCont = document.querySelector('.popUpContainer');

    let contentCont = document.querySelector('.popUpContentContainer');


    let infoText = createHTMLChildElement(contentCont, 'div', 'popUpInfoText', null, 'popUpInfoText');

    setToTextFromDocument(infoText, 'Website-Files/description.txt');


}

function turnToLightMode() {
    document.documentElement.style.setProperty('--mainColor', '#041537');
    document.documentElement.style.setProperty('--secondaryColor', 'black')
    document.documentElement.style.setProperty('--tertiaryColor', 'rgb(230, 230, 230)');
    document.documentElement.style.setProperty('--boxColor', 'rgba(4, 21, 55, 0.25)');
    document.documentElement.style.setProperty('--meterOutlineColor', 'rgba(0, 0, 0, 0.25)');
    document.documentElement.style.setProperty('--pngFilters', 'brightness(0) saturate(100%) invert(12%) sepia(47%) saturate(1029%) hue-rotate(183deg) brightness(85%) contrast(109%)');

    document.getElementById('infoButton').style.color = 'white';
    let switchWidth = document.querySelector('.colorModeSwitch').getBoundingClientRect().width;
    document.querySelector('.colorModeToggle').style.transform = `translateX(${switchWidth - 30}px)`;
    document.querySelector('.colorModeIcon').style.transform = `translateX(${25 - switchWidth}px)`;
    document.querySelector('.colorModeIcon').src = "../Image-Assets/DarkModeIcon.webp";
    document.querySelector('.colorModeSwitch').style.backgroundPositionX = '0%';
    document.querySelector('.colorModeSwitch').style.boxShadow = '0px 0px 15px rgba(255,234, 0, 0.5)';
}

function turnToDarkMode(){
    document.documentElement.style.setProperty('--mainColor', 'white');
    document.documentElement.style.setProperty('--secondaryColor', 'rgb(255,234, 0)');
    document.documentElement.style.setProperty('--tertiaryColor', '#041537');
    document.documentElement.style.setProperty('--boxColor', 'rgba(0, 0, 0, 0.75)');
    document.documentElement.style.setProperty('--meterOutlineColor', 'rgba(255, 255, 255, 0.25)');
    document.documentElement.style.setProperty('--pngFilters', 'none');

    document.getElementById('infoButton').style.color = 'black';
    document.querySelector('.colorModeToggle').style.transform = 'translateX(0px)';
    document.querySelector('.colorModeIcon').style.transform = 'translateX(0px)';
    document.querySelector('.colorModeIcon').src = "../Image-Assets/LightModeIcon.webp";
    document.querySelector('.colorModeSwitch').style.backgroundPositionX = '100%';
    document.querySelector('.colorModeSwitch').style.boxShadow = '0px 0px 15px rgba(4, 21, 55, 0.5)';
}

function showPopUpScreen(openSettings, openInfo){
    
    let popUpScr = document.querySelector('.popUpScreen');
    let popUpCont = document.querySelector('.popUpContainer');
    document.querySelector('.mainContent').style.filter = 'blur(5px)';
        popUpScr.style.width = '100%';
        popUpScr.style.height = '100%';
        popUpScr.style.inset = '0%'
    let popUpContainer = document.querySelector('.popUpContainer');

    let titleContainer = createHTMLChildElement(popUpCont, 'div', 'popUpTitleContainer', null)

    let rsxTitle = createHTMLChildElement(titleContainer, 'div', 'popUpRsxTitle', 'RockSatX Dashboard');
    let rsxSubtitle = createHTMLChildElement(titleContainer, 'div', 'popUpRsxSubtitle', 'College of the Canyons - 2024');
    
    let contentContainer = createHTMLChildElement(popUpCont, 'div', 'popUpContentContainer');
    let navContainer = createHTMLChildElement(popUpCont, 'div', 'popUpNavContainer');
    let settingsSection = createHTMLChildElement(navContainer, 'div', 'popUpNavSection', 'SETTINGS', 'popUpNavSettingsSection');
    let infoSection = createHTMLChildElement(navContainer, 'div', 'popUpNavSection', 'INFO', 'popUpNavInfoSection');
    
    if (openSettings) {
        createSettingsMenu();
        settingsSection.style.opacity = 1;

        onSettings = true;

    } else if (openInfo) {
        createInfoMenu();
        infoSection.style.opacity = 1;

        onSettings = false;
    }

    document.getElementById('popUpNavSettingsSection').addEventListener('click', () => {
        settingsSection.style.opacity = 1;
        infoSection.style.opacity = 0.5;        
        changePopUpScreenContent(true, false);
    
        // let contentContainer = document.querySelector('.popUpContentContainer');
    
        // createSettingsMenu();
    });

    document.getElementById('popUpNavInfoSection').addEventListener('click', () => {
        infoSection.style.opacity = 1;
        settingsSection.style.opacity = 0.5;
        changePopUpScreenContent(false, true);
    
        // let contentContainer = document.querySelector('.popUpContentContainer');
    
        // createInfoMenu();
    });

    checkIfPopUpScreenClicked()
    setTimeout(() => {popUpScreenOpen = true;}, 5)
    
}
let popUpContainer = document.querySelector('.popUpContainer');



function checkIfPopUpScreenClicked() {
    document.addEventListener('click', (event) => {
        //console.log(event.target);
        let ifClickInside = popUpContainer.contains(event.target)//popUpContainer.contains(event.target)
        //console.log(popUpScreenOpen);
        console.log(popUpContainer + ', ' + ifClickInside)

        if (!ifClickInside && popUpScreenOpen) {

            //console.log('clicked outside box.');
            cleanElement(popUpContainer);
            //console.log('element cleaned');
            popUpContainer.style.minWidth = '0';
            // setTimeout(() => {
            //     'the most important function ever'
            // }, 50)
            popUpScreen.style.width = '0';
            popUpScreen.style.height = '0';

            let logoPosition = document.getElementById('logo').getBoundingClientRect();
            //console.log(logoPosition);
            //console.log(`${logoPosition.top} ${logoPosition.right} ${logoPosition.bottom} ${logoPosition.left}`);
            popUpScreen.style.inset = `${logoPosition.top + 25}px ${logoPosition.right}px ${logoPosition.bottom}px ${logoPosition.left + 25}px`;

            document.querySelector('.mainContent').style.filter = '';
            popUpScreenOpen = false;


            setTimeout(() => {
                popUpContainer.style.minWidth = '410px';
            }, 500);
        } else {
            //console.log('clicked inside box.');
        }
    });
}


document.getElementById('settingsButtonBox').addEventListener('click', () => {
    //console.log(popUpScreenOpen);
    showPopUpScreen(true, false);
    //console.log(popUpScreenOpen);
});



document.getElementById('infoButtonBox').addEventListener('click', () => {
    showPopUpScreen(false, true);
    
});



let popUpScreen = document.querySelector('.popUpScreen');



function changePopUpScreenContent(showSettings, showInfo){
    let contentCont = document.querySelector('.popUpContentContainer');

    if (showSettings && !onSettings) {

        transition(createSettingsMenu, false);
        console.log('opening settings');


        // contentCont.style.opacity = '1';
        // contentCont.style.transform = 'translateX(0%)';

        onSettings = true;

    } else if (showInfo && onSettings) {

        createInfoMenu();
        console.log('opening info');

        transition(createInfoMenu, true);

        onSettings = false;
    }

    function transition(createScreenFunction, fromRight) {

        contentCont.style.transitionDuration = '0s';

        cleanElement(contentCont);

        let sideSign;
        
        if (!fromRight) {
            sideSign = '-';
        } else {
            sideSign = '';
        }

        contentCont.style.transform = `translateX(${sideSign}100%)`;

        console.log(contentCont.style.transitionDuration);

        setTimeout(() => {

            contentCont.style.transitionDuration = '0.5s';
            console.log(contentCont.style.transitionDuration);

            contentCont.style.transform = 'translateX(0%)';
            contentCont.style.opacity = 1;
        }, 1);


        (createScreenFunction)();
    }
}

// let infoTab = document.getElementById('popUpNavInfoSection');

// document.getElementById('popUpNavInfoSection').addEventListener('click', () => {
//     console.log('info clicked');
// });

function beginGlobalTimer(){
    
    let timerInterval = setInterval(() => {

        let sign = getCurrentTimeSign(currentTime_T);

        console.log('changing time');
        currentTime_T++;
        changeTime(sign, currentTime_T);

        // Checks if the "stop mission" button has been clicked, resulting in a timerState == false
        if (!timerState){

            clearInterval(timerInterval);

        }

    }, globalIntervalLength);

    
}


function restartGlobalTimer(){

    currentTime_T = startTime_T;
    changeTime('', currentTime_T);

}

function changeTime(sign, time_T){

    let currentTimeInSec = time_T + 350;
    const timer_T = document.getElementById('missionTimer');
    const timer_Slider = document.querySelector('.sliderNumInput');
    const inputSlider = document.querySelector('.slider')

    timer_T.textContent = `T${sign}${currentTime_T}`
    timer_Slider.value = currentTimeInSec;
    inputSlider.value = currentTimeInSec;
    updateTimerEvents();
    // Add function for changing graphics upon a change in time

}

function getCurrentTimeSign(time){

    if (time >= 0){
        return "+";
    }

    return "";
}

function updateTimerEvents(){
    let stageBoxes = document.querySelectorAll('.stageBox');
    //console.log(stageBoxes);

    for (let i = 0; i < stageBoxes.length; i++){
        if (-(currentTime_T - timerEvents_inT[i]) <= 0){

            stageBoxes[i].style.backgroundColor = 'var(--rsxGreen)';
            stageBoxes[i].style.boxShadow = '0px 0px 10px rgba(0,230,0,0.5)';

        } else if (-(currentTime_T - timerEvents_inT[i]) <= 50) {

            stageBoxes[i].style.backgroundColor = 'var(--rsxOrange)';
            stageBoxes[i].style.boxShadow = '0px 0px 10px rgba(255,127,0,0.5)';

        } else {

            stageBoxes[i].style.backgroundColor = 'var(--rsxRed)';
            stageBoxes[i].style.boxShadow = '0px 0px 10px rgba(230,0,0,0.5)';

        }
    }
    let restartButton = document.querySelector('.restartTimerButton');
    let restartArrow = document.querySelector('.restartArrow');
    if(currentTime_T === -350){
        restartButton.style.opacity = 0.5;

        restartButton.style.pointerEvents = 'none';

    } else {
        restartButton.style.opacity = 1;

        restartButton.style.pointerEvents = 'all';
    }
}
// Future function that changes graphics upon a change in time
function updateGraphics(){

}


function createSwitchToggle(name, object){

        let switchBackground = createHTMLChildElement(false, 'div', 'settingSwitch', null, `settingSwitch${name}`);
        let switchToggle = createHTMLChildElement(switchBackground, 'div', 'settingSwitchToggle', null, `settingSwitchToggle${name.substring(0, 4)}`);

        switchToggle.addEventListener('click', () => {


            if(!object.active){

                const containerWidth = document.querySelector('.settingSwitch').getBoundingClientRect().width;
                console.log(containerWidth, switchToggle.style.margin);
                switchToggle.style.transform = `translateX(calc(${containerWidth}px - ${switchToggle.style.margin} - ${switchToggle.style.margin} - ${switchToggle.style.width}))`;
                switchBackground.style.boxShadow = '0px 0px 15px rgba(0,230,0,0.5)';
                switchBackground.style.backgroundPositionX = '0%';
                object.func();


            } else {
            
                switchToggle.style.transform = `translateX(1%)`;
                switchBackground.style.backgroundPositionX = '100%';
                switchBackground.style.boxShadow = '0px 0px 15px rgba(230,0,0,0.5)';

            }

            object.active = !object.active

        });
        return switchBackground;
}

function createSettingSlider(name, object, range, defaultVal, stepVal){
    const shortenedName = name.substring(0,4);
    const min = range[0];
    const max = range[1];

    let sliderContainer = createHTMLChildElement(false, 'div', 'settingSliderContainer', null, `settingSliderContainer${shortenedName}`);
    let sliderLabel = createHTMLChildElement(sliderContainer, 'label', 'settingSliderLabel', null, `settingSliderLabel${shortenedName}`);
    let sliderNumInput = createHTMLChildElement(sliderContainer, 'input', 'settingSliderNumInput', null, `settingSliderNumInput${shortenedName}`);

    sliderNumInput.type = 'number';
    sliderNumInput.maxLength = toString(max).length;
    sliderNumInput.min = min;
    sliderNumInput.max = max;
    sliderNumInput.setAttribute('value', defaultVal);
    //console.log(min)
    let sliderBox = createHTMLChildElement(sliderContainer, 'div', 'settingSliderBox', null, `settingSliderBox${shortenedName}`);
    let sliderRangeMin = createHTMLChildElement(sliderBox, 'div', 'settingSliderRange', min, `settingSliderRangeMin${shortenedName}`);

    let slider = createHTMLChildElement(sliderBox, 'input', 'settingSlider', null, `settingSlider${shortenedName}`);
    //console.log(slider)
    slider.type = 'range';
    slider.step = stepVal;
    slider.min = min;
    slider.max = max;
    slider.setAttribute('value', defaultVal);

    let sliderRangeMax = createHTMLChildElement(sliderBox, 'div', 'settingSliderRange', max, `settingSliderRangeMax${shortenedName}`);

    return sliderContainer;
}

function setupSettingSlider(settingObject, func){
    
    let sliderCont = settingObject.slider;
    let slider = document.getElementById(`settingSlider${settingObject.name.substring(0,4)}`);
    let sliderNumInput = document.getElementById(`settingSliderNumInput${settingObject.name.substring(0,4)}`);
    let maxVal = settingObject.max;


    //console.log('slider value: ' + slider.value);
    sliderCont.addEventListener('mousedown', () => {turnYellow(sliderNumInput)});

    sliderCont.addEventListener('mouseup', async () => {
        
        turnWhite(sliderNumInput);

    });

    slider.addEventListener('input', () => {

        sliderNumInput.value = slider.value;
        console.log(sliderCont);
    });

    sliderNumInput.addEventListener('keydown', (target) => {
        if(target.key == 'Enter'){

            turnWhite(sliderNumInput);

            if(slider.value > maxVal){

                //console.log(valueDisplay);
                slider.value = maxVal;
                sliderNumInput.value = maxVal;

            } else {

                slider.value = sliderNumInput.value;

            }

            sliderNumInput.blur();

        }
    })


    sliderNumInput.addEventListener('input', () => {
        
            turnYellow(sliderNumInput);

            if (sliderNumInput.value.length > sliderNumInput.maxLength){

                sliderNumInput.value = sliderNumInput.value.slice(0, sliderNumInput.maxLength);

            }

    });

    function turnYellow(elem){

        elem.style.setProperty('color', `rgb(255,234, 0)`);
        elem.style.setProperty('font-size', `18px`);

    }

    function turnWhite(elem){

        elem.style.setProperty('color', `white`);
        elem.style.setProperty('font-size', `12px`);

        settingObject.func(sliderNumInput.value);

    }
}


window.addEventListener('resize', () => {resizeToggleSwitch(); resizeElements();});



function resizeToggleSwitch() {
    ifElementExists(document.querySelector('.settingSwitch'), () => {
        const containerHeight = document.querySelector('.settingSwitch').getBoundingClientRect().height;


        document.querySelectorAll('.settingSwitchToggle').forEach((elem) => {
            elem.style.height = `${containerHeight - containerHeight/5}px`;
            elem.style.width = `${containerHeight - containerHeight/5}px`;
            elem.style.margin = `${containerHeight/5}px`;
        })
    });
}

document.querySelector('.colorModeToggle').addEventListener('click', () => {
    if (!lightMode){
        turnToLightMode();
    } else {
        turnToDarkMode();
    }

    lightMode = !lightMode;
});



setInterval(() => {
    
    capsule1.atmospherpicLayer = Math.ceil(Math.random()*5);
    capsule2.atmospherpicLayer = Math.ceil(Math.random()*5);
    capsule3.atmospherpicLayer = Math.ceil(Math.random()*5);
    //console.log(capsule1.atmospherpicLayer, capsule2.atmospherpicLayer, capsule3.atmospherpicLayer);
    updateAltitudeTable(1, capsule1.atmospherpicLayer);
    updateAltitudeTable(2, capsule2.atmospherpicLayer);
    updateAltitudeTable(3, capsule3.atmospherpicLayer);

    //console.log('yuh');
    updateCapsuleGeneralStatus(Math.floor(Math.random()*3), capsule1);
}, 500);

function testSO2Bar(){
    const rgbNum = 255;
    for(let i = 0; i <= 50; i++){
        setTimeout(() => {
            let rgbDiff = Math.round(i * 2.55 * 2);
            document.getElementById('SO2BarContainer2-P0::before').style.setProperty('--c', `conic-gradient(from 270deg at 50% 100%, red 0%, rgb(${rgbNum - rgbDiff}, 0, ${rgbDiff}) ${i}%,  rgba(0, 0, 0, 0) ${i}%`);
        }, ((10 * i) + i*5));
        console.log("yo");
    } 
}

function testSO2Bar2(){
    const rgbNum = 255;
    for(let i = 0; i <= 50; i++){
        setTimeout(() => {
            let rgbDiff = Math.round(i * 2.55);
            document.documentElement.style.setProperty('--c', `conic-gradient(from 270deg at 50% 100%, red 0%, rgb(${rgbDiff}, 0, ${rgbNum - rgbDiff}) ${50 - i}%,  rgba(0, 0, 0, 0) ${50 - i}%`);
        }, (10 * i) + i*3);
        console.log("yo2");
    } 
}

// testSO2Bar();
// setTimeout(testSO2Bar2, 1500);

// setInterval(() => {
//     testSO2Bar();
//     setTimeout(testSO2Bar2, 1500);
// }, 5000);

// arguments must be passed with decimals representing percentages (i.e. 1 => 100%, 0.3 => 30%)
function magRad(initRadPercentage, maxRadPercentage, radius, steps){
    let currentRadPercentage = initRadPercentage;
    let currentRadius = radius * currentRadPercentage;
    let magNumber = document.getElementById('magNumber');
    let innerCircle = document.getElementById('innerCircle');

    resizeElements();
    //console.log(window.getComputedStyle(document.getElementById('innerCircle')).getPropertyValue('outline-width'));
    let timerId = setInterval(() => {

        let outerCircleSize = document.documentElement.style.getPropertyValue('--magnetosphereSize');

        let maxPossibleDimension = parseInt(outerCircleSize) - innerCircle.offsetWidth - 20;


        if ((currentRadPercentage >= maxRadPercentage) || !ifElementExists(document.querySelector('.MagBoxContent'), () => {return true;})){

            magNumber.textContent = (radius * maxRadPercentage).toFixed(2);
            currentRadPercentage = maxRadPercentage;
            innerCircle.style.outlineWidth = `calc(var(--magnetosphereSize) * ${currentRadPercentage * 0.36}px)`;

            clearInterval(timerId);
        } else {
            // Adds a
            currentRadPercentage += maxRadPercentage/steps;

            currentRadius = radius * currentRadPercentage;

            innerCircle.style.outlineWidth = `calc(var(--magnetosphereSize) * ${currentRadPercentage * 0.36}px)`;

            magNumber.textContent = currentRadius.toFixed(2);
        }
        console.log(maxPossibleDimension, maxPossibleDimension * currentRadPercentage);
    }, 100);
}

function changeMagnetosphereRadius(endRadius, radius){

    let magnetosphereElementExists = ifElementExists(document.querySelector('.MagBoxContent'), () => {return true;});

    if(magnetosphereElementExists){
        let magNumber = document.getElementById('magNumber');
        let innerCircle = document.getElementById('innerCircle');
        let outerCircleSize = document.documentElement.style.getPropertyValue('--magnetosphereSize');
        let maxPossibleDimension = parseInt(outerCircleSize) - innerCircle.offsetWidth - 20;

        let targetRadiusToRadiusRatio = endRadius/radius;
        innerCircle.style.outlineWidth = `calc(var(--magnetosphereSize) * ${targetRadiusToRadiusRatio * 0.36}px)`;
        magNumber.textContent = endRadius.toFixed(2);
    }

}

let magnetosphereRadius = 0;
setInterval(() => {
    if (magnetosphereRadius === 5){
        magnetosphereRadius = 0;
        changeMagnetosphereRadius(0, 5);
    } else {
        changeMagnetosphereRadius(++magnetosphereRadius, 5);
    }
}, 1000);

changeMagnetosphereRadius(3, 5);


//magRad(0, 1, 5, 10);

function returnValueBasedOnCriteria(criteria, trueVal, falseVal){
    if (criteria) {
        return trueVal;
    } else {
        return falseVal;
    }
}

function resizeElements(){
    let windowWidth = window.innerWidth;
    let title = document.querySelector('.title');
    let subtitle = document.querySelector('.subtitle');

    
    ifElementExists(document.querySelector('.MagBoxContent'), (elem) => {
        let magnetosphereContainer; 
        magnetosphereContainer = elem;
        let minimumMagnetosphereDimension = Math.min(magnetosphereContainer.clientWidth, magnetosphereContainer.clientHeight);
        document.documentElement.style.setProperty('--magnetosphereSize', minimumMagnetosphereDimension * 0.9);
    });

    let so2Box = document.querySelector('.SO2BoxContent');

    // console.log(magnetosphereContainer);

    // console.log(document.documentElement.style.getPropertyValue('--magnetosphereSize'));
    // console.log('adjusting title');
    // console.log(document.querySelector('title'))
    if (windowWidth <= 1000) {
        dashMode = 2;
        title.style.opacity = 0;
        subtitle.style.opacity = 0;
        setTimeout(() => {
            title.innerText = "";
            subtitle.innerText = "";
        }, 500);

        // graphArray.forEach((elem) => {
            
        //     if(elem.height !== 180){
        //         elem.resize(150, 180);
        //         console.log('test 1');
        //     }

        // });

        document.querySelectorAll('.SO2Section').forEach((elem, i) => {
            elem.style.flexDirection = 'column'
        });

        ifElementExists(so2Box, () => {
            so2Box.style.justifyContent = 'center';
        });

        // Gives the titles a shortened name
        document.querySelectorAll('.boxTitle').forEach((elem, i) => {
            let currentShortenedTitle = pageProperties[currentPage].titles[i].substring(0,3);
            elem.textContent = `${currentShortenedTitle}.`;
        });

        if (timerState){
            document.querySelector('.startButton').innerHTML = ` <div class="startText"></div> <img class="startButtonImg" src="../Image-Assets/StopButton.webp"> <div class="startCircle" id="startCircle"></div>`;
        } else {
            document.querySelector('.startButton').innerHTML = `<div class="startText"></div> <img class="startButtonImg" src="../Image-Assets/StartButton.webp"> <div class="startCircle" id="startCircle"></div>`;
        }

        document.querySelectorAll('.capStatText').forEach((elem, i) => {
            elem.innerHTML = `<img class="capsuleLogo" src="../Image-Assets/C${i+1}.webp">`;
        });

        document.querySelectorAll('.capAltStatText').forEach((elem, i) => {
            elem.innerHTML = `<img class="capsuleLogo" src="../Image-Assets/C${i+1}.webp">`;
        });

        document.querySelectorAll('.atmosphericLayerHeader').forEach((elem, i) => {
            elem.textContent = `${elem.textContent.substring(0, 3)}.`
            elem.style.width = '20%';
        });

        document.querySelectorAll('.temperatureMeterCapsuleLogo').forEach((elem, i) => {
            elem.style.display = 'none'
        });

        document.querySelectorAll('.pressureMeterCapsuleLogo').forEach((elem, i) => {
            elem.style.display = 'none'
        });

        document.querySelector('.logoTextContainer').style.display = 'none';

        document.querySelector('.bottomText').style.display = 'none';
        document.querySelector('.bottomInfo').style.justifyContent = 'center';

        document.querySelector('.sliderContainer').style.width = '60%';
        document.querySelector('.bottomRightSection').style.width = '37.5%';

        document.querySelector('.startButton').style.width = '35%';
        document.querySelector('.missionTimer').style.width = '35%';
        document.querySelector('.restartTimerButton').style.width = '25%';

    } else if (windowWidth <= 1200){
        dashMode = 1;
        resetSizeToDefault();
        title.innerText = "RSX '24 Dashboard";
        subtitle.innerText = "COC";

        graphArray.forEach((elem) => {
            if(elem.height !== 240){
                elem.resize(200, 240);
                console.log('test 2');
            }
        });


    } else {
        dashMode = 0;
        resetSizeToDefault();
        title.innerText = "RockSatX 2024 Dashboard";
        subtitle.innerText = "College of the Canyons";

        graphArray.forEach((elem) => {

            if(elem.height !== 300){
                elem.resize(250, 300);
                console.log('test 3');
            }

        });

    }

    function resetSizeToDefault(){
        let defaultTest = (title.innerText == "RSX '24 Dashboard")
        if(!defaultTest){
            title.style.opacity = 1;
            subtitle.style.opacity = 1;

            document.querySelectorAll('.boxTitle').forEach((elem, i) => {
                let currentTitle = pageProperties[currentPage].titles[i];
                elem.textContent = currentTitle;
            });

            document.querySelectorAll('.SO2Section').forEach((elem) => {
                elem.style.flexDirection = 'row'
            });

            if (timerState){
                document.querySelector('.startButton').innerHTML = `<div class="startText" id="startText" style="color: var(--timerNoHoverColor);">STOP MISSION</div> <div class="startCircle" id="startCircle"></div>`;
            } else {
                document.querySelector('.startButton').innerHTML = `<div class="startText" id="startText" style="color: var(--timerNoHoverColor);">START MISSION</div> <div class="startCircle" id="startCircle"></div>`;
            }

            document.querySelectorAll('.capStatText').forEach((elem, i) => {
                ifElementExists(elem, () => {
                    elem.innerHTML = `Capsule ${i+1}`;
                });
            });
    
            document.querySelectorAll('.capAltStatText').forEach((elem, i) => {
                elem.innerHTML = `Capsule ${i+1}`;
            });

            ifElementExists(so2Box, () => {
                so2Box.style.justifyContent = 'space-evenly';
            });

            // Resets the atmospheric layer titles to their full length 
            let atmosphericLayerTitlesArray = ['Exosphere', 'Thermosphere', 'Mesosphere', 'Stratosphere', 'Troposphere']
            document.querySelectorAll('.atmosphericLayerHeader').forEach((elem, i) => {
                elem.textContent = atmosphericLayerTitlesArray[i]
                elem.style.width = '40%';
            });

            document.querySelectorAll('.temperatureMeterCapsuleLogo').forEach((elem, i) => {
                elem.style.display = 'block'
            });

            document.querySelectorAll('.pressureMeterCapsuleLogo').forEach((elem, i) => {
                elem.style.display = 'block'
            });

            document.querySelector('.logoTextContainer').style.display = 'block';
            document.querySelector('.bottomText').style.display = 'block';

            document.querySelector('.bottomInfo').style.justifyContent = 'space-between';

            document.querySelector('.sliderContainer').style.width = '40%';
            document.querySelector('.bottomRightSection').style.width = 'auto';

            document.querySelector('.startButton').style.width = '65%';
            document.querySelector('.missionTimer').style.width = '20%';
            document.querySelector('.restartTimerButton').style.width = '10%';
        }
    }
}

// Grabs the text from a given document and returns the value to a variable
async function setToTextFromDocument(element, documentPath){
    let response;

    let process = await fetch(documentPath)
    .then((doc) => {return doc.text()})
    .then((txt) => {txt = txt.toString(); element.innerText = txt});
    
    return process;
}


resizeElements();