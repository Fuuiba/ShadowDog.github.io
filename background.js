class Layer{
    constructor(game,width,height,speedModifie,image){
        this.game=game;
        this.width=width;
        this.height=height;
        this.speedModifie=speedModifie;
        this.image=image;
        this.x=0;
        this.y=0;
    }
    
    update(){
    }
    draw(context){
        context.drawImage(this.image,this.x,this.y,this.game.width,this.game.height,0,0,this.game.width,this.game.height*1.39)
    }
}

// 背景图层
export class BackGround{
    constructor(game){
        this.game=game
        // 画布宽度
        this.width=8*1667
        this.height=2*500
        // 创建背景图层
        this.layerImage1=document.getElementById('layer1')
        this.layerImage2=document.getElementById('layer2')
        this.layerImage3=document.getElementById('layer3')
        this.layerImage4=document.getElementById('layer4')
        this.layerImage5=document.getElementById('layer5')
        this.layer1=new Layer(this.game,this.width,this.height,1,this.layerImage1)
        this.layer2=new Layer(this.game,this.width,this.height,1.5,this.layerImage2)
        this.layer3=new Layer(this.game,this.width,this.height,2,this.layerImage3)
        this.layer4=new Layer(this.game,this.width,this.height,2.5,this.layerImage4)
        this.layer5=new Layer(this.game,this.width,this.height,3,this.layerImage5)
        // 背景层打组
        this.BackGroundLayers=[this.layer1,this.layer2,this.layer3,this.layer4]
    }
    // 更新
    update(){
        this.BackGroundLayers.forEach(layer=>{
            layer.update();
        })
        this.layer5.update();
        
    }
    // 绘制背景
    draw(context){
        this.BackGroundLayers.forEach(layer=>{
            layer.draw(context)
        })
    }
    draw_ground(context){
        this.layer5.draw(context);
    }
}