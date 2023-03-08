package gama_demo_program;


import java.awt.Canvas;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;


public class GameMaster extends Canvas implements KeyListener{
	Image buf;
	Graphics buf_gc;
	Dimension d;
	private int imgW,imgH;

	private int enmyAnum = 10;
	private int ftrBltNum = 10;
	private int mode = -1;
	private int i,j;

	Fighter ftr;
	FighterBullet ftrBlt[] = new FighterBullet[ftrBltNum];
	EnemyA enmyA[] = new EnemyA[enmyAnum];

	GameMaster(int imgW,int imgH) {
		this.imgW = imgW;
		this.imgH = imgH;

		setSize(imgW,imgH);

		addKeyListener(this);

		ftr = new Fighter(imgW,imgH);
		for(i=0;i<ftrBltNum;i++) {
			ftrBlt[i]=new FighterBullet();

		}
		for(i=0;i<enmyAnum;i++) {
			enmyA[i]=new EnemyA(imgW,imgH);

		}
	}

	public void addNotify() {
		super.addNotify();
		buf=createImage(imgW,imgH);
		buf_gc=buf.getGraphics();

	}



	public void paint(Graphics g) {
		buf_gc.setColor(Color.LIGHT_GRAY);
		buf_gc.fillRect(0, 0, imgW, imgH);
			switch(mode) {
			case -2:
				buf_gc.setColor(Color.black);
				buf_gc.drawString("GAME-OVER", imgW/2-80, imgH/2-20);
				buf_gc.drawString("Press Space", imgW/2-80, imgH/2+20);
				break;

			case -1:
				buf_gc.setColor(Color.black);
				buf_gc.drawString("**The Shooting Game DESU**", imgW/2-80, imgH/2-20);
				buf_gc.drawString("Press Space to START...", imgW/2-80, imgH/2+20);
				break;

			default:
				makeEnmy: if(Math.random()<0.1) {
					for(i=0;i<enmyAnum;i++) {
						if(enmyA[i].hp == 0) {
							enmyA[i].revive(imgW,imgH);
							break makeEnmy;

						}
					}
				}


			if(ftr.sflag == true && ftr.delaytime == 0) {
				for(i=0;i<ftrBltNum;i++) {
					if(ftrBlt[i].hp==0) {
						ftrBlt[i].revive(ftr.x,ftr.y);
						ftr.delaytime=5;
						break;

					}
				}

			}else if(ftr.delaytime>0) {
				ftr.delaytime--;
			}



			for(i=0;i<enmyAnum;i++) {
				if(enmyA[i].hp > 0) {
					ftr.collisionCheck(enmyA[i]);
					for(j=0;j<ftrBltNum;j++) {
						if(ftrBlt[i].hp>0) {
							ftrBlt[j].collisionCheck(enmyA[i]);
						}
					}
				}
			}

			if(ftr.hp<1) {
				mode = -2;

			}

			for(i=0;i<enmyAnum;i++) {
				enmyA[i].move(buf_gc,imgW,imgH);

			}

			for(i=0;i<ftrBltNum;i++) {
				ftrBlt[i].move(buf_gc,imgW,imgH);

			}

			ftr.move(buf_gc,imgW,imgH);


			for(i=0;i<enmyAnum;i++) {
				System.out.print(enmyA[i].hp + " ");

			}
			System.out.println("");


			}

		g.drawImage(buf,0,0,this);

		}



	public void update(Graphics gc) {
		paint(gc);

	}


	public void keyTyped(KeyEvent ke) {

	}

	public void keyPressed(KeyEvent ke) {
		int cd = ke.getKeyCode();

		switch (cd) {
		case KeyEvent.VK_LEFT:
			ftr.lflag=true;
			break;

		case KeyEvent.VK_RIGHT:
			ftr.rflag=true;
			break;

		case KeyEvent.VK_UP:
			ftr.uflag=true;
			break;

		case KeyEvent.VK_DOWN:
			ftr.dflag=true;
			break;

		case KeyEvent.VK_SPACE:
			ftr.sflag=true;
			if(this.mode != 1) {
				this.mode++;
			}
			ftr.hp=10;
			break;

		}

	}



	public void keyReleased(KeyEvent ke) {
		int cd = ke.getKeyCode();

		switch (cd) {
		case KeyEvent.VK_LEFT:
			ftr.lflag=false;
			break;

		case KeyEvent.VK_RIGHT:
			ftr.rflag=false;
			break;

		case KeyEvent.VK_UP:
			ftr.uflag=false;
			break;

		case KeyEvent.VK_DOWN:
			ftr.dflag=false;
			break;

		case KeyEvent.VK_SPACE:
			ftr.sflag=false;
			break;

		}

	}



}
























