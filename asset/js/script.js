function updateWords(){
  for(var i=0; i<10; i++){
    $("#word-container" + String(i+1) + ">.word-question").text("こんにちは。");
    $("#word-container" + String(i+1) + ">.word-answer").text("こんにちは。");
  }
}

updateWords();