/// <reference path="createJS.js" />

//データをやり取りするにはPHPが必要

// 変数ゾーン //
{
//デバッグモードか
//var debug = true;
var debug = false;
console.log("DEBUG : "+debug);

//ゲームのステージ
var game_stage;
//キャンバスの大きさ
var canvasWidth;
var canvasHeight;

//マトリックスのリスト
var matrix_list = [[20,3,1,0,0,1,1,1]];
const en = "eee";
//マトリックスを初期化する。m_sizeで範囲を指定する
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
                      staghunt.push([b,a,d,c,f,e,h,g,"staghunt"]);
                    }else if (a == b && g == h && c == f && d == e && d > a && a > g && g > c){
                      //配列にプッシュ
                      pd.push([b,a,d,c,f,e,h,g,"PD"]);
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
    console.log("matrilx list length : "+matrix_list.length);

    choice_matrix = matrix_list[0];
    a = choice_matrix[0];
    b = choice_matrix[1];
    c = choice_matrix[2];
    d = choice_matrix[3];
    e = choice_matrix[4];
    f = choice_matrix[5];
    g = choice_matrix[6];
    h = choice_matrix[7];

    return matrix_list;
  
}

//数値を初期化
function resetMatrixValue() {
    //現在のマトリックス
    choice_matrix = matrix_list[round];
    //マトリックスに配置されている数値、ペイオフ値
    a = choice_matrix[0];
    b = choice_matrix[1];
    c = choice_matrix[2];
    d = choice_matrix[3];
    e = choice_matrix[4];
    f = choice_matrix[5];
    g = choice_matrix[6];
    h = choice_matrix[7];
    
}

//マトリックスリストの長さ
var list_length = matrix_list.length;
//現在のラウンド
var round = 0;
//現在のマトリックス
var choice_matrix = matrix_list[round];
//マトリックスに配置されている数値、ペイオフ値
var a = choice_matrix[0];
var b = choice_matrix[1];
var c = choice_matrix[2];
var d = choice_matrix[3];
var e = choice_matrix[4];
var f = choice_matrix[5];
var g = choice_matrix[6];
var h = choice_matrix[7];

//コンピュータの重み
var self_weight  = 1;
var other_weight = 0;
/*
var self_weight  = Math.random() * 2.0 - 1.0;
var other_weight = Math.random() * 2.0 - 1.0;
*/
console.log("self : "+self_weight);
console.log("other : "+other_weight);
}

// 関数ゾーン //

//ロード時に、initを実行
window.addEventListener("load", init);

//初期化関数、init、最初に1回実行される
function init() {
    //画像をプリロード
    imagePreLoad();
    //マトリックスをセット、長さも取得
    matrix_list = mat(4);
    list_length = matrix_list.length;
    resetMatrixValue();
    //キャンバス情報を取得、キャンバス扱いに
    const gameCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("myCanvasBottom"));
    //横、縦の大きさも取得
    canvasWidth = gameCanvas.width;
    canvasHeight = gameCanvas.height;
    //ステージを取得
    game_stage = new createjs.Stage("myCanvasBottom");


    //変数初期化
    cardParametaInit();


    //ゲームコントロールのclass
    var game = new GameControl();
    
    
    //ウィンドウのタイミングに合わせる
    //if(!debug)createjs.Ticker.timingMode = createjs.Ticker.RAF;

    // 自動的に画面更新させます。
    createjs.Ticker.addEventListener("tick", game_stage);

}

//画像をプリロードする
function imagePreLoad() {

    //画像のロード関数
    function imageLoad(Image,ImageSrc) {
        try {
            Image.src = ImageSrc;
            Image.onload = () => {
                console.log("load : complete  : " + String(ImageSrc));
            }
        } catch(e) {
            console.log(e);
        }

    }

    //imageLoad(deer_image,"./images/deer.png");
    //imageLoad(think_image,"./images/fukidashi02.png");
    //imageLoad(vote_image,"./images/fukidashi14.png");
    
}

