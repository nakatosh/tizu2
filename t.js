

//グーグルマップを開く
function gmap() {
if (document.getElementById("POLNO").value>0){} else {alert('マーカーを選択してから押すと、グーグルマップで現在地からの経路が表示されます。');return;}
var glat = document.getElementById("LAT").value;
  var glng = document.getElementById("LNG").value;

window.open("https://www.google.com/maps?q=" + glat + "," + glng);
}

var db;
   var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
      if (indexedDB) {
      // データベースを削除したい場合はコメントを外します。
      //indexedDB.deleteDatabase("mydb");
      var openRequest = indexedDB.open("mydb", 1.0);
       openRequest.onupgradeneeded = function(event) {
// データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
        db = event.target.result;
           var store = db.createObjectStore("mystore", { keyPath: "mykey"});
              store.createIndex("myvalueIndex", "myvalue");

      }
          openRequest.onsuccess = function(event) {


//マーカークリックイベント
         db = event.target.result;
        }
      } else {
        window.alert("このブラウザではIndexed DataBase API は使えません。");
              }

function markerClick(e){ 
  ck();
  //マーカーから値をもらう
  POLNO.value = e.sourceTarget.options.customID;            
  LAT.value = e.latlng.lat;
  LNG.value = e.latlng.lng;
  ima();
  map.setView([e.latlng.lat, e.latlng.lng]);

  //現在地取得
　GPS(); 
  //接地抵抗クリア 
  setti1.value = "";
  //接地抵抗に移動
  document.getElementById('setti1').focus()
  //DBから値をもらう
  getValue(event); 

}

// 接地抵抗が入力済みなら取得する
 function getValue(event) {
  var key = document.getElementById("POLNO").value;
  var result = document.getElementById("result");             
  var transaction = db.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore");                  
  var request = store.get(key);

  request.onsuccess = function (event) {  

    if (event.target.result === undefined) {} else {
      //値あり
      var aaa = Number(event.target.result.myvalue)
      //0だったらヌル数字だったら数字
      if(aaa===0){setti1.value ="";} else {
      setti1.value = aaa;
      biko.value = event.target.result.mybiko
     

      }
    }
  }
}

//登録  
function setValue(event) {
  var key = document.getElementById("POLNO").value;
  var value = Number(document.getElementById("setti1").value);
  var LAT = Number(document.getElementById("LAT").value);
  var LNG = Number(document.getElementById("LNG").value);

  var GLAT = Number(document.getElementById("GLAT").value);
  var GLNG = Number(document.getElementById("GLNG").value);

  var now = document.getElementById("noww").value;
  var etc = Number(document.getElementById("etc").value);

  //チェック
  if (key >0){} else {alert('マーカーをクリックしてから登録してください!!');return;}
  if (value >0){} else {alert('接地抵抗が未入力です');document.getElementById('setti1').focus();return;}
  // form要素を取得
  var element = document.getElementById( "tutibox" ) ;
  // form要素内のラジオボタングループ(name="tuti")を取得
  var radioNodeList = element.tuti ;
  // 選択状態の値(value)を取得 (Bが選択状態なら"b"が返る)
  var tuti = radioNodeList.value ;
  var biko = document.getElementById("biko").value;
  //                  
  var transaction = db.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore")
  var request = store.put({ mykey: key, myvalue: value, myLAT: LAT, myLNG: LNG, mytuti: tuti, mybiko: biko, myGLAT: GLAT, myGLNG: GLNG, mynow: now , myetc:etc});
  
  //入力欄リセット
	document.getElementById("POLNO").value = "";
	document.getElementById("setti1").value = "";
	document.getElementById("biko").value = "";
	//document.getElementById("tuti").value = "";
	document.getElementById("etc").value = 0;
  //再マーク
   MAKall();
  ck0();
  currentWatchReset();
   request.onsuccess = function (event) {

   }
}

// LDBからマーカ
function MAKall(event) {
return new Promise(function(resolve) {
  var result = document.getElementById("result");                   
  var transaction = db.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore");
  var request = store.openCursor();

  //マーカーレイヤー削除
  MI.clearLayers();
  KAN.clearLayers();

  request.onsuccess = function (event) {
    //リストがなかったら終了  
    if(event.target.result == null) {
    resolve()   
    return;
     }
    var cursor = event.target.result;
    var data = cursor.value;
  
    //値が入ってたら完了（グレー）、未入力ピンク
    if(data.myvalue>0){
    //L.marker([data.myLAT, data.myLNG],{icon:myIcon2,customID: data.mykey}).addTo(KAN).on('click', function(e) { markerClick(e);});
    KAN.addLayer(
      L.marker([data.myLAT, data.myLNG],{icon:myIcon2,customID: data.mykey})
     .bindPopup(data.mykey)
      .on('click', function(e) { markerClick(e);})
    );
    } else {
      MI.addLayer(
      L.marker([data.myLAT, data.myLNG],{icon:myIcon1,customID: data.mykey})
      .bindPopup(data.mykey)
      .on('click', function(e) { markerClick(e);})
      );
    }
    cursor.continue();
      }
      })
}



//マーカーが全部入るイメージ
function zenb(){
map.fitBounds(MI.getBounds());   
};



function ck(){
let element = document.getElementById('pop-up');
element.checked = true;
}
function ck0(){
let element = document.getElementById('pop-up');
element.checked = false;
}

//現在地
function GPS() {
	function success(pos) {
		GLAT.value = pos.coords.latitude;
		GLNG.value = pos.coords.longitude;

	}
  function error(err) {
		alert('位置情報を取得できませんでした。');
		GLAT.value = 0;
		GLNG.value = 0;
	}
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	  if (watch_id == 0) {
		watch_id = navigator.geolocation.watchPosition(success, error, options); // 現在地情報を定期的に
  	}
}

//現在地
function currentWatch() {
	function success(pos) {
		var lat = pos.coords.latitude;
		var lng = pos.coords.longitude;
		map.setView([ lat,lng ]);
		// 現在地に表示するマーカー
		if (curMarker) {
			map.removeLayer(curMarker);
		}
		curMarker = L.marker([lat, lng],{icon:myIcon3}).addTo(map);
	}
	function error(err) {
		alert('位置情報を取得できませんでした。');
	}
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	if (watch_id == 0) {
		watch_id = navigator.geolocation.watchPosition(success, error, options); // 現在地情報を定期的に
	}
}

function currentWatchReset() {
	if (watch_id > 0) {
		navigator.geolocation.clearWatch(watch_id);
		watch_id = 0;
	}
	if (curMarker) {
		map.removeLayer(curMarker);
		curMarker = null;
	}
}


//待つタイプ
async function mikan(){
await MAKall();
await map.fitBounds(MI.getBounds());   
};
async function kanryo(){
await MAKall();
await map.fitBounds(KAN.getBounds());   
};
	
//現在時刻
function ima() {
  const D = new Date();
  const year = D.getFullYear();
  const month = D.getMonth() + 1;
  const date = D.getDate();
  const hour = D.getHours();
  const minute = D.getMinutes();
  const second = D.getSeconds();
  noww.value =  year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
}




