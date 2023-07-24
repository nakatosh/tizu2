var aaa  = "";
var bbb  = "";
var db;
var filename = "download.csv";

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
            db = event.target.result;
        }
        } else {
        window.alert("このブラウザではIndexed DataBase API は使えません。");
        }



//全データ表示
function getAll(event) { 
    return new Promise(function(resolve) {

    result.innerHTML = "";
    bbb  = "";          
    var transaction = db.transaction(["mystore"], "readwrite");
    var store = transaction.objectStore("mystore");
    var request = store.openCursor();

    request.onsuccess = function (event) {

        if(event.target.result == null) {
        //データが無いもしくは終わった
        if (bbb== "") {
         result.innerHTML="測定値が入力されたデータはありません";
            } else {       
             result.innerHTML=bbb;
            }
            resolve(bbb)   
        
        }
        var cursor = event.target.result;
        var data = cursor.value;
        
        //測定値が入っているものだけ表示
        if(data.myvalue >0) {
         bbb += cursor.key.slice(0,6) + "-" + cursor.key.slice(6,12) + "," + data.myLAT + "," + data.myLNG +  "," + data.myvalue +  "," + data.myBSY + "," + data.mytuti + "," + data.mybiko+ "," + data.myetc + "," + data.myGLAT + "," + data.myGLNG + "," + data.mynow + "," + data.myIV + "," + data.myBRK + "," + data.myTIK2 + "," + data.myTIK3 + "," + data.mySUTE + "\n";
        }
     cursor.continue();
    }

    })
}    

    //数える
    var kans;
    var zens;
    function getCount(event) {
    return new Promise(function(resolve) {
        //var result = document.getElementById("result");
        result.innerHTML = "";
        bbb  = "";
        kans = 0 ;
        zens = 0 ;
        var transaction = db.transaction(["mystore"], "readwrite");
        var store = transaction.objectStore("mystore");
        var request = store.openCursor();
        request.onsuccess = function (event) {
            if(event.target.result == null) {
            result.innerHTML= "完了:" +  kans + "件  未完了:" + zens + "件" ;
            return;
            }
            var cursor = event.target.result;
            var data = cursor.value;
            //測定値が入っているものだけ表示
            if(data.myvalue >0)
            {
            kans = kans + 1;
            } else {
            zens = zens + 1;
            }
        cursor.continue();
        }

    })

} 


    //全データ削除 
    function deleteAll() {
        return new Promise(function(resolve) {
        var result = document.getElementById("result");
        var transaction = db.transaction(["mystore"], "readwrite");
        var store = transaction.objectStore("mystore");
        var request = store.clear(); 
        request.onsuccess = function () {}
        result.innerHTML = "全データ削除しました。";
    })
	}
 
	


// データ削除
async function deleteAll3(){
    
    result.innerHTML = "";
    if(window.confirm('データの削除を開始してよろしいですか？')){
        let promise = new Promise(function(resolve, reject) {
            resolve('ok');
            reject('Error...');
          });
        await getAll();
        filename = "削除前bk.csv";
        await downloadCSV(bbb);
        await deleteAll();
        result.innerHTML = "データ削除しました。";
        //resolve();
    }else{
        // 「キャンセル」時の処理開始
        result.innerHTML = "削除はキャンセルしました。";
        //resolve();
    }
}


// CSV出力
function downloadCSV(bbb) {
    return new Promise(function(resolve) {
    //ダウンロードするCSVファイル名を指定する

    //CSVデータ
    var data =  "電柱NO,緯度,経度,接地測定値,B種,舗装,メモ,メモ2,測定緯度,測定経度,測定日時,IV,ボルコン,蓄力２号,蓄力３号,ステバン" + "\n" + bbb
    //BOMを付与する（Excelでの文字化け対策）
    var bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    //Blobでデータを作成する
    var blob = new Blob([bom, data], { type: "text/csv" });
    //IE10/11用(download属性が機能しないためmsSaveBlobを使用）

  if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filename);
        //その他ブラウザ
        resolve();
        } else {
        //BlobからオブジェクトURLを作成する
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
     //ダウンロード用にリンクを作成する
        var download = document.createElement("a");
        //リンク先に上記で生成したURLを指定する
      download.href = url;
        //download属性にファイル名を指定する
        download.download = filename;
        //作成したリンクをクリックしてダウンロードを実行する
      download.click();
        //createObjectURLで作成したオブジェクトURLを開放する
       (window.URL || window.webkitURL).revokeObjectURL(url);
       resolve();
    }
    
    })
} 

