package gama_demo_program;

import java.awt.Graphics;

abstract class MovingObject {

	int x;
	int y;
	int dx;
	int dy;
	int w;
	int h;
	int hp;


	MovingObject(){

	}

	MovingObject(int width,int height){
		x=(int)(Math.random()*width);
		y=(int)(Math.random()*height);
		dx=(int)(Math.random()*6);
		dy=(int)(Math.random()*6);
		w=2;
		h=2;
		hp=10;

	}


	abstract void move(Graphics buf,int apWidth,int apHeight) ;

	abstract void revive(int w,int h);

	boolean collisionCheck(MovingObject obj) {
		if(Math.abs(this.x-obj.x) <= (this.w+obj.w) && Math.abs(this.y-obj.y) <= (this.h+obj.h)) {
			this.hp--;
			obj.hp--;
			return true;
		}else {
			return false;
		}
	}




}



















