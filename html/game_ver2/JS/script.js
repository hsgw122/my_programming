
//ロード時
window.onload = function(){
  // ms ミリ秒
  //setInterval("showLog()",msTimePer);
  
  mainGame();
  C_btn();
  
}

//リセット
function resetElementChild(parent){
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }

}

//要素作成
function makeElement(Type,Id="",Class="",Text=""){
  var ele = document.createElement(Type);
  ele.setAttribute("id",Id);
  ele.setAttribute("class",Class);
  ele.innerText = Text;

  return ele;

}

//avatarの移動
function avatarMove(avatar){
  var top = 30;

  avatar.style.top = top + "%";

  var rate = true;

  var timer = setInterval(function() {

    if(top < 28){
      rate = false;
    }else if(top > 33){
      rate = true;
    }

    if(rate) {
      top = top - 0.5;
    } else {
      top = top + 0.2;
    };

  avatar.style.top = top + "%";
  }, 100);

}


//画像配置
function settingImg(set,value,cond,img_name,source){
  while(value > cond - 1){
    value -= cond;
    //画像の追加
    var img = makeElement("img","",img_name);
    img.setAttribute("src",source);
    img.setAttribute("alt", img_name);
    set.appendChild(img);
  }

  return value;

}

//マトリックスの外見生成
function setMatrixBox(matrix_box,sub_box,mar_box,self_box,other_box,code,self_value,other_value){

  var box = makeElement("div","",sub_box + " " + code +" ");
  matrix_box.appendChild(box);

  //self側
  var self = makeElement("div",code + "_self",mar_box + self_box + " " + code + "_self ",String(self_value));
  box.appendChild(self);

  self_value = settingImg(self,self_value,3,"deer_img","./images/deer.png");
  self_value = settingImg(self,self_value,1,"rabbit_img","./images/rabbit.png");

  //other側
  var other = makeElement("div",code + "_other",mar_box + other_box + " " + code + "_other ",String(other_value));
  box.appendChild(other);

  
  other_value = settingImg(other,other_value,3,"deer_img","./images/deer.png");
  other_value = settingImg(other,other_value,1,"rabbit_img","./images/rabbit.png");

}


//matrix
var mt_box = "mt_box";
var matrix_box = makeElement("div","",mt_box);
var mt_zone_size = getComputedStyle(matrix_box,null).getPropertyValue("width");

//スコア
var cpu_score_zone = makeElement("div"," cpu_score_zone "," score_zone cpu_score_zone ");
var cpu_score = makeElement("div"," cpu_score ","score cpu_score ");

var player_score_zone = makeElement("div"," player_score_zone "," score_zone player_score_zone ");
var player_score = makeElement("div"," player_score ","score player_score ");

//ボタン
var C_button = makeElement("button"," C_button "," ch_button "+" C_button ","C");
C_button.setAttribute("onclick","C_btn()");
C_button.setAttribute("onmouseover","C_btn_hover(this)");
C_button.setAttribute("onmouseleave","C_btn_leave(this)");

var D_button = makeElement("button"," D_button "," ch_button "+" D_button ","D");
D_button.setAttribute("onclick","D_btn()");
D_button.setAttribute("onmouseover","D_btn_hover(this)");
D_button.setAttribute("onmouseleave","D_btn_leave(this)");

