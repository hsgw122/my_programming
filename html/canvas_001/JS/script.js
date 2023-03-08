

function testing() {
  var canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#myCanvas'));
  var ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.rect(20, 40, 50, 50);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(240, 160, 20, 0, Math.PI*2, false);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(160, 10, 100, 40);
  ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  ctx.stroke();
  ctx.closePath();

  var canvas_2 = /** @type {HTMLCanvasElement} */ (document.getElementById("myCanvas2"));
  if(! canvas_2 || ! canvas_2.getContext ){
    return false;
  }
  var cvs2 = canvas_2.getContext('2d');
  //alert("got");

  /* rectangle */
  cvs2.beginPath(); /* 図形を描き始めることを宣言 */
  cvs2.moveTo(50, 50); /* 図形の描き始めを移動 */
  cvs2.lineTo(150, 50); /* 図形の線の終わりを決める */
  cvs2.lineTo(150, 150);
  cvs2.lineTo(50, 150);
  //cvs2.closePath(); /* 描いた線を閉じる */
  cvs2.stroke(); /* 描いた図形を線で表示させる */

}

//ロード時
window.onload = function(){
  // ms ミリ秒
  //setInterval("showLog()",msTimePer);

  //キャストしてからだと、認識する。
  const gameCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("gameCanvas"));
  const ctx = gameCanvas.getContext("2d");

  var main = new MainGame(gameCanvas,ctx);
  main.drawingObjects();
  
}

class MainGame {

  constructor(gameCanvas,ctx){
    this.gameCanvas = gameCanvas;
    this.ctx = ctx;
    this.canvas_width = gameCanvas.width;
    this.canvas_height = gameCanvas.height;
/* 
    this.ex_rect = new DrawFigure(this.ctx);
    this.ex_rect2 = new DrawRect(this.ctx,false,20,100);
    this.ex_circle = new DrawCircle(this.ctx,false,20,100); */
  }

  drawingObjects() {
    var width = this.canvas_width;
    var height = this.canvas_height;

    var ex_rect = new DrawFigure(this.ctx);
    var ex_rect2 = new DrawRect(this.ctx,false,20,100);
    var ex_circle = new DrawCircle(this.ctx,false,20,100);
    var ex_text = new DrawText(this.ctx,"unko",200,300,50);
    //var ex_rect = new DrawFigure(this.ctx);
/*     ex_rect.draw();
    console.log(ex_rect.getColor);
    ex_rect2.draw();
    console.log(ex_rect2._color);
    ex_circle.draw(); */

    let test_list = [];
    test_list.push(ex_rect);
    test_list.push(ex_rect2);
    test_list.push(ex_circle);
    test_list.push(ex_text);
    /*
    for( var i = 0;i < test_list.length;i++ ){
      test_list[i].draw();
    }
    */
    /*
    ex_text.draw();

    
    var img_src = "./images/deer.png";
    var ex_img = new DrawImage(this.ctx,true,100,500,500,100,img_src);
    ex_img = new DrawImage(this.ctx,true,200,200,100,100,img_src);
    ex_img.draw();
    */

    //console.log(this.canvas_width);
    //console.log(this.canvas_height);


    //ここからメイン
    var object_list = [];

    var matrix_box = new DrawRect(this.ctx,true,110,60,200,100,"red");
    object_list.push(matrix_box);

    var choice_button_zone = new DrawRect(this.ctx,true,130,500,240,100,"blue");
    object_list.push(choice_button_zone);

    var pop_up_zone = new DrawRect(this.ctx,false,250,280,400,200,"gray");
    object_list.push(pop_up_zone);

    var pop_text = new DrawText(this.ctx,"POP_UP",250,280,50,"gray","center");
    object_list.push(pop_text);

    for(var i = 0;i < object_list.length;i++){
      object_list[i].draw();
    }


    //ここまでメイン

    
    //補助線
    let line_list = [];
    for( var i = 0;i < this.canvas_width;i++ ){
      for( var j = 0;j < this.canvas_height;j++ ){
        if(i == 20 && j % 100 == 0){
          var rer = new DrawText(this.ctx,String(j),i,j,10);
          line_list.push(rer);
        }
        if(i == this.canvas_width - 20 && j % 100 == 0){
          var rer = new DrawText(this.ctx,String(j),i,j,10);
          line_list.push(rer);
        }
        if(j == 20 && i % 100 == 0){
          var rr = new DrawText(this.ctx,String(i),i,j,10);
          line_list.push(rr);
        }
        if(j == this.canvas_height - 10 && i % 100 == 0){
          var rr = new DrawText(this.ctx,String(i),i,j,10);
          line_list.push(rr);
        }
      }
    }
    //console.log(line_list);
    //console.log(line_list.length);

    
    for( var i = 0;i < line_list.length;i++ ){
      line_list[i].draw();
    }

  }

/* 
  set setMethod(){

  }

  get getMethod(){

  }
   */
}

