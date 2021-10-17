//現在時刻
function ima() {
const D = new Date();
const year = D.getFullYear();
const month = D.getMonth() + 1;
const date = D.getDate();
const hour = D.getHours();
const minute = D.getMinutes();
const second = D.getSeconds();
return year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
}


  
//閉じる
function toji() {
 window.close();
}

//グーグルマップを開く
function gmap() {
if (document.getElementById("POLNO").value>0){} else {alert('マーカーを選択してから押すと、グーグルマップで現在地からの経路が表示されます。');return;}
var glat = document.getElementById("LAT").value;
  var glng = document.getElementById("LNG").value;

window.open("https://www.google.com/maps?q=" + glat + "," + glng);
}




