export class UI{
    constructor(game){
        this.game=game;
        this.frontSize=100;
        this.fronFamily='Creepster'
        this.HPimage=document.getElementById("hp")
    }
    draw(context){
        context.save()
       
        context.font= this.frontSize+'px '+this.fronFamily;
        context.textAlign='left';
        context.fillstyle=this.game.frontColor;
        context.fillText('Score:'+this.game.gameScore,20,80)
  
            for(let i=0;i<this.game.player.HP;i++){
            context.drawImage(this.HPimage,(50*i+20),100,50,50)
        }
        context.restore()

    }
}