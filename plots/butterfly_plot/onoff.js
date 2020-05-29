const fs = require('fs');
const features = ["accent", "marcato", "sforzando", "tenuto", "staccato", "trill", "mordent", "turn", "sslur", "eslur"];
var notesMapA = new Map(); // [tstart : isNote] a map is used whether there is already a note for that tick position (groupA)
var notesMapB = new Map();
var allKeys = 0; // variable to hold number of all keys; will be used to check if all of the rows were copied correctly

function tsvJSON(tsv){
    var lines=tsv.split("\n");
    var result = [];
    var headers=lines[0].split("\t");
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split("\t");
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

function jsonToTSV(data) {
    data = JSON.parse(data);
    // const replacer = (key, value) => value == null ? '' : value;
    const header = Object.keys(data[0]);
    let tsv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join('\t'));
    tsv.unshift(header.join('\t'))
    tsv = tsv.join('\r\n')
    return tsv;
}

// fill in between lines for spacing purposes
function fill(data) {
    data = JSON.parse(data);
    for (let c = 0; c < data.length - 1; c++) {
        let curr = data[c];
        let next = data[c+1];
        if ((next['tstart'] - curr['tstart']) > 1) {
            let copy = Object.assign({}, curr);
            for (var key of Object.keys(copy)) {
                copy[key] = '0';
            }
            currentIndex = c;
            for (let i = parseInt(curr['tstart']) + 1; i < parseInt(next['tstart']); i++) {
                data.splice(currentIndex + 1, 0, {});
                copy['tstart'] = i.toString();
                Object.assign(data[currentIndex+1], copy);
                currentIndex+=1;
            }
            c += parseInt(next['tstart']) - parseInt(curr['tstart']) - 1;
        }
    }
    return JSON.stringify(data);
}

function addNoteColumn(data) {
    data = JSON.parse(data);
    data.forEach(element => {
        element['note'] = '0';
    });
    allKeys = Object.keys(data[0]).length;
    return JSON.stringify(data);
}

// checks rows with no featuers and assigns them as notes
function addNotes(data) {
    data = JSON.parse(data);
    data.forEach(element => {
        if (isNote(element)) {
            element['note'] = "1";
            if (element['group'] === "1") {
                notesMapA[element['tstart']] = 1;
            }
            else {
                notesMapB[element['tstart']] = 1;
            }
        }
    })
    return JSON.stringify(data)
}

// adds a note for every feature
function countNotes(data) {
    data = JSON.parse(data);
    // data.forEach(element => {
    //     if (!isNote(element)) {
    //         let copy = Object.assign({}, element);
    //         for (var key of Object.keys(copy)) {
    //             copy[key] = '0';
    //         }
    //         copy['note'] = "1"; copy['tstart'] = element['tstart']; copy['group'] = element['group'];
    //         data.splice(data.indexOf(element) + 1, 0, {});
    //         Object.assign(data[data.indexOf(element) + 1], copy);
    //     }
    // });
    for (let i = 0; i < data.length; i++) {
        let element = data[i];
        if (!isNote(element)) {
            let copy = Object.assign({}, element);
            for (var key of Object.keys(copy)) {
                copy[key] = '0';
            }
            copy['note'] = "1"; copy['tstart'] = element['tstart']; copy['group'] = element['group'];
            data.splice(i + 1, 0, {});
            Object.assign(data[i + 1], copy);
            i+=1;
        }
    }
    return JSON.stringify(data);
}

function onoffNotes(data) {
    data = JSON.parse(data);
    // data.forEach(element => {
    //     if (!isNote(element) && notesMap[element['tstart']] !== 1) {
    //         let copy = Object.assign({}, element);
    //         for (var key of Object.keys(copy)) {
    //             copy[key] = '0';
    //         }
    //         copy['note'] = "1"; copy['tstart'] = element['tstart']; copy['group'] = element['group'];
    //         data.splice(data.indexOf(element) + 1, 0, {});
    //         Object.assign(data[data.indexOf(element) + 1], copy);
    //         notesMap[element['tstart']] = 1;
    //     }
    // });
    for (let i = 0; i < data.length; i++) {
        let element = data[i];
        let visited = false;
        if (element['group'] === '1' && notesMapA[element['tstart']] === 1) {
            visited = true;
        } else if (element['group' === 0] && notesMapB[element['tstart'] === 1]) {
            visited = true;
        }
        if (!isNote(element) && !visited) {
            let copy = Object.assign({}, element);
            for (var key of Object.keys(copy)) {
                copy[key] = '0';
            }
            copy['note'] = "1"; copy['tstart'] = element['tstart']; copy['group'] = element['group'];
            data.splice(i + 1, 0, {});
            Object.assign(data[i + 1], copy);
            notesMapA[element['tstart']] = 1;
            i++;
        }
    }
    let element = data[data.length-1];
    return JSON.stringify(data);
}

// takes in a single json element (a single row of tsv) and check if it is a note or not (boolean return)
function isNote(element) {
    let note = true;
    features.forEach(feature => {
        if (element[feature] === "1") {
            note = false;
        }
    });
    return note;
}

//checks if rows were copied correctly
function checkRows(data) {
    data = JSON.parse(data);
    for (let i = 0; i < data.length; i++) {
        if (Object.keys(data[i]).length !== allKeys) {
            data.splice(i, 1);
        }
    }
    return JSON.stringify(data);
}


function sumAll(data, field) {
    let total = 0;
    data = JSON.parse(data);
    data.forEach(element => {
        if (element[field]) {
            total += parseInt(element[field]);
        }
    });
    return total;
}


const inputFolder = './input';
const outputFolder = './output';
let files = []
fs.readdirSync(inputFolder).forEach(file => {
    // files.push(inputFolder + "/" + file);
    fs.readFile(inputFolder + '/' + file, (err, data) => {
        let fileNumber = file.split(".")[0];
        if (err) throw err;
        let featuresToInclude = ["Note"]; // holds list of features that should be in the legend
        let countData = tsvJSON(data.toString()); // convert tsv to json
        countData = addNoteColumn(countData); // add a note column
        countData = addNotes(countData); // for every row that has no features, count it as a note
        let onoffData = onoffNotes(countData);
        countData = countNotes(countData);
        countData = fill(countData);
        onoffData = fill(onoffData);
        countData = checkRows(countData);
        onoffData = checkRows(onoffData);
        features.forEach(element => {
            if (sumAll(countData, element) > 0) {
                featuresToInclude.push(element);
            }
        });
        fs.writeFile(outputFolder + '/' + fileNumber + 'count' + '.tsv', jsonToTSV(countData), (err) => {
            if (err) throw err;
        });
        fs.writeFile(outputFolder + '/' + fileNumber + 'onoff' + '.tsv', jsonToTSV(onoffData), (err) => {
            if (err) throw err;
        });
    });
});

files.forEach(file => {
    
});

