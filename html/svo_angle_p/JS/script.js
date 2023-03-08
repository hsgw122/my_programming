/// <reference path="createJS.js" />


//
var debug = false;

//ゲームのステージ
var game_stage;
//キャンバスの大きさ
var canvasWidth;
var canvasHeight;

//座標
var svo_X = 0;
var svo_Y = 0;

//四捨五入する桁
var roound = 5;

//座標を更新
function updateZahyou(x,y){
    svo_X = roundDecimal(x,roound);
    svo_Y = roundDecimal(y,roound);

    //console.log("x : "+svo_X);
    //console.log("y : "+svo_Y);
}

// 四捨五入
function roundDecimal(value, n){
    return Math.round(value * Math.pow(10, n) ) / Math.pow(10, n);
}


//ロード時に、initを実行
window.addEventListener("load", init);

//初期化関数、init、最初に1回実行される
function init() {
    
    //キャンバス情報を取得、キャンバス扱いに
    const gameCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("myCanvasBottom"));
    //横、縦の大きさも取得
    canvasWidth = gameCanvas.width;
    canvasHeight = gameCanvas.height;
    //ステージを取得
    game_stage = new createjs.Stage("myCanvasBottom");
    //マウスオーバーを有効に
    game_stage.enableMouseOver();

    //円のプロパティを初期化
    initSvoValue();

    //svoの円
    var svo = new SVOcircle();
    svo.x = svo_position_x;
    svo.y = svo_position_y;

    //重み
    var weight_view = new WeightView();
    createjs.Ticker.addEventListener("tick",setting);
    function setting() {
        weight_view.setValue();
        
    }
    weight_view.x = 150;
    weight_view.y = canvasHeight * 0.8;
    
    //ウィンドウのタイミングに合わせる
    if(!debug)createjs.Ticker.timingMode = createjs.Ticker.RAF;

    // 自動的に画面更新させます。
    createjs.Ticker.addEventListener("tick", game_stage);

}

//SVOcircleのプロパティ
{
    //円の位置
    var svo_position_x;
    var svo_position_y;
    var svo_r_size;
    var svo_r_rec;
    var svo_circle_fillColor = "rgba(0,0,0,0.1)";
    //特定する場所
    var point_r_size = 10;
    var point_flag = false;

    //SVOアングルの名前リスト、0度から反時計回り
    var svo_text_list = ["Indivisualism","Cooperation","Altruism","Martyrdom","Masochism","Sadomasochism","Sadism","Competition"];

}

//円のプロパティの初期化
function initSvoValue(){
    svo_position_x = canvasWidth/2;
    svo_position_y = canvasHeight/2;
    svo_r_size = canvasHeight * 0.3;
    svo_r_rec = svo_r_size-1;
}

//円を描くclass
class SVOcircle extends createjs.Container{

