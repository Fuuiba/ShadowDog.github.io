import { Attacking, Falling, Jumpping, Rolling, Running, Sitting, Standing,Dead,Hit,Vertigo } from "./playerStates.js";
import { CollisionAnimation } from "./collisionanimation.js";

export class Player{
    constructor(game){
        this.game=game;
        // 角色帧动画大小
        this.width=100;
        this.height=91.3;
        // 控制绘制大小
        this.sizeControl=1.5
        // 绘制觉到道画布上指定位置

        this.groundMargin=167;
        this.x=0;
        this.y=this.game.height-this.height*this.sizeControl-this.groundMargin;
        // 指向html中创建的id=player对象
        this.image = document.getElementById('player');
        this.image_anti = document.getElementById('player_anti');


        // 角色保持静止不动时速度
        this.speed=0;
        // 停止之前的速度
        this.pre_speed=this.speed;
        // 角色正常移动时的速度
        this.moveSpeed=4;
        // 角色最大移动速度
        this.maxMoveSpeed=12;
        // 角色重量
        this.vy=0;
        this.weight=1;



        // 角色状态列表
        this.states=[new Sitting(this),
                     new Running(this),
                     new Jumpping(this),
                     new Falling(this),
                     new Standing(this),
                     new Rolling(this),
                     new Attacking(this),
                     new Dead(this),
                     new Hit(this),
                     new Vertigo(this)
                ];
        this.stateSheet=['Sitting','Running','Jumpping','Falling','Standing','Rolling','Attacking','Dead','Hit','Vertigo']
        // 角色当前状态
        this.currenState=this.states[4]
        // 进入对应状态
        this.currenState.enter();

        // 体力状态控制
        // 最大体力值
        this.HP=10;
        this.maxStrengthState=2000;
        this.strengthState=this.maxStrengthState;
        // 体力值恢复速度
        this.recoverStrength=15;
        // 是否可恢复体力
        this.isrecoverable=true;
        // 跳跃消耗体力
        this.jumpResume=30;
        // 快跑消耗体力
        this.runResume=10;
        // 冲刺维持时间
        this.dashState=14;
        // 冲刺消耗体力
        this.dashResume=60;
        // 攻击消耗体力
        this.attackResume=100;
        this.playerIsVigito=false;
       
        // 跳跃后回体力间隔
        this.maxJumpRecover=10
        // 当前间隔
        this.jumpRecover=this.maxJumpRecover;
        // 基础冷却时间
        this.cooldown=8;
        // 体力耗尽之后快跑冷却时间
        this.quickrun=2*this.cooldown;
        // 冲刺冷却时间
        this.dashCD=6*this.cooldown;
        this.atkCoolDown=8*this.cooldown;


        // 角色每个动作动画对应的最大帧数
        this.maxFrame;
        // 角色动画表中行列数
        this.frameX=0;
        this.frameY=0;

        // 游戏帧率
        this.fps=20;
        // 每帧之间的间隔
        this.frameInterval=1000/this.fps;
        // 当前时间间隔
        this.frameTime=0;
        
       



    }
    strengthRecover(){
        // 是否可以恢复体力
        if(!this.isrecoverable){
            console.log("NG!")
        }
        // 体力恢复大于1000则将其置为1000
        else if(this.strengthState>=this.maxStrengthState){
            this.strengthState=this.maxStrengthState;
        }
        // 否则每次恢复15点体力
        else if(this.strengthState<this.maxStrengthState){
            this.strengthState+=this.recoverStrength;
        }
    }

    // 判断体力是否足够完成动作
    strengthEnough(consume){
        // 体力不够则返回false
        if(this.strengthState-consume<0){
            // 将冷却时间置0;
            this.quickrun=0;
            return false;
        }
        // 体力够消耗一定体力 返回为真
        else{
            this.strengthState-=consume;
            return true;
        } 
    }

