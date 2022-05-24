function handleFileSelect(evt) {
    const filename = document.querySelector('input[type="file"]');
    const filereader = new FileReader();
    filereader.readAsText(filename.files[0]);
    filereader.onload = () => {
        let dataText = filereader.result;
        let splitDataText = dataText.split('\n');
        if (splitDataText.length == 0) {
            console.log('El archivo no contiene datos');
        } else if (splitDataText.length == 1) {
            console.log('No hay datos suficientes');
        } else {
            disableInput();
            let foundStartTime;
            let foundEndTime;
            let searchDay;
            let searchStartTime;
            let searchEndTime;
            let foundDay;
            let indexOfFoundDay;
            let tableSectionInner;
            let employees = extractEmployes(splitDataText);
            let matchList = compareEmployees(splitDataText, employees);
        };
        filereader.onerror = () => {
            console.log("Error: ", filereader.error);
        };
    }
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);

function splitData(dataText) {
    let name;
    let schedule;
    if (dataText.includes('=')) {
        dataText = dataText.replace("\r", "");
        equalPosition = dataText.indexOf('=');
        name = dataText.slice(0, equalPosition);
        schedule = dataText.slice(equalPosition + 1, dataText.length).split(',');
    }
    let day = schedule.map(function(x) {
        return x.slice(0, 2);
    });
    let startTime = schedule.map(function(x) {
        return parseInt(x.slice(2, 5)) * 60 + parseInt(x.slice(5, 7));
    });
    let endTime = schedule.map(function(x) {
        return parseInt(x.slice(8, 11)) * 60 + parseInt(x.slice(11, 13));
    });
    let employee = { name, schedule, day, startTime, endTime };
    return employee;
}

function createRowItem(content) {
    let div = document.createElement('div');
    div.textContent = content;
    return div;
}

function disableInput() {
    let fileInput = document.querySelector("#files");
    fileInput.disabled = true;
}

function extractEmployes(splitDataText) {
    let employees = new Array;
    for (let i = 0; i < splitDataText.length; i++) {
        employees[i] = splitData(splitDataText[i]); //Extraigo Los datos Organizados
    }
    return employees;
}

function compareEmployees(splitDataText, employees) {
    let matchList = new Object;
    let k;
    let countRow = 0;

    for (let i = 0; i < splitDataText.length - 1; i++) {
        for (let h = i + 1; h < splitDataText.length; h++) {

            matchList.match = 0;
            for (let j = 0; j < employees[i].schedule.length; j++) {
                searchDay = employees[i].day[j];
                searchStartTime = employees[i].startTime[j];
                searchEndTime = employees[i].endTime[j];
                foundDay = employees[h].day.find(element => element == searchDay); //Busco en el Segundo Elemento los del 1ero
                indexOfFoundDay = employees[h].day.indexOf(foundDay);
                if (foundDay != undefined) {
                    foundStartTime = employees[h].startTime[indexOfFoundDay]
                    foundEndTime = employees[h].endTime[indexOfFoundDay]
                    if (searchStartTime <= foundEndTime && searchStartTime >= foundStartTime) {
                        matchList.employee1 = employees[i].name;
                        matchList.employee2 = employees[h].name;
                        matchList.match = matchList.match + 1;
                    }
                }
            }
            if (matchList.match != 0) {
                countRow++;
                printRow(countRow, matchList);
            }
        }
    }
    return matchList;
}

function printRow(countRow, matchList) {
    tableSectionInner = document.querySelector("#tableSection>div:nth-child(" + countRow + ")");
    rowTable = '<div id="rowTable' + countRow + '" class="rowTable">' +
        '<div class="employee1">' + matchList.employee1 + '</div>' +
        '<div class="employee2">' + matchList.employee2 + '</div>' +
        '<div class="employee2">' + matchList.match + '</div></div>';
    tableSectionInner.insertAdjacentHTML("afterend", rowTable);
    matchList.match = 0;
}