//画面表示
function mainGame(){
  //fieldを読み込む
  var field = document.getElementById('field');
  resetElementChild(field);

  //マトリックス
  //var mt_box = "mt_box";
  //var matrix_box = makeElement("div","",mt_box);
  field.appendChild(matrix_box);
  
  //CCとかの区分
  var sub = " sub_box ";
  var mar = " state_box "
  var self = " self_box ";
  var other = " other_box ";

  REsetMatrix(false);

  /*
  choice_matrix = matrix_list[round];
  round += 1;
  var b = choice_matrix[0];
  var a = choice_matrix[1];
  var d = choice_matrix[2];
  var c = choice_matrix[3];
  var f = choice_matrix[4];
  var e = choice_matrix[5];
  var h = choice_matrix[6];
  var g = choice_matrix[7];

  setMatrixBox(matrix_box,sub,mar,self,other,"CC",a,b);
  setMatrixBox(matrix_box,sub,mar,self,other,"DC",c,d);
  setMatrixBox(matrix_box,sub,mar,self,other,"CD",e,f);
  setMatrixBox(matrix_box,sub,mar,self,other,"DD",g,h);
  */


  mt_zone_size = getComputedStyle(matrix_box,null).getPropertyValue("width");
  var mt_zone_posi = getComputedStyle(matrix_box,null).getPropertyValue("left");
  //選択ボタン
  var button_zone = makeElement("div","","button_zone");
  button_zone.style.width = String(mt_zone_size);
  button_zone.style.left = String(mt_zone_posi);
  field.appendChild(button_zone);

  /*
  var C_button = makeElement("button"," C_button "," ch_button "+" C_button ","C");
  C_button.setAttribute("onclick","C_btn()");
  C_button.setAttribute("onmouseover","C_btn_hover(this)");
  C_button.setAttribute("onmouseleave","C_btn_leave(this)");
  */
  button_zone.appendChild(C_button);

  /*
  var D_button = makeElement("button"," D_button "," ch_button "+" D_button ","D");
  D_button.setAttribute("onclick","D_btn()");
  D_button.setAttribute("onmouseover","D_btn_hover(this)");
  D_button.setAttribute("onmouseleave","D_btn_leave(this)");
  */
  button_zone.appendChild(D_button);

  //スコア
  field.appendChild(cpu_score_zone);
  cpu_score_zone.appendChild(cpu_score);
  var cpu_text = makeElement("div","","name cpu_name","CPU");
  cpu_score_zone.appendChild(cpu_text);

  field.appendChild(player_score_zone);
  player_score_zone.appendChild(player_score);
  var player_text = makeElement("div","","name player_name","PLAYER");
  player_score_zone.appendChild(player_text);
  
  //アバター
  var avatar = makeElement("div"," avatar "," avatar ","avatar");
  field.appendChild(avatar);
  avatarMove(avatar);

}

const coin_size = [10,5,1];
const coin_text = ["☆","V","I"]
var player_coin = [0,0,0];
var cpu_coin = [0,0,0];

//あらかじめ要素を作っておかないと、エラー
function C_btn(){
  //alert("成功");
  player_coin[2] += 1 
  if(player_coin[2] > 4){
    player_coin[2] -= 4;
    player_coin[1] += 1;
    if(player_coin[1] > 1){
      player_coin[1] -= 2;
      player_coin[0] += 1;
    }
  }
  resetElementChild(player_score);
  for(var i = 0;i < player_coin.length;i++){
    if(player_coin[i] != 0){
      for(var j = 0;j < player_coin[i];j++){
        var coin = makeElement("div","","coin_" + String(coin_size[i]) + " score_object",coin_text[i]);
        player_score.appendChild(coin);
      }
    }
  }

  var coin = makeElement("div","","coin_" + String(player_coin) + " score_object",String(player_coin));

  //cpu_score.appendChild(coin_1);
  player_score.appendChild(coin);
}

var C_hover_flag = false;

var circle1 = makeElement("div","","circle circle1");
var circle2 = makeElement("div","","circle circle2");

function C_btn_hover(own_element){
  if(!C_hover_flag){
    C_hover_flag = true;
    var CC_self = document.getElementById("CC_self");
    var CD_self = document.getElementById("CD_self");

    CC_self.appendChild(circle1);

    CD_self.appendChild(circle2);
    hoverC();

  }

}

function C_btn_leave(own_element){
  if(C_hover_flag){
    C_hover_flag = false;

    var CC_self = document.getElementById("CC_self");
    var CD_self = document.getElementById("CD_self");

    circle1.style.width = "100px";
    circle1.style.height = "100px";

    circle2.style.width = "100px";
    circle2.style.height = "100px";

    REsetMatrix(next_=false);

  }

}

//state: 100
const max_size = 110;
const min_size = 90;

const b_rate_const = 2;
var C_b_rate = b_rate_const;

var C_b_wid = min_size;

const hoverC = () => {
  var CC_self = document.getElementById("CC_self");
  var CD_self = document.getElementById("CD_self");

  C_b_wid += C_b_rate;
  if(C_b_wid >= max_size || C_b_wid <= min_size){
    C_b_rate *= -1;
  }

  circle1.style.width = C_b_wid + "px";
  circle1.style.height = C_b_wid + "px";
  circle2.style.width = C_b_wid + "px";
  circle2.style.height = C_b_wid + "px";

  if(C_hover_flag){
    var id = setTimeout(hoverC,100);
  }
  if(!C_hover_flag){
    clearTimeout(id);

    circle1.style.width = "100px";
    circle1.style.height = "100px";
    circle2.style.width = "100px";
    circle2.style.height = "100px";

    C_b_wid = 100;
    C_b_rate = b_rate_const;
    
  }
  
}

