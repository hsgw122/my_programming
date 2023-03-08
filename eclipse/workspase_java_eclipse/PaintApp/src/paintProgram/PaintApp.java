package paintProgram;


import java.awt.BasicStroke;
import java.awt.BorderLayout;
import java.awt.Button;
import java.awt.Canvas;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GridLayout;
import java.awt.Image;
import java.awt.Label;
import java.awt.Panel;
import java.awt.Scrollbar;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.AdjustmentEvent;
import java.awt.event.AdjustmentListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;

import javax.swing.JFrame;


class MyCanvas extends Canvas implements MouseListener,
MouseMotionListener {
  //フィールド変数
    int x, y;   // マウスの位置
    int px, py; // 記憶ポジション
    int reX,reY;// 描画用ポジション
    int ow, oh;
    int pen=1;
    int flag=0;

    int mode;   // drawing mode associated as below
    Image img = null;   // 仮の画用紙 2つあれば破線表示可能では?
    Image img_stack = null;
    Graphics gc = null; // 仮の画用紙用のペン
    Graphics gc_stack = null;
    Dimension d; // キャンバスの大きさ取得用

    Color color = new Color(0,0,0);

    //コンストラクタ
    MyCanvas(PaintApp obj){
        mode=0;                       // initial value
        this.setSize(250,20);        // キャンバスのサイズを指定
        addMouseListener(this);       // マウスのボタンクリックなどを監視するよ
        addMouseMotionListener(this); // マウスの動きを監視するよう指定
    }

    //メソッド（オーバーライド）
    // フレームに何らかの更新が行われた時の処理
    public void update(Graphics g) {
        paint(g); // 下記の paint を呼び出す
    }

    //メソッド（オーバーライド）
    public void paint(Graphics g) {
        d = getSize();   // キャンバスのサイズを取得
        if (img == null) // もし仮の画用紙の実体がまだ存在しなければ
            img = createImage(d.width, d.height); // 作成
            img_stack = img;
        if (gc == null)  // もし仮の画用紙用のペン (GC) がまだ存在しなければ
            gc = img.getGraphics(); // 作成
            gc_stack = gc;

        switch (mode){
        default:
            Graphics2D gc2 = (Graphics2D)gc;
            BasicStroke bs = new BasicStroke(pen);


        case 0:
            gc.setColor(Color.white);
            gc.fillRect(0,0,d.width,d.height);
            /*
            gc_stack.setColor(Color.white);
            gc_stack.fillRect(0,0,d.width,d.height);
            */
            break;
        case 1:
            gc.setColor(color);
            gc2 = (Graphics2D)gc;
            bs = new BasicStroke(pen,BasicStroke.CAP_ROUND,BasicStroke.JOIN_ROUND);
            gc2.setStroke(bs);
            gc.drawLine(reX, reY, x, y);
            /*
            gc_stack.setColor(color);
            gc_stack.drawLine(reX+1, reY+50, x, y);
            */
            break;
        case 2:
            gc.setColor(color);
            gc2 = (Graphics2D)gc;
            bs = new BasicStroke(pen);
            gc2.setStroke(bs);
            gc.drawLine(reX, reY, x, y);
            break;
        case 3:
            gc.setColor(color);
            gc2 = (Graphics2D)gc;
            bs = new BasicStroke(pen);
            gc2.setStroke(bs);
            gc.drawRect(reX, reY, ow, oh);
            break;
        case 4:
            gc.setColor(color);
            gc2 = (Graphics2D)gc;
            bs = new BasicStroke(pen);
            gc2.setStroke(bs);
            gc.drawOval(reX, reY, ow, oh);
            break;
        case 5:
            gc.setColor(color);
            gc2 = (Graphics2D)gc;
            bs = new BasicStroke(pen);
            gc2.setStroke(bs);
            gc.fillRect(reX, reY, ow, oh);
            break;
        case 6:
            gc2 = (Graphics2D)gc;
            bs = new BasicStroke(pen);
            gc2.setStroke(bs);
            gc.setColor(color);
            gc.fillOval(reX, reY, ow, oh);
            break;
        case 7:
            gc.setColor(Color.white);
            gc2 = (Graphics2D)gc;
            bs = new BasicStroke(pen);
            gc2.setStroke(bs);
            gc.drawLine(reX, reY, x, y);

            break;
        }
        if(flag==3){
            flag=0;
            gc.setColor(Color.white);
            gc.fillRect(0,0,d.width,d.height);
        }
        g.drawImage(img, 0, 0, this); // 仮の画用紙の内容を MyCanvas に描画
    }

    //メソッド

    public void mouseClicked(MouseEvent e){}
    public void mouseEntered(MouseEvent e){}
    public void mouseExited(MouseEvent e){}


    public void mousePressed(MouseEvent e){ // マウスボタンが押された時
        switch (mode){
        case 0:
            break;
        case 1:
            x = e.getX();
            reX = x;
            y = e.getY();
            reY = y;
            break;
        case 2:
            reX = e.getX();
            reY = e.getY();
            break;
        case 3:
        case 4:
        case 5:
        case 6:
            px = e.getX();
            py = e.getY();
        case 7:
            x = e.getX();
            reX = x;
            y = e.getY();
            reY = y;
            break;
        }
    }


    public void mouseReleased(MouseEvent e){ // マウスボタンが離された時
        switch (mode){
        case 2:
            x = e.getX();
            y = e.getY();
            break;
        case 3:
        case 4:
        case 5:
        case 6:
            x = e.getX();
            if(px < x){reX = px;}
            else{reX = x;}
            y = e.getY();
            if(py < y){reY = py;}
            else{reY = y;}
            ow = x-px;
            if(ow < 0)ow = ow * (-1);
            oh = y-py;
            if(oh < 0)oh = oh * (-1);
        }

        repaint(); // 再描画

    }

    //メソッド

    public void mouseDragged(MouseEvent e){ // マウスがドラッグされた時
        switch (mode){
        case 1:
        case 7:
            px = x;
            reX = x;
            //      reX = e.getX();
            py = y;
            reY = y;
            //      reY = e.getY();
            x = e.getX();
            y = e.getY();
            //      if(reX > x+20 || reX < x-20)reX=x;
            //      if(reY > y+20 || reY < y-20)reY=y;
            repaint(); // 再描画
        }
    }
    public void mouseMoved(MouseEvent e){}
}