// =================== 正規分布 連続 ===================
function xRandomNormal(average, deviation) {
    var z01 = 0;                  // 標準正規分布（０，１）に従う乱数
    for (var i=1; i<=12; i++) {   // 中心極限定理により１２個の一様乱数は正規分布になる
        z01 = z01 + Math.random();
    }
    z01 = z01 - 6;
    return (average + z01) + (deviation * z01);
}

// =================== 正規分布（上下限） 連続 ===================
// 極端な値にならないように、最小値と最大値を設ける
// 通常の正規分布を行い、範囲を逸脱したときには、再度計算を行う
function xRandomNormalMinmax(xmin, xmax, average, deviation) {
    var ok = 0;       // 範囲内なら１、範囲外なら０
    while (ok==0) {
        var z01 = 0;                  // 標準正規分布（０，１）に従う乱数
        for (var i=1; i<=12; i++) {   // 中心極限定理により１２個の一様乱数は正規分布になる
            z01 =z01 + Math.random();
        }
        z01 = z01 - 6;
        var x =  (average + z01) + (deviation * z01);
        if ( (x >= xmin) && (x <= xmax) ) ok = 1;
    }
    return x;
}

// クラスゾーン //

//ゲームコントロールclass
//場所をコントロールする
class GameControl {

    constructor(){

        //Cのカードclass
        var C_card = new ChoiceCard("C");
        C_card.x = card_wid * 0.6;
        C_card.y = card_hei * 0.7;
        C_card.setScoreBorad(a,b,e,f);
        //C_card.x = card_wid * 0.6;
        //C_card.y = card_hei * 0.7;
        //Dのカードclass
        var D_card = new ChoiceCard("D");
        D_card.x = card_wid * 1.7;
        D_card.y = card_hei * 0.7;
        D_card.setScoreBorad(c,d,g,h);
        //D_card.x = card_wid * 0.6;
        //D_card.y = card_hei * 1.8;
        //エージェントの見た目class
        //

        //ステージのマウスオーバーをオンにする
        game_stage.enableMouseOver();
    }

}

//カードのプロパティ
{
//カードのサイズ
var card_wid;
var card_hei;
var card_round;
//カードの色
var card_stroke_size;
var card_stroke_color;
var card_fill_color;
//カードのテキスト
var card_text_fontsize;
var card_text;
var card_text_font;
var card_text_color;
var card_text_textAlign;
var card_text_textBaseline;
var card_text_x;
var card_text_y;
//カードの報酬のテキスト
var card_youText;
var card_youText_color;
var card_cpuText;
var card_cpuText_color;
var card_Text_fontSize;

//カードのカプセル
var card_capsule_wid;
var card_capsule_hei;
var card_capsule_round;
//カードのボックス
var card_box_wid;
var card_box_hei;
var card_box_round;
var card_box_x;
}

//変数の初期化
function cardParametaInit() {
    //カードのサイズ
    card_wid = canvasWidth * 0.4;
    card_hei = canvasHeight* 0.8;
    card_round = 10;
    //カードの色
    card_stroke_size  = 10;
    card_stroke_color = "rgba(200,250,250,1.0)";
    card_fill_color   = "rgba(250,250,250,1.0)";
    //カードのテキスト
    card_text_fontsize = 20;
    card_text = "If you chose this card :";
    card_text_font = String(card_text_fontsize)+"px sans-serif";
    card_text_color = "black";
    card_text_textAlign = "center";
    card_text_textBaseline = "bottom";
    card_text_x = 0;
    card_text_y = -card_hei/2 + card_text_fontsize;
    //カードの報酬のテキスト
    card_youText = "yours";
    card_youText_color = "red";
    card_cpuText = "cpu's";
    card_cpuText_color = "blue";
    card_Text_fontSize = 20;

    //カードのカプセル
    card_capsule_wid = card_wid * 0.9;
    card_capsule_hei = card_hei * 0.3;
    card_capsule_round = 10;
    //カードのボックス
    card_box_wid = card_capsule_wid * 0.44;
    card_box_hei = card_capsule_hei * 0.9;
    card_box_round = 10;
    card_box_x = card_box_wid * 0.6;
}

