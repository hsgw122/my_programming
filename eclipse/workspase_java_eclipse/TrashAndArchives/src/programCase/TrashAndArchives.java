package programCase;

import java.awt.BorderLayout;
import java.awt.Canvas;
import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.EventQueue;
import java.awt.FlowLayout;
import java.awt.Graphics;
import java.awt.GridLayout;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.Transferable;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;
import java.util.zip.ZipFile;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.Timer;
import javax.swing.TransferHandler;



public class TrashAndArchives extends JFrame implements ActionListener{

	/*field stat*/

	//ウィンドウのサイズ設定
	private static int width = 900;
	private static int height = 500;

	//アプリのモード
	private static int mode;
	//エフェクトだけにするかのモード
	private static int effectMode = 0;

	//即削除モードのパネル
	private static JPanel stringSpace;
	static int spaceSumString = 0;
	private static int countMax = 5;
	static int countString = countMax;

	//アーカイブモードのキャンバス、文字表示用
	private static PaintCanvas eastCanvas;

	JFrame frame;					//すべてのフレーム
	JPanel card;					//カードレイアウト
	static JPanel fileProf;		//ファイルのプロフィール
	JPanel topReader;				//説明と切り替えボタン
	JPanel arcv;					//アーカイブモードのパネル
	//プレビューのパネル
	static JPanel east;			//アーカイブモードの西側パネル
	//ファイルプロフィールのパネル
	JPanel cent;					//アーカイブモードの中央パネル
	//ボタンを置くパネル
	JPanel west;					//アーカイブモードの東側パネル

	JScrollPane scrProf;			//ファイルプロフィールの表示画面、スクロールバー

	JButton filex;					//テストファイルボタン、押すと消える
	JButton delBtn;					//アーカイブモードの削除ボタン

	CardLayout cardLayout;			//カードレイアウト
	GridLayout arcvLay;				//arcvのレイアウト
	GridLayout centLay;				//centのレイアウト
	GridLayout westLay;				//westのレイアウト

	static List<File> files;		//ファイル一覧の一時保存場所

	//アーカイブモードを制御する変数
	static int fileBoxSize = 100;										//最大ファイル数
	static String[] filePaths = new String[fileBoxSize + 1];			//ファイルの絶対パス
	static String[] fileNames = new String[fileBoxSize + 1];			//ファイルの名前
	static JButton[] pathBtn = new JButton[fileBoxSize + 1];			//ファイル名のボタン
	static int pathIndex = 0;											//ファイルパスが何番目まで入っているか

	static String[] directoryPaths = new String[fileBoxSize + 1];	//ディレクトリの絶対パス
	static int directoryIndex = 0;									//ディレクトリパスが何番目まで入っているか

	//文字・テキストがあった場合の表示パネル制御
	static JPanel wordsPanel;										//文字パネル
	static int wordsSize = 200;									//文字の行数の最大値
	static String[] wordsCharacters = new String[wordsSize + 1];//文字の列を保存
	static boolean isWords = false;								//選択したファイルがテキスト系列ならtrue
	static int wordsSum = 0;										//文字列の数

	//文字色の変更の制御
	static int chMax = 14;					//何回で色が白くなるかを決める
	static int chPlus = 255 / chMax + 2;	//255に上記の回数で到達するようにプラス値を決定
	static int checkColorN = chMax;		//何回プラスしたかを確認
	static int redCh = 0;					//赤色
	static int greenCh = 0;				//緑色
	static int blueCh = 0;					//青色

	//画像色の変更の制御
	static int deepMax = 10;					//色深度の回数
	static int deepPlus = 255 / deepMax + 2;	//上記の文字色同様
	static int checkDeepN = deepMax;			//同上
	static boolean isImg = false;				//画像ならtrue

	static BufferedImage firstImg = null;		//一番最初の読み込み
	static BufferedImage beforeImg = null;	//前の結果の画像
	static BufferedImage newImg = null;		//新しくできた画像
	static File keeps = null;					//一時保存ファイル、閲覧するときに参照する
	static BufferedImage arcvImg = null;		//一時保存画像、画像がでなければnull
	static JScrollPane scrImg;					//画像表示スクロール
	static BufferedReader br = null;			//文字をバッファする

