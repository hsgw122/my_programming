package gama_demo_program;

import java.awt.FlowLayout;

import javax.swing.JFrame;



public class ShootingGame extends JFrame implements Runnable{

	Thread th;
	GameMaster gm;


	public static void main(String[] args) {
		ShootingGame frame = new ShootingGame();

	    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);


	}

	ShootingGame(){
		super("Shooting Game (Sample)");
		int cW = 640,cH = 480;
		this.setSize(cW+30,cH+40);
		this.setLayout(new FlowLayout(FlowLayout.LEFT,10,10));

		gm = new GameMaster(cW,cH);
		this.add(gm);
		this.setVisible(true);

		th = new Thread(this);
		th.start();

		requestFocusInWindow();


	}

	public void run() {
		try {
			while(true) {
				Thread.sleep(20);
				gm.repaint();
			}
		}

		catch(Exception e) {
			System.out.println("Exception: " + e);
			}

	}





}