var ffff = true;

//選択カードclass
class Ch8oiceCard extends createjs.Container {

    //加える分のtext
    constructor(plusText="",card_fillColor=card_fill_color){
        super();

        //自分をステージに追加
        game_stage.addChild(this);

        //カードを表示
        var card = new createjs.Shape();
        card.graphics
            .setStrokeStyle(card_stroke_size)
            .beginStroke(card_stroke_color)
            .beginFill(card_fillColor)
            .drawRoundRect(-card_wid/2,-card_hei/2,card_wid,card_hei,card_round);
        this.addChild(card);

        //カード名を表示
        var text = new createjs.Text("", "", "");
        text.text = card_text + plusText;
        text.font = card_text_font;
        text.color = card_text_color;
        //中心にセット
        text.x = card_text_x;
        text.y = card_text_y;
        text.textAlign = card_text_textAlign;
        text.textBaseline = card_text_textBaseline;
        this.addChild(text);

        //プレイヤー　が得られる報酬という説明テキスト
        var yourText = new createjs.Text("", "", "");
        yourText.text = card_youText;
        yourText.font = String(card_Text_fontSize)+"px sans-serif";
        yourText.color = card_youText_color;
        yourText.x = -card_box_wid * 0.6;
        yourText.y = -card_capsule_hei * 0.8;
        yourText.textAlign = card_text_textAlign;
        yourText.textBaseline = card_text_textBaseline;
        this.addChild(yourText);
        //コンピュータが得られる報酬という説明テキスト
        var cpuText = new createjs.Text("", "", "");
        cpuText.text = card_cpuText;
        cpuText.font = String(card_Text_fontSize)+"px sans-serif";
        cpuText.color = card_cpuText_color;
        cpuText.x = +card_box_wid * 0.6;
        cpuText.y = -card_capsule_hei * 0.8;
        cpuText.textAlign = card_text_textAlign;
        cpuText.textBaseline = card_text_textBaseline;
        this.addChild(cpuText);

        //上側報酬のリストを表示functionのretrun
        var C_capsule = this.makeRewardsList("rgba(240,240,100,0.8)");
        C_capsule.y = -card_capsule_hei * 0.2;
        this.addChild(C_capsule);
        //上側報酬のリストを表示functionのretrun
        var D_capsule = this.makeRewardsList("rgba(100,240,240,0.8)");
        D_capsule.y = card_capsule_hei * 1.0;
        this.addChild(D_capsule);

        //リスナーを付ける
        this.listenerThis(true);

        var listener = this;
        this.addEventListener("click",handleClick);
        function handleClick(params) {
            listener.listenerThis(false);
            if(ffff==false){
                ffff = true;
            }else{
                ffff = false;
            }
            console.log(ffff);
        }
    }

    //リスナーを加える
    listenerThis(add=true){
        var listener = this;
        if(add == true){
            this.addEventListener("mouseover",handleMouseOver);
            this.addEventListener("mouseout",handleMouseOut);
        }else if(add == false){
            this.removeEventListener("mouseover",handleMouseOver);
            this.removeEventListener("mouseout",handleMouseOut);
        }

        function handleMouseOver() {
            if(ffff){
                listener.scaleX = 1.1;
                listener.scaleY = 1.1;
            }
        }

        function handleMouseOut() {
            listener.scaleX = 1.0;
            listener.scaleY = 1.0;
        }
    }