//図形を描く親クラス
class DrawFigure {

  _ctx;
  _TYPE;
  _FILL;
  _x;
  _y;
  _width;
  _height;
  _color;

  constructor(ctx,TYPE="RECT",FILL=true,x=20,y=30,width=30,height=40,color="black"){
    this._ctx = ctx;
    this._TYPE = TYPE;
    this._FILL = FILL;
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._color = color;

  }

  draw() {

    this.drawingFig();

    this.point();

  }

  drawingFig() {
    this._ctx.beginPath();
    this._ctx.fillStyle = this._color;
    this._ctx.strokeRect( this._x - this._width / 2, this._y - this._height / 2, this._width, this._height );
    this._ctx.closePath();
  }

  point() {
    this._ctx.beginPath();
    this._ctx.fillStyle = "black";
    this._ctx.arc(this._x, this._y, 2, 0, Math.PI*2, false);
    this._ctx.fill();

    this._ctx.closePath();
  }

  get getCTX() {
    return this._ctx;
  }

  get getTYPE() {
    return this._TYPE;
  }

  get getFILL() {
    return this._FILL;
  }

  get getX() {
    return this._x;
  }

  get getY() {
    return this._y;
  }

  get getWidth() {
    return this._width;
  }

  get getHeight() {
    return this._height;
  }

  get getColor() {
    return this._color;
  }

  
  set setCTX(ctx) {
    this._ctx = ctx;
  }

  set setTYPE(TYPE) {
    this._TYPE = TYPE;
  }

  set setFILL(FILL) {
    if(FILL == true || FILL == false){
      this._FILL = FILL;
    }else{
      this._FILL = true;
    }
  }

  set setX(x) {
    this._x = x;
  }

  set setY(y) {
    this._y = y;
  }

  set setWidth(width) {
    this._width = width;
  }

  set setHeight(height) {
    this._height = height;
  }

  set setColor(color) {
    this._color = color;
  }

}

//四角形
class DrawRect extends DrawFigure {

  constructor(ctx,FILL=true,x=20,y=30,width=30,height=40,color="black"){
    super(ctx,"RECT",FILL,x,y,width,height,color);

  }

  drawingFig(){
    
    this._ctx.beginPath();
    this._ctx.fillStyle = this._color;
    if(this._FILL){
      this._ctx.fillRect( this._x - this._width / 2, this._y - this._height / 2, this._width, this._height );
    }else{
      this._ctx.strokeRect( this._x - this._width / 2, this._y - this._height / 2, this._width, this._height );
    }
    
    this._ctx.closePath();

  }

}

//円
class DrawCircle extends DrawFigure {

  constructor(ctx,FILL=true,x=20,y=30,width=30,height=40,color="black"){
    super(ctx,"CIRCLE",FILL,x,y,width,height,color);

  }

  drawingFig() {
    
    this._ctx.beginPath();
    this._ctx.fillStyle = this._color;
    this._ctx.arc(this._x, this._y, 20, 0, Math.PI*2, false);

    if(this._FILL){
      this._ctx.fill();
    }else{
      this._ctx.stroke();
    }
    
    this._ctx.closePath();

  }

}

//画像
class DrawImage extends DrawFigure {
  _image_source;
  _image;

  constructor(ctx,FILL=true,x=20,y=30,width=30,height=40,image_source) {
    super(ctx,"IMAGE",FILL,x,y,width,height);
    this._image_source = image_source;

    this._image = new Image();
  }

  drawingFig() {
    this._image.src = this._image_source;
    this._image.onload = () =>{
      this._ctx.drawImage(this._image, this._x - this._width / 2, this._y - this._height / 2, this._width,this._height);
      this.point();
    }

  }

}

//文字を描くクラス
class DrawText {
  _text;
  _x;
  _y;
  _font_size;
  _color;
  _textAlign;

  constructor(ctx,text,x,y,font_size=10 ,color="black",textAlign="center") {
    this._ctx = ctx;
    this._text = text;
    this._x = x;
    this._y = y;
    this._font_size = font_size;
    this._color = color;
    this._textAlign = textAlign;

  }

  draw() {
    this._ctx.beginPath();
    this._ctx.fillStyle = this._color;
    this._ctx.font = String(this._font_size) + "px serif";
    this._ctx.textAlign = this._textAlign;
    this._ctx.fillText(this._text, this._x, this._y + this._font_size / 2);
    this._ctx.closePath();
    console.log("yes");
  }

}