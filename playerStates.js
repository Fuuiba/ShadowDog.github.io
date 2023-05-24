
// 状态表
const states={
    SITTING:0,
    RUNNING:1,
    JUMPPING:2,
    FALLING:3,
    STANDING:4,
    ROLLING:5,
    ATTACKING:6,
    DYING:7,
    HIT:8,
    VERTIGO:9,
}

// 状态父类
class State{
    constructor(state){
        this.state=state;
    }
}

// 均为角色当前状体啊
// sitting状态类
export class Sitting extends State{
    // 继承父类构造器，接受角色信息
    constructor(player){
        super('SITTING');
        this.player=player;
    }
    enter(input){
        // 改变角色状态动画
        // sitting状态为动画表第六列 （6-1）
            this.player.speed=0;
            if(this.player.strengthState<200){
            for(let i=0;i<9;i++){
                this.player.strengthRecover();
            }          
        }
        this.player.maxFrame=4;
        this.player.frameY=5;    
        // }
    }
    // 读取键盘指令，完成状态切换d
    handleInput(input){
        // 键盘包括a，d指令指令时，从sitting状体啊转为奔跑状态
        if(input.includes('a')||input.includes('d')){
            // 切换动作时需要将动画帧的x轴置0，放置切换动作时出现帧闪烁现象
            this.player.frameX=0;
            this.player.setState(states.RUNNING,input)
        }
        // 键盘包括w指令时，转为跳跃状态
        if(input.includes('w')){
            this.player.frameX=0;
            this.player.setState(states.JUMPPING,input)
        }
    }

}

// running状态类
export class Running extends State{
    constructor(player){
        super('RUNNING');
        this.player=player;
    }
    enter(input){
        this.player.maxFrame=8;
        this.player.frameY=3;
       
        // 奔跑状态在第4列
        if(input.includes('d')&&input.includes('k')){
            // 当体力足够完成快跑且不在冷却期时，转为快跑状态
            if(this.player.strengthEnough(this.player.runResume)&&this.player.quickrun==2*this.player.cooldown){
                this.player.fps=40;    
                this.player.speed=this.player.maxMoveSpeed;
            }
             else{    
              
                // 期间速度为一般速度   
                this.player.fps=20;         
                this.player.speed=this.player.moveSpeed;
                }
        }
        else if(input.includes('a')&&input.includes('k')){
            if(this.player.strengthEnough(this.player.runResume)&&this.player.quickrun==2*this.player.cooldown){
                    this.player.fps=40;
                    this.player.speed=-this.player.maxMoveSpeed;
                }
                else{
                    // 期间速度为一般速度   
                    this.player.fps=20;         
                    this.player.speed=-this.player.moveSpeed;
                }
        }
        else if(input.includes('d')){
            this.player.fps=20; 
            this.player.speed=this.player.moveSpeed;
        }
        else if(input.includes('a')){
            this.player.fps=20; 
            this.player.speed=-this.player.moveSpeed;
        }

        
    }
    handleInput(input){
        // 只有s指令 转为sitting状态
        if(input.includes('s')&&input.length==1){
            this.player.setState(states.SITTING,input)
        // w 指令，切换为跳跃状状态
        }else  if(input.includes('w')){
            this.player.frameX=0;
            this.player.setState(states.JUMPPING,input)
        }
        //j指令 转为冲刺状态 
        // 在这里判断是否处于冲刺cd是为防止频繁按冲刺键倒是角色动作鬼畜
        else if(input.includes('j')&&this.player.strengthEnough(this.player.dashResume)&&this.player.dashCD==6*this.player.cooldown){
            this.player.setState(states.ROLLING,input)
         }
        //h指令 转为攻击状态
        // 在这里判断体力消耗是否足够事为了防止体力时按攻击导致角色动画鬼畜
         else if(input.includes('h')&&this.player.strengthEnough(this.player.attackResume)&&this.player.atkCoolDown==8*this.player.cooldown){
            this.player.frameX=0;
            this.player.setState(states.ATTACKING,input)
        }
        // 不满足前面条件下，包含a,d指令维持奔跑状态  
        else if(input.includes('a')||input.includes('d')){
            this.player.setState(states.RUNNING,input)   
        }
        // 不满足前面任一条件指令则转为站立状态
        else {
            this.player.frameX=0;
            this.player.setState(states.STANDING,input)
        }
        // 
    }

}