    //報酬capsuleを1つを作って、capsuleを返す
    makeRewardsList(fillColor="gray",strokeColor="black") {
        //上下に表示するcapsuleのうちの1つ
        var capsule = new createjs.Container();

        //表示するcapsuleくん
        var bg = new createjs.Shape();
        bg.graphics
            .setStrokeStyle(1)
            .beginStroke(strokeColor)
            .beginFill(fillColor)
            .drawRoundRect(-card_capsule_wid/2,-card_capsule_hei/2,card_capsule_wid,card_capsule_hei,card_capsule_round);
        capsule.addChild(bg);
        //自分側の報酬function return
        var player_box = this.makeRewards("rgba(255,100,100,0.8)");
        player_box.x = -card_box_wid * 0.6;
        capsule.addChild(player_box);
        //相手側の報酬function return
        var cpu_box = this.makeRewards("rgba(100,100,255,0.8)");
        cpu_box.x = card_box_wid * 0.6;
        capsule.addChild(cpu_box);
        //中心に置く壁
        var centerBar = new createjs.Shape();
        centerBar.graphics
            .setStrokeStyle(1)
            .beginStroke("gray")
            .beginFill("Black")
            .drawRoundRect(0,-card_capsule_hei*0.4,0,card_capsule_hei*0.8,0);
        capsule.addChild(centerBar);

        return capsule;

    }

    //報酬を1つ作って返す
    makeRewards(fillColor="gray",strokeColor="black") {
        //右左に表示するボックスのうちの1つ
        var box = new createjs.Container();

        //表示するboxくん
        var bg = new createjs.Shape();
        bg.graphics
            .setStrokeStyle(2)
            .beginStroke(strokeColor)
            .beginFill(fillColor)
            .drawRoundRect(-card_box_wid/2,-card_box_hei/2,card_box_wid,card_box_hei,card_box_round);
        box.addChild(bg);

        return box;

    }
}


//選択カードclass
class ChoiceCard extends createjs.Container {

    //加える分のtext
    constructor(plusText="",card_fillColor=card_fill_color){
        super();

        //自分をステージに追加
        game_stage.addChild(this);

        //カードを表示
        var card = new createjs.Shape();
        card.graphics
            .setStrokeStyle(card_stroke_size)
            .beginStroke(card_stroke_color)
            .beginFill(card_fillColor)
            .drawRoundRect(-card_wid/2,-card_hei/2,card_wid,card_hei,card_round);
        this.addChild(card);
        this.card = card;

        //カード名を表示
        var text = new createjs.Text("", "", "");
        text.text = card_text + plusText;
        text.font = card_text_font;
        text.color = card_text_color;
        //中心にセット
        text.x = card_text_x;
        text.y = card_text_y;
        text.textAlign = card_text_textAlign;
        text.textBaseline = card_text_textBaseline;
        this.addChild(text);

        //プレイヤー　が得られる報酬という説明テキスト
        var yourText = new createjs.Text("", "", "");
        yourText.text = card_youText;
        yourText.font = String(card_Text_fontSize)+"px sans-serif";
        yourText.color = card_youText_color;
        yourText.x = -card_box_wid * 0.6;
        yourText.y = -card_capsule_hei * 0.8;
        yourText.textAlign = card_text_textAlign;
        yourText.textBaseline = card_text_textBaseline;
        this.addChild(yourText);
        //コンピュータが得られる報酬という説明テキスト
        var cpuText = new createjs.Text("", "", "");
        cpuText.text = card_cpuText;
        cpuText.font = String(card_Text_fontSize)+"px sans-serif";
        cpuText.color = card_cpuText_color;
        cpuText.x = +card_box_wid * 0.6;
        cpuText.y = -card_capsule_hei * 0.8;
        cpuText.textAlign = card_text_textAlign;
        cpuText.textBaseline = card_text_textBaseline;
        this.addChild(cpuText);

        //上側報酬のリストを表示functionのretrun
        var C_capsule = this.makeCapsule("rgba(240,240,100,0.8)");
        C_capsule.y = -card_capsule_hei * 0.2;
        this.addChild(C_capsule);
        //上側報酬のリストを表示functionのretrun
        var D_capsule = this.makeCapsule("rgba(100,240,240,0.8)");
        D_capsule.y = card_capsule_hei * 1.0;
        this.addChild(D_capsule);

        //自分をサイズ0にする
        this.scaleX = 0.0;
        this.scaleY = 0.0;

        this.sizingThis(0.1);


        //スコアの得点表示
        
        var score_C_you = new ScoreBorad([1,0,0]);
        score_C_you.x = -card_box_x;
        C_capsule.addChild(score_C_you);
        this.score_C_you = score_C_you;

        var score_C_cpu = new ScoreBorad([1,1,1]);
        score_C_cpu.x = card_box_x;
        C_capsule.addChild(score_C_cpu);
        this.score_C_cpu = score_C_cpu;

        var score_D_you = new ScoreBorad([1,1,1]);
        score_D_you.x = -card_box_x;
        D_capsule.addChild(score_D_you);
        this.score_D_you = score_D_you;

        var score_D_cpu = new ScoreBorad([1,1,1]);
        score_D_cpu.x = card_box_x;
        D_capsule.addChild(score_D_cpu);
        this.score_D_cpu = score_D_cpu;

        this.setScoreBorad(a,b,c,d);
        

        //リスナーを付ける
        this.listenerThis(true);

        var listener = this;
        card.addEventListener("click",handleClick);
        function handleClick(params) {
            listener.listenerThis(false);
            if(ffff==false){
                ffff = true;
            }else{
                ffff = false;
            }
            console.log(ffff);
        }
        
    }

