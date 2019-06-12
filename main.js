window.addEventListener("load", init);

var canvas;
var ctx;
var SCREEN_WIDTH=1280;
var SCREEN_HEIGHT=720;
var speeds={
    WSAcceleration: 0.5,
    ADAcceleration: math.pi/100,
    wScale: 1,
    vScale: 10,
}

function init(){
    // initialization
    canvas=document.getElementById("maincanvas");
    ctx=canvas.getContext("2d");
    canvas.width=SCREEN_WIDTH;
    canvas.height=SCREEN_HEIGHT;
    ctx.font="12px Arial";
    ctx.fillStyle="black";
    Asset.loadAssets(function(){
        requestAnimationFrame(update);
    });
}

var lastTimestamp = null;
var elapsedTime=0;

function update(timestamp){
    if(lastTimestamp!=null){
        elapsedTime=(timestamp-lastTimestamp)/1000;
    }
    lastTimestamp=timestamp;

    var sensors=updateSensors(rocket);
    //processInput();

    requestAnimationFrame(update);
    render();
}

var rocket={x: 390, y: 89, t: 0, vx: 0, vy: 0, w: 0};
var sugoMap=new Path2D("M1173.7,216.2c-19.6-15.2-40.6-10.4-52.7-1.7l-0.1,0.1l-0.1,0.1L936.1,361.6c-18.2,12.7-25.2,27-23.3,47.7c1.6,17.7-9.2,25.9-11.1,27.2l-65.1,29.1l-0.2,0.1l-0.2,0.1c-0.9,0.5-22.5,11.4-38.2-2.9c-11.6-10.5-6.5-27.1-6.3-27.8c0-0.1,44.9-148.4,46.8-155c10-25.8,22.5-36.7,46.1-40.2c8.9-0.2,120.7-3.2,131.9-4.5c44.4-5.4,43.6-45.2,43.6-45.2l-6.7-68.9c-2-24.5-20.1-38.1-50.8-38.1H211.1c-84.6,0.8-119.5,27.7-138.3,42.1c-1.5,1.2-3,2.3-4.3,3.3c-29.8,22.1-51.6,60.2-57,99.3c-4.8,35.6,4,69,25.5,96.6c21.7,27.8,48.7,44.7,80.4,50.2c25.5,4.4,47.1,0.2,57.4-1.8l2.2-0.4l0.5-0.1c0,0,0.5-0.2,0.5-0.2l63-24.5l3.8-1.5l141.8-55.1c17.7-5.2,35.3,2.4,45,10.5c9.3,7.8,81.6,77.2,82.3,77.9l0.1,0.1l0.1,0.1c14.9,12.9,12.8,29.8,9.3,43.1c0-0.1-46.7,161.8-46.7,161.8c0,0.1-0.4,1.4-0.4,1.4c-3.9,14.5-9.9,36.5,8,60.6c18.2,24.4,51.2,17,66.6,9.6l140.3-43.3l0.3-0.1l0.3-0.1l556.1-249.2c13.5-10,19.6-23,21.2-39.2c1.6-15.9-3.1-31.5-12.4-41.8C1257,282.4,1183.2,223.6,1173.7,216.2z M23.3,229.4c1.6-11.8,4.8-23.4,9.4-34.5c4.6,8.3,12.4,15.8,18.4,21.6c2.8,2.7,5.1,9.5,4.3,13.7c-0.6,2.8-4.5,10.9-9,10.8c-11-0.3-18.9,1.3-24.2,3.5C22.2,239.1,22.6,234,23.3,229.4z M936.8,108.8h64.6c1.4,0.2,16.1,2.1,17.9,13.3c2.3,14.1,6.6,59.7,7.1,64.8c1,5.4-6.2,33.7-36.4,38l0,0.1c-31.1,1.2-82.4,2.5-106.1,3.1l-0.3,0l-0.3,0c-28.1,4-44.3,17.9-55.8,47.8l-0.1,0.2l-0.1,0.2l-46.9,155.1c-0.3,0.9-7.6,24.3,9.6,40c21.2,19.3,48.7,6.1,51.5,4.7l65.4-29.2l0.3-0.1l0.3-0.2c0.8-0.5,19.4-12,16.9-38.5c-1.5-16.5,3.7-26.9,18.5-37.1l0.2-0.1l0.2-0.1L1127.9,224c8.8-6.3,24.1-9.7,38.5,1.5c9.1,7.1,76.1,60.4,82.1,65.2c7,7.9,10.4,19.9,9.1,32.4c-1.3,12.7-7.1,23.8-16,30.5L687.6,601.7L547.2,645l-0.5,0.1l-0.4,0.2c-1.4,0.7-35.4,17-52.4-5.8c-14.5-19.5-9.9-36.7-6.1-50.5l0.4-1.3c0,0.1,46.8-161.9,46.8-161.9c2.3-8.9,9.4-35.6-12.8-54.9c-3.1-3-73.3-70.4-82.9-78.4c-12.6-10.5-33.9-19.3-56.1-12.7l-0.2,0.1l-0.2,0.1l-208.4,81l-1.7,0.3c-19.8,3.8-79.9,15.5-126.3-44.1c-7.4-9.5-12.7-19.1-16.4-28.6l-2.8-8c-2.7-8.7-4.1-17.1-4.7-25.1c3.3-2,10.7-5.1,23.4-4.5c9.2,0.5,17.2-4.1,21.3-12.2c3.8-7.6,3.2-16.2-1.5-22c-1.8-2.2-4.5-4.8-7.6-7.7c-7.8-7.5-19.2-18.3-19.1-27.7c9.3-17.4,21.9-32.6,36.6-43.5c1.4-1,2.9-2.2,4.5-3.4c17.7-13.6,50.6-38.9,131.1-39.7h160.7l2,2.9l1.2,1.7l2,0.1l201.3,11.2L936.8,108.8z M578.9,100.9l-133.8-6h557.6c24.7,0,37.5,9,39,27.4c0,0.1,5.8,60,6.5,67.5c-0.8,4.4-6.7,30.1-33.4,33.9c-0.2,0-8.9,0.9-9.2,0.9c29.7-17.4,29.1-38,29.1-38c-0.2-2.1-4.7-50.8-7.2-65.9c-3-18.2-24.7-20.2-25.7-20.3l-0.2,0h-0.2h-64.8L578.9,100.9z");
var simpleMap=new Path2D("M574,164.6c0,103.6-40,187.5-89.5,187.5c-41.8,0-75.7-83.9-75.7-187.5c0-75.3,16.9-136.2,37.8-136.2C517,28.4,574,89.3,574,164.6z");
function render(){
    // redering
    ctx.clearRect(0,0, canvas.width, canvas.height);
    //ctx.drawImage(Asset.images["map"], 0, 0);
    ctx.stroke(sugoMap);
    if(ctx.isPointInPath(sugoMap, rocket.x, rocket.y)){
        ctx.strokeStyle="blue";
        var l0;
        for(l0=1; l0<100; l0++){
            if(!ctx.isPointInPath(sugoMap, rocket.x+l0*math.cos(rocket.t), rocket.y+l0*math.sin(rocket.t))){
                break;
            }
        }
        ctx.beginPath();
        ctx.moveTo(rocket.x, rocket.y);
        ctx.lineTo(rocket.x+l0*math.cos(rocket.t), rocket.y+l0*math.sin(rocket.t));
        ctx.closePath();
        ctx.stroke();
    }else{
        ctx.strokeStyle="red";
    }
    ctx.beginPath();
    ctx.moveTo(rocket.x+14*math.cos(rocket.t), rocket.y+14*math.sin(rocket.t));
    ctx.lineTo(rocket.x-7*math.cos(rocket.t)+5*math.cos(rocket.t+math.pi/2), rocket.y-7*math.sin(rocket.t)+5*math.sin(rocket.t+math.pi/2));
    ctx.lineTo(rocket.x-7*math.cos(rocket.t)+5*math.cos(rocket.t-math.pi/2), rocket.y-7*math.sin(rocket.t)+5*math.sin(rocket.t-math.pi/2));
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle="black";
    ctx.beginPath();
    ctx.arc(rocket.x, rocket.y, 1, 0, math.pi*2, false);
    ctx.closePath();
    ctx.fill();
    ctx.fillText((1/elapsedTime).toFixed(1)+" fps", 0, 12);
    ctx.fillText("("+rocket.x.toFixed(1)+", "+rocket.y.toFixed(1)+", "+rocket.t.toFixed(1)+", "+rocket.w.toFixed(1)+")", 0, 24)
    //ctx.fillText((math.pi).toFixed(10)+"", 0, 24);
}

