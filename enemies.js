import { CollisionAnimation } from "./collisionanimation.js";

// 敌人父类
class Enemy{
    constructor(){
        this.frameX=0;
        this.frameY=0;
        this.fps=20;
        this.frameInterval=1000/this.fps;
        this.frameTimer=0;
        this.deletion=false;
        
        // 碰撞箱
        // 各子类具体实现
        {
            this.hitBox_L;
            this.hitBox_R;
            this.hitBox_T;
            this.hitBox_B;
        }
    }
    update(deltaTime){

        // 更新动作的动画帧
        if(this.frameTimer>this.frameInterval){
            this.frameTimer=0;
            if(this.frameX<this.maxFrame) this.frameX++
            else this.frameX=0;
        }
        else{
            this.frameTimer+=deltaTime
        }
        // 判断实体是否出画布，出画布则将删除标记置为真
        if(this.x<-this.width||this.x>this.game.width||this.y>this.game.height){
            this.deletion=true;
        }
        

    }

    draw(context){

        context.drawImage(this.image,this.frameX*this.width,0,this.width,
        this.height,this.x,this.y,this.width*this.sizeControl,this.height*this.sizeControl)

        // 显示碰撞箱
        context.strokeStyle="white";
        if(this.game.debug){
            context.strokeRect(this.hitBox_L,this.hitBox_T,this.hitBox_modify_x,this.hitBox_modify_y)
        }
    }
}

// 角色活动范围231-696 
// 1类苍蝇敌人
export class Flies_1 extends Enemy{
    constructor(game){
        super();
        this.id='Flies_1'
        this.game=game;
        this.width=266;
        this.height=188;
        // 
        this.sizeControl=Math.random()*(0.6-0.4)+0.4;
        this.x=1800;
        this.random=Math.random()*(100-0)+0
        if(this.random>10){

            this.y=(Math.random()*(0.4-0)+0)*this.game.height
        }
        else{
            this.y=(Math.random()*(0.6-0.4)+0.4)*this.game.height
        }

        this.speedX=2;
        this.angle=0;
        this.angleSpeed=Math.random()*0.2  //控制精灵上下摆动的速度
        this.curve=Math.random()*7//控制精灵上下摆动的幅度
        


        this.maxFrame=5;
        this.image=document.getElementById('fly_1');

        this.score=5

        this.hitBox_modify_x=3*(this.width*this.sizeControl)/5;
        this.hitBox_modify_y=5*(this.height*this.sizeControl)/7;

       
    }
    update(deltaTime){
        this.x-=this.speedX;
        this.y+=this.curve*Math.sin(this.angle)
        this.angle+=this.angleSpeed
        super.update(deltaTime);

        {
            this.hitBox_L=this.x+(this.width*this.sizeControl)/7;
            this.hitBox_R=this.x+(this.width*this.sizeControl)/7+3*(this.width*this.sizeControl)/5;
            this.hitBox_T=this.y+(this.height*this.sizeControl)/7;
            this.hitBox_B=this.y+(this.height*this.sizeControl)/7+5*(this.height*this.sizeControl)/7;

         
        }
    }
}

// 2类苍蝇敌人
export class Flies_2 extends Enemy{
    constructor(game){
        super();

        this.id='Flies_2'
        this.game=game;
        this.width=60;
        this.height=44;
        this.sizeControl=Math.random()*(1.6-1.2)+1.2;
        this.x=1800;
        this.random=Math.random()*(100-0)+0
        if(this.random>25){

            this.y=(Math.random()*(0.6-0.4)+0.4)*this.game.height
        }
        else{
            this.y=(Math.random()*(0.7-0.5)+0.5)*this.game.height
        }
        this.speedX=6;
        this.speedY=0;
        this.maxFrame=5;
        this.image=document.getElementById('fly_2')

        this.score=3;

        this.hitBox_modify_x=this.width*this.sizeControl;
        this.hitBox_modify_y=this.height*this.sizeControl;

        

    }
    update(deltaTime){
        if(this.x>this.game.width/2){
                this.speedX=3;
        }
        else{
                this.speedX=25;
            
        }
        this.x-=this.speedX;
        super.update(deltaTime);

        {
            this.hitBox_L=this.x;
            this.hitBox_R=this.x+this.width*this.sizeControl;
            this.hitBox_T=this.y;
            this.hitBox_B=this.y+this.height*this.sizeControl;


        }
    }
}