    constructor(){
        super();

        game_stage.addChild(this);

        //見た目の円
        var circle = new createjs.Shape();
        this.addChild(circle);
        circle.graphics
            .setStrokeStyle(2)
            .beginStroke("black")
            .beginFill(svo_circle_fillColor)
            .drawCircle(0,0,svo_r_size);

        //横線
        var line_x = new createjs.Shape();
        this.addChild(line_x);
        line_x.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .drawRect(-svo_r_size*1.05,0,svo_r_size*2.1,0);

        //縦線
        var line_y = new createjs.Shape();
        this.addChild(line_y);
        line_y.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .drawRect(0,-svo_r_size*1.05,0,svo_r_size*2.1);
  
        //svoのてきすと
        for(var i=0;i<svo_text_list.length;i++){
            //console.log(svo_text_list[i]);
            //位置
            var x_e = Math.cos(Math.PI / 4 * i);
            var y_e = Math.sin(Math.PI / 4 * i);

            //座標点
            var ten = new createjs.Shape();
            this.addChild(ten);
            ten.graphics
                .setStrokeStyle(0)
                .beginFill("gray")
                .drawCircle(0,0,10);

            ten.x = x_e * svo_r_size;
            ten.y = y_e * svo_r_size;

            //名称
            var text = new createjs.Text("","","");
            this.addChild(text);
            text.text = svo_text_list[i];
            text.font = "10px sans-serif";
            text.color = "black";
            text.textAlign = "center";
            text.textBaseline = "bottom";

            text.x = x_e * svo_r_size * 1.3;
            text.y = y_e * svo_r_size * 1.3;
        }

        //円内部の時
        circle.addEventListener("mouseover",handleMouseOverCircle);
        function handleMouseOverCircle() {
            point_flag = true;
            
        }

        //円外部の時
        circle.addEventListener("mouseout",handleMouseOutCircle);
        function handleMouseOutCircle() {
            point_flag = false;
            
        }

        //クリックされたとき
        circle.addEventListener("click",handleClickCircle);
        function handleClickCircle() {
            var X = game_stage.mouseX-svo_position_x;
            var Y = game_stage.mouseY-svo_position_y;

            point.x = X;
            point.y = Y;

            X = X / svo_r_rec;
            Y = Y / svo_r_rec;
            updateZahyou(X,Y);
            //console.log("x : "+svo_X);
            //console.log("y : "+svo_Y);
        }

        //座標の点
        var point = new createjs.Shape();
        this.addChild(point);
        point.graphics
            .setStrokeStyle(0)
            .beginStroke()
            .beginFill("red")
            .drawCircle(0,0,point_r_size);

        //円の上をマウスダウンしながら移動するとき
        circle.addEventListener("pressmove",handlePressMove);
        function handlePressMove() {
            if(point_flag){
                
                var X = game_stage.mouseX-svo_position_x;
                var Y = game_stage.mouseY-svo_position_y;

                if(X*X+Y*Y <= svo_r_size*svo_r_size){
                    point.x = X;
                    point.y = Y;

                    X = X / svo_r_rec;
                    Y = Y / svo_r_rec;
                    updateZahyou(X,Y);
                    //console.log("x : "+svo_X);
                    //console.log("y : "+svo_Y);
                }

            }
            
        }

    }

}

//WeightViewのプロパティ
{
    var wv_text_font_size = 20;
    var wv_text_font = String(wv_text_font_size)+"px sans-serif";
    var wv_text_color = "black";
    var text_text_x = -40;
    var value_text_x = 50;
    var self_y = -10;
    var other_y = 30;
}

//座標を表示するclass
class WeightView extends createjs.Container {

    constructor(){
        super();

        game_stage.addChild(this);

        var box = new createjs.Shape();
        this.addChild(box);
        box.graphics
            .setStrokeStyle(3)
            .beginStroke("blue")
            .beginFill("rgba(100,100,100,0.2)")
            .drawRoundRect(-100,-50,200,100,20);


        //X座標
        var text_x = new createjs.Text("","","");
        this.addChild(text_x);
        text_x.text = "  SELF  : ";
        text_x.font = wv_text_font;
        text_x.color = wv_text_color;
        text_x.textAlign = "center";
        text_x.textBaseline = "bottom";
        text_x.x = text_text_x;
        text_x.y = self_y;

        var text_x_value = new createjs.Text("","","");
        this.addChild(text_x_value);
        text_x_value.text = String(svo_X);
        text_x_value.font = wv_text_font;
        text_x_value.color = wv_text_color;
        text_x_value.textAlign = "center";
        text_x_value.textBaseline = "bottom";
        text_x_value.x = value_text_x;
        text_x_value.y = self_y;
        this.text_x_value = text_x_value;


        //Y座標
        var text_y = new createjs.Text("","","");
        this.addChild(text_y);
        text_y.text = "OTHER : ";
        text_y.font = wv_text_font;
        text_y.color = wv_text_color;
        text_y.textAlign = "center";
        text_y.textBaseline = "bottom";
        text_y.x = text_text_x;
        text_y.y = other_y;

        var text_y_value = new createjs.Text("","","");
        this.addChild(text_y_value);
        text_y_value.text = String(svo_Y);
        text_y_value.font = wv_text_font;
        text_y_value.color = wv_text_color;
        text_y_value.textAlign = "center";
        text_y_value.textBaseline = "bottom";
        text_y_value.x = value_text_x;
        text_y_value.y = other_y;

        this.text_y_value = text_y_value;

    }

    setValue(){
        this.text_x_value.text = String(svo_X);
        this.text_y_value.text = String(svo_Y);
    }
}