// jumpping状态类
export class Jumpping extends State{
    constructor(player){
        super('JUMPPING');
        this.player=player;
    }
    enter(input){
        this.player.fps=20; 
        this.player.maxFrame=6;
        this.player.frameY=1;

        // 当角色在地面时，将角色起跳最大设置为10
        // 对应动画在第2列
        if(this.player.onGround()) {
            // 判定为在快跑过程中跳跃时的体力消耗策略
            if(input.includes('k')){
                if(this.player.strengthEnough(this.player.jumpResume*4+this.player.runResume*1.5)){
                    // 较高跳跃
                    this.player.vy-=30;
                    this.player.jumpRecover=0
                }
                //  无则低跳
                else{
                    this.player.vy-=22;
                    this.player.jumpRecover=0
                }

            }
            // 判定为非快跑过程中的跳跃时的体力消耗策略
            else{
                // 同时按下l，w判定为低跳
                if(input.includes('l')&&input.includes('w')){
                    this.player.vy-=22;
                    this.player.jumpRecover=0
                }
                else if(this.player.strengthEnough(this.player.jumpResume)){
                // 较高跳跃
                    this.player.vy-=30;
                    this.player.jumpRecover=0
                }
                //  无则低跳
                else{
                    this.player.vy-=22;
                    this.player.jumpRecover=0
                }
            }
        }
    }

    
    handleInput(input){
        // console.log('jump1');
        // 当角色跳跃达到最高点时，转为下落状态
        if(input.includes('j')&&this.player.strengthEnough(this.player.dashResume)&&this.player.dashCD==6*this.player.cooldown){
           this.player.setState(states.ROLLING,input)
        }
        else if(input.includes('h')&&this.player.strengthEnough(this.player.attackResume)&&this.player.atkCoolDown==8*this.player.cooldown){
            this.player.frameX=0;
            this.player.setState(states.ATTACKING,input)
        }
        else if(this.player.vy>this.player.weight){
            this.player.frameX=0;
            this.player.setState(states.FALLING,input)
        }
    }

}


export class Falling extends State{
    constructor(player){
        super('FALLING');
        this.player=player;
    }
    enter(input){
        this.player.fps=20; 
        this.player.maxFrame=6;
        this.player.frameY=2;
    }
    handleInput(input){
        if(this.player.strengthEnough(this.player.dashResume)&&input.includes('j')&&this.player.dashCD==6*this.player.cooldown){
            this.player.setState(states.ROLLING,input)
         }
         else if(input.includes('h')&&this.player.strengthEnough(this.player.attackResume)&&this.player.atkCoolDown==8*this.player.cooldown){
            this.player.frameX=0;
            this.player.setState(states.ATTACKING,input)
        }
        else if(this.player.onGround()){
            if(input.includes('s')&&input.length==1){
                this.player.frameX=0;
                this.player.setState(states.SITTING,input)
            }
            else if(input.includes('a')||input.includes('d')){
                this.player.frameX=0;
                this.player.setState(states.RUNNING,input)
            }
            else{
                this.player.frameX=0;
                this.player.setState(states.STANDING,input)
            }
        }
    }
}

export class Standing extends State{
    constructor(player){
        super('STANDING');
        this.player=player;
    }
    enter(input){
        this.player.fps=20; 
        this.player.speed=0;
        this.player.maxFrame=6;
        this.player.frameY=0;
        

    }
    handleInput(input){
        // console.log('stand1');
        // console.log('stand接收'+input);
        if(input.includes('a')||input.includes('d')){
            this.player.frameX=0;
            this.player.setState(states.RUNNING,input)
        }
        // 键盘包括w指令时，转为跳跃状态
        else if(input.includes('w')){
            this.player.frameX=0;
            this.player.setState(states.JUMPPING,input)
        }
        else  if(input.includes('s')&&input.length==1){
            this.player.frameX=0;
            this.player.setState(states.SITTING,input)
        }
        else if(input.includes('h')&&this.player.strengthEnough(this.player.attackResume)&&this.player.atkCoolDown==8*this.player.cooldown){
            this.player.frameX=0;
            this.player.setState(states.ATTACKING,input)
        }
    }

}

