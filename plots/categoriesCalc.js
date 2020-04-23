const fs = require('fs');
const features = ["accent", "marcato", "sforzando", "tenuto", "staccato", "trill", "mordent", "turn", "sslur", "eslur"];

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


fs.readFile("R129.tsv", (err, data) => {
    if (err) throw err;
    // console.log(sumAll(tsvJSON(data.toString()), "accent"));
    featuresToInclude = ["Note"];
    jsonData = tsvJSON(data.toString());
    features.forEach(element => {
        if (sumAll(jsonData, element) > 0) {
            featuresToInclude.push(element);
        }
    });
    console.log(featuresToInclude);
});