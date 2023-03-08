package sample;

import java.awt.BorderLayout;
import java.awt.CardLayout;
import java.awt.FlowLayout;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;

import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JRadioButton;

public class CardLayoutPanel extends JPanel implements ItemListener {
	JPanel top = new JPanel(); //ラジオボタン配置用の上部配置パネル
	JPanel card = new JPanel(); //CardLayoutを設定する中央配置のパネル
	CardLayout cardLayout = new CardLayout();	//カードレイアウト記憶用

	ButtonGroup group = new ButtonGroup();	//グループ化用オブジェクト生成
	JRadioButton rBtn1 = new JRadioButton("Flow");
	JRadioButton rBtn2 = new JRadioButton("Non");
	JRadioButton rBtn3 = new JRadioButton("GridBag");

	public CardLayoutPanel(){
		this.setLayout(new BorderLayout());
		this.add(top, BorderLayout.NORTH);
		this.add(card, BorderLayout.CENTER);

		card.setLayout(cardLayout);
		card.add(new FlowLayoutPanel(), "1");//上記で作ったパネル
		card.add(new NonLayoutPanel(), "2");//上記で作ったパネル
		card.add(new GridBagLayoutPanel(), "3");//上記で作ったパネル

		top.add(rBtn1);	//ラジオボタンをパネルへ配置
		top.add(rBtn2);
		top.add(rBtn3);

		rBtn1.setSelected(true);//ラジオボタンの状態設定
		group.add(rBtn1);//ラジオボタンのグループ化
		group.add(rBtn2);
		group.add(rBtn3);

		//Altキー連携ショートカット用キー設定
		rBtn1.setMnemonic(KeyEvent.VK_F);
		rBtn2.setMnemonic(KeyEvent.VK_N);
		rBtn3.setMnemonic(KeyEvent.VK_B);

		//項目の選択・解除のメソッドを持つオブジェクトを指定（イベントの登録）
		rBtn1.addItemListener(this);
		rBtn2.addItemListener(this);
		rBtn3.addItemListener(this);
	}

	//ユーザにる項目の選択・解除で実行する
	public void itemStateChanged(java.awt.event.ItemEvent e)
	{
		Object obj = e.getSource();	//イベント発生オブジェクト取得
		if (obj == rBtn1){
			cardLayout.show(card, "1");//カードの切り替え
		}else if (obj == rBtn2)	{
			cardLayout.show(card, "2");
		}else if (obj == rBtn3)	{
			cardLayout.show(card, "3");
		}
	}

	public static void main(String[] args){
		new TestCardLayout();
		JFrame frm2 = new TestCardLayout();
		frm2.setBounds(100, 150, 500, 250);
		frm2.setVisible(true);
		frm2.validate();
	}
}

class TestCardLayout extends JFrame
{
	public TestCardLayout(){
		this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		this.setTitle("TestCardLayout");
		JPanel panel = new CardLayoutPanel();
		this.setContentPane(panel);
		this.setBounds(0, 0, 200, 150);
		this.setVisible(true);
	}
}



public class FlowLayoutPanel extends JPanel
{
	JButton[] btn = new JButton[5];//ボタン配列
	public FlowLayoutPanel(){
		this.setLayout(new FlowLayout());
		//↑FlowLayoutの配置に設定(このクラスがJPanelなので、省略しても同じ)

		for (int i = 0; i < this.btn.length; i++){
			btn[i] = new JButton("btn" + (i + 1));
			this.add(btn[i]);
		}
	}
	public static void main(String[] args){
		new TestFlowLayout();
		JFrame frm2 = new TestFlowLayout();
		frm2.setBounds(100, 150, 300, 250);
	}
}