// 植物类敌人
export class Plants extends Enemy{

    constructor(game){
        super();
        this.id='Plant'
        this.game=game;
        this.width=60;
        this.height=87;
        // 
        this.sizeControl=Math.random()*(1.5-1)+1;

        this.ran=Math.random();
        if(this.ran<0.5&&(this.game.player.x+100)<this.game.width-20){
            this.x=Math.random()*((this.game.width-20)-(this.game.player.x+80))+(this.game.player.x+80);
        }
        else if(this.ran>=0.5&&(this.game.player.x-140)>10){
            this.x=Math.random()*((this.game.player.x-80)-10)+10;
        }
        else{
            this.x=Math.random()*(2*this.game.width/3-this.game.width/3)
        }
        this.y=this.game.height-this.height*this.sizeControl;
        
        this.speedX=0;
        this.speedY=2;
        this.maxFrame=1;
        this.image=document.getElementById('plant')

        this.score=2;

        this.hitBox_modify_x=this.width*this.sizeControl;
        this.hitBox_modify_y=this.height*this.sizeControl;

    }
    update(deltaTime){
        if(this.y<this.game.height-this.height*this.sizeControl-166){
            this.y=this.game.height-this.height*this.sizeControl-166;
        }
        else{
            this.y-=this.speedY
        }
        super.update(deltaTime);

        {
            this.hitBox_L=this.x;
            this.hitBox_R=this.x+this.width*this.sizeControl;
            this.hitBox_T=this.y;
            this.hitBox_B=this.y+this.height*this.sizeControl;

          
        }
    }
    
}

// 蜘蛛类敌人
export class Spiders extends Enemy{
    constructor(game){
        super();
        this.id='Spider'
        this.game=game;
        this.width=310;
        this.height=175;
        // 
        this.sizeControl=Math.random()*(0.7-0.4)+0.4;
        this.y=0;
        this.random=Math.random()*(100-0)+0
        this.x=(Math.random()*(0.8-0.2)+0.2)*this.game.width
        
        this.speedX=0;
        this.speedY=2;
        this.maxFrame=5;
        this.image=document.getElementById('spider')

        this.score=3

        this.hitBox_modify_x=(this.width*this.sizeControl)/2;
        this.hitBox_modify_y=6*(this.height*this.sizeControl)/7;

       
    }
    update(deltaTime){

        this.y+=this.speedY
        super.update(deltaTime);

        {
            this.hitBox_L=this.x+(this.width*this.sizeControl)/4;
            this.hitBox_R=this.x+(this.width*this.sizeControl)/4+(this.width*this.sizeControl)/2;
            this.hitBox_T=this.y;
            this.hitBox_B=this.y+6*(this.height*this.sizeControl)/7;


   
         
        }

    }

    
    
}

// 自爆虫类敌人
export class Boomers extends Enemy{
    constructor(game){
        super();
        this.id='Boomer'
        this.game=game;
        this.width=218;
        this.height=177;
        // 
        this.sizeControl=Math.random()*(0.6-0.4)+0.4;

        this.random=Math.random()*(100-0)+0
        this.initx=(this.game.width*(Math.random()*(0.7-0.3)+0.3))
        this.inity=0;
        this.posID=Math.random()
        
        this.x;
        this.y=this.inity;
        this.speedX=20;
        this.speedY=15;
        this.angle=0
        this.angleSpeed=Math.random()*(1-0.7)

        this.maxFrame=5;
        this.image=document.getElementById('boomer')

        this.score=7;

        this.hitBox_modify_x=this.width*this.sizeControl;
        this.hitBox_modify_y=this.height*this.sizeControl;

        
    }
    update(deltaTime){

        // 俯冲轰炸-左
        if(this.posID>=0.5){
            this.x=-this.game.width/3*Math.sin(this.angle*Math.PI/90)+this.initx
            this.angle+=5*this.angleSpeed
            this.y+=this.speedY
        }
        // 俯冲轰炸-左
        else
        {
            this.x=this.game.width/3*Math.sin(this.angle*Math.PI/90)+this.initx
            this.angle+=5*this.angleSpeed
            this.y+=this.speedY

        }

        {
            this.hitBox_L=this.x;
            this.hitBox_R=this.x+this.width*this.sizeControl;
            this.hitBox_T=this.y;
            this.hitBox_B=this.y+this.height*this.sizeControl;

         
        }
        
        if(this.y>=this.game.height-this.height*this.sizeControl-167){
            this.deletion=true;
            console.log()
            this.game.collision.push(new CollisionAnimation(this.game,2,this.x,this.y,this.width*this.sizeControl))
            console.log(this.game.collision.length+'--------')
        }

        super.update(deltaTime);
    }
}

