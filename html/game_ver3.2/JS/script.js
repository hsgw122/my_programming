/// <reference path="createJS.js" />

//データをやり取りするにはPHPが必要

//ロード時に、initを実行
window.addEventListener("load", init);

//初期化関数、init、最初に1回実行される
function init() {
    //画像をプリロード
    imagePreLoad();
    //マトリックスをセット、長さも取得
    matrix_list = mat(4);
    list_length = matrix_list.length;
    //キャンバス情報を取得、キャンバス扱いに
    const gameCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("myCanvasBottom"));
    //横、縦の大きさも取得
    canvasWidth = gameCanvas.width;
    canvasHeight = gameCanvas.height;
    //ステージを取得
    game_stage = new createjs.Stage("myCanvasBottom");
    //ゲームを生成
    var game = new GameControl();

    
    //ウィンドウのタイミングに合わせる
    //if(!debug)createjs.Ticker.timingMode = createjs.Ticker.RAF;

    // 自動的に画面更新させます。
    createjs.Ticker.addEventListener("tick", game_stage);

}

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

//コンピュータが考えているかのフラグ
var cpu_thinking_flag = false;
//コンピュータが選んでいるかのフラグ
var cpu_chose_flag = false;
//コンピュータがCを選んだというフラグ
var cpu_C_flag = false;
//コンピュータがDを選んだというフラグ
var cpu_D_flag = false;

//プレイヤーがCを選んだというフラグ
var player_C_flag = false;
//プレイヤーがDを選んだというフラグ
var player_D_flag = false;

var deer_image = new Image();
var think_image = new Image();
var vote_image = new Image();

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

    imageLoad(deer_image,"./images/deer.png");
    imageLoad(think_image,"./images/fukidashi02.png");
    imageLoad(vote_image,"./images/fukidashi14.png");
    
}

//ゲームコントロール
class GameControl {
    game_stage;

