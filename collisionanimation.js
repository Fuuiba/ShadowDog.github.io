export class CollisionAnimation{
    constructor(game,cillisionType,x,y,width){
        this.game=game;
        this.image=document.getElementById("collision")
        this.ATK_image=document.getElementById("ATK_collision")
        this.spriteWidth=100;
        this.spriteHeight=90;

        this.frameX=0;
        this.maxFrame=4;
        this.deletion=false

        // this.deletion=false;

        //  帧速率
        this.fps=Math.random()*10+5
        // 帧更新间隔
        this.frameInterval=1000/this.fps
        // 当前帧间隔
        this.frameTimer=0

        // 碰撞产生爆炸效果
        // 4种爆炸类型
        // 0:非自爆虫敌人被角色消灭产生的爆炸
        // 1:角色被敌人攻击产生的爆炸
        // 2:自爆虫撞击地面产生的爆炸
        // 3:角色消灭自爆虫产生的爆炸
        this.cillisionType=cillisionType;
        if(this.cillisionType==2){
        this.x=x-100;
        this.y=y-100;
        this.width=width+200;
        this.height=(width+200)*9/10
        }
        else if(this.cillisionType==3){
            this.x=x-300;
            this.y=y-300;
            this.width=width+600;
            this.height=(width+600)*9/10
        }
        else{
        this.x=x-20;
        this.y=y-20;
        this.width=width+40;
        this.height=(width+40)*9/10
        }

        this.hitBox_L=this.x+15;
        this.hitBox_T=this.y+15;
        this.hitBox_R=this.x+this.width-30;
        this.hitBox_B=this.y+this.height-30;

        this.lock=true;
       
    }
    // 绘制动画
    draw(context){

        if(this.cillisionType!=3){
            context.drawImage(this.image,100*this.frameX,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height)
        }
        else{
            context.drawImage(this.ATK_image,100*this.frameX,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height)
        }
        if(this.game.debug){
            context.strokeRect(this.hitBox_L,this.hitBox_T,this.width-30,this.height-30)
        }
    }
    // 更新，传递参数游戏时间间隔
    update(deltaTime) {
        if(this.frameX==0&&this.lock){
            if(this.cillisionType==2){
                if(this.game.player.currenState.state!='SITTING'&&!this.game.player.playerIsVigito){
                    if(this.game.player.currenState.state=='ROLLING'){
                        if(this.Check_cillision(this.game.player.roll_L,this.game.player.roll_T,this.game.player.roll_R,this.game.player.roll_B,this.hitBox_L,this.hitBox_T,this.hitBox_R,this.hitBox_B)){
                            this.game.player.HP-=2;
                            this.lock=!this.lock;

                        }
                    }
                    else if(this.game.player.currenState.state=='ATTACKING'){
                        if(this.Check_cillision(this.game.player.atk_L,this.game.player.atk_T,this.game.player.atk_R,this.game.player.atk_B,this.hitBox_L,this.hitBox_T,this.hitBox_R,this.hitBox_B)){
                            this.game.player.HP-=2;
                            this.lock=!this.lock;

                        }

                    }
                    else{

                        if(this.Check_cillision(this.game.player.normal_L,this.game.player.normal_T,this.game.player.normal_R,this.game.player.normal_B,this.hitBox_L,this.hitBox_T,this.hitBox_R,this.hitBox_B)){
                            this.game.player.HP-=2;
                            this.lock=!this.lock;
    
                        }

                    }
                }
                else{
                    if(this.Check_cillision(this.game.player.sit_L,this.game.player.sit_T,this.game.player.sit_R,this.game.player.sit_B,this.hitBox_L,this.hitBox_T,this.hitBox_R,this.hitBox_B)){
                        this.game.gameScore+=50;
                        this.lock=!this.lock;
                    }
                }

            }
            if(this.cillisionType==3){
                this.game.enemies.forEach(enemy => {
                    if(this.Check_cillision(enemy.hitBox_L,enemy.hitBox_T,enemy.hitBox_R,enemy.hitBox_B,this.hitBox_L,this.hitBox_T,this.hitBox_R,this.hitBox_B)){
                        enemy.deletion=true;
                        this.game.gameScore+=3*enemy.score
                        this.game.collision.push(new CollisionAnimation(this.game,0,enemy.x,enemy.y,enemy.width*enemy.sizeControl))
                        
                    }
                });
                this.game.plant.forEach(plant=>{
                    if(this.Check_cillision(plant.hitBox_L,plant.hitBox_T,plant.hitBox_R,plant.hitBox_B,this.hitBox_L,this.hitBox_T,this.hitBox_R,this.hitBox_B)){
                        plant.deletion=true;
                        this.game.gameScore+=3*plant.score
                        this.game.collision.push(new CollisionAnimation(this.game,0,plant.x,plant.y,plant.width*plant.sizeControl))
                        
                    }
                })
                this.lock=!this.lock;
            }
        }

        if(this.frameTimer>this.frameInterval){
            // 更新动画帧到下一帧
                this.frameX++
                // 重置当前帧间隔
                this.frameTimer=0
        }
        else{
                // 没超过则增加当前帧间隔
            this.frameTimer+=deltaTime
        }
        //当当前动画帧超过最大动画帧是，删除动画
        if(this.frameX>=this.maxFrame){
            this.deletion=true;
        } 
    }

    Check_cillision(Box1_X1,Box1_Y1,Box1_X2,Box1_Y2,Box2_X1,Box2_Y1,Box2_X2,Box2_Y2){
        if(
            (Box1_X1<Box2_X2&&
            Box1_X2>Box2_X1&&
            Box1_Y1<Box2_Y2&&
            Box1_Y2>Box2_Y1)
        ){
            return true;
        }
        else{
           return false;
        }
    
    }
    
    
}
