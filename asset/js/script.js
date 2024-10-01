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

// ========================================

function main() {
  // promiseを使用してすべての読み込みが完了するまで待機させる
  Promise.all([
    fetchCSV(CSVurl)
  ]).then(([csvText]) => {

    // 二次元配列に変換してグローバル変数に格納
    dataset = parseCSV(csvText);

    swap();

    for(var i=0 ; i<10; i++){
      $("#word-container" + String(i+1) + ">.word").html(dataset[order[i]][1]);
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
      $("#word-container" + String(i+1) + ">.answer>p").html(textContent);
    }
  }).catch(error => console.error(error));
}

// ========================================

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function swap(){
  order = [];

  for(var i=0; i<dataset.length-1 - 1; i++){
    order.push(i+1);
  }

  console.log(order);

  for(var i=0; i<(dataset.length-1 - 1)*2; i++){
    var a = getRandomInt(dataset.length-1 - 1);
    var b = getRandomInt(dataset.length-1 - 1);
    var tmp;

    tmp = order[a]
    order[a] = order[b];
    order[b] = tmp;
  }

  console.log(order);
}

// ========================================

$(document).ready(function(){
  main();
});

$(".word-container").click(function(){
  $(this).toggleClass("active");
});