    constructor(){
        
        this.game_stage = game_stage;
        //this.stage.enableMouseOver();

        //実際に触られる部分、UIレイヤー
        var gameUILayer = new createjs.Container();
        this.game_stage.addChild(gameUILayer);
        //ロードまで非表示にする
        gameUILayer.visible = false;

        //ロード画面
        var load_Layer = new LoadingDisplay();
        this.game_stage.addChild(load_Layer); 


        //マトリックス、常時表示、左上
        var matrix_box = new MatrixBox(debug);
        gameUILayer.addChild(matrix_box);
        matrix_box.x = 10;
        matrix_box.y = 20;
        //マトリックスに数値を表示する
        matrix_box.setMatrixValue();
        this.matrix_box = matrix_box;


        /*
        var mouseOver_C_flag = false;
        var mouseOver_D_flag = false;
        var scalingPopC = 0.0;
        var scalingPopD = 0.0;
        var scalingPop_Rate_plus = 0.1;
        var scalingPop_Rate_minus = 0.3;
        */


        //ボタンC
        var btn_C = new ChoiceButton("C","rgb(255,200,200",40);
        gameUILayer.addChild(btn_C);
        btn_C.x = 20;
        btn_C.y = 360;

        //Cボタンをクリックしたとき
        btn_C.addEventListener("click",handleClickC);
        function handleClickC(event) {
            //console.log("click C");
            //選択したことを強調表示
            btn_C.choicedVisble = true;
            btn_D.choicedVisble = false;
            player_C_flag = true;
            player_D_flag = false;
            mouseOver_C_flag = true;
            mouseOver_D_flag = false;
            //もう一方のポップアップを小さくする
            createjs.Ticker.addEventListener("tick",scalingPopUpOutD);
            //自分のポップアップを大きくする
            createjs.Ticker.addEventListener("tick",scalingPopUpOverC);
        }

        //ボタンCに乗った時、マウスオーバー
        btn_C.addEventListener("mouseover",handleMouseOverC);
        function handleMouseOverC(event) {
            //console.log("over");
            //片側の選択を解除する
            mouseOver_D_flag = false;
            btn_D.choicedVisble = false;
            //片方のポップアップを小さくする
            createjs.Ticker.addEventListener("tick",scalingPopUpOutD);
            //マトリックスを強調表示
            matrix_box.moveCbox(true);
            //もう一方のポップアップを小さくする
            createjs.Ticker.removeEventListener("tick",scalingPopUpOutC);
            //自分のポップアップを大きくする
            createjs.Ticker.addEventListener("tick",scalingPopUpOverC);
            
        }
        function scalingPopUpOverC() {
            //console.log("scalingPop");
            scalingPopC += scalingPop_Rate_plus;
            if(scalingPopC > 1.0){
                scalingPopC = 1.0;
                createjs.Ticker.removeEventListener("tick",scalingPopUpOverC);
            }
            popUpMatrix_C.setScaleX = scalingPopC;
            popUpMatrix_C.setScaleY = scalingPopC;
            
        }

        //ボタンCから出た時、マウスアウト
        btn_C.addEventListener("mouseout",handleMouseOutC);
        function handleMouseOutC(event) {
            matrix_box.moveCbox(false);
            //console.log("out");

            if(!mouseOver_C_flag){
                player_C_flag = false;
                player_D_flag = false;
                createjs.Ticker.removeEventListener("tick",scalingPopUpOverC);
                createjs.Ticker.addEventListener("tick",scalingPopUpOutC);
            }
            
        }
        function scalingPopUpOutC() {
            //console.log("scalingPop");
            scalingPopC -= scalingPop_Rate_minus;
            if(scalingPopC < 0.0){
                scalingPopC = 0.0;
                createjs.Ticker.removeEventListener("tick",scalingPopUpOutC);
            }
            popUpMatrix_C.setScaleX = scalingPopC;
            popUpMatrix_C.setScaleY = scalingPopC;
            
        }


        //ボタンD
        var btn_D = new ChoiceButton("D","rgb(200,200,255)",40);
        gameUILayer.addChild(btn_D);
        btn_D.x = 220;
        btn_D.y = 360;

        //ボタンDをクリックしたとき
        btn_D.addEventListener("click",handleClickD);
        function handleClickD(event) {
            //console.log("click D");
            btn_C.choicedVisble = false;
            btn_D.choicedVisble = true;
            player_C_flag = false;
            player_D_flag = true;
            mouseOver_C_flag = false;
            mouseOver_D_flag = true;
            createjs.Ticker.addEventListener("tick",scalingPopUpOutC);
            createjs.Ticker.addEventListener("tick",scalingPopUpOverD);
            
        }

        //ボタンDをマウスオーバーしたとき
        btn_D.addEventListener("mouseover",handleMouseOverD);
        function handleMouseOverD(event) {
            //console.log("over");
            mouseOver_C_flag = false;
            btn_C.choicedVisble = false;
            createjs.Ticker.addEventListener("tick",scalingPopUpOutC);
            matrix_box.moveDbox(true);
            createjs.Ticker.removeEventListener("tick",scalingPopUpOutD);
            createjs.Ticker.addEventListener("tick",scalingPopUpOverD);
            
        }
        function scalingPopUpOverD() {
            //console.log("scalingPop");
            scalingPopD += scalingPop_Rate_plus;
            if(scalingPopD > 1.0){
                scalingPopD = 1.0;
                createjs.Ticker.removeEventListener("tick",scalingPopUpOverD);
            }
            popUpMatrix_D.setScaleX = scalingPopD;
            popUpMatrix_D.setScaleY = scalingPopD;
            
        }
        //ボタンDをマウスアウトしたとき
        btn_D.addEventListener("mouseout",handleMouseOutD);
        function handleMouseOutD(event) {
            matrix_box.moveDbox(false);
            //console.log("out");

            if(!mouseOver_D_flag){
                player_C_flag = false;
                player_D_flag = false;
                createjs.Ticker.removeEventListener("tick",scalingPopUpOverD);
                createjs.Ticker.addEventListener("tick",scalingPopUpOutD);
            }
            
        }
        function scalingPopUpOutD() {
            //console.log("scalingPop");
            scalingPopD -= scalingPop_Rate_minus;
            if(scalingPopD < 0.0){
                scalingPopD = 0.0;
                createjs.Ticker.removeEventListener("tick",scalingPopUpOutD);
            }
            popUpMatrix_D.setScaleX = scalingPopD;
            popUpMatrix_D.setScaleY = scalingPopD;
            
        }


        //ポップアップの位置
        var popUp_x = 0.2 * canvasWidth - 50;
        var popUp_y = 140;

        //ポップアップするマトリックス、Cを選んだ場合
        var popUpMatrix_C = new PopUpMatrix("rgba(180,100,150,0.8)","rgba(100,150,210,0.8)","C",debug);
        gameUILayer.addChild(popUpMatrix_C);
        popUpMatrix_C.x = popUp_x;
        popUpMatrix_C.y = popUp_y;
        this.popUpMatrix_C = popUpMatrix_C;

        //Dを選んだ場合のポップアップマトリックス
        var popUpMatrix_D = new PopUpMatrix("rgba(210,100,150,0.8)","rgba(150,100,210,0.8)","D",debug);
        gameUILayer.addChild(popUpMatrix_D);
        popUpMatrix_D.x = popUp_x;
        popUpMatrix_D.y = popUp_y;
        this.popUpMatrix_D = popUpMatrix_D;

        this.setValue();

        //デバッグ用,C、Dを選んでもう決定する
        if(false){
            var next_round = new ChoiceButton("NEXT","rgb(200,255,200)",40,debug);
            gameUILayer.addChild(next_round);
            next_round.x = 600;
            next_round.y = 400;
            next_round.addEventListener("click",handleClickRound);
            function handleClickRound(event) {
                if(!cpu_thinking_flag && !cpu_chose_flag){
                    if(player_C_flag || player_D_flag){
                        //chara.thinkingPop();
                        chara.agentChoice();
                        AI.think();

                        createjs.Ticker.addEventListener("tick",waiting);
            
                        function waiting(evnet) {
                            if(!cpu_chose_flag && !cpu_thinking_flag){
                                createjs.Ticker.removeEventListener("tick",waiting);
                                round += 1;
                                if(round > list_length - 1){
                                    round = 0;
                                }
                                choice_matrix = matrix_list[round];
            
                                a = choice_matrix[0];
                                b = choice_matrix[1];
                                c = choice_matrix[2];
                                d = choice_matrix[3];
                                e = choice_matrix[4];
                                f = choice_matrix[5];
                                g = choice_matrix[6];
                                h = choice_matrix[7];
            
                                matrix_box.setMatrixValue();
                                popUpMatrix_C.resetBarChild(a,b,e,f);
                                popUpMatrix_D.resetBarChild(c,d,g,h);
            
                                //game_stage.update();
                            }else{
                                //console.log("voting or thiking :");
                            }
                        }
                    }else{
                        console.log("please choice:");
                        alert("Please Choice C or D :");
                    }
                }else{
                    console.log("thinking!");
                }
                
            
            }

        }

        //選ぶクリックの処理
        btn_C.addEventListener("click",handleClickChoice);
        btn_D.addEventListener("click",handleClickChoice);
        //次のラウンドへ
        function handleClickChoice(event) {
            if(!cpu_thinking_flag && !cpu_chose_flag){
                if(player_C_flag || player_D_flag){
                    btn_C.removeEventListener("click",handleClickC);
                    btn_C.removeEventListener("mouseover",handleMouseOverC);
                    btn_C.removeEventListener("mouseout",handleMouseOutC);
                    btn_D.removeEventListener("click",handleClickD);
                    btn_D.removeEventListener("mouseover",handleMouseOverD);
                    btn_D.removeEventListener("mouseout",handleMouseOutD);

                    //chara.thinkingPop();
                    chara.agentChoice();
                    AI.think();

                    createjs.Ticker.addEventListener("tick",waiting);
        
                    function waiting(evnet) {
                        if(!cpu_chose_flag && !cpu_thinking_flag){
                            btn_C.choicedVisble = false;
                            btn_D.choicedVisble = false;


                            createjs.Ticker.removeEventListener("tick",waiting);
                            round += 1;
                            if(round > list_length - 1){
                                round = 0;
                            }
                            choice_matrix = matrix_list[round];
        
                            a = choice_matrix[0];
                            b = choice_matrix[1];
                            c = choice_matrix[2];
                            d = choice_matrix[3];
                            e = choice_matrix[4];
                            f = choice_matrix[5];
                            g = choice_matrix[6];
                            h = choice_matrix[7];
        
                            matrix_box.setMatrixValue();
                            popUpMatrix_C.resetBarChild(a,b,e,f);
                            popUpMatrix_D.resetBarChild(c,d,g,h);

                            player_C_flag = false;
                            player_D_flag = false;

                            btn_C.addEventListener("click",handleClickC);
                            btn_C.addEventListener("mouseover",handleMouseOverC);
                            btn_C.addEventListener("mouseout",handleMouseOutC);
                            btn_D.addEventListener("click",handleClickD);
                            btn_D.addEventListener("mouseover",handleMouseOverD);
                            btn_D.addEventListener("mouseout",handleMouseOutD);

                            btn_C.removeEventListener("click",handleClickChoice);
                            btn_D.removeEventListener("click",handleClickChoice);
                            btn_C.addEventListener("click",handleClickChoice);
                            btn_D.addEventListener("click",handleClickChoice);

        
                            //game_stage.update();
                        }else{
                            //console.log("choicing or thiking :");
                        }
                    }
                }else{
                    console.log("please choice:");
                    alert("Please Choice C or D :");
                }
            }else{
                console.log("thinking!");
            }
            
        
        }


        //相手の姿
        var chara = new Agent();
        gameUILayer.addChild(chara);
        chara.x = canvasWidth - chara.Width - 30;
        chara.y = canvasHeight - chara.Height - 100;
        //コンピュータのAI
        var AI = new IntelCPU(self_weight,other_weight);
        this.AI = AI;

        this.game_stage.update();

        //UIを見せる
        gameUILayer.visible = true;

        //ロード画面を透明にする
        load_Layer.clearLoad();


    }

    //マトリックスにセットする
    setValue() {
        choice_matrix = matrix_list[round];
            
        a = choice_matrix[0];
        b = choice_matrix[1];
        c = choice_matrix[2];
        d = choice_matrix[3];
        e = choice_matrix[4];
        f = choice_matrix[5];
        g = choice_matrix[6];
        h = choice_matrix[7];

        this.matrix_box.setMatrixValue();

        this.popUpMatrix_C.resetBarChild(a,b,e,f);
        this.popUpMatrix_D.resetBarChild(c,d,g,h);

    }


}

var mouseOver_C_flag = false;
var mouseOver_D_flag = false;
var scalingPopC = 0.0;
var scalingPopD = 0.0;
var scalingPop_Rate_plus = 0.1;
var scalingPop_Rate_minus = 0.3;

//ロード画面
class LoadingDisplay extends createjs.Container {