	Timer timer;				//タイマーセット　スレッドダメだった
	static int delTime = 100;	//タイマーの周期

	//ボタン系列をremoveするには、そのパネルとボタンをすべて宣言しておく必要がある。
	//上限を決めておいて配列で宣言し、ボタンを管理する。

	/*main stat*/
	//Eventを付加して実行
	public static void main(String[] args) {
		EventQueue.invokeLater( new Runnable() {
			public void run() {
				TrashAndArchives frame = new TrashAndArchives();
			}
		});
	}

	/*const stat*/

	TrashAndArchives(){

		mode = 0;							//初期化
		start();							//ウィンドウセットをスタート
		initialize();						//ドロップ操作を有効に(関数処理)

		//タイマーを周期セット
		timer = new Timer(delTime,this);	//actionperformedがdelTimeで呼び出される
		timer.start();						//タイマー開始

	}

	/*void stat*/
	//関数部

	public void start() {
		setWindow();
	}

	//実際にウィンドウの中身のGUIを作るところ
	public void setWindow() {

		//ウィンドウ作成
		frame = new JFrame("Trash and Archives;");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);	//ウィンドウを閉じてプログラムを閉じる操作を有効化
		frame.setSize(width,height);
		frame.setLocationRelativeTo(null);						//場所指定なし、中心

		//画面をモード選択パネルと実際の処理パネルで構成
		topReader = new JPanel();
		card = new JPanel();
		cardLayout = new CardLayout();
		frame.add(topReader,BorderLayout.NORTH);
		frame.add(card,BorderLayout.CENTER);
		card.setLayout(cardLayout);

		//即削除のパネル展開
		stringSpace = new JPanel();		//ファイル名が並ぶフィールド
		stringSpace.setBackground(new Color(100,100,100));
		card.add(stringSpace,"　即削除　");


		//アーカイブモードのパネル展開
		arcv = new JPanel();
		arcvLay = new GridLayout(1,2);	//右と左に2分割
		//縦横に隙間を設定
		arcvLay.setHgap(10);
		arcvLay.setVgap(10);
		arcv.setLayout(arcvLay);

		//西パネル
		eastCanvas = new PaintCanvas();
		arcv.add(eastCanvas,0);

		//右側パネル
		JPanel choicePanel = new JPanel();
		choicePanel.setLayout(new GridLayout(1,2));//右側で右と左に2分割
		arcv.add(choicePanel,1);

		//中央パネル
		//ファイル名の並ぶパネルを載せる
		cent = new JPanel();
		choicePanel.add(cent,0);
		centLay = new GridLayout(1,1);
		centLay.setHgap(10);
		centLay.setVgap(10);
		cent.setLayout(centLay);

		//ファイル名が並ぶパネル
		fileProf = new JPanel();
		fileProf.setBackground(new Color(200,200,200));
		fileProf.setLayout(new FlowLayout(FlowLayout.LEFT));
		fileProf.setPreferredSize(new Dimension(width/3-30,4000));

		//テストボタン設定
		filex = new JButton("ファイルx");
		setBtn(filex,"ファイルx",fileProf,null);		//fileProfパネルにfilexボタンを追加