var D_hover_flag = false;

var circle3 = makeElement("div","","circle circle3");
var circle4 = makeElement("div","","circle circle4");

function D_btn_hover(own_element){
  if(!D_hover_flag){
    D_hover_flag = true;
    var DC_self = document.getElementById("DC_self");
    var DD_self = document.getElementById("DD_self");

    DC_self.appendChild(circle3);

    DD_self.appendChild(circle4);
    hoverD();

  }

}

function D_btn_leave(own_element){
  if(D_hover_flag){
    D_hover_flag = false;

    var DC_self = document.getElementById("DC_self");
    var DD_self = document.getElementById("DD_self");

    circle3.style.width = "100px";
    circle3.style.height = "100px";

    circle4.style.width = "100px";
    circle4.style.height = "100px";

    REsetMatrix(next_=false);

  }

}

var D_b_rate = b_rate_const;

var D_b_wid = min_size;

const hoverD = () => {
  var DC_self = document.getElementById("DC_self");
  var DD_self = document.getElementById("DD_self");

  D_b_wid += D_b_rate;
  if(D_b_wid >= max_size || D_b_wid <= min_size){
    D_b_rate *= -1;
  }

  circle3.style.width = D_b_wid + "px";
  circle3.style.height = D_b_wid + "px";
  circle4.style.width = D_b_wid + "px";
  circle4.style.height = D_b_wid + "px";

  if(D_hover_flag){
    var id = setTimeout(hoverD,100);
  }
  if(!D_hover_flag){
    clearTimeout(id);

    circle3.style.width = "100px";
    circle3.style.height = "100px";
    circle4.style.width = "100px";
    circle4.style.height = "100px";

    D_b_wid = 100;
    D_b_rate = b_rate_const;
    
  }
  
}

function REsetMatrix(next_=true){
  resetElementChild(matrix_box);
  if(next_){
    round += 1;
  }
  choice_matrix = matrix_list[round];

  //CCとかの区分
  var sub = " sub_box ";
  var mar = " state_box "
  var self = " self_box ";
  var other = " other_box ";

  var b = choice_matrix[0];
  var a = choice_matrix[1];
  var d = choice_matrix[2];
  var c = choice_matrix[3];
  var f = choice_matrix[4];
  var e = choice_matrix[5];
  var h = choice_matrix[6];
  var g = choice_matrix[7];

  setMatrixBox(matrix_box,sub,mar,self,other,"CC",a,b);
  setMatrixBox(matrix_box,sub,mar,self,other,"CD",c,d);
  setMatrixBox(matrix_box,sub,mar,self,other,"DC",e,f);
  setMatrixBox(matrix_box,sub,mar,self,other,"DD",g,h);
}

function D_btn(){
  /* 思考後に追加
  if(round < list_length && !thinking_){
    REsetMatrix();
  }
  */

  //alert("成功");
  cpu_coin[2] += 1

  var coin = makeElement("div","","coin_" + String(cpu_coin) + " score_object",String(cpu_coin));

  cpu_score.appendChild(coin);
  //player_score.appendChild(coin_1);

  var field = document.getElementById('field');

  field.appendChild(loading_zone);

  loading_zone.appendChild(load_1);
  loading_zone.appendChild(load_2);
  loading_zone.appendChild(load_3);

  load();

}


/* ロードに関すること */
var loading_zone = makeElement("div","loading","loading");
var load_1 = makeElement("div","load_1","load_small");
var load_2 = makeElement("div","load_2","load_small");
var load_3 = makeElement("div","load_3","load_small");

var load_No = 0;

function load(){
  if(!thinking_){
    thinking_ = true;
    nowLoading();
  }else {
    alert("now thinking!");
  }

}

var thinking_ = false;
var counter = 0;
var load_rate = 300;
//思考時間
const max_s = 1;
const max_counter = max_s * 1000 / load_rate;

const nowLoading = () => {
  counter++;

  load_No += 1;
  load_No %= 3;

  load_1.setAttribute("class","load_small");
  load_2.setAttribute("class","load_small");
  load_3.setAttribute("class","load_small");

  if(load_No + 1 == 1){
    load_1.setAttribute("class","load_big");
    load_2.setAttribute("class","load_middle");

  }else if(load_No + 1 == 2){
    load_2.setAttribute("class","load_big");
    load_3.setAttribute("class","load_middle");

  }else if(load_No + 1 == 3){
    load_3.setAttribute("class","load_big");
    load_1.setAttribute("class","load_middle");

  }

  var id = setTimeout(nowLoading,load_rate);
  if(counter > max_counter){
    clearTimeout(id);
    counter = 0;
    thinking_ = false;
    var field = document.getElementById('field');
    field.removeChild(loading_zone);
    
    if(round < list_length && !thinking_){
      REsetMatrix();
    }
    
  }
  
}


