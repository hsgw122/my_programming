/* $(function() {
  $(".accordion").click(function() {
    $(this).toggleClass("close").next().slideToggle();
  });
}); */

function click_button(){
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

  click_button();

  //要素の追加
  var boxPlayer = document.getElementById('boxPlayer');
  boxPlayer.insertAdjacentHTML('beforeend', "C<br>");

  var boxEnemy = document.getElementById('boxEnemy');
  var random_4 = String(Math.floor( Math.random() * 4))
  boxEnemy.insertAdjacentHTML('beforeend', random_4 + "<br>");

  player_choice_list += ["C"]
}

function click_button_D(){
  click_button();

  //要素の追加
  var boxPlayer = document.getElementById('boxPlayer');
  boxPlayer.insertAdjacentHTML('beforeend', "D<br>");

  var boxEnemy = document.getElementById('boxEnemy');
  var random_4 = String(Math.floor( Math.random() * 4))
  boxEnemy.insertAdjacentHTML('beforeend', random_4 + "<br>");

  player_choice_list += ["D"]
}

//本当は、相手の選んだ手を表示するので、関係ない。上は変更する

/* ここのマトリックスを変更する */
const matrix_list = [[4,4,3,2,2,3,1,1],[1,2,4,3,0,0,3,4]];

const list_length = matrix_list.length;
var random_N = Math.floor( Math.random() * list_length);
var choice_matrix = matrix_list[random_N]

var player_choice_list = []

//const : 再代入不可
//var : 最大入可能
//let : 可能