export class Rolling extends State{
    constructor(player){
        super('ROLLING');
        this.player=player;
    }
    enter(input){
        // 判断向左还是向右冲刺
        this.player.maxFrame=6;
        this.player.frameY=6; 
        if(!this.player.onGround()){
            if(!input.includes('d')&&!input.includes('a')){
            }
            else{
                this.player.vy=0;
                this.player.weight=0;
                if(input.includes('d')&&!input.includes('a'))this.player.speed=4*this.player.maxMoveSpeed;
                else if(!input.includes('d')&&input.includes('a')) this.player.speed=-4*this.player.maxMoveSpeed;    
            }   
        }
        else{
            if(input.includes('d')&&!input.includes('a'))this.player.speed=3*this.player.maxMoveSpeed;
            else if(!input.includes('d')&&input.includes('a')) this.player.speed=-3*this.player.maxMoveSpeed;  
        }
    }
    handleInput(input){
        this.player.weight=1;
        if(this.player.dashState>=0){
            this.player.setState(states.ROLLING,input) 
            if(this.player.dashState<4&&!input.includes('j')){
                this.player.dashState=0;
            }
            if(this.player.dashState==0){
                this.player.dashCD=0;
            }
            this.player.dashState--;
            
        }
        else{
            if(this.player.onGround){
                this.player.setState(states.RUNNING,input) 
            }
            else{
                this.player.setState(states.FALLING,input)
            }
        }
    }
}

export class Attacking extends State{
    constructor(player){
        super('ATTACKING');
        this.player=player;
    }
    enter(input){

            // 攻击动作第一阶段
            // 向前水平低速度位移
            if(input.includes('a')){
                this.player.fps=50;
                this.player.speed=-this.player.maxMoveSpeed/4;
                this.player.maxFrame=3;
                this.player.frameY=7;
                if(!this.player.onGround()){
                    this.player.speed=-2*this.player.maxMoveSpeed;
                    this.player.vy=0;
                    this.player.weight=0;
                }
                else{
                    this.player.speed=-this.player.maxMoveSpeed;
                }
                
            }
            else{
                this.player.fps=50;
                this.player.speed=this.player.maxMoveSpeed/4;
                this.player.maxFrame=3;
                this.player.frameY=7;
                if(!this.player.onGround()){
                    this.player.vy=0;
                    this.player.weight=0;
                    this.player.speed=2*this.player.maxMoveSpeed;
                }
                else{
                    this.player.speed=this.player.maxMoveSpeed;
                }
            }

            this.player.atkCoolDown=0
           
    }
    handleInput(input){
        this.player.weight=1;
        // 当攻击动画播放结束
        // 此时角色处于整段动画的最高点
        if(this.player.frameX>=this.player.maxFrame){
            this.player.frameX=0
            if(input.includes('j')){
                this.player.setState(states.ROLLING,input)
            }
            else if(!this.player.onGround()){

                this.player.setState(states.FALLING,input)
            }
            else{
                this.player.setState(states.STANDING,input)
            }
        }
        else{
            this.player.setState(states.ATTACKING,input)
        }
    }

}

export class Dead extends State{}

export class Hit extends State{}

export class Vertigo extends State{
    constructor(player){
        super('VERTIGO');
        this.player=player;
    }
    enter(input){
        this.player.frameX=0
        this.player.frameY=4
        this.player.maxFrame=10
        this.player.speed=0;

    }
    handleInput(input){
        if(this.player.frameX>=10 &&this.player.onGround()){
            this.player.frameX=0
            this.player.playerIsVigito=!this.player.playerIsVigito;
            this.player.setState(states.STANDING,input)
        }else if(this.player.frameX>=10 && !this.player.onGround()){
            this.player.frameX=0
            this.player.playerIsVigito=!this.player.playerIsVigito;
            this.player.setState(states.FALLING,input)
        }
    }
}