document.addEventListener("keydown", keyDownCallback);
document.addEventListener("keyup", keyUpCallback);

var keyDown={};
var key={
    W: 87,
    A: 65,
    S: 83,
    D: 68
};

function keyDownCallback(e){
    keyDown[e.keyCode]=true;
}

function keyUpCallback(e){
    keyDown[e.keyCode]=false;
}

function processInput(){
    if(keyDown[key.W]){
        rocket.vx+=math.cos(rocket.t)*speeds.WSAcceleration;
        rocket.vy+=math.sin(rocket.t)*speeds.WSAcceleration;
    }
    if(keyDown[key.A])rocket.w-=speeds.ADAcceleration;
    if(keyDown[key.S]){
        rocket.vx-=math.cos(rocket.t)*speeds.WSAcceleration;
        rocket.vy-=math.sin(rocket.t)*speeds.WSAcceleration;
    }
    if(keyDown[key.D])rocket.w+=speeds.ADAcceleration;

    rocket.t+=rocket.w*speeds.wScale*elapsedTime;
    rocket.x+=rocket.vx*speeds.vScale*elapsedTime;
    rocket.y+=rocket.vy*speeds.vScale*elapsedTime;
}

function updateSensors(rocket){
    var sensors=[0,0,0,0,0,0,0,0];
}

var Asset={};

Asset.assets=[
];

Asset.images={};

Asset.loadAssets=function(onComplete){
    var total=this.assets.length;
    if(total==0){
        onComplete();
    }
    var loadCount=0;

    var onLoad=function(){
        loadCount++;
        if(loadCount>=total){
            onComplete();
        }
    };

    this.assets.forEach(function(asset){
        switch(asset.type){
            case "image":
                this._loadImage(asset, onLoad);
                break;
        }
    }.bind(this));
};

Asset._loadImage=function(asset, onLoad){
    var image=new Image();
    image.src=asset.src;
    image.onload=onLoad;
    this.images[asset.name]=image;
};