    constructor(){
        super();

        //if(debug)this.visible = false;

        //ロードの全画面
        var load_bg = new createjs.Shape();
        //全画面を隠す黒い四角形を描く
        load_bg.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .beginFill("black")
            .drawRect(0,0,canvasWidth,canvasHeight);
        this.addChild(load_bg);

        //「ロード中」のテキスト
        var load_text = new createjs.Text("", "24px sans-serif", "white");
        load_text.text = "Now loading...";
        //中心にセット
        load_text.x = canvasWidth / 2;
        load_text.y = canvasHeight / 2;
        load_text.textAlign = "center";
        load_text.textBaseline = "middle";
        this.addChild(load_text);

    }

    //ロード画面を透明にしていく
    clearLoad(e) {
        //自分のアドレス
        var this_obj = this;
        //ロード画面の明るさ
        var alpha_Load = 1.0;
        //tickに追加、定期的に実行される
        createjs.Ticker.addEventListener("tick",clear);
        //実際に明るくする関数
        function clear(params) {
            //console.log("clearLoad : ");
            alpha_Load -= 0.05;
            if(debug)alpha_Load=-1;
            if(alpha_Load < 0){
                createjs.Ticker.removeEventListener("tick",clear);
                this_obj.visible = false;
    
                game_stage.enableMouseOver();
            }
            this_obj.alpha = alpha_Load;
        }
        
    }

}

//思考するCPUの中
class IntelCPU {
    constructor(self_w=1,other_w=0){
        this.self_w = self_w;
        this.other_w = other_w;

        cpu_thinking_flag = false;
        //this.think();

    }

    think(){
        cpu_thinking_flag = true;
        var result = ((a * this.other_w + b * this.self_w) / 2 + (c * this.other_w + d * this.self_w) / 2) - ((e * this.other_w + f * this.self_w) / 2 + (g * this.other_w + h * this.self_w) / 2);
        console.log(result);
        if(result>=0){
            console.log("C");
            cpu_C_flag = true;
            cpu_D_flag = false;
        }else{
            cpu_C_flag = false;
            cpu_D_flag = true;
            console.log("D");
        }
        var random = xRandomNormal(1,0.5);
        var time_race = random * 2 + 10;
        console.log(time_race + " : time race");
        createjs.Ticker.addEventListener("tick",timeThink);
        function timeThink(e) {
            console.log("thinking :");
            time_race -= 1;
            if(time_race < 0){
                createjs.Ticker.removeEventListener("tick",timeThink);
                cpu_thinking_flag = false;
                cpu_chose_flag = true;
                console.log("end:");
            }
        }

    }
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

//エージェント
class Agent extends createjs.Container {

    constructor(){
        super();

        var Wid = 150;
        var Hei = 300;
        this.Wid = Wid;
        this.Hei = Hei;

        var box = new createjs.Shape();
        box.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .drawRect(0,0,Wid,Hei)
        this.addChild(box);

        var body = new BodyObject();
        this.addChild(body);
        body.x = Wid/2 - body.Width/2;
        body.y = Hei/2-30;

        var right_arm = new ArmObject(true);
        this.addChild(right_arm);
        right_arm.x = body.x + right_arm.Width - 10;
        right_arm.y = 140;
        right_arm.rotation = 10;

        var left_arm = new ArmObject(false);
        this.addChild(left_arm);
        left_arm.x = body.Width + 10;
        left_arm.y = 140;
        left_arm.rotation = -10;

        var head = new HeadObject();
        this.addChild(head);
        head.x = Wid/2 - head.Width/2;
        head.y = 50;


        var grgr = new createjs.Container();
        this.addChild(grgr);
        this.grgr = grgr;
        grgr.x = this.Wid / 2;
        //grgr.y = -20;
        this.thinkingPop();

        var vote_zone = new createjs.Container();
        this.addChild(vote_zone);
        this.vote_zone = vote_zone;
        vote_zone.visible = false;
        vote_zone.x = -30;
        vote_zone.y = 110;

        var image_size = 100;
        var image = new createjs.Bitmap(vote_image);
        vote_image.onload = () => {

            image.scaleX = - image_size / image.getBounds().width;
            image.scaleY = image.scaleX * 1.5;

            image.regX = image.getBounds().width / 2;
            image.regY = image.getBounds().height / 2;

            image.rotation += 90;
        }
        vote_zone.addChild(image);

        var vote_text = new createjs.Text("", "50px sans-serif", "white");
        this.vote_text = vote_text;
        vote_text.text = "C";
        vote_text.x = -25;
        vote_text.y = -25;
        vote_zone.addChild(vote_text);

        //image.x = 60;
        //image.y = 0;

        //this.voteChoice();

    }

    get Width() {
        return this.Wid;
    }

    get Height() {
        return this.Hei;
    }

    thinkingPop(){

        
        var image_size = 100;
        var image = new createjs.Bitmap(think_image);
        think_image.onload = () => {

            image.scaleX = image_size / image.getBounds().width;
            image.scaleY = image.scaleX;

            image.regX = image.getBounds().width / 2;
            image.regY = image.getBounds().height / 2;
        }
    
        this.grgr.addChild(image);
        image.x = 60;
        image.y = 0;

        var scale = image.scaleX;
        var low = scale;
        var high = scale+0.2;
        var rate = 0.02;
        image.scaleX = scale;
        image.scaleY = scale;
        createjs.Ticker.addEventListener("tick",grgrMotion);
        function grgrMotion(event) {
            if(cpu_thinking_flag){
                image.visible = true;

                scale += rate;
                if(scale > high || scale < low){
                    rate *= -1;
                }
                image.scaleX += rate;
                image.scaleY += rate;

            }else{
                image.visible = false;
                image.scaleX = image_size / image.getBounds().width;
                image.scaleY = image.scaleX;
                if(rate<0)rate*=-1;
                //createjs.Ticker.removeEventListener("tick",grgrMotion);

            }
            
        }

    }

    agentChoice() {
        var vote_zone = this.vote_zone;
        var vote_text = this.vote_text;
        createjs.Ticker.addEventListener("tick",voteCheck);
        function voteCheck(event) {
            if(!cpu_chose_flag){
                vote_zone.visible = false;

            }else{
                vote_zone.visible = true;

                if(cpu_C_flag){
                    vote_text.text = "C";
                    vote_zone.y = 110;

                }else if(cpu_D_flag){
                    vote_text.text = "D";
                    vote_zone.y = 210;
                }

                createjs.Ticker.removeEventListener("tick",voteCheck);

                var time_race = 50;
                createjs.Ticker.addEventListener("tick",voteMotion);
                function voteMotion(event) {
                    console.log("racing :");
                    time_race -= 1;
                    if(time_race < 0){
                        cpu_chose_flag = false;
                        createjs.Ticker.removeEventListener("tick",voteMotion);
                        vote_zone.visible = false;
                    }
                    
                }

            }
            
        }
    }
}

//頭のクラス
class HeadObject extends createjs.Container {

    constructor(){
        super();

        var wid = 80;
        this.wid = wid;
        var hei = 80;

        this.container = new createjs.Container();
        this.addChild(this.container);

        var head = new createjs.Shape();
        head.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .beginFill("white")
            .drawRect(0,0,wid,hei)
            .drawCircle(wid/2,wid/2,wid/2)
        this.container.addChild(head);

        var y_s = 0;
        var upFlag = true;
        var up = 0.1;
        var down = 0.1;

        createjs.Ticker.addEventListener("tick",rote);
        function rote() {
            if(upFlag){
                head.y += up;
                y_s += up;
            }else{
                head.y -= down;
                y_s -= down;
            }

            if(y_s > 2)upFlag=false;
            if(y_s < -1)upFlag=true;
            
            
        }
    }

