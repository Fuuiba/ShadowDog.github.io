export class InputHandler{
    constructor(game){
        // 创建一个键盘指令数组
        this.keys=[];
        this.game=game;
        // 监听键盘时间
        window.addEventListener('keydown',e=>{
            // console.log(e.key,this.keys);
            // 当按下键盘上的某一键位，且该键位不在键盘指令数组中
            // 将其添加到键盘指令数组中
            if(( e.key==='w'||
                 e.key==='s'||
                 e.key==='a'||
                 e.key==='d'||
                 e.key==='j'||
                 e.key==='k'||
                 e.key==='l'||
                 e.key==='h'||
                 e.key==='b'||
                 e.key==='v')
            &&this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
            }
            else if(e.key==='r'){
                this.game.debug=!this.game.debug;
            }
        })
        window.addEventListener('keyup',e=>{
            // console.log(e.key,this.keys);
            // 当按下键盘上的某一键位，且该键位不在键盘指令数组中
            // 将其添加到键盘指令数组中
            if( e.key==='w'||
                e.key==='s'||
                e.key==='a'||
                e.key==='d'||
                e.key==='j'||
                e.key==='k'||
                e.key==='l'||
                e.key==='h'||
                e.key==='r'||
                e.key==='b'||
                e.key==='v'){
                this.keys.splice(this.keys.indexOf(e.key),1);
            }
            // console.log(e.key,this.keys); 
        });
    }
}