
var timeTable = document.getElementsByClassName("time");

var thElements = timeTable[0].getElementsByTagName("th");

var tdElements = timeTable[0].getElementsByTagName("td"); 
//要素がたとえ1つでもtimeTable[0]と指定しないとElementじゃないのでgetElementsByTagName()は呼び出せない


//駅名取得(ローマ字)
var stationName;
if(stationName = document.getElementsByClassName("fs12 mr17 arrow_link")[0]){
    stationName = stationName.href;
    stationName = stationName.substring(stationName.indexOf("station") + 8,stationName.indexOf(".html"));
}else stationName = "default";


var stationInfo = document.getElementsByTagName("title")[0].innerText;

//駅名取得（漢字）
stationNameJa = stationInfo.substring(0,stationInfo.indexOf("駅"));

//方面取得（漢字）
boundFor = stationInfo.substring(stationInfo.indexOf("時刻表") + 4, stationInfo.indexOf("方面") + 2);


//ダイヤ情報取得
var dayOfTheWeek;
if(document.getElementsByClassName("even_weekday")[0]){
    dayOfTheWeek = "weekday"; //平日ダイヤ
}else dayOfTheWeek = "holiday"; //休日ダイヤ


var allJson = {};
allJson.stationName = stationName;
allJson.stationNameJa = stationNameJa;
allJson.timeTableType = dayOfTheWeek;
allJson.boundFor = boundFor;

var timeTableArray = [];
for(var i = 0; i < thElements.length; i++ ){
    var hour = thElements[i].innerText;
    timeTableArray.push({"hour": hour});

    var minuteAndTrain = [];

    var minuteElements = tdElements[i].getElementsByClassName("num");
    var trainElements = tdElements[i].getElementsByTagName("a");

    for(var i2 = 0; i2 < minuteElements.length; i2++){
        var minute = minuteElements[i2].innerText;
        var train = trainElements[i2].innerText.substring(trainElements[i2].innerText.indexOf("["));

        var content = {};
        content.minute = minute;
        content.train = train;
        if(tdElements[i].getElementsByTagName("li")[i2].getElementsByClassName("num uline")[0]) content.runFromThisStation = "当駅始発";
        
        minuteAndTrain.push(content);
       // minuteAndTrain.push({"minute": minute, "train": train});
    }

    timeTableArray[i].minuteAndTrain = minuteAndTrain;
}

allJson.timeTable = timeTableArray;



//阪急時刻表ページに挿入するスクリプト
var insertScript = document.createElement('script');
var scriptContent = 'function myHandleDownload() { var content = JSON.stringify(allJson); var blob = new Blob([ content ], { "type" : "text/plain" }); if (window.navigator.msSav6eBlob) { window.navigator.msSaveBlob(blob, "test.txt");         window.navigator.msSaveOrOpenBlob(blob, "test.txt"); } else { document.getElementById("download").href = window.URL.createObjectURL(blob);} }';
insertScript.innerHTML = scriptContent;
document.body.appendChild(insertScript);


const title = stationName + "_" + dayOfTheWeek + ".json";


//時刻表ページに挿入するダウンロードリンク
//なぜか2回クリックしないとダウンロード出来ない
var myAnchor = document.createElement("a");
myAnchor.href = "javascript:myHandleDownload()"; //#では動作しなかった
myAnchor.id = "download";
myAnchor.download= title;
//myAnchor.onclick="myHandleDownload()";
myAnchor.innerHTML = "時刻表ダウンロード";

document.body.appendChild(myAnchor);