    get Width() {
        return this.wid;
    }

    motion() {
        this.container.rotation += 1;
    }

}

//体のクラス
class BodyObject extends createjs.Container {
    
    constructor(){
        super();

        var wid = 100;
        this.wid = wid;
        var hei = 150;

        this.container = new createjs.Container();
        this.addChild(this.container);

        var body = new createjs.Shape();
        body.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .beginFill("white")
            .drawRect(0,0,wid,hei)
        this.container.addChild(body);

        var y_s = 0;
        var upFlag = true;
        var up = 0.25;
        var down = 0.2;

        createjs.Ticker.addEventListener("tick",rote);
        function rote() {
            if(upFlag){
                body.y += up;
                y_s += up;
            }else{
                body.y -= down;
                y_s -= down;
            }

            if(y_s > 3)upFlag=false;
            if(y_s < 0)upFlag=true;
            
            
        }
    }

    get Width() {
        return this.wid;
    }

    motion() {
        this.container.rotation += 1;
    }
}

//腕のクラス
class ArmObject extends createjs.Container {

    constructor(right=true){
        super();

        var wid = 30;
        this.wid = wid;
        var hei = 100;

        var container = new createjs.Container();
        this.addChild(container);

        var arm = new createjs.Shape();
        arm.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .beginFill("white")
            .drawRect(0,0,wid,hei)
        container.addChild(arm);

        if(right)arm.scaleX = -1.0;

        var rotate = 0;
        var upFlag = true;
        var rot = -1;
        if(right)rot = 1;
        var up = 0.5 * rot;
        var down = 0.4 * rot;

        createjs.Ticker.addEventListener("tick",rote);
        function rote() {
            if(upFlag){
                container.rotation += up;
                rotate += up;
            }else{
                container.rotation -= down;
                rotate -= down;
            }

            if(right){
                if(rotate > 20)upFlag=false;
                if(rotate < 0)upFlag=true;
            }else{
                if(rotate < -20)upFlag=false;
                if(rotate > 0)upFlag=true;
            }
            
            
        }

        var image = new Image();
        image.src = "./images/arm_2.png";
        image.onload = () => {

            var arm_image = new createjs.Bitmap(image);
    
            arm_image.scaleX = wid / arm_image.getBounds().width * -rot;
            arm_image.scaleY = hei / arm_image.getBounds().height;

            container.addChild(arm_image);

        }
    }

    get Width(){
        return this.wid;
    }

    motion() {
        this.container.rotation += 1;
    }
}

//マトリックス
class MatrixBox extends createjs.Container {

    constructor(DEBUG=false){
        super();

        //大きさ
        var matrixW = 0.2 * canvasWidth;
        var matrixH = 0.2 * canvasHeight;

        var WSpa = 10;
        var HSpa = 10;

        // 座布団を作成
        var bg = new createjs.Shape();
        bg.graphics
              .setStrokeStyle(1)
              .beginStroke("#563d7c")
              .beginFill("white")
              .drawRoundRect(0, 0, matrixW, matrixH, 4);
        
        if(DEBUG)this.addChild(bg);

        this.bg_W = matrixW/2-WSpa;
        this.bg_H = matrixH-HSpa;
        //Cの座布団
        this.C_bg = new createjs.Shape();
        this.C_bg.graphics
              .setStrokeStyle(1)
              .beginStroke("#563d7c")
              .beginFill("rgb(205,100,100)")
              .drawRoundRect(0, 0, matrixW/2-WSpa, matrixH-HSpa, 4);
        this.C_bg.x = WSpa / 2;
        this.C_bg.y = HSpa / 2;
        
        this.addChild(this.C_bg);

        //Dの座布団
        this.D_bg = new createjs.Shape();
        this.D_bg.graphics
              .setStrokeStyle(1)
              .beginStroke("#563d7c")
              .beginFill("rgb(100,100,205)")
              .drawRoundRect(0, 0, matrixW/2-WSpa, matrixH-HSpa, 4);
        this.D_bg.x = WSpa / 2 + matrixW / 2;
        this.D_bg.y = HSpa / 2;
        
        this.addChild(this.D_bg);

        var widSpa = 10;
        var boxW = matrixW / 4 - widSpa;
        var heiSpa = 10;
        var boxH = matrixH / 2 - heiSpa;

        function setBox(Oya,boxW,boxH,i,j,fillColor="white") {
            var box = new Box(boxW,boxH,i*4+j,fillColor);
            box.addEventListener("click", handleClick);
            function handleClick(event) {
                //box.Value = 20;
                if(DEBUG)console.log(box.Value);
            }
            Oya.addChild(box);

            box.x = j * boxW + j * widSpa + widSpa / 2;
            box.y = i * boxH + i * heiSpa + heiSpa / 2;

            return box;
        }

        var pColor = "rgb(255,200,200)";
        this.box_0 = setBox(this,boxW,boxH,0,0,pColor);
        this.box_1 = setBox(this,boxW,boxH,0,1);
        this.box_2 = setBox(this,boxW,boxH,0,2,pColor);
        this.box_3 = setBox(this,boxW,boxH,0,3);

        this.box_4 = setBox(this,boxW,boxH,1,0,pColor);
        this.box_5 = setBox(this,boxW,boxH,1,1);
        this.box_6 = setBox(this,boxW,boxH,1,2,pColor);
        this.box_7 = setBox(this,boxW,boxH,1,3);

        // ラベルを作成
        var label = new createjs.Text("Matrix", "24px sans-serif", "#563d7c");
        label.x = matrixW / 2;
        label.y = matrixH / 2;
        label.textAlign = "center";
        label.textBaseline = "middle";
        // ラベルの配置場所を調整 (省略)
        if(DEBUG){
            this.addChild(label);
        }

    }

    setMatrixValue() {
        this.box_0.Value = a;
        this.box_1.Value = b;
        this.box_2.Value = c;
        this.box_3.Value = d;
        this.box_4.Value = e;
        this.box_5.Value = f;
        this.box_6.Value = g;
        this.box_7.Value = h;

    }

    moveCbox(flag=true){
        //console.log("moveC");
        this.box_0.move(flag);
        this.box_1.move(flag);
        this.box_4.move(flag);
        this.box_5.move(flag);

        this.moveThis(flag,this.C_bg,this.bg_W,this.bg_H,"rgb(205,100,100)");

    }

    moveDbox(flag=true){
        //console.log("moveC");
        this.box_2.move(flag);
        this.box_3.move(flag);
        this.box_6.move(flag);
        this.box_7.move(flag);

        this.moveThis(flag,this.D_bg,this.bg_W,this.bg_H,"rgb(100,100,205)");

    }

    moveThis(flag,box,boxW,boxH,fillColor) {
        if(flag){
            sizingThis(10,fillColor);
        }else{
            sizingThis(0,fillColor);
        }

        function sizingThis(shape_scale,fillColor,storokeStyle=1,strokeColor="#563d7c") {
            box.graphics
                .clear()
                .setStrokeStyle(storokeStyle)
                .beginStroke(strokeColor)
                .beginFill(fillColor)
                .drawRoundRect(-shape_scale/2, -shape_scale/2, boxW+shape_scale,boxH+shape_scale, 4);

        }
    }

}

//マトリックスの箱の数値
class Box extends createjs.Container {
    value = 0;