    //リスナーを加える
    listenerThis(add=true){
        var listener = this;
        var card = this.card;
        if(add == true){
            card.addEventListener("mouseover",handleMouseOver);
            card.addEventListener("mouseout",handleMouseOut);
        }else if(add == false){
            card.removeEventListener("mouseover",handleMouseOver);
            card.removeEventListener("mouseout",handleMouseOut);
        }

        function handleMouseOver() {
            if(ffff){
                listener.scaleX = 1.1;
                listener.scaleY = 1.1;
            }
        }

        function handleMouseOut() {
            listener.scaleX = 1.0;
            listener.scaleY = 1.0;
        }
    }

    //スコアをセットする
    setScoreBorad(a=7,b=7,c=7,d=7){
        this.score_C_you.setScore(toScoreList(a));
        this.score_C_cpu.setScore(toScoreList(b));
        this.score_D_you.setScore(toScoreList(c));
        this.score_D_cpu.setScore(toScoreList(d));
    }

    //サイズを変更する
    sizingThis(rate = -0.1){
        this.visible = true;
        var listener = this;
        createjs.Ticker.removeEventListener("tick",sizing);
        createjs.Ticker.addEventListener("tick",sizing);
        function sizing() {
            listener.scaleX += rate;
            listener.scaleY += rate;
            if(listener.scaleX > 1){
                listener.scaleX = 1.0;
                listener.scaleY = 1.0;
    
                createjs.Ticker.removeEventListener("tick",sizing);
            }else if(listener.scaleX < 0){
                listener.scaleX = 0.0;
                listener.scaleY = 0.0;
    
                createjs.Ticker.removeEventListener("tick",sizing);
            };
                
        }
    }

    //サイズを0にする
    sizingZero(){
        this.visible = false;
        this.scaleX = 0.0;
        this.scaleY = 0.0;
    }