    // 更新角色状态，行为和位置
    update(input,delatTime){

        if(!this.playerIsVigito){
            this.checkCollision(input);
        }
        this.currenState.handleInput(input);
        
        this.x+=this.speed;

        //   当角色横坐标完全超出画布右边时则切换回下一场景
        if(this.x>this.game.width-this.width/2){
            this.x=0;
        }
        // 当角色横坐标完全超出画布左边时则切换回上一场景
        if(this.x<-this.width/2){
            this.x=this.game.width-this.width;
        }
        if(this.y>this.game.height-this.height*this.sizeControl-this.groundMargin){
            this.y=this.game.height-this.height*this.sizeControl-this.groundMargin;
        }

        this.y+=this.vy;
        if(!this.onGround()){
            this.vy+=this.weight;
        }
        else this.vy=0;

        // 当前间隔大于设置更新间隔时
        if(this.frameTime>this.frameInterval){
            this.frameTime=0;
        // 当未播放完当前动画的全部动画帧，则播放下一帧
            if(this.frameX<this.maxFrame){
               this.frameX++;
            }
            else{
                this.frameX=0;
            }
        }
        else{
            this.frameTime+=delatTime;
        }
        

        if(this.onGround()&&this.currenState.state!='ROLLING'&&this.currenState.state!='ATTACKING'&&!input.includes('k')){
            // 快跑冷却重置
            this.quickrun++
            if(this.quickrun>2*this.cooldown){
                this.quickrun=2*this.cooldown;
            }
        }
          

        // cd，体力恢复相关
        // 恢复冲刺CD

        if(this.onGround()&&this.currenState.state!='ATTACKING'&&this.currenState.state!='ROLLING'&&(this.dashState!=8||this.dashCD!=6*this.cooldown||this.atkCoolDown!=8*this.cooldown)){
            this.dashState++;
            this.dashCD++;
            this.atkCoolDown++;
            if(this.dashState>14){
                this.dashState=14;
            }
            if(this.atkCoolDown>8*this.cooldown){
                this.atkCoolDown=8*this.cooldown;
            }   
            if(this.dashCD>6*this.cooldown){
                this.dashCD=6*this.cooldown;
            }
        }
        // 重置跳跃间隔
        if(this.jumpRecover!=this.maxJumpRecover&&this.onGround()){
            this.jumpRecover++
            if(this.jumpRecover>this.maxJumpRecover){
                this.jumpRecover=this.maxJumpRecover;
            }
        }
        // 体力不满，且当前在地面上，速度不为最大移动速度，且不处于跳跃间隔，则恢复体力
        if( this.strengthState!=2000
            &&this.onGround()
            &&this.jumpRecover==this.maxJumpRecover
            &&this.speed<this.maxMoveSpeed
            &&this.speed>-this.maxMoveSpeed
            &&this.currenState.state!='ATTACKING'
            ){
            this.strengthRecover()
        }

        {
            // 冲刺状态碰撞箱边界
            {
                this.roll_L=this.x+(this.width*this.sizeControl)/4;
                this.roll_R=this.x+(this.width*this.sizeControl)/4+(this.width*this.sizeControl)/2;
                this.roll_T=this.y+3*(this.height*this.sizeControl)/7;
                this.roll_B=this.y+3*(this.height*this.sizeControl)/7+(this.height*this.sizeControl)/2;
            }
            
            // 攻击状态碰撞箱边界
            {
                this.atk_L=this.x+(this.width*this.sizeControl)/12;
                this.atk_R=this.x+(this.width*this.sizeControl)/12+5*(this.width*this.sizeControl)/6;
                this.atk_T=this.y+2*(this.height*this.sizeControl)/5;
                this.atk_B=this.y+2*(this.height*this.sizeControl)/5+3*(this.height*this.sizeControl)/5;
            }
    
            // 坐下状态碰撞箱边界
            {
                this.sit_L=this.x+(this.width*this.sizeControl)/4;
                this.sit_R=this.x+(this.width*this.sizeControl)/4+9*(this.width*this.sizeControl)/14;
                this.sit_T=this.y+4*(this.height*this.sizeControl)/7;
                this.sit_B=this.y+4*(this.height*this.sizeControl)/7+(this.height*this.sizeControl)/3;
            }
    
            // 一般状态碰撞箱边界
            {
                this.normal_L=this.x+(this.width*this.sizeControl)/12;
                this.normal_R=this.x+(this.width*this.sizeControl)/12+5*(this.width*this.sizeControl)/6;
                this.normal_T=this.y+(this.height*this.sizeControl)/4;
                this.normal_B=this.y+(this.height*this.sizeControl)/4+2*(this.height*this.sizeControl)/3;
            }
            }

            // console.log(this.HP)

        
}
    // 绘制角色
    draw(context){


        // 速度大于0则绘制向前跑动画
        if(this.speed>0){
            context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,
                this.x,this.y,this.width*this.sizeControl,this.sizeControl*this.height);
                this.pre_speed=this.speed;
        }
        // 速度等于0则绘制根据停止之前的速度绘制站立动画
        else if(this.speed==0){
            if(this.pre_speed>=0){
                context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,
                    this.x,this.y,this.width*this.sizeControl,this.sizeControl*this.height);
                    this.pre_speed=this.speed;
            }
            else{
                context.drawImage(this.image_anti,this.frameX*this.width,this.frameY*this.height,this.width,this.height,
                    this.x,this.y,this.width*this.sizeControl,this.sizeControl*this.height);
            }
        
        }
        // 速度大小0则绘制向后跑动画
        else{
             context.drawImage(this.image_anti,this.frameX*this.width,this.frameY*this.height,this.width,this.height,
                this.x,this.y,this.width*this.sizeControl,this.sizeControl*this.height);
                this.pre_speed=this.speed;
        }

        // debug模式下显示角色和敌人碰撞箱
        if(this.game.debug){
            // 冲刺碰撞箱
            if(this.currenState.state=='ROLLING'){
                context.strokeStyle="blue";
                context.strokeRect(this.x+(this.width*this.sizeControl)/4,
                                   this.y+3*(this.height*this.sizeControl)/7,
                                   (this.width*this.sizeControl)/2,
                                   (this.height*this.sizeControl)/2)
            }
            // 坐下碰撞箱
            else if(this.currenState.state=='SITTING'){
                context.strokeStyle="green";
                context.strokeRect(this.x+(this.width*this.sizeControl)/4,
                                   this.y+4*(this.height*this.sizeControl)/7,
                                   9*(this.width*this.sizeControl)/14,
                                   (this.height*this.sizeControl)/3)

            }
            // 攻击碰撞箱
            else if(this.currenState.state=='ATTACKING'){
                context.strokeStyle="yellow";
                context.strokeRect(this.x+(this.width*this.sizeControl)/12,
                                   this.y+2*(this.height*this.sizeControl)/5,
                                   5*(this.width*this.sizeControl)/6,
                                   3*(this.height*this.sizeControl)/5)
            }
            // 其他动作时的碰撞箱
            else{
                context.strokeStyle="red";
                context.strokeRect(this.x+(this.width*this.sizeControl)/12,
                                   this.y+(this.height*this.sizeControl)/4,
                                   5*(this.width*this.sizeControl)/6,
                                   2*(this.height*this.sizeControl)/3)

            }
                    }
    }
    // 判断角色是否在地面上
    onGround(){
        return this.y>=this.game.height-this.height*this.sizeControl-this.groundMargin
        
    }

    setState(state,input){
        this.currenState=this.states[state];
        this.currenState.enter(input);
        
    }
    checkCollision(input){
        

        if(this.currenState.state=='ROLLING'){
            this.game.enemies.forEach(enemy => {
                // 齿轮的碰撞判断较为特殊需要单独判断
                if(enemy.id=='Gear'){
                    if(
                        // 玩家需从右边攻击才能摧毁齿轮
                        this.speed<0&&
                        this.NormalCheck(this.roll_L,this.roll_T,this.roll_R,this.roll_B,enemy.hitBox_L,enemy.hitBox_T,enemy.hitBox_R,enemy.hitBox_B)
                    ){
                        enemy.deletion=true;
                        this.game.gameScore+=enemy.score;
                        this.game.collision.push(new CollisionAnimation(this.game,0,enemy.x,enemy.y,enemy.width*enemy.sizeControl))
                    }
                }
                else{
                    if(this.NormalCheck(this.roll_L,this.roll_T,this.roll_R,this.roll_B,enemy.hitBox_L,enemy.hitBox_T,enemy.hitBox_R,enemy.hitBox_B)){
                        enemy.deletion=true;
                        this.game.gameScore+=enemy.score;
                        if(enemy.id=='Boomer'){
                            this.game.collision.push(new CollisionAnimation(this.game,3,enemy.x,enemy.y,enemy.width*enemy.sizeControl))
                        }
                        else{
                            this.game.collision.push(new CollisionAnimation(this.game,0,enemy.x,enemy.y,enemy.width*enemy.sizeControl))
                        }
                    }

                }
            })

            this.game.plant.forEach(plant=>{
                if(this.NormalCheck(this.roll_L,this.roll_T,this.roll_R,this.roll_B,plant.hitBox_L,plant.hitBox_T,plant.hitBox_R,plant.hitBox_B)){
                    plant.deletion=true;
                    this.game.gameScore+=plant.score;
                    this.game.collision.push(new CollisionAnimation(this.game,0,plant.x,plant.y,plant.width*plant.sizeControl))

                }

            })
        }
        else if(this.currenState.state=='ATTACKING'){
            this.game.enemies.forEach(enemy => {
                // 齿轮的碰撞判断较为特殊需要单独判断
                if(enemy.id=='Gear'){
                    if(
                        // 玩家需从右边攻击才能摧毁齿轮
                        this.speed<0&&
                        this.NormalCheck(this.roll_L,this.roll_T,this.roll_R,this.roll_B,enemy.hitBox_L,enemy.hitBox_T,enemy.hitBox_R,enemy.hitBox_B)
                    ){
                        enemy.deletion=true;
                        this.game.gameScore+=1.5*enemy.score;
                        this.game.collision.push(new CollisionAnimation(this.game,0,enemy.x,enemy.y,enemy.width*enemy.sizeControl))

                    }
                    else if(
                        // 玩家需从右边攻击才能摧毁齿轮
                        this.speed>=0&&
                        this.NormalCheck(this.roll_L,this.roll_T,this.roll_R,this.roll_B,enemy.hitBox_L,enemy.hitBox_T,enemy.hitBox_R,enemy.hitBox_B)
                        &&!this.playerIsVigito
                    ){
                        this.setState(9,input)
                        enemy.deletion=true;
                        this.HP-=2;
                        this.playerIsVigito=!this.playerIsVigito
                        this.game.collision.push(new CollisionAnimation(this.game,1,enemy.x,enemy.y,enemy.width*enemy.sizeControl))
                    }
                }
                else{
                    if(this.NormalCheck(this.atk_L,this.atk_T,this.atk_R,this.atk_B,enemy.hitBox_L,enemy.hitBox_T,enemy.hitBox_R,enemy.hitBox_B)){
                        enemy.deletion=true;
                        this.game.gameScore+=1.5*enemy.score;
                        if(enemy.id=='Boomer'){
                            this.game.collision.push(new CollisionAnimation(this.game,3,enemy.x,enemy.y,enemy.width*enemy.sizeControl))
                        }
                        else{
                            this.game.collision.push(new CollisionAnimation(this.game,0,enemy.x,enemy.y,enemy.width*enemy.sizeControl))
                        }
                    }

                }
            })

            this.game.plant.forEach(plant=>{
                if(this.NormalCheck(this.atk_L,this.atk_T,this.atk_R,this.atk_B,plant.hitBox_L,plant.hitBox_T,plant.hitBox_R,plant.hitBox_B)){
                    plant.deletion=true;
                    this.game.gameScore+=1.5*plant.score;
                    this.game.collision.push(new CollisionAnimation(this.game,0,plant.x,plant.y,plant.width*plant.sizeControl))

                }

            })


        }
        else if(this.currenState.state=='SITTING'){
            this.game.enemies.forEach(enemy => {
                // 齿轮和自爆虫的碰撞判断掉两血
                if(this.NormalCheck(this.sit_L,this.sit_T,this.sit_R,this.sit_B,enemy.hitBox_L,enemy.hitBox_T,enemy.hitBox_R,enemy.hitBox_B)){
                    if((enemy.id=='Gear'||enemy.id=='Boomer')&&!this.playerIsVigito){
                        this.HP-=2;
                        this.setState(9,input)
                        enemy.deletion=true;
                        this.playerIsVigito=!this.playerIsVigito;
                        this.game.collision.push(new CollisionAnimation(this.game,1,enemy.x,enemy.y,enemy.width*enemy.sizeControl))

                    }
                    else if((enemy.id=='Flies_1'||enemy.id=='Flies_2'||enemy.id=='Spider')&&!this.playerIsVigito){
                        this.HP-=1;
                        this.setState(9,input)
                        enemy.deletion=true;
                        this.playerIsVigito=!this.playerIsVigito;
                        this.game.collision.push(new CollisionAnimation(this.game,1,enemy.x,enemy.y,enemy.width*enemy.sizeControl))

                    }
                }
                
            })
            this.game.plant.forEach(plant=>{
                if(this.NormalCheck(this.sit_L,this.sit_T,this.sit_R,this.sit_B,plant.hitBox_L,plant.hitBox_T,plant.hitBox_R,plant.hitBox_B)&&!this.playerIsVigito){
                    this.HP-=1;
                    this.setState(9,input)
                    plant.deletion=true;
                    this.playerIsVigito=!this.playerIsVigito;
                    this.game.collision.push(new CollisionAnimation(this.game,1,plant.x,plant.y,plant.width*plant.sizeControl))

                }
            })
        }
        else{
            this.game.enemies.forEach(enemy => {
                // 齿轮和自爆虫的碰撞判断掉两血
                if(this.NormalCheck(this.normal_L,this.normal_T,this.normal_R,this.normal_B,enemy.hitBox_L,enemy.hitBox_T,enemy.hitBox_R,enemy.hitBox_B)){
                    if((enemy.id=='Gear'||enemy.id=='Boomer')&&!this.playerIsVigito){
                        this.HP-=2;
                        this.setState(9,input)
                        enemy.deletion=true;
                        this.playerIsVigito=!this.playerIsVigito;
                        this.game.collision.push(new CollisionAnimation(this.game,1,enemy.x,enemy.y,enemy.width*enemy.sizeControl))

                    } 
                    else if((enemy.id=='Flies_1'||enemy.id=='Flies_2'||enemy.id=='Spider')&&!this.playerIsVigito){
                        this.HP-=1;
                        this.setState(9,input)
                        enemy.deletion=true;
                        this.playerIsVigito=!this.playerIsVigito;
                        this.game.collision.push(new CollisionAnimation(this.game,1,enemy.x,enemy.y,enemy.width*enemy.sizeControl))

                    }
                }
               
            })
            this.game.plant.forEach(plant=>{
                if(this.NormalCheck(this.normal_L,this.normal_T,this.normal_R,this.normal_B,plant.hitBox_L,plant.hitBox_T,plant.hitBox_R,plant.hitBox_B)&&!this.playerIsVigito){
                    this.HP-=1;
                    this.setState(9,input)
                    plant.deletion=true;
                    this.playerIsVigito=!this.playerIsVigito;
                    this.game.collision.push(new CollisionAnimation(this.game,1,plant.x,plant.y,plant.width*plant.sizeControl))

                }
            })
            


        }
    }

    // 传入8个参数
    // 判断碰撞的两个物体的碰撞箱的起点和大小
    NormalCheck(Box1_X1,Box1_Y1,Box1_X2,Box1_Y2,Box2_X1,Box2_Y1,Box2_X2,Box2_Y2){
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