    constructor(boxW,boxH,value=0,fillColor="white",DEBUG=false){
        super();
        // 座布団を作成

        this.boxW = boxW;
        this.boxH = boxH;
        this.value = value;
        this.fillColor = fillColor;

        this.box = new createjs.Shape();
        this.addChild(this.box);
        this.box.graphics
            .setStrokeStyle(1)
            .beginStroke("#563d7c")
            .beginFill(fillColor)
            .drawRoundRect(0, 0, boxW, boxH, 4);

        // ラベルを作成
        this.boxL = new createjs.Text(String(this.value), "24px sans-serif", "#563d7c");
        this.addChild(this.boxL);

        this.boxL.x = boxW / 2;
        this.boxL.y = boxH / 2;
        this.boxL.textAlign = "center";
        this.boxL.textBaseline = "middle";

        // イベントを登録
        this.addEventListener("click", handleClick);
        function handleClick(event) {
            // クリックされた時の処理を記述
            if(DEBUG)console.log("this is "+ String(value));
        }

    }

    set Value(value) {
        this.value = value;
        this.boxL.text = String(value);
    }

    get Value() {
        return this.value;
    }

    move(flag) {
        var box = this.box;
        var boxW = this.boxW;
        var boxH = this.boxH;
        var fillColor = this.fillColor;
        if(flag){
            sizingBox(4,fillColor);
        }else{
            sizingBox(0,fillColor);
        }

        function sizingBox(shape_scale,fillColor,storokeStyle=1,strokeColor="#563d7c") {
            box.graphics
                .clear()
                .setStrokeStyle(storokeStyle)
                .beginStroke(strokeColor)
                .beginFill(fillColor)
                .drawRoundRect(-shape_scale/2, -shape_scale/2, boxW+shape_scale,boxH+shape_scale, 4);
               
                //label.font = String(fontSize+shape_scale/2) + "px sans-serif";
        }
    }

}

//ポップアップマトリックス
class PopUpMatrix extends createjs.Container {

    constructor(UpColor="rgba(255,0,0,0.2)",DownColor="rgba(0,0,255,0.2)",name="DEFAULT",DEBUG=false){
        super();

        var Wid = 420;
        var Hei = 200;

        var position_C = Wid / 4 - 10;
        var position_D = Wid / 4 * 3 - 10;

        var pop_Wid = Wid - 20;
        var pop_Hei = (Hei - 20 ) / 2;

        // 座布団を作成
        var bg = new createjs.Shape();
        bg.graphics
            .clear()
            .setStrokeStyle(1)
            .beginStroke("#563d7c")
            .beginFill("white")
            .drawRoundRect(0, -30, Wid, Hei+50, 30);
        if(DEBUG)this.addChild(bg);

        var bg_top = new createjs.Shape();
        bg_top.graphics
            .clear()
            .setStrokeStyle(1)
            .beginStroke(DownColor)
            .beginFill(UpColor)
            .drawRoundRect(0, 0, Wid - 240, 50, 10);
        bg_top.x = 120;
        bg_top.y = -75;
        this.addChild(bg_top);


        var label_top = new createjs.Text("", "24px sans-serif", "white");
        label_top.text = "if choice " + name;
        label_top.x = Wid / 2 - 10;
        label_top.y = -50;
        label_top.textAlign = "center";
        label_top.textBaseline = "middle";
        // ラベルの配置場所を調整
        this.addChild(label_top);


        var bg_C = new createjs.Shape();
        bg_C.graphics
            .clear()
            .setStrokeStyle(1)
            .beginStroke("coral")
            .beginFill("coral")
            .drawRoundRect(0, 0, pop_Wid / 2 - 10, Hei + 30, 10);
        bg_C.x = 5;
        bg_C.y = -20;
        //this.addChild(bg_C);

        var label_C = new createjs.Text("", "24px sans-serif", "black");
        label_C.text = "your points";
        label_C.x = position_C;
        label_C.textAlign = "center";
        label_C.textBaseline = "middle";
        // ラベルの配置場所を調整
        this.addChild(label_C);


        var bg_D = new createjs.Shape();
        bg_D.graphics
            .clear()
            .setStrokeStyle(1)
            .beginStroke("purple")
            .beginFill("purple")
            .drawRoundRect(0, 0, pop_Wid / 2 - 10, Hei + 30, 10);
        bg_D.x = pop_Wid / 2 + 5;
        bg_D.y = -20;
        //this.addChild(bg_D);

        var label_D = new createjs.Text("", "24px sans-serif", "black");
        label_D.text = "CPU points";
        label_D.x = position_D;
        label_D.textAlign = "center";
        label_D.textBaseline = "middle";
        // ラベルの配置場所を調整
        this.addChild(label_D);

        this.barUp = new PopUpBar(UpColor,pop_Wid,pop_Hei);
        this.addChild(this.barUp);
        this.barUp.y = 20;

        this.barDown = new PopUpBar(DownColor,pop_Wid,pop_Hei);
        this.addChild(this.barDown);
        this.barDown.y = 120;

        this.scaleX = 0.0;
        this.scaleY = 0.0;

        this.resetBarChild();

    }

    set setScaleX(value) {
        this.scaleX = value;
    }

    set setScaleY(value) {
        this.scaleY = value;
    }

    resetBarChild(a,b,e,f) {

        this.barUp.resetBoxChild(a,b);
        this.barDown.resetBoxChild(e,f);

    }

}

//ポップアップバー
class PopUpBar  extends createjs.Container {

    constructor(fillColor="rgba(0,0,255,0.2)",Wid=400,Hei=90,DEBUG=false){
        super();
        
        this.Wid = Wid; // 横幅
        var widSpa = 40;
        this.Hei = Hei; // 高さ
        var heiSpa = 20;

        // 座布団を作成
        var bg = new createjs.Shape();
        bg.graphics
              .setStrokeStyle(1)
              .beginStroke("#563d7c")
              .beginFill(fillColor)
              .drawRoundRect(0, 0, Wid, Hei, 4);
        // 座布団のグラフィックを描く (省略)
        this.addChild(bg);

        //自分の報酬を表示する
        this.C_bg = new PopUpBox(Wid,widSpa,Hei,heiSpa,fillColor);

        this.addChild(this.C_bg);

        //相手の報酬を表示する
        this.D_bg = new PopUpBox(Wid,widSpa,Hei,heiSpa,fillColor);
        this.D_bg.x = Wid / 2;
       
        this.addChild(this.D_bg);

        // ラベルを作成
        var label = new createjs.Text("", "30px sans-serif", "#563d7c");
        if(DEBUG)label.text = "Pop Up";
        label.x = Wid / 2;
        label.y = Hei / 2;
        label.textAlign = "center";
        label.textBaseline = "middle";
        this.addChild(label);

    }

    resetBoxChild(a,b) {
        this.C_bg.resetChild(a);

        this.D_bg.resetChild(b);
    }

}

//報酬の表示
class PopUpBox extends createjs.Container {

    constructor(Wid,widSpa,Hei,heiSpa,fillColor){
        super();

        this.Wid = Wid;
        this.widSpa = widSpa;
        this.wid_size = Wid/2-widSpa;
        this.Hei = Hei;
        this.heiSpa = heiSpa;
        this.fillColor = fillColor;

        //自分の報酬を表示する
        var bg = new createjs.Shape();
        bg.graphics
            .setStrokeStyle(1)
            .beginStroke("#563d7c")
            .beginFill(fillColor)
            .drawRoundRect(widSpa/2, heiSpa/2, Wid/2-widSpa, Hei-heiSpa, 4);
        
        this.addChild(bg);
    }