function mousePoint(){
  document.body.addEventListener('mousemove',function(e){
    var mX = e.pageX;
    var mY = e.pageY;

    var x = document.getElementById("textX");
    x.innerText = String(mX);
    var y = document.getElementById("textY");
    y.innerText = String(mY);

    var win_wid = window.innerWidth;
    var win_hei = window.innerHeight;

    var box = document.getElementById("box");
    var box_wid = box.clientWidth;
    var box_hei = box.clientHeight;

    mX = mX - box_wid / 2;
    mY = mY - box_hei / 2;

    if(mX < 0){
      mX = 0;
    }
    if(mX + box_wid > win_wid){
      mX = win_wid - box_wid;
    }

    if(mY < 0){
      mY = 0;
    }
    if(mY + box_hei > win_hei){
      mY = win_hei - box_hei;
    }

    box.style.left = String(mX) + 'px';
    box.style.top = String(mY) + 'px';

    box.innerText = String(mX) + "desu";

    //console.log("mX = "+String(mX));
  })
}


var time = 0;
var timePerS = 0.1;
var msTimePer = timePerS * 1000;

var r = 250;
var r_rate = -1;
var g = 150;
var b = 150;
var backColor = "";
var clear = 1.0;
var clear_rate = -0.1;

function showLog(){
  time += timePerS;
  if(time < 10){
    
    //document.getElementById("Time").innerText = String(time) + " 秒";
  
    r += r_rate;
    if(r > 255 || r < 200){
      r_rate = -1 * r_rate;
    }
    backColor = "rgb(" + String(g) + "," + String(r) + "," + String(b) + ")";


    clear += clear_rate;
    if(clear > 1.0 || clear < 0.0){
      clear_rate = -1 * clear_rate;
    }
    var cl = String(clear);

    var fil = document.getElementById("field");
    fil.style.backgroundColor = backColor;
    //fil.style.opacity = cl;
  }
}

var game_mode_1 = false;

function A_btn(){
  console.log("push A");

  var fis = document.createElement("div");
  fis.setAttribute("class","char2");
  fis.style.height = "100px";
  fis.style.width = "100px";
  fis.innerText = "A_s";

  //var par = document.getElementById("main_body");
  var par = document.getElementById("field");
  par.appendChild(fis);

  if(!game_mode_1){
    var B_btn = document.createElement("button");
    B_btn.setAttribute("class","B_button");
    B_btn.setAttribute("onclick","B_btn()")
    B_btn.innerText = "B";
    B_btn.style.width = "100px";

    par.appendChild(B_btn);
    B_btn.innerText = "B_";
    //B_btn.style.width = "10px";

    game_mode_1 = true;
  }

  var law = document.getElementById("law");
  law.remove();

  //alert("成功しています");
  
}

function B_btn(){
  alert("成功しています");
  var ele = document.getElementById('field');
  while( ele.firstChild ){
    ele.removeChild( ele.firstChild );
  }

}


function click_button(btn){
  if(round < list_length){
    choice_matrix = matrix_list[round];

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

  click_button("C");

  player_choice_list += ["C"]
}

function click_button_D(){
  click_button("D");

  player_choice_list += ["D"]
}

//本当は、相手の選んだ手を表示するので、関係ない。上は変更する

const en = "eee";

/* ここのマトリックスを変更する */
/*
const matrix_list_2 = [
        [4,4,3,2,2,3,1,1],
        [1,2,4,3,0,0,3,4],
        [3,3,4,2,2,4,1,1],
        [1,2,4,3,0,0,3,4],
        [1,2,5,3,1,0,3,4],        
        [en,en,en,en,en,en,en,en]];
        */

//段階
var matrix_sizing = 4;
var matrix_list = mat(matrix_sizing);

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
  console.log(matrix_list);
  return matrix_list;

}


const list_length = matrix_list.length;
//const list_length = 10;

var random_N = Math.floor( Math.random() * list_length);

var choice_matrix = matrix_list[round-1];

var player_choice_list = [];

var round = 0;

//const : 再代入不可
//var : 最大入可能
//let : 可能