//登録  NO 緯度 経度,数値,数値２,土,備考,備考２
       //key,myLAT.myLNG.myvalu.myBSY.mytuti.mybiko.myetc.myGLAT.myGLNG.mynow.myIV.myBRK.myTIK2.myTIK3

function setValue(key,LAT,LNG,value,BSY,tuti,biko,etc,GLAT,GLNG,NOWW,IV,BK,TK2,TK3,SUTE) {
  //チェック
  if (key >0){} else {return;}
  var transaction = db.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore")
  var request = store.put({ mykey: key, myLAT: LAT,myLNG: LNG,myvalue: value,myBSY: BSY, mytuti: tuti, mybiko: biko, myetc: etc ,myGLAT:GLAT,myGLNG:GLNG,mynow:NOWW,myIV:IV,myBRK:BK,myTIK2:TK2,myTIK3:TK3,mySUTE:SUTE});
   request.onsuccess = function (event) {
   }
}

// テキストインポート
async function txtinp0(){
    filename = "インポート前bk.csv";

    if(window.confirm('！！注意！！測定完了データが既に存在します。キー番号が同じだと上書きされてしまいます。テキスト取込を続行しますか？')){
        let promise = new Promise(function(resolve, reject) {
            resolve('ok');
            reject('Error...');
          });
        //await getCount();
        await getAll();
        await downloadCSV(bbb);
        await txtinp();
        result.innerHTML = "CSVを取込しました。";
        //resolve();
    }else{
        // 「キャンセル」時の処理開始
        result.innerHTML = "CSV取込はキャンセルしました。";
        //resolve();
    }
}

    //テキストデータ取込
    function txtinp() {
    var CR = String.fromCharCode(13);
    var LF = String.fromCharCode(10);
    var col = document.getElementById("ttt").value;
    //var col = result.innerHTML
    var cols = col.split(LF);
                var data = [];
                for (var i = 0; i < cols.length; i++) {
                    var data = cols[i].split(',');          
                    setValue(data[0].replace(/-/g, ''),data[1],data[2],uc(data[3]),uc(data[4]),uc(data[5]),uc(data[6]),uc(data[7]),uc(data[8]),uc(data[9]),uc(data[10]),uc(data[11]),uc(data[12]),uc(data[13]),uc(data[14]),uc(data[15]));
                }
    result.innerHTML = '入力したデータを取り込みました'; 
    }

    //csvインポート
    // File APIに対応しているか確認
    if(window.File && window.FileReader && window.FileList && window.Blob) {
        function loadLocalCsv(e) {
            // ファイル情報を取得
            var fileData = e.target.files[0];
                // CSVファイル以外は処理を止める
            if(!fileData.name.match('.csv$')) {
                alert('CSVファイルを選択してください');
                return;
            }


            // FileReaderオブジェクトを使ってファイル読み込み
            var reader = new FileReader();
            // ファイル読み込みに成功したときの処理
            reader.onload = function() {
                var cols = reader.result.split('\n');
                var data = [];
                        for (var i = 0; i < cols.length; i++) {
                var data = cols[i].split(',');
                            //電柱NO,緯度,経度,接地測定値,B種,舗装,メモ,メモ2,測定緯度,測定経度,測定日時,IV,ボルコン,蓄力２号,蓄力３号  
                    setValue(data[0].replace(/-/g, ''),data[1],data[2],uc(data[3]),uc(data[4]),uc(data[5]),uc(data[6]),uc(data[7]),uc(data[8]),uc(data[9]),uc(data[10]),uc(data[11]),uc(data[12]),uc(data[13]),uc(data[14]),uc(data[15]));

                }
        file.value = '';
        result.innerHTML = 'CSVを取り込みました'; 
            getCount();	
            var insert = createTable(data);
            result.appendChild(insert);
            }
            // ファイル読み込みを実行
            reader.readAsText(fileData);
            
        }
        file.addEventListener('change', loadLocalCsv, false);
    } else {
        file.style.display = 'none';
        result.innerHTML = 'File APIに対応したブラウザでご確認ください';
}

function uc (aaa) {
    if (aaa === undefined)
         {return null;}
    else
         {return aaa;}
}

// CSV出力
async function dCSV(){
    await getAll();
    filename = "download.csv";
    await downloadCSV(bbb);
}