    resetChild(a=0) {
        this.removeAllChildren();
        //自分の報酬を表示する
        var bg = new createjs.Shape();
        bg.graphics
            .setStrokeStyle(1)
            .beginStroke("#563d7c")
            .beginFill(this.fillColor)
            .drawRoundRect(this.widSpa/2, this.heiSpa/2, this.Wid/2-this.widSpa, this.Hei-this.heiSpa, 4);
                
        this.addChild(bg);

        // ラベルを作成
        var label = new createjs.Text("", "30px sans-serif", "#563d7c");
        label.text = String(a);
        label.x = 10;
        label.y = 0;
        label.textAlign = "center";
        label.textBaseline = "middle";
        //this.addChild(label);

        //表示先コンテナ
        var contena = new createjs.Container();
        this.addChild(contena);

        var put_point = 0;
        var putSp = 10;

        var deer_ten = 3;
        var deer_s = parseInt(a/deer_ten);
        var deer_size = 50;
        a = a % deer_ten;
        if(deer_s != 0){
            for(var i=0;i<deer_s;i++){
                this.addImagePoint(contena,put_point,this.Hei-deer_size-this.heiSpa,deer_ten,"./images/deer.png",deer_size,"white","red");
                put_point += deer_size + putSp;
            }
        }

        var rabbit_ten = 2;
        var rabbit_s = parseInt(a/rabbit_ten);
        var rabbit_size = 45;
        a = a % rabbit_ten;
        if(rabbit_s != 0){
            for(var i=0;i<rabbit_s;i++){
                this.addImagePoint(contena,put_point,this.Hei-rabbit_size-this.heiSpa,rabbit_ten,"./images/rabbit.png",rabbit_size,"white","blue");
                put_point += rabbit_size + putSp;
            }
        }

        var rat_ten = 1;
        var rat_s = parseInt(a/rat_ten);
        var rat_size = 40;
        a = a % rat_ten;
        if(rat_s != 0){
            for(var i=0;i<rat_s;i++){
                this.addImagePoint(contena,put_point,this.Hei-rat_size-this.heiSpa,rat_ten,"./images/rat.png",rat_size,"white","green");
                put_point += rat_size + putSp;
            }
        }

        contena.x = (this.wid_size - put_point) / 2;

    }

    addImagePoint(oya_cont,x=0,y=0,SCORE=0,image_src="./images/deer.png",size=60,textColor="black",fillColor="white") {
        var image = new Image();
        image.src = image_src;
        image.onload = () => {
            var con = new createjs.Container();
            oya_cont.addChild(con);
            con.x = x+this.widSpa/2;
            con.y = y+this.heiSpa/2 - 10;

            var En_size = size / 2;
            var En = new createjs.Shape();
            En.graphics
                .setStrokeStyle(1)
                .beginStroke("black")
                .beginFill("rgba(255,255,255,0.8)")
                .drawCircle(En_size,En_size,En_size);
            con.addChild(En);

            var point = new createjs.Bitmap(image);
        
            //point.x = x+this.widSpa/2;
            //point.y = y+this.heiSpa/2;
    
            point.scaleX = size / point.getBounds().width;
            point.scaleY = point.scaleX;
        
            //point.regX = 0;
            //point.regY = 0;

            con.addChild(point)

            var ten_size = 10;
            var ten = new createjs.Shape();
            ten.graphics
                .setStrokeStyle(1)
                .beginStroke("white")
                .beginFill(fillColor)
                .drawCircle(0,En_size+ten_size,ten_size)
            con.addChild(ten);

            var label = new createjs.Text("", "20px sans-serif", textColor);
            label.text = String(SCORE);
            label.x = 0;
            label.y = En_size+ten_size;
            label.textAlign = "center";
            label.textBaseline = "middle";
            con.addChild(label);

        }
    }
}

//ボタン
class ChoiceButton extends createjs.Container {

    constructor(name="Button",fillColor="white",fontSize=40,DEBUG=debug){
        super();

        var btnW = 150; // ボタンの横幅
        var btnH = 75; // ボタンの高さ
        var spa = 50;

        var fontSize = fontSize;

        var choice_bg = new createjs.Shape();
        choice_bg.graphics
            .clear()
            .setStrokeStyle(0)
            .beginFill("yellow")
            .drawRoundRect(-spa/2,-spa/2, btnW+spa,btnH+spa,30)
        this.addChild(choice_bg);
        choice_bg.visible = false;
        this.choice_bg = choice_bg;

        // 座布団を作成
        var bg = new createjs.Shape();
        bg.graphics
                .clear()
                .setStrokeStyle(1)
                .beginStroke("#563d7c")
                .beginFill(fillColor)
                .drawRoundRect(0, 0, btnW, btnH, 30);
        // 座布団のグラフィックを描く (省略)
        this.addChild(bg);

        // ラベルを作成
        var label = new createjs.Text(name, String(fontSize)+"px sans-serif", "#563d7c");
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
            if(DEBUG)console.log("click!");
            createjs.Ticker.removeEventListener("tick", lessMouseDown);
            createjs.Ticker.addEventListener("tick", biggerHover);
        }

        //マウスダウン
        this.addEventListener("mousedown", handleMouseDown);
        function handleMouseDown(event) {
            if(DEBUG)console.log("click?");
            createjs.Ticker.addEventListener("tick", lessMouseDown);

        }
        //変化量
        var shape_scale = 0;

        function lessMouseDown() {
            shape_scale -= 5;
            if(shape_scale < 10){
                shape_scale = 10;
                createjs.Ticker.removeEventListener("tick", lessMouseDown);
            }
            sizingBtn(shape_scale);
        }

        //マウスオーバー
        this.addEventListener("mouseover", handleMouseOver);

        // マウスオーバーしたとき
        function handleMouseOver(event) {
            createjs.Ticker.removeEventListener("tick", lessHover);
            createjs.Ticker.addEventListener("tick", biggerHover);

        }

        //大きくなる処理
        function biggerHover() {
            shape_scale += 5;
            if(shape_scale > 20){
                shape_scale = 20;
                createjs.Ticker.removeEventListener("tick", biggerHover);
            }
            sizingBtn(shape_scale);
        }

        this.addEventListener("mouseout", handleMouseOut);

        // マウスアウトしたとき
        function handleMouseOut(event) {
            createjs.Ticker.removeEventListener("tick", biggerHover);
            createjs.Ticker.addEventListener("tick", lessHover);

        }

        //小さくなる処理
        function lessHover() {
            shape_scale -= 5;
            if(shape_scale < 0){
                shape_scale = 0;
                createjs.Ticker.removeEventListener("tick", lessHover);
            }
            sizingBtn(shape_scale);
        }

        function sizingBtn(shape_scale,storokeStyle=1,strokeColor="#563d7c") {
            bg.graphics
                .clear()
                .setStrokeStyle(storokeStyle)
                .beginStroke(strokeColor)
                .beginFill(fillColor)
                .drawRoundRect(-shape_scale/2, -shape_scale/2, btnW+shape_scale,btnH+shape_scale, 30);
       
            label.font = String(fontSize+shape_scale/2) + "px sans-serif";
        }

    }

