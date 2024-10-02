// スケジュールをCSVファイルから取得
// ファイルはすべてindex.htmlからの相対パスを指定（script_gym.jsからではない）
const CSVurl = './asset/csv/data.csv';

// promiseを使用して完了まで待機するシステムにした
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(`Failed to fetch CSV: ${xhr.status}`);
        }
      }
    };
    xhr.open('GET', url);
    xhr.send();
  });
}

// 読み込んだCSVファイルを二次元配列に組みなおす
function parseCSV(csvText) {
  const lines = csvText.split(/\r\n|\n/);
  const data = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length > 0) {
      data.push(currentLine);
    }
  }

  return data;
}

// ========================================

var dataset;
var order;
var swapFlag = true;
var modeChangeFlag = true;

var n=0;

// ========================================

function init() {
  // promiseを使用してすべての読み込みが完了するまで待機させる
  Promise.all([
    fetchCSV(CSVurl)
  ]).then(([csvText]) => {

    // 二次元配列に変換してグローバル変数に格納
    dataset = parseCSV(csvText);

    main();

  }).catch(error => console.error(error));
}

function main(){
  if(modeChangeFlag){
    if(swapFlag){
      swapAll();
    }
    else{
      orderAll();
    }
    modeChangeFlag = false;
  }

  for(var i=n ; i<n+10; i++){
    if(i >= order.length){
      $("#word-container" + String(i-n+1) + " .word").html("");
      $("#word-container" + String(i-n+1) + " .num").html("");
      $("#word-container" + String(i-n+1) + " .answer>p").html("");
      $("#word-container" + String(i-n+1)).addClass("noData");
      continue;
    }
    else{
      $("#word-container" + String(i-n+1)).removeClass("noData");
    }
    
    $("#word-container" + String(i-n+1)).removeClass("active");

    $("#word-container" + String(i-n+1) + " .word").html(dataset[order[i]][1]);
    $("#word-container" + String(i-n+1) + " .num").html(dataset[order[i]][0]);
    var textContent;
    textContent = "- " + dataset[order[i]][3];
    if(dataset[order[i]][4] != ""){
      textContent += "<br>";
      textContent += "- " + dataset[order[i]][4];
    }
    if(dataset[order[i]][5] != ""){
      textContent += "<br>";
      textContent += "- " + dataset[order[i]][5];
    }
    if(dataset[order[i]][6] != ""){
      textContent += "<br>";
      textContent += "- " + dataset[order[i]][6];
    }
    $("#word-container" + String(i-n+1) + " .answer>p").html(textContent);
  }

  // setInterval(() => {
  //   for(var i=n ; i<n+10; i++){
  //     console.log(i);
  //     $("#word-container" + String(i-n+1) + " .word").html(dataset[order[i]][1]);
  //     $("#word-container" + String(i-n+1) + " .num").html(dataset[order[i]][0]);
  //     var textContent;
  //     textContent = "- " + dataset[order[i]][3];
  //     if(dataset[order[i]][4] != ""){
  //       textContent += "<br>";
  //       textContent += "- " + dataset[order[i]][4];
  //     }
  //     if(dataset[order[i]][5] != ""){
  //       textContent += "<br>";
  //       textContent += "- " + dataset[order[i]][5];
  //     }
  //     if(dataset[order[i]][6] != ""){
  //       textContent += "<br>";
  //       textContent += "- " + dataset[order[i]][6];
  //     }
  //     $("#word-container" + String(i-n+1) + " .answer>p").html(textContent);
  //   }
  //   n += 10;
  // }, 1000);
}

// ========================================

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function swapAll(){
  order = [];

  for(var i=0; i<dataset.length-1 - 1; i++){
    order.push(i+1);
  }

  for(var i=0; i<(dataset.length-1 - 1)*2; i++){
    var a = getRandomInt(dataset.length-1 - 1);
    var b = getRandomInt(dataset.length-1 - 1);
    var tmp;

    tmp = order[a]
    order[a] = order[b];
    order[b] = tmp;
  }
}

function orderAll(){
  order = [];

  for(var i=0; i<dataset.length-1 - 1; i++){
    order.push(i+1);
  }
}

// ========================================

$(document).ready(function(){
  init();
});

$(".word-container").click(function(){
  $(this).toggleClass("active");
});

$("#swap-or-order").click(function(){
  modeChangeFlag = true;
  swapFlag = !swapFlag;
  if(swapFlag){
    $(this).html("順番にする");
  }
  else{
    $(this).html("ランダム");
  }
  n=0;
  main();
});

$("#prev").click(function(){
  n = n >= 10 ? n-10 : n;
  main();
});

$("#next").click(function(){
  n = n <= dataset.length-20 ? n+10 : n;
  main();
});