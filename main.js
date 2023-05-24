import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { BackGround } from "./background.js";
import{
    Flies_1,
    Flies_2,
    Plants,
    Spiders,
    Boomers,
    Gears
} from "./enemies.js"
import { CollisionAnimation } from "./collisionanimation.js";
import { UI } from "./UI.js";

window.addEventListener('load', function(){

    const canvas=document.getElementById('canvas1')
    const ctx=canvas.getContext('2d');
    canvas.width=1800;
    canvas.height=1000;



    class Game{
        constructor(width,height){
            // 游戏画布大小
            this.width=width;
            this.height=height;
            // this.groundMargin=167;
            // 游戏背景变化速度
            this.speed=0;
            // 创建背景
            this.backGround=new BackGround(this);
            // 创建角色
            this.player=new Player(this);
            // 创建键盘监听对象
            this.input=new InputHandler(this);
            // 创建敌人对象
           
            this.plant=[]
            this.enemies=[];
            this.enemyTime=0;
            this.enemyInterval=40;

            // 碰撞动画
            this.collision=[]

            this.UI=new UI(this);

            this.debug=false;

            this.gameScore=0;
            this.maxScore=0;
            this.recover=0;
            this.recoverState=0;

            this.frontColor='black';
            

        }
        // 调用更新方法
        update(delatTime){

            this.backGround.update();
            this.player.update(this.input.keys,delatTime);

            if(this.enemyTime>this.enemyInterval){
                if(this.enemies.length+this.plant.length<7){
                    this.addEnemy();
                    this.enemyTime=0
                }
                   
            }
            else{
                this.enemyTime+=delatTime;
            }
            this.plant.forEach(plant=>{
                plant.update(delatTime)
                if(plant.deletion){
                    this.plant.splice(this.plant.indexOf(plant),1);
                }
            })
            this.enemies.forEach(enemy=>{
                enemy.update(delatTime)
                if(enemy.deletion){
                    this.enemies.splice(this.enemies.indexOf(enemy),1);
                }
            })

            this.collision.forEach(col=>{
                col.update(delatTime);
                if(col.deletion){
                    // console.log(this.collision.length+'##################')
                    this.collision.splice(this.collision.indexOf(col),1);
                    // console.log(this.collision.length+'&&&&&&&&&&&&&&&&&&')
                }
            })

            this.recover=Math.floor(this.gameScore/75)
            if(this.recoverState!=this.recover){
                this.player.HP+=1;
                this.recoverState=this.recover;
            }

            console.log(this.collision.length)


        }
        // 调用绘制方法
        draw(context){

            this.backGround.draw(context);
            this.player.draw(context);
            this.plant.forEach(enemy=>{
                enemy.draw(context)
            })
            this.enemies.forEach(enemy=>{
                enemy.draw(context)
            })

            this.backGround.draw_ground(context);
            this.collision.forEach(col=>{
                col.draw(context);
            })

            this.UI.draw(context);
           
        }
        addEnemy(){
            {
                this.ran=Math.random()*(10-0)+0
            if(this.ran<2){
                this.enemies.push(new Flies_1(game));
            }
            else if(this.ran>=2&&this.ran<4){
                this.enemies.push(new Flies_2(game));  
            }
            else if(this.ran>=4&&this.ran<6){
                this.enemies.push(new Boomers(game));
                
            }
            else if(this.ran>=6&&this.ran<8){
                this.enemies.push(new Spiders(game));
            }
            else if(this.ran>=8&&this.ran<9){
                if(this.plant.length<8){
                    this.plant.push(new Plants(game));
                }
            }
            else{
                this.enemies.push(new Gears(game));
            }

            }
        }
    }

    let games=[]

    // 创建游戏
    let game=new Game(canvas.width,canvas.height);

    console.log(game);

    games.push(game)

    let lastTime=0;
    
    let input=new InputHandler(games[0]);

    // 创建动画
    function animate(timeStamp){


        if(input.keys.includes('v')){
            ctx.fillStyle="red";
            ctx.font="100px Georgia";
            ctx.fillText('GAME OVER',550,450)
            ctx.font="30px Georgia";
            ctx.fillText('Flash the page RESTART GAME',640,500)
            console.log('gameover')
            return 0;
        }
        if(games[0].player.HP<=0){
            ctx.fillStyle="red";
            ctx.font="100px Georgia";
            ctx.fillText('GAME OVER',550,470)
            ctx.font="30px Georgia";
            ctx.fillText('Flash the page RESTART GAME',640,500)
            console.log('gameover')
            return 0;
        }
        // if(input.keys.includes('b')){
        //     games.splice(0,1)
        //     let New_game=new Game(canvas.width,canvas.height)
        //     games.push(New_game)
        //     input=new InputHandler(games[0]);
        // }

        ctx.clearRect(0,0,canvas.width,canvas.height)
        // 设置请求动画帧切换间隔
        const delatTime=timeStamp-lastTime;
        lastTime=timeStamp;
        // 清空画布避免形成拖影
        
        games[0].update(delatTime);
        games[0].draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});