    set choicedVisble(value=true){
        this.choice_bg.visible = value;

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


//以下、使わないことに。。。

//共有情報を持つ親クラス
class SuperObject {
    x = 0;
    y = 0;

    width = 10;
    height = 10;

    fillColor = "white";
    strokeColor = "Black";
    strokeSize = 2;

    shape = new createjs.Shape();

    constructor(stage,x=this.x,y=this.y,width=this.width,height=this.height,fillColor=this.fillColor,strokeColor=this.strokeColor,strokeSize=this.strokeSize) {
        this.stage = stage;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeSize = strokeSize;

        //this.shape = new createjs.Shape();
        this.shaping();

    }

    //オブジェクトの位置
    //flagでオブジェクトを表示するか決定
    shaping(flag=true) {
        var stage = this.stage;
        var shape = this.shape;
        stage.addChild(shape);
        shape.graphics
            .beginFill(this.fillColor)
            .beginStroke(this.strokeColor)
            .setStrokeStyle(this.strokeSize)
            .drawRect(this.x,this.y,this.width,this.height)
            .endFill()
            .endStroke();

        this.shape.visible = flag;

    }


}

//ホバー,クリックオブジェクト
class HoverClickObject extends SuperObject {
    shape_scale = 40;
    sign = "";

    constructor(stage,x=250,y=250,width=100,height=100,fillColor="white",strokeColor="black",strokeSize=1,sign=""){
        super(stage,x,y,width,height,fillColor,strokeColor,strokeSize);
        this.sign = sign;
        this.shape_scale = 40;

        this.shaping();


        this.container = new createjs.Container();
        this.container.x = this.x;
        this.container.y = this.y;
        stage.addChild(this.container);

        this.active();

    }

    active(){
        //関数内で使うときは呼び出す必要がある
        var x = this.x;
        var y = this.y;
        var width = this.width;
        var wid_cent = width / 2;
        var height = this.height;
        var hei_cent = height / 2;

        var sign = this.sign;

        var button = this.shape;

        button.x = wid_cent;
        button.y = hei_cent;
        button.regX = wid_cent;
        button.regY = hei_cent;

        //変化量
        var shape_scale = 0;

        var fillColor = this.fillColor;
        var strokeColor = this.strokeColor;

        // 各種マウスイベントを登録する
        button.addEventListener("click", handleClick);
        button.addEventListener("mousedown", handleMouseDown);
        button.addEventListener("mouseover", handleMouseOver);
        button.addEventListener("mouseout", handleMouseOut);

        function handleClick(event) {
            console.log("click!"+sign);
            //console.log(sign);
            createjs.Ticker.removeEventListener("tick", lessMouseDown);
            createjs.Ticker.addEventListener("tick", biggerHover);
            
        }

        function handleMouseDown(event) {
            //console.log("click?");
            createjs.Ticker.addEventListener("tick", lessMouseDown);

        }

        function lessMouseDown() {
            shape_scale -= 5;
            if(shape_scale < 10){
                shape_scale = 10;
                createjs.Ticker.removeEventListener("tick", lessMouseDown);
            }
            // 緑で塗り直す
            button.graphics
                .clear()
                .beginFill(fillColor)
                .beginStroke(strokeColor)
                .drawRect(x-shape_scale/2, y-shape_scale/2, width+shape_scale,height+shape_scale);
            
        }

        // マウスオーバーしたとき
        function handleMouseOver(event) {
            createjs.Ticker.removeEventListener("tick", lessHover);
            createjs.Ticker.addEventListener("tick", biggerHover);

        }

        //大きくなる処理
        function biggerHover() {
            shape_scale += 5;
            if(shape_scale > 20){
                shape_scale = 20;
                createjs.Ticker.removeEventListener("tick", biggerHover);
            }
            // 緑で塗り直す
            button.graphics
                .clear()
                .beginFill(fillColor)
                .beginStroke(strokeColor)
                .drawRect(x-shape_scale/2, y-shape_scale/2, width+shape_scale,height+shape_scale);
        }

        // マウスアウトしたとき
        function handleMouseOut(event) {
            createjs.Ticker.removeEventListener("tick", biggerHover);
            createjs.Ticker.addEventListener("tick", lessHover);

        }

        //小さくなる処理
        function lessHover() {
            shape_scale -= 5;
            if(shape_scale < 0){
                shape_scale = 0;
                createjs.Ticker.removeEventListener("tick", lessHover);
            }
            // 緑で塗り直す
            button.graphics
                .clear()
                .beginFill(fillColor)
                .beginStroke(strokeColor)
                .drawRect(x-shape_scale/2, y-shape_scale/2, width+shape_scale,height+shape_scale);
        }

    }

}

//ゲームマトリックスのクラス
class MatrixBox_old extends SuperObject {
    wid_per = 0.2;
    hei_per = 0.2;

    constructor(stage) {
        super(stage,0,0,0,0,"white","black",1);

        this.x = 10;
        this.y = 10;
        this.width = this.wid_per * canvasWidth;
        this.height = this.hei_per * canvasHeight;

        this.shaping(true);


        this.container = new createjs.Container();
        this.container.x = this.x;
        this.container.y = this.y;
        stage.addChild(this.container);

        this.setBox();

    }

    setBox() {
        for(var i = 0;i < 2;i++){
            for(var j = 0;j < 4;j++){
                // boxを作る
                var box = new createjs.Shape();
                var space_wid = this.width / 4;
                var space_hei = this.height / 2;
                //割合サイズ
                var sizing = 0.7;
                var box_wid = space_wid * sizing;
                var box_hei = space_hei * sizing;


                var value_text = new createjs.Text();

                value_text.text = String(i+j);

                var font_size = box_wid;
                if(box_wid > box_hei){
                    font_size = box_hei;
                }
                value_text.font = String(font_size) + "px serif";

                value_text.color = "rgb(100,100,140)";
                value_text.textAlign = "center";
                value_text.regX = - box_wid / 2;
                value_text.regY = - box_hei / 2 + font_size / 2;

                box.graphics.beginFill(this.fillColor);

                if(j%2 == 0){
                    box.graphics.beginFill("rgb(200,120,120)");
                    value_text.color = "rgb(250,250,255)";
                }
                box.graphics
                    .beginStroke(this.strokeColor)
                    .drawRect(0,0,box_wid,box_hei);
                // 配置
                box.x = j * space_wid + space_wid * (1 - sizing) / 2;
                box.y = i * space_hei + space_hei * (1 - sizing) / 2;
                value_text.x = box.x;
                value_text.y = box.y;

                // グループに追加
                this.container.addChild(box);
                this.container.addChild(value_text);

            }

        }

    }

}

//ボタンを管理するクラス
class ButtonZone extends SuperObject {
    wid_per = 0.5;
    hei_per = 0.2;

    constructor(stage){
        super(stage,10,0,0,0,"white","Black",1);

        this.width = canvasWidth * this.wid_per;
        this.height = canvasHeight * this.hei_per;
        this.y = canvasHeight - 10 - this.height;

        this.shaping(true);

        this.buttonSet();

    }

    buttonSet() {
        var wid = this.width * 0.3;
        var hei = this.height * 0.8;

        //間隔
        var spa_x = 10;
        var spa_y = (this.height - hei) / 2;

        var strokeColor = this.strokeColor;
        var fillColor_1 = "red";
        var sign_1 = "C";
        var button_1 = new HoverClickObject(this.stage,this.x+spa_x,this.y+spa_y,wid,hei,fillColor_1,strokeColor,2,sign_1);

        var fillColor_2 = "rgb(100,100,255)";
        var sign_2 = "D";
        var button_2 = new HoverClickObject(this.stage,this.x+this.width-wid-spa_x,this.y+spa_y,wid,hei,fillColor_2,strokeColor,2,sign_2);

    }

}


function Actron_click(stage) {

    // 円の作成
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DarkRed").drawCircle(100, 100, 80);
    stage.addChild(circle);

    // 四角形の作成
    var rect = new createjs.Shape();
    rect.graphics.beginFill("blue").drawRect(200, 20, 160, 160);
    stage.addChild(rect);

    // 各種マウスイベントを登録する
    circle.addEventListener("click", handleCircleClick);
    rect.addEventListener("click", handleRectClick);

    // クリックしたとき
    function handleCircleClick(event) {
        circle.scaleX = 1.2;
        circle.scaleY = 1.2;
    }

    function handleRectClick(event) {
        rect.scaleX = 1.2;
        rect.scaleY = 1.2;
    }


    var shape = new createjs.Shape();
    shape.graphics.beginFill("Black");
    shape.graphics.drawCircle(0, 0, 40);
    stage.addChild(shape);

    var shape_scale = 40;

    // 各種マウスイベントを登録する
    shape.addEventListener("mouseover", handleMouseOver);
    shape.addEventListener("mouseout", handleMouseOut);

    // マウスオーバーしたとき
    function handleMouseOver(event) {
        createjs.Ticker.addEventListener("tick", bigger);

    }

    function bigger() {
        shape_scale += 1;
        if(shape_scale > 80){
            shape_scale = 80;
        }
        // 緑で塗り直す
        shape.graphics
            .clear()
            .beginFill("green")
            .drawCircle(0, 0, shape_scale);
    }

    // マウスアウトしたとき
    function handleMouseOut(event) {
        // 赤で塗り直す
        shape.graphics
            .clear()
            .beginFill("DarkRed")
            .drawCircle(0, 0, 40);

        shape_scale = 40;

        createjs.Ticker.removeEventListener("tick", bigger);
    }
    
}

function Actron_stoke(stage){
    var shape = new createjs.Shape();
    shape.graphics.beginFill("Black");
    shape.graphics.drawCircle(0, 0, 40);
    stage.addChild(shape);

    // tick イベントを登録する
    createjs.Ticker.addEventListener("tick", handleTick);

    function handleTick(event) {
        // マウス座標を取得する
        var mx = stage.mouseX;
        var my = stage.mouseY;
        // シェイプをマウスに追随させる
        shape.x = mx;
        shape.y = my;

        // 画面を更新する
        //stage.update();
    }
}

function Actron_En_move(stage) {
    // コンテナー(グループの親)を作成
    var container = new createjs.Container();
    container.x = 300;
    container.y = 300;
    stage.addChild(container); // 画面に追加
    // ループ分で10回
    for (var i = 0; i < 10; i++) {
        // 円を作成し
        var ball = new createjs.Shape();
        ball.graphics
            .beginFill("DarkRed")
            .drawCircle(0, 0, 50);
        // 円周上に配置
        ball.x = 200 * Math.sin(i * 360 / 10 * Math.PI / 180);
        ball.y = 200 * Math.cos(i * 360 / 10 * Math.PI / 180);
        // グループに追加
        container.addChild(ball);
    }

    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        // 親だけを回転
        container.rotation += 1;
        stage.update();
    }
}

function Actron_Move(stage) {
    var container = new createjs.Container();
    container.x = 0;
    container.y = 0;
    stage.addChild(container);
    // 1つ目の円を作成
    var circle1 = new createjs.Shape();
    circle1.graphics.beginFill("DarkRed").drawCircle(0, 0, 50);
    circle1.y = 100;

    // 2つ目の円を作成
    var circle2 = new createjs.Shape();
    circle2.graphics.beginFill("Blue").drawCircle(0, 0, 50);
    circle2.y = 300;

    // 2つの円を親に追加
    container.addChild(circle1);
    container.addChild(circle2);

    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        // 親だけを移動
        container.x += 1;
        if (container.x > 960) { // 画面端まで移動したら、元に戻す
            container.x = 0;
        }
        stage.update();
    }
    
}