// 齿轮类敌人
export class Gears extends Enemy{
    constructor(game){
        super();
        this.id='Gear'
        this.game=game;
        this.width=213;
        this.height=212;
        // 
        this.sizeControl=Math.random()*(0.6-0.4)+0.4;
        

        this.speedX=2;
        this.speedY=2;
        this.maxFrame=8;
        this.image=document.getElementById('gear')
        this.posID=Math.random()
        if(this.posID<0.5){
            this.x=Math.random()*(this.game.width-this.width);
            this.y=Math.random()*(this.game.height-this.height);
        }
        else if(this.posID>=0.5&&this.posID<0.75){
            this.x=Math.random()*(this.game.width-this.width);
            this.y=0;
        }
        else{
            this.x=this.game.width;
            this.y=Math.random()*((3*this.game.height/4)-this.height);
        }
        

        this.angle=Math.random()*10;
        this.angleSpeed=(Math.random()*(10-6)+6)/2;
        this.wave=200;
        this.waveSpeed=1;
        this.stateTime=0;

        this.score=10;

        this.hitBox_modify_x=this.width*this.sizeControl;
        this.hitBox_modify_y=this.height*this.sizeControl;
    }
    update(deltaTime){

        // 定y轴x轴移动
        // this.wave改变移动的距离
        // this.waveSpeed改变移动的速度
        if(this.posID<0.1){
            this.x=this.wave*Math.sin(this.angle*Math.PI/180)+this.game.width/2;
            this.y=3*this.game.height/7;
            this.angle+=this.waveSpeed*this.angleSpeed;
        }
        
        
        // 逆圆周运动
        else if(this.posID>=0.1&&this.posID<0.2){
            this.x=(this.wave+50)*Math.sin(this.angle*Math.PI/180)+this.game.width/2;
            this.y=this.wave*Math.cos(this.angle*Math.PI/180)+this.game.height/4;
            this.angle+=this.waveSpeed*this.angleSpeed;
        }


        //  // 顺圆周运动
        //  {
        //     this.x=this.wave*Math.cos(this.angle*Math.PI/180)+this.game.width/2;
        //     this.y=this.wave*Math.sin(this.angle*Math.PI/180)+this.game.height/2;
        //     this.angle+=this.waveSpeed*this.angleSpeed;
        // }

                
        // // 左对角线运动
        else if(this.posID>=0.2&&this.posID<0.3){
            this.x=this.wave*Math.sin(this.angle*Math.PI/180)+this.game.width/4;
            this.y=this.wave*Math.sin(this.angle*Math.PI/180)+this.game.height/3;
            this.angle+=this.waveSpeed*this.angleSpeed;
        }

        // 右对角线运动
        else if(this.posID>=0.3&&this.posID<0.4){
            this.x=3*this.game.width/4-this.wave*Math.cos(this.angle*Math.PI/180);
            this.y=this.wave*Math.cos(this.angle*Math.PI/180)+this.game.height/3;
            this.angle+=this.waveSpeed*this.angleSpeed;
        }
        else if(this.posID>=0.4&&this.posID<0.7){
            this.y+=this.speedY*8
        }
        else{
            this.x-=this.speedX*8;
        }
        
        if(this.stateTime>3000*this.frameInterval){
            this.deletion=true;
        }else{
            this.stateTime+=deltaTime;
        }

        {
            this.hitBox_L=this.x;
            this.hitBox_R=this.x+this.width*this.sizeControl;
            this.hitBox_T=this.y;
            this.hitBox_B=this.y+this.height*this.sizeControl;

          
        }

        super.update(deltaTime);
    }
    
}