		//fileProfを表示するスクロールパネル
		scrProf = new JScrollPane();
		scrProf.setViewportView(fileProf);
		scrProf.setPreferredSize(new Dimension(width/3-10, height/2-45));
		//必要ならスクロールバーを表示する
		scrProf.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);
		scrProf.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
		cent.add(scrProf);

		//東側パネル
		west = new JPanel();
		choicePanel.add(west,1);
		westLay = new GridLayout(3,1);//3列に設定
		westLay.setHgap(10);
		westLay.setVgap(10);
		west.setLayout(westLay);

		//削除するボタンを追加
		delBtn = new JButton("　削　除　");
		setBtn(delBtn,"　削　除　",null,new Color(255,100,100));
		west.add(delBtn,"　削　除　",0);
		card.add(arcv,"アーカイブ");

		//delA1～delA4まで削除するか選ばせるパネル
		//いずれも3段にして、下2段をボタンにしている
		JPanel delA1 = new JPanel();
		delA1.setLayout(new GridLayout(3,1));
		JLabel a1Label = new JLabel("削除しますか");
		delA1.add(a1Label);
		setBtn(null,"削除する",delA1,new Color(255,230,230));
		setBtn(null,"削除しない",delA1,null);
		card.add(delA1,"delA1");

		JPanel delA2 = new JPanel();
		delA2.setLayout(new GridLayout(3,1));
		JLabel a2Label = new JLabel("データを削除すると"
				+ "早急な復旧でない限り"
				+ "二度と復元できません");
		delA2.add(a2Label);
		setBtn(null,"やっぱりやめる・・・",delA2,null);
		setBtn(null,"それでも削除する",delA2,new Color(255,220,220));
		card.add(delA2,"delA2");

		JPanel delA3 = new JPanel();
		delA3.setLayout(new GridLayout(3,1));
		JLabel a3Label = new JLabel("共有ファイルのものでも、"
				+ "このプログラムは削除してしまいます。"
				+ "間違えありませんか？　"
				+ "慎重な検討でしたか？");
		delA3.add(a3Label);
		setBtn(null,"しつこい",delA3,new Color(255,200,200));
		setBtn(null,"検討してなかった！！",delA3,null);
		card.add(delA3,"delA3");

		JPanel delA4 = new JPanel();
		delA4.setLayout(new GridLayout(3,1));
		JLabel a4Label = new JLabel("本当によろしいですね？");
		delA4.add(a4Label);
		setBtn(null,"やめます",delA4,null);
		setBtn(null,"削除開始",delA4,new Color(255,150,150));
		card.add(delA4,"delA4");

		//削除確認ここまで

		//ラベルで文字を描画
		topReader.add(new JLabel("ファイルをドロップしてください"));

		/*card select*/
		//カードとモードを選ぶボタンを追加する
		setBtn(null,"　即削除　",topReader,Color.red);
		setBtn(null,"アーカイブ",topReader,null);
		setBtn(null,"演出だけ見る",topReader,null);

		//今の演出状態を表示するラベル
		JLabel preLabel = new JLabel("削除してしまう");
		preLabel.setForeground(new Color(240,100,100));
		preLabel.setBackground(new Color(150,10,10));
		topReader.add(preLabel);

		// ウィンドウを表示
		frame.setVisible(true);


	}//		setWindow();

	//ボタンをあるパネルに色指定でセットする なければdefault color
	public void setBtn(JButton Btn,String str,JPanel pnl,Color color) {
		if(Btn == null)Btn = new JButton(str);
		if(color != null)Btn.setBackground(color);
		Btn.addActionListener(this);
		Btn.setActionCommand(str);
		if(pnl != null)pnl.add(Btn);

	}//		setBtn();

	//パネルを作るクラス
	public	void setPnl(JPanel Pnl,JPanel toPnl) {
		if(Pnl == null)Pnl = new JPanel();
		if(toPnl != null)toPnl.add(Pnl);

	}//		setPnl();

	// キャンバスクラス
	static class PaintCanvas extends Canvas {

		public PaintCanvas() {
			// キャンバスの背景を白に設定
			setBackground(Color.white);
		}

		public void paint(Graphics g) {

			if(mode == 0) {
				g.drawString("ドロップしたが最後、勝手に削除されます。演出もありません。", width/2, height/2);

			}else if(mode == 10) {
				g.drawString("ここにファイルをドロップするんだ・・・", 0, 10);

			}

		}

	}//		PaintCanvas;

	public void initialize() {
		card.setTransferHandler(new DropFileHandler());//ドロップ操作を有効化

	}//		initialize();

	//ドロップ操作を認識し、ファイルを受け取るクラス
	private class DropFileHandler extends TransferHandler {		//ファイルの受け取りを含む

		@Override
		public boolean canImport(TransferSupport support) {		//受け取れるかチェック
			if (!support.isDrop()) {
				// ドロップ操作でない場合は受け取らない
				return false;
			}
			if (!support.isDataFlavorSupported(DataFlavor.javaFileListFlavor)) {
				// ドロップされたのがファイルでない場合は受け取らない
				return false;
			}
			//上記すべてを突破して初めて受け取る
			return true;

		}

		@SuppressWarnings("unchecked")	//エラーを避けるため記述
		@Override
		public boolean importData(TransferSupport support) {		//データを受け取れるかチェック
			// 受け取っていいものか確認する
			if (!canImport(support)) {
				return false;
			}
			// ドロップ処理
			Transferable t = support.getTransferable();

			//ファイル入力のためtry
			try {
				//ファイルをリストで受け取る
				files = (List<File>) t.getTransferData(DataFlavor.javaFileListFlavor);
				System.out.println("ファイルを受け取りました：");
				//即削除かつエフェクトを見て削除するモードなら
				if(mode == 0) {
					for(File file : files) {
						//ファイル名をフィールドに追加
						JLabel label = new JLabel(file.getName());
						label.setForeground(new Color(
								(int)(Math.random()*255),
								(int)(Math.random()*255),
								(int)(Math.random()*255)));
						stringSpace.add(label);
						spaceSumString = spaceSumString + 1;

					}
					stringSpace.updateUI();

					mode = 90;

				}

				//アーカイブモードなら
				if(mode == 10) {
					fileProf.removeAll();					//fileProfの初期化
					for(int a = 0;a < pathIndex-1;a++) {	//ファイル関係初期化
						filePaths[a] = null;
						fileNames[a] = null;
						pathBtn[a] = null;

					}
					pathIndex = 0;

					for(int a = 0;a < directoryIndex - 1;a++) {	//ディレクトリ関係初期化
						directoryPaths[a] = null;
					}
					directoryIndex = 0;

					for(File file : files){		//ファイルをfileProfに追加
						filePathToBtn(file);

					}

				}

			} catch (UnsupportedFlavorException | IOException e) {	//受け取りエラー
				e.printStackTrace();
				System.out.println("ファイルを受け取っていません：");

			}
			return true;

		}

	}//		DropFileHandler;

	//ファイルを再帰的に削除するメソッド
	public void fileDelete(File file) {
		if (file.exists()) {
			//ファイル存在チェック

			if (file.isFile()) {
				//存在したら削除する
				if (file.delete()) {
					System.out.println("ファイルを削除しました：");

				}else {
					System.out.println("ファイルの削除を失敗しました：");

				}

				//対象がディレクトリの場合
			} else if(file.isDirectory()) {
				//ディレクトリ内の一覧を取得
				File[] files = file.listFiles();

				//存在するファイル数分ループして再帰的に削除
				for(int i=0; i<files.length; i++) {
					fileDelete(files[i]);
				}

				//ディレクトリを削除する
				if (file.delete()) {
					System.out.println("ディレクトリを削除しました：");

				}else{
					System.out.println("削除できませんでした：");

				}

			}

		} else {
			System.out.println("ディレクトリが存在しません：");

		}

	}//		fileDelete();

	//ファイルのボタンと、ディレクトリのラベルをfileProfに追加
	public void filePathToBtn(File file) {
		if (file.exists()) {
			//ファイル存在チェック

			if (file.isFile()) {
				//ファイルが存在したら
				if(pathIndex < fileBoxSize) {
					filePaths[pathIndex] = file.getAbsolutePath();				//絶対パス取得
					fileNames[pathIndex] = file.getName();						//名前取得
					pathBtn[pathIndex] = new JButton(fileNames[pathIndex]);		//ボタン宣言

					//ボタンをボタンにする
					pathBtn[pathIndex].addActionListener(this);
					pathBtn[pathIndex].setActionCommand(fileNames[pathIndex]);

					//fileProfに追加
					fileProf.add(pathBtn[pathIndex]);
					fileProf.updateUI();				//UIをアップデートする、再描画

					pathIndex = pathIndex + 1;		//Index更新

				}

				//対象がディレクトリの場合
			} else if(file.isDirectory()) {
				if(directoryIndex < fileBoxSize) {
					//ファイルの時と同様、ボタンからラベルに変わっている
					directoryPaths[directoryIndex] = file.getAbsolutePath();
					JLabel profLabel = new JLabel(file.getName());
					profLabel.setForeground(new Color(155,20,20));
					fileProf.add(profLabel);
					fileProf.updateUI();
					directoryIndex = directoryIndex + 1;

					//ディレクトリ内の一覧を取得
					File[] files = file.listFiles();

					//存在するファイル数分ループして再帰的に追加
					for(int i=0; i<files.length; i++) {
						filePathToBtn(files[i]);

					}

				}

			}

			//プレビュー画面を更新
			arcv.remove(0);
			arcv.add(eastCanvas,0);
			arcv.updateUI();

		} else {
			System.out.println("ディレクトリが存在しません：");

		}

	}

	//アクションに応じて実行される
	//タイマーでdelTimeごとに呼び出される
	@Override
	public void actionPerformed(ActionEvent e) {

		String comand = e.getActionCommand();	//コマンド獲得

		if(mode == 10 || mode == 0) {
			//演出だけか、削除するかのボタン
			if(comand == "演出だけ見る") {
				//モードを行き来する

				if(effectMode == 0) {
					effectMode = 10;
					//ラベルをアップデート
					topReader.remove(4);
					JLabel label = new JLabel("演出だけを見る");
					label.setForeground(new Color(10,150,10));		//文字色
					label.setBackground(new Color(100,240,100));	//背景色
					topReader.add(label);
					topReader.updateUI();

				}else if(effectMode == 10) {
					effectMode = 0;
					//ラベルをアップデート
					topReader.remove(4);
					JLabel label = new JLabel("削除してしまう");
					label.setForeground(new Color(240,100,100));
					label.setBackground(new Color(150,10,10));
					topReader.add(label);
					topReader.updateUI();

				}

			}

		}

		//即削除モードに変更
		if(mode == 10) {
			if(comand == "　即削除　") {
				//キャンバス初期化
				arcv.remove(0);
				arcv.add(eastCanvas,0);
				arcv.updateUI();
				cardLayout.show(card,comand);
				mode = 0;

				//フラグを初期化
				isImg = false;
				isWords = false;

			}

		}

		//即削除の最終確認ダイアログ
		if(mode == 90) {

			String selectX[] = {"削除する","やめる","間違えた"};

			//選択ダイアログの宣言と表示
			int selecta = JOptionPane.showOptionDialog(this,
					"ファイルを削除しますか？",
					"消去処理確認",
					JOptionPane.YES_NO_OPTION,		//指定しているので意味なし
					JOptionPane.WARNING_MESSAGE,	//形態
					null,							//ImageIconの選択
					selectX,						//配列
					selectX[1]);					//デフォルト選択ボタン

			if(selecta == 0) {
				if(effectMode == 0) {
					System.out.println();
					System.out.println("削除を実行します：");
					for(File file : files){
						fileDelete(file);		//ファイル全削除
						System.out.println("削除しました");
					}

				}else if(effectMode == 10) {
					System.out.println();
					System.out.println("削除していませんよ～");

				}

				files = null;
				mode = 5;		//確認ダイアログ表示モード
			}else {
				files = null;
				mode = 0;
			}

		}

		//即削除モードの時に
		//ファイルを削除してから表示される確認ダイアログ
		if(mode == 5) {
			timer.stop();

			String selectX[] = {"了解しました","ありがとう","え！？","許”さ”ん”"};

			//選択ダイアログの宣言と表示
			int selecta = JOptionPane.showOptionDialog(this,
					"ファイルを削除しました・・・",
					"消去完了___データ完全処理済",
					JOptionPane.YES_NO_OPTION,		//指定しているので意味なし
					JOptionPane.WARNING_MESSAGE,	//形態
					null,							//ImageIconの選択
					selectX,						//配列
					selectX[0]);					//デフォルト選択ボタン

			mode = 0;
			timer.start();

		}

		//アーカイブモードに変更
		if(mode == 0) {
			if(comand == "アーカイブ") {
				cardLayout.show(card,comand);
				mode = 10;

			}

		}

		//試しボタンを消す
		if(comand == "ファイルx") {
			fileProf.remove(filex);
			fileProf.updateUI();

		}

		//削除ボタンを押したら、確認その1に移動
		if(comand == "　削　除　") {
			cardLayout.show(card, "delA1");

		}

		//確認その2に移動
		if(comand == "削除する") {
			cardLayout.show(card, "delA2");

			//元のページに戻る
		}else if(comand == "削除しない"){
			cardLayout.show(card, "アーカイブ");
			mode = 10;

		}

		//確認その3に移動
		if(comand == "それでも削除する") {
			cardLayout.show(card, "delA3");

			//元のページに戻る
		}else if(comand == "やっぱりやめる・・・"){
			cardLayout.show(card, "アーカイブ");
			mode = 10;

		}

		//確認その4に移動
		if(comand == "しつこい") {
			cardLayout.show(card, "delA4");

			//元のページに戻る
		}else if(comand == "検討してなかった！！"){
			cardLayout.show(card, "アーカイブ");
			mode = 10;

		}

		//最終確認ダイアログを表示して、削除モードへ移動
		if(comand == "削除開始") {

			String selects[] = {"削除する","やめる"};

			int select = JOptionPane.showOptionDialog(this,
					"ファイルを削除しますか？",
					"ファイルを削除する？",
					JOptionPane.YES_NO_OPTION,		//指定しているので意味なし
					JOptionPane.WARNING_MESSAGE,	//形態
					null,							//ImageIconの選択
					selects,						//配列
					selects[1]);					//デフォルト選択ボタン

			//削除モードへ移動
			if(select == 0) {
				cardLayout.show(card, "アーカイブ");
				mode = 40;

				//元のページへ戻る
			}else{
				cardLayout.show(card, "アーカイブ");
				mode = 10;

			}

			//元のページへ戻る
		}else if(comand == "やめます"){
			cardLayout.show(card, "アーカイブ");
			mode = 10;

		}

		//削除モードの具体的選択
		if(mode == 40) {
			//画像かチェック
			if(isImg) {
				mode = 50;
				isImg = false;

				//文字かチェック
			}else if(isWords) {
				//ランダムで振り分け
				int RD = (int)(Math.random()*2);
				if(RD == 0) {
					mode = 60;
				}else if(RD == 1) {
					mode = 62;
				}
				isWords = false;

				//どれでもないなら
				//最終削除モードへ
			}else {
				isImg = false;
				isWords = false;
				mode = 20;

			}

		}

		//画像の処理モード1
		if(mode == 50) {
			if(checkDeepN > 0) {

				//画像を読み込むのでtry
				try {
					//初めて読み込むかチェック
					if(beforeImg == null) {
						firstImg = ImageIO.read(keeps);
						beforeImg = firstImg;
						firstImg.flush();					//解放

					}

					//高さ取得
					int imgWid = beforeImg.getWidth();
					int imgHei = beforeImg.getHeight();

					//書き込む画像を作る
					newImg = new BufferedImage(imgWid,imgHei,BufferedImage.TYPE_INT_ARGB);

					//すべてのピクセルに処理
					for(int y=0;y<imgHei;y++){
						for(int x=0;x<imgWid;x++){
							int color = beforeImg.getRGB(x, y);// 座標の色を取得
							int red   = (color & 0xff0000) >> 16; // 赤抽出
						int green = (color & 0x00ff00) >> 8;  // 緑抽出
				int blue  = (color & 0x0000ff) >> 0;  // 青抽出
				// 色の情報変換
				if(red < 255)red = red + deepPlus;
				if(red > 255)red = 255;

				if(green < 255)green = green + deepPlus;
				if(green > 255)green = 255;

				if(blue < 255)blue = blue + deepPlus;
				if(blue > 255)blue = 255;

				// 出力用にフォーマット
				red  =(red << 16)  & 0xff0000;
				green=(green << 8) & 0x00ff00;
				blue =(blue << 0)  & 0x0000ff;
				color = 0xff000000 | red | green | blue;

				newImg.setRGB(x, y, color); // 情報変換した色をもとの座標に戻す

						}

					}

					//ラベルとしてスクロールパネルに表示する
					ImageIcon icon = new ImageIcon(newImg);
					JLabel label = new JLabel(icon);
					scrImg = new JScrollPane();
					scrImg.setViewportView(label);
					scrImg.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
					scrImg.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);

					beforeImg = newImg;		//画像を保存し次に使う
					arcv.remove(0);
					arcv.add(scrImg,0);
					arcv.updateUI();
					checkDeepN = checkDeepN - 1;

				} catch (IOException e1) {
					e1.printStackTrace();
					mode = 20;
					checkDeepN = deepMax;
					beforeImg = null;
					arcv.remove(0);
					arcv.add(eastCanvas,0);
					arcv.updateUI();

				}

			}

			//全部真っ白になったら
			if(checkDeepN == 0) {
				mode = 20;
				checkDeepN = deepMax;
				beforeImg = null;
				arcv.remove(0);
				arcv.add(eastCanvas,0);
				arcv.updateUI();

			}

		}

		//文字処理モード1
		if(mode == 62) {
			if(wordsSum > 0) {
				//先頭から一つずつ抜いていく
				wordsPanel.remove(0);
				wordsPanel.updateUI();
				wordsCharacters[wordsSum-1] = null;
				wordsSum = wordsSum - 1;

			}

			if(wordsSum == 0) {
				mode = 20;
				arcv.remove(0);
				arcv.add(eastCanvas,0);
				arcv.updateUI();

			}

		}

		//文字処理モード2
		if(mode == 60) {
			//色を白くしていく
			if(checkColorN > 0) {

				if(redCh < 255)redCh = redCh + chPlus;
				if(redCh > 255)redCh = 255;

				if(greenCh < 255)greenCh = greenCh + chPlus;
				if(greenCh > 255)greenCh = 255;

				if(blueCh < 255)blueCh = blueCh + chPlus;
				if(blueCh > 255)blueCh = 255;

				//すべての文字に適用する
				for(int i = 0;i < wordsSum;i++) {
					wordsPanel.remove(i);
					JLabel label = new JLabel(wordsCharacters[i]);
					label.setForeground(new Color(redCh,greenCh,blueCh));
					wordsPanel.add(label,i);
					wordsPanel.updateUI();

				}

				wordsPanel.updateUI();
				checkColorN = checkColorN - 1;

			}

			if(checkColorN == 0) {
				mode = 20;
				checkColorN = chMax;
				redCh = 0;
				greenCh = 0;
				blueCh = 0;
				wordsSum = 0;
				arcv.remove(0);
				arcv.add(eastCanvas,0);
				arcv.updateUI();

			}

		}

		//最終処理、fileProfからすべてを順番に抜いていく
		if(mode == 20) {
			if(pathIndex > 0) {		//ファイルを完全消去し初期化
				fileProf.remove(pathBtn[pathIndex-1]);
				fileProf.updateUI();
				filePaths[pathIndex] = null;
				fileNames[pathIndex] = null;
				pathBtn[pathIndex] = null;
				pathIndex = pathIndex - 1;

			}else if(pathIndex == 0) {
				if(directoryIndex > 0) {		//ディレクトリを完全消去し初期化
					directoryPaths[directoryIndex-1] = null;
					fileProf.remove(0);
					fileProf.updateUI();
					directoryIndex = directoryIndex - 1;

				}

				//確認ダイアログ表示
				if(directoryIndex == 0) {
					directoryIndex = 0;

					timer.stop();
					//最終確認ダイアログ
					String selectA[] = {"削除する","思いとどまる"};

					int selecto = JOptionPane.showOptionDialog(this,
							"本当に削除しますか・・・？最後の決断です・・・",
							"削除しますか",
							JOptionPane.YES_NO_OPTION,				//指定しているので意味なし
							JOptionPane.WARNING_MESSAGE,			//形態
							null,									//ImageIconの選択
							selectA,								//配列
							selectA[1]);							//デフォルト選択ボタン

					if(selecto == 0) {
						if(effectMode == 0) {
							if(files != null) {
								System.out.println();
								System.out.println("削除を実行します：");
								for(File file : files){
									fileDelete(file);		//ファイル全削除

								}
							}

						}else if(effectMode == 10) {
							System.out.println();
							System.out.println("削除していませんよ～");

						}

						files = null;


						arcv.remove(0);
						arcv.add(eastCanvas,0);
						arcv.updateUI();

						String selectX[] = {"了解しました","ありがとう","え！？","許”さ”ん”","／(^o^)＼ﾅﾝﾃｺｯﾀｲ"};

						int selecta = JOptionPane.showOptionDialog(this,
								"ファイルを削除しました・・・",
								"消去完了___データ完全処理済",
								JOptionPane.YES_NO_OPTION,				//指定しているので意味なし
								JOptionPane.WARNING_MESSAGE,			//形態
								null,									//ImageIconの選択
								selectX,								//配列
								selectX[0]);							//デフォルト選択ボタン

						mode = 10;

					}else {
						mode = 10;

					}


					timer.start();

				}

			}

		}

		//ファイルのプレビューに関する事項
		if(mode == 10) {
			for(int i = 0;i<pathIndex;i++) {
				if(comand == fileNames[i]) {			//ファイルボタンを押したかチェック
					keeps = new File(filePaths[i]);	//一時保存ファイルを作る
					if (keeps.exists()){				//存在チェック
						if(!keeps.isDirectory()) {
							isImg = false;
							isWords = false;
							int check = 0;

							//zipかチェック、zipならはじく
							try(ZipFile entry = new ZipFile(filePaths[i])){
								check = 0;
								isWords = false;
								isImg = false;

							} catch (IOException e2) {
								e2.printStackTrace();
								check = 1;

							}

							//zipじゃないとき
							if(check == 1) {

								//画像に入れてみる
								try {
									arcvImg = null;
									arcvImg = ImageIO.read(keeps);

									if(arcvImg != null) {		//画像かチェック
										//画像をラベルとしてそのままのサイズでプレビューする
										ImageIcon icon = new ImageIcon(filePaths[i]);
										JLabel label = new JLabel(icon);
										scrImg = new JScrollPane();
										scrImg.setViewportView(label);
										scrImg.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
										scrImg.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
										arcv.remove(0);
										arcv.add(scrImg,0);
										arcv.updateUI();
										arcvImg = null;
										isImg = true;
										isWords = false;

									}else if(arcvImg == null) {
										arcv.remove(0);
										arcv.add(eastCanvas,0);
										arcv.updateUI();

									}

								} catch (IOException e1) {
									e1.printStackTrace();
									System.out.println("Img error です：");

								}

								//文字にしてみる
								try(BufferedReader br = new BufferedReader(new FileReader(keeps))){
									arcvImg = null;

									if(br != null) {								//文字があるなら
										BufferedImage img = ImageIO.read(keeps);	//読み込む
										if(img == null) {			//画像でないなら読み込む

											//文字列を格納、表示していく
											String str;
											JScrollPane scr = new JScrollPane();
											wordsPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
											wordsPanel.setPreferredSize(new Dimension(10, 2000));
											wordsPanel.setBackground(Color.WHITE);
											scr.setViewportView(wordsPanel);
											scr.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
											scr.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
											arcv.remove(0);
											arcv.add(scr,0);
											arcv.updateUI();
											wordsSum = 0;

											//文字がなくなるまで格納
											while((str = br.readLine()) != null){
												if(wordsSum < wordsSize) {		//オーバーフロウを防ぐ
													wordsCharacters[wordsSum] = str;
													JLabel label = new JLabel();
													label.setText(str);
													label.setForeground(new Color(redCh,greenCh,blueCh));
													wordsPanel.add(label);
													wordsSum = wordsSum + 1;

												}

											}

											br.close();			//文字読み込みを閉じる
											isWords = true;	//文字だったフラグ
											isImg = false;		//画像フラグはおろす

										}

									}

								}catch(FileNotFoundException err){
									System.out.println(err);
									System.out.println("テキストのファイルが見つからない：");

								}catch(IOException err){
									System.out.println(err);
									System.out.println("画像ではなかったかも：");

								}
								arcvImg = null;

							}

						}else{
							System.out.println("ファイルが見つからないか開けません");

						}

					}

				}

			}

		}

		//即削除パネルに文字があったら削除していく
		if(spaceSumString > 0) {
			if(countString < 1) {
				stringSpace.remove(0);
				spaceSumString = spaceSumString - 1;
				stringSpace.updateUI();
				countString = countMax;

			}else {
				countString = countString - 1;

			}

		}


	}//		actionPerformed(ActionEvent e);

}