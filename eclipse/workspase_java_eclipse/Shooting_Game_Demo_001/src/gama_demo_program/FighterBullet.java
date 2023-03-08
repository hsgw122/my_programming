package gama_demo_program;

import java.awt.Color;
import java.awt.Graphics;;

public class FighterBullet extends MovingObject {

	FighterBullet(){
		w=3;
		h=6;
		dx=0;
		dy=-6;
		hp=0;
	}


	void move(Graphics buf,int apWidth,int apHeight) {
		if(hp>0) {
			buf.setColor(Color.black);
			buf.fillOval(x-w, y-h, 2*w, 2*h);
			if(y>0 && y<apHeight && x>0 && x<apWidth) {
				y=y+dy;
				x=x+(int)(Math.random()*4-2);

			}else {
				hp=0;
			}
		}
	}


	void revive(int x,int y) {
		this.x=x;
		this.y=y;
		hp=1;

	}




}
