function Actoren_Image(stage,x=0,y=0,image_src="./images/deer.png") {
    var image = new Image();
    image.src = image_src;
    image.onload = () => {
        var obj = new createjs.Bitmap(image);

        //画像の基準点を調整する
        //obj.regX = x;
        //obj.regY = y;
    
        obj.x = x+100;
        obj.y = y;
    
        /*
        obj.scaleX = 0.1;
        obj.scaleY = obj.scaleX;
        */

        obj.scaleX = 100 / obj.getBounds().width;
        obj.scaleY = obj.scaleX;
    
        obj.regX = 0;
        obj.regY = 0;
    
        stage.addChild(obj);

        stage.update();
    }

    
}

function Actoren_Text(stage,x=200,y=200,text="HELLO",color="DarkRed") {
    var obj = new createjs.Text(text,"24px serif",color);
    obj.x = x;
    obj.y = y;

    //変更する場合
    obj.text = text;

    //startは基準点から
    obj.textAlign = "center";

    //垂直方向
    obj.textBaseline = "top";


    stage.addChild(obj);
    
}

function Actoren_002(stage,x=250,y=10,rotate=0,alpha=1.0,visible=true,scaleX=1.0,scaleY=1.0,color="yellow",r_size=100) {
    //宣言
    var object = new createjs.Shape();
    //配置
    object.x = x;
    object.y = y + 100;
    //回転
    object.rotation = rotate;
    //透明度
    object.alpha = alpha;
    //描画するか、ビジブル
    object.visible = visible;
    //縦横のサイズ、パーセントで拡大・縮小
    object.scaleX = scaleX;
    object.scaleY = scaleY;
    //色
    object.graphics.beginFill(color);

    //四角を描く
    object.graphics.drawRect(x,y,r_size,r_size+20);
    //描き終わり
    object.graphics.endFill();

    //色
    object.graphics.beginFill(color);

    //丸い四角を描く,角丸の幅、高さ
    object.graphics.drawRoundRect(x-150,y,r_size,r_size+20,20,20);
    //描き終わり
    object.graphics.endFill();

    //色
    object.graphics.beginFill(color);

    //多角形を描く,頂点の数、谷の深さ、起点の角度
    object.graphics.drawPolyStar(x,y-100,r_size-20,6,0.8,-40);
    //描き終わり
    object.graphics.endFill();

    //色
    object.graphics.beginFill(color);
    //書き始め
    object.graphics.moveTo(x,y);
    object.graphics.lineTo(x,y+440);
    object.graphics.lineTo(x-200,y-440);
    object.graphics.lineTo(x,y)
    object.graphics.endFill();


    //ステージに登場
    stage.addChild(object);
    
}

function Actoren(stage,x=0,y=0,rotate=45,alpha=0.5,visible=true,scaleX=0.5,scaleY=2.0,color="DarkRed",r_size=100) {
    //宣言
    var object = new createjs.Shape();
    //配置
    object.x = x;
    object.y = y + 100;
    //回転
    object.rotation = rotate;
    //透明度
    object.alpha = alpha;
    //描画するか、ビジブル
    object.visible = visible;
    //縦横のサイズ、パーセントで拡大・縮小
    object.scaleX = scaleX;
    object.scaleY = scaleY;
    //色
    object.graphics.beginFill(color);

    //円を描く
    object.graphics.drawCircle(x,y,r_size);
    //描き終わり
    object.graphics.endFill();

    //線の色を指定
    object.graphics.beginStroke(color);
    //線の幅を指定
    object.graphics.setStrokeStyle(5);
    //円を描く
    object.graphics.drawCircle(x, y, r_size + 100);
    object.graphics.endStroke();

    //ステージに登場
    stage.addChild(object);
    
}