/*
 * main 部分
 *
 * */


public class PaintApp extends JFrame implements ActionListener,
AdjustmentListener {
    //フィールド変数
    Button bt1, bt2, bt3, bt4, bt5,bt6,bt7,bt8; // フレームに配置するボ
    int act1,act2,act3,act4,act5,act6,act7,act8;

    Panel p_bt;

    Panel  pnl;                // ボタン配置用パネルの宣言
    MyCanvas mc;               // 別途作成した MyCanvas クラス型の変数の

    Label lb1, lb2, lb3, lb4;
    Scrollbar sbar1, sbar2, sbar3, sbar4;
    int red = 0, green = 0, blue = 0;
    Color color = new Color(red,green,blue);
    int pen = 0;

    Panel p_west = new Panel();
    Panel p_scrol = new Panel();
    Panel p_color = new Panel();


    // ■ main メソッド（スタート地点）
    public static void main(String [] args) {
        PaintApp da = new PaintApp();
    }

    //コンストラクタ
    PaintApp() {
        super("Paint Application");
        this.setSize(1080, 810);

        this.setLayout(new FlowLayout(FlowLayout.LEFT, 10, 15));

        pnl = new Panel();       // Panel のオブジェクト（実体）を作成
        mc = new MyCanvas(this); // mc のオブジェクト（実体）を作成

        this.setLayout(new BorderLayout(10, 10));
        this.add(pnl, BorderLayout.EAST);
        this.add(mc,  BorderLayout.CENTER);
        this.add(p_west,BorderLayout.WEST);



        pnl.setLayout(new GridLayout(12,1));

        act1 = 0;
        act2 = 0;
        act3 = 0;
        act4 = 0;
        act5 = 0;
        act6 = 0;
        act7 = 0;
        act8 = 0;

        bt1 = new Button("CLEAR アクティブ時に画面を押してください");
        bt1.addActionListener(this);
        pnl.add(bt1);
        bt2 = new Button("Free Hand");
        bt2.addActionListener(this);
        pnl.add(bt2);// ボタンを順に配置
        bt3 = new Button("直線");
        bt3.addActionListener(this);
        pnl.add(bt3);
        bt4 = new Button("四角形");
        bt4.addActionListener(this);
        pnl.add(bt4);
        bt5 = new Button("楕円");
        bt5.addActionListener(this);
        pnl.add(bt5);
        bt6 = new Button("塗り潰し四角形");
        bt6.addActionListener(this);
        pnl.add(bt6);
        bt7 = new Button("塗り潰し楕円");
        bt7.addActionListener(this);
        pnl.add(bt7);
        bt8 = new Button("けしごむ");
        bt8.addActionListener(this);
        pnl.add(bt8);

        lb1 = new Label("ペンサイズ", Label.CENTER);
        pnl.add(lb1);
        sbar1 = new Scrollbar(Scrollbar.HORIZONTAL, 0, 5, 0, 50);
        sbar1.addAdjustmentListener(this);
        pnl.add(sbar1);

        p_west.setLayout(new BorderLayout());
        p_west.add(p_scrol,BorderLayout.EAST);
        p_scrol.setLayout(new GridLayout(1,6));

        lb2 = new Label("赤", Label.CENTER);
        p_scrol.add(lb2);
        sbar2 = new Scrollbar(Scrollbar.VERTICAL, 0, 10, 0, 265);
        sbar2.addAdjustmentListener(this);
        p_scrol.add(sbar2);

        lb3 = new Label("緑", Label.CENTER);
        p_scrol.add(lb3);
        sbar3 = new Scrollbar(Scrollbar.VERTICAL, 0, 10, 0, 265);
        sbar3.addAdjustmentListener(this);
        p_scrol.add(sbar3);

        lb4 = new Label("青", Label.CENTER);
        p_scrol.add(lb4);
        sbar4 = new Scrollbar(Scrollbar.VERTICAL, 0, 10, 10, 265);
        sbar4.addAdjustmentListener(this);
        p_scrol.add(sbar4); // スクロールバーを配置

        p_west.add(p_color,BorderLayout.SOUTH);

        this.setVisible(true); //可視化

	    setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    //メソッド

    public void actionPerformed(ActionEvent e){ // フレーム上で生じたイ
        if (e.getSource() == bt1){
            mc.mode=0;
            mc.flag=3;
            mc.repaint();//idea is not mine.
        }
        else if (e.getSource() == bt2)
            mc.mode=1;
        else if (e.getSource() == bt3)
            mc.mode=2;
        else if (e.getSource() == bt4)
            mc.mode=3;
        else if (e.getSource() == bt5)
            mc.mode=4;
        else if (e.getSource() == bt6)
            mc.mode=5;
        else if (e.getSource() == bt7)
            mc.mode=6;
        else if (e.getSource() == bt8)
            mc.mode=7;
    }


    public void adjustmentValueChanged(AdjustmentEvent e) {
        Scrollbar sbar = (Scrollbar)e.getAdjustable();
        if(sbar == sbar1){
            pen = sbar1.getValue();
            mc.pen = pen;
                }
        if (sbar == sbar2 || sbar == sbar3 ||sbar == sbar4) {
            red   = sbar2.getValue();
            green = sbar3.getValue();
            blue  = sbar4.getValue();
        }
        color = new Color(red,green,blue);
        mc.color = color;
        repaint();
    }


    public void paint(Graphics g) {
        g.setColor(color);
        g.fillRect(0, 0,getSize().width/2, getSize().height);

    }

}