    //報酬capsuleを1つを作って、capsuleを返す
    makeCapsule(fillColor="gray",strokeColor="black") {
        //上下に表示するcapsuleのうちの1つ
        var capsule = new createjs.Container();

        //表示するcapsuleくん
        var bg = new createjs.Shape();
        bg.graphics
            .setStrokeStyle(1)
            .beginStroke(strokeColor)
            .beginFill(fillColor)
            .drawRoundRect(-card_capsule_wid/2,-card_capsule_hei/2,card_capsule_wid,card_capsule_hei,card_capsule_round);
        capsule.addChild(bg);
        //自分側の報酬function return
        var player_box = this.makeBox("rgba(255,100,100,0.8)");
        player_box.x = -card_box_x;
        capsule.addChild(player_box);
        //相手側の報酬function return
        var cpu_box = this.makeBox("rgba(100,100,255,0.8)");
        cpu_box.x = card_box_x;
        capsule.addChild(cpu_box);
        //中心に置く壁
        var centerBar = new createjs.Shape();
        centerBar.graphics
            .setStrokeStyle(1)
            .beginStroke("gray")
            .beginFill("Black")
            .drawRoundRect(0,-card_capsule_hei*0.4,0,card_capsule_hei*0.8,0);
        capsule.addChild(centerBar);

        return capsule;

    }

    //報酬を1つ作って返す
    makeBox(fillColor="gray",strokeColor="black") {
        //右左に表示するボックスのうちの1つ
        var box = new createjs.Container();

        //表示するboxくん
        var bg = new createjs.Shape();
        bg.graphics
            .setStrokeStyle(2)
            .beginStroke(strokeColor)
            .beginFill(fillColor)
            .drawRoundRect(-card_box_wid/2,-card_box_hei/2,card_box_wid,card_box_hei,card_box_round);
        box.addChild(bg);

        return box;

    }
}


//得点のプロパティ
var score_size = 50;
var score_spa = 2;

//得点のclass
class ScoreImage extends createjs.Container {

    constructor(wid,image_src,size,scoreText,fillColor,howmany=1){
        super();

        this.wid = wid;
        var image = new Image();
        image.src = image_src;
        image.onload = () => {

            for(var i=0;i<howmany;i++){
                wid += score_spa;
                var score_boards = new createjs.Container();
                this.addChild(score_boards);
                score_boards.x = wid-size/4;

                var circle_size = size / 2;
                var circle = new createjs.Shape();
                circle.graphics
                    .setStrokeStyle(1)
                    .beginStroke("black")
                    .beginFill("rgba(255,255,255,0.8)")
                    .drawCircle(0,0,circle_size);
                score_boards.addChild(circle);

                var animalImage = new createjs.Bitmap(image);

                animalImage.scaleX = size / animalImage.getBounds().width;
                animalImage.scaleY = animalImage.scaleX;

                animalImage.x = -size/2;
                animalImage.y = -size/2;

                score_boards.addChild(animalImage)

                var ten_size = 10;
                var ten = new createjs.Shape();
                ten.graphics
                    .setStrokeStyle(1)
                    .beginStroke("gray")
                    .beginFill(fillColor)
                    .drawCircle(0,0,ten_size)
                score_boards.addChild(ten);
                ten.x = -size*0.4;
                ten.y = size*0.4;

                var label = new createjs.Text("", "20px sans-serif", "black");
                label.text = String(scoreText);
                label.x = ten.x;
                label.y = ten.y;
                label.textAlign = "center";
                label.textBaseline = "middle";
                score_boards.addChild(label);

                wid += size+score_spa;

            }
        
        }
    }

}

//得点から画像の表示数を割り出し、リストを返す関数
function toScoreList(score) {
    var list = [];
    var bo = 0;

    function checking(value) {
        bo = 0;

        bo = parseInt(score / value);
        score = parseInt(score % value);
        
        list.push(bo);
    }

    checking(3);
    checking(2);
    checking(1);

    //console.log(list);

    return list;
}

//得点ボードのclass
class ScoreBorad extends createjs.Container {

