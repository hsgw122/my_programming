
function click_button(btn){
  /*
  random_N = Math.floor( Math.random() * list_length);
  choice_matrix = matrix_list[random_N]

  var text = String(choice_matrix[0]) + "," + String(choice_matrix[1]);
  document.getElementById("CC").innerText = text;
  text = String(choice_matrix[2]) + "," + String(choice_matrix[3]);
  document.getElementById("CD").innerText = text;
  text = String(choice_matrix[4]) + "," + String(choice_matrix[5]);
  document.getElementById("DC").innerText = text;
  text = String(choice_matrix[6]) + "," + String(choice_matrix[7]);
  document.getElementById("DD").innerText = text;
  //document.getElementById("test").innerText = "4,2";
*/

  //var table = document.getElementById('table_RPE');

  //var rows = table.rows.length;
  if(round < list_length){
    choice_matrix = matrix_list[round]

    /*
    var cell = table.rows[0].insertCell(-1);
    cell.innerHTML = round;
  
    var cell = table.rows[1].insertCell(-1);
    cell.innerHTML = btn;
  
    var cell = table.rows[2].insertCell(-1);
    cell.innerHTML = String(Math.floor( Math.random() * 4));
    */

    round += 1;

    var text = String(choice_matrix[0]);
    document.getElementById("CC_self").innerText = text;
    text = String(choice_matrix[1]);
    document.getElementById("CC_other").innerText = text;
    text = String(choice_matrix[2]);
    document.getElementById("CD_self").innerText = text;
    text = String(choice_matrix[3]);
    document.getElementById("CD_other").innerText = text;
    text = String(choice_matrix[4]);
    document.getElementById("DC_self").innerText = text;
    text = String(choice_matrix[5]);
    document.getElementById("DC_other").innerText = text;
    text = String(choice_matrix[6]);
    document.getElementById("DD_self").innerText = text;
    text = String(choice_matrix[7]);
    document.getElementById("DD_other").innerText = text;

    document.getElementById("type").innerText = choice_matrix[8];

  }
 
}

function click_button_C(){
  /* random_N = Math.floor( Math.random() * list_length);
  choice_matrix = matrix_list[random_N]

  var text = String(choice_matrix[0]) + "," + String(choice_matrix[1]);
  document.getElementById("CC").innerText = text;
  text = String(choice_matrix[2]) + "," + String(choice_matrix[3]);
  document.getElementById("CD").innerText = text;
  text = String(choice_matrix[4]) + "," + String(choice_matrix[5]);
  document.getElementById("DC").innerText = text;
  text = String(choice_matrix[6]) + "," + String(choice_matrix[7]);
  document.getElementById("DD").innerText = text;
  //document.getElementById("test").innerText = "4,2"; */

  click_button("C");

  /*
  //要素の追加
  var boxPlayer = document.getElementById('boxPlayer');
  boxPlayer.insertAdjacentHTML('beforeend', "C<br>");

  var boxEnemy = document.getElementById('boxEnemy');
  var random_4 = String(Math.floor( Math.random() * 4));
  boxEnemy.insertAdjacentHTML('beforeend', random_4 + "<br>");
  */

  player_choice_list += ["C"]
}

function click_button_D(){
  click_button("D");

  /*
  //要素の追加
  var boxPlayer = document.getElementById('boxPlayer');
  boxPlayer.insertAdjacentHTML('beforeend', "D<br>");

  var boxEnemy = document.getElementById('boxEnemy');
  var random_4 = String(Math.floor( Math.random() * 4))
  boxEnemy.insertAdjacentHTML('beforeend', random_4 + "<br>");
  */

  player_choice_list += ["D"]
}

//本当は、相手の選んだ手を表示するので、関係ない。上は変更する

const en = "";

/* ここのマトリックスを変更する */
const matrix_list_2 = [
        [4,4,3,2,2,3,1,1],
        [1,2,4,3,0,0,3,4],
        [3,3,4,2,2,4,1,1],
        [1,2,4,3,0,0,3,4],
        [1,2,5,3,1,0,3,4],
        [en,en,en,en,en,en,en,en]];


var matrix_list = mat(4);

function mat(m_size){
  var staghunt = [];
  var pd = [];
  for (var a = 0;a < m_size;a++){
    for (var b = 0;b < m_size;b++){
      for (var c = 0;c < m_size;c++){
        for (var d = 0;d < m_size;d++){
          for (var e = 0;e < m_size;e++){
            for (var f = 0;f < m_size;f++){
              for (var g = 0;g < m_size;g++){
                for (var h = 0;h < m_size;h++){
                  //stag hunt
                  if (a == b && g == h && c == f && d == e && a > d && d >= g && g > c){
                    //配列にプッシュ
                    staghunt.push([a,b,c,d,e,f,g,h,"staghunt"]);
                  }else if (a == b && g == h && c == f && d == e && d > a && a > g && g > c){
                    //配列にプッシュ
                    pd.push([a,b,c,d,e,f,g,h,"PD"]);
                  }
          
                }
              }
            }
          }
        }
      }
    }
  }
  var matrix_list = [];
  //結合
  matrix_list = matrix_list.concat(staghunt);
  matrix_list = matrix_list.concat(pd);
  matrix_list.push([en,en,en,en,en,en,en,en,"End"]);
  return matrix_list;

}


const list_length = matrix_list.length;
//const list_length = 10;

var random_N = Math.floor( Math.random() * list_length);

var choice_matrix = matrix_list[round-1];

var player_choice_list = [];

var round = 1;

//const : 再代入不可
//var : 最大入可能
//let : 可能