package gama_demo_program;


import java.awt.Color;
import java.awt.Graphics;


public class Fighter extends MovingObject{
	boolean lflag;
	boolean rflag;
	boolean uflag;
	boolean dflag;
	boolean sflag;
	int delaytime;



	Fighter(int apWidth,int apHeight){
		x=(int)(apWidth/2);
		y=(int)(apHeight*0.9);
		dx=5;
		dy=5;
		w=4;
		h=10;
		lflag=false;
		rflag=false;
		uflag=false;
		dflag=false;
		sflag=false;
		delaytime=5;

	}


	void revive(int apWidth,int apHeight) {

	}

	void move(Graphics buf,int apWidth,int apHeight) {
		buf.setColor(Color.red);
		buf.fillRect(x-w, y-h, 2*w, 2*h);

		if(lflag && !rflag && x>w) {
			x=x-dx;
		}
		if(rflag && !lflag && x<apWidth-w) {
			x=x+dx;
		}
		if(uflag && !dflag && y>h) {
			y=y-dy;
		}
		if(dflag && !uflag && y<apHeight-h) {
			y=y+dy;
		}


	}







}


