    constructor(list=[1,2,3],scoreList=[["./images/deer.png",60,3,"red"],
                           ["./images/rabbit.png",40,2,"green"],
                           ["./images/rat.png",35,1,"yellow"]]){
        super();

        this.scoreList = scoreList;

        var score = new createjs.Container();
        this.addChild(score);
        this.score = score;

        var wid = 0;

        for(var i = 0;i<scoreList.length;i++){
            var score_obj = new ScoreImage(wid,scoreList[i][0],scoreList[i][1],scoreList[i][2],scoreList[i][3],list[i]);
            score.addChild(score_obj);
            wid += (scoreList[i][1] + score_spa * 2 ) * list[i];

        }

        score.x = -wid/2;

        var box = new createjs.Shape();
        if(debug)this.addChild(box);
        this.box = box;
        box.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .drawRect(-wid/2,-35,wid,70);

        //this.setScore(toScoreList(5));

    }

    setScore(list=[1,2,3]){
        var scoreList = this.scoreList;
        this.removeAllChildren();
        
        var score = new createjs.Container();
        this.addChild(score);
        this.score = score;

        var wid = 60+score_spa;

        for(var i = 0;i<scoreList.length;i++){
            var score_obj = new ScoreImage(wid,scoreList[i][0],scoreList[i][1],scoreList[i][2],scoreList[i][3],list[i]);
            score.addChild(score_obj);
            wid += (scoreList[i][1] + score_spa * 2 ) * list[i];

        }

        score.x = -wid/2;

        var box = new createjs.Shape();
        if(debug)this.addChild(box);
        this.box = box;
        box.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .drawRect(-wid/2,-35,wid,70);
    }
}

//いい例のボタン
class MyButton extends createjs.Container {

    constructor(){
        super();

        var btnW = 240; // ボタンの横幅
        var btnH = 50; // ボタンの高さ

        // 座布団を作成
        var bg = new createjs.Shape();
        bg.graphics
              .setStrokeStyle(1)
              .beginStroke("#563d7c")
              .beginFill("white")
              .drawRoundRect(0, 0, btnW, btnH, 4);
        // 座布団のグラフィックを描く (省略)
        this.addChild(bg);

        // ラベルを作成
        var label = new createjs.Text("Button", "24px sans-serif", "#563d7c");
        label.x = btnW / 2;
        label.y = btnH / 2;
        label.textAlign = "center";
        label.textBaseline = "middle";
        // ラベルの配置場所を調整 (省略)
        this.addChild(label);

        // イベントを登録
        this.addEventListener("click", handleClick);
        function handleClick(event) {
            // クリックされた時の処理を記述
            alert("クリックされました。");
        }
    }
}

//継承
class MyStar extends createjs.Shape {
    constructor(){
        super();

        // 円を作成します
        this.graphics.beginStroke("Purple");// 線の色を指定
        this.graphics.setStrokeStyle(5);// 線の幅を指定
        this.graphics.drawCircle(0, 0, 150); // 半径150pxの円を記述
        this.graphics.endStroke();

        // 多角形を作成します
        this.graphics.beginFill('Purple'); // 塗りの色を指定
        this.graphics.drawPolyStar(0, 0, 150, 5, 0.6, -90); // 半径150pxの星を記述
        this.graphics.endFill();
    }
}

/** コンテナーを継承したサブクラスです。 */
class MyContainer extends createjs.Container {
    constructor() {
        super();
  
        // 円を作成します
        var circle = new createjs.Shape();
        circle.graphics.beginStroke("DarkRed");// 線の色を指定
        circle.graphics.setStrokeStyle(5);// 線の幅を指定
        circle.graphics.drawCircle(0, 0, 150); // 50pxの星を記述
        this.addChild(circle); // 表示リストに追加
  
        // 多角形を作成します
        var poly = new createjs.Shape();
        poly.graphics.beginFill('DarkRed'); // 赤色で描画するように設定
        poly.graphics.drawPolyStar(0, 0, 150, 5, 0.6, -90); // 150pxの星を記述
        this.addChild(poly); // 表示リストに追加
    }
}

