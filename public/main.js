// global parameters
var SCREEN_WIDTH=1600;
var SCREEN_HEIGHT=900;
var INITIAL_ROCKETS=25;
var ELITE_NUM=5;
var speeds={
    WSAcceleration: 0.5,
    ADAcceleration: math.pi/64,
    wScale: 1,
    vScale: 10,
    speedMax: 10,
    rotateMax: 2*math.pi,
}
var SENSOR_SIZE=10;
var HIDDEN_SIZE=32;
var HIDDEN_LAYER=2;
var OUTPUT_SIZE=4;
var sensorDirectionUnit=64;
var sensorDirections=[0, math.pi/sensorDirectionUnit, math.pi/2, math.pi*(sensorDirectionUnit-1)/sensorDirectionUnit, math.pi, math.pi*(sensorDirectionUnit+1)/sensorDirectionUnit, math.pi*3/2, math.pi*(2*sensorDirectionUnit-1)/sensorDirectionUnit];
var checkpoints=[[390, 50], [970, 52], [1040, 170], [855, 205], [790, 430], [920, 370], [1140, 175], [1245, 290], [550, 595], [535, 345], [410, 245], [110, 330], [20, 205], [95, 75]];
var startCheckpoint=0;
var enableRNN=false;

// global variables
var ctx;
var rockets=[];
var betweenCheckpoints=[];
var timeInterval=0;
var generation=0;
var topScoreHistory=[0];
var sugoMap=new Path2D("M1267.5,233.6l-72.7-61.4c-19.1-15.4-38.6-34.9-62.7-27.8c-24.1,7.1-37,35.3-37,35.3L937,300.5c-34.9,21.6-38.2,41.5-37.8,47.3c2.3,36.9,9.2,30.3-39.8,54.8c-24,12-41.9,22.8-53.6,14.1c-11.6-8.7-10.8-24.9-2.9-44c7.9-19.1,13.3-53.1,17.9-62.7c10.9-22.8,28.6-73.5,40.3-81.4c9.5-6.4,54-5.8,62.7-9.1c8.7-3.3,65.2-5,65.2-5c32,3.3,51.5-8.7,59-14.9l80.1-66l-72.7-83.5c-10.8-12.9-26.6-17.4-34-17.4H579.1c-18.7,6.6-101.3,6.6-108.8,7.9c-23.9,4-161.9-0.4-177.7-0.4c-15.8,0-91.3-7.1-109.2-4.2c-17.9,2.9-68.5,6.6-117.5,44.8c-51.3,40-63.5,97.6-64.8,106.3c-2.7,18.9-2.9,50.2,23.7,97.6c34.1,60.7,95.5,66,103,66.4c51.5,2.9,122.9-38.2,140.3-43.6l120.8-39c29.9-8.3,39.3,3.9,39.3,3.9l80.8,67.5c22.7,18.8,1.1,49.8,1.1,49.8l-68.1,129.5c-23.8,37.6-17.2,59.2-8.3,81.9c21.8,55.8,112.4,23.8,123.7,20.2l126.2-44l345.9-153.6c12-4.6,108-34,130-39.9c22-5.8,79.3-34,89.3-39.9c6.1-3.6,27.8-25.7,30.7-55.6C1283,251.9,1267.5,233.6,1267.5,233.6z M400.2,54.2h538.5l-0.5,3c0,0-2.8,0.4-2.9,2.6c-0.1,2.7,2,2.7,2,2.7l-1.9,11.2h63.1c5.5,1.1,12.7,5,13.8,14.4l5.5,58.7c0,0-0.6,23.3-28.8,27.7c-25.9,4.1-124,5-128.4-6.1l-1.4-2.2c-11.3,0-50,8.2-60.9,38.5c-6.6,18.3-32.6,128.8-37.6,160.4c-3.8,23.7-6.3,34.1-3.6,60.2c1.1,10.7,12.4,29.7,42.6,37.6c10.5,2.8,31-2.8,31-2.8l85.2-39.9c0,0,24.9-11.1,23.4-48.2c-1.2-29.3-7.4-30.4,9.2-45.9l154.4-121.2c0,0,38.8-22.7,72,1.1l35.4,26.6c0,0,47.1,39.3-5,77.5l-102.4,57L677.9,555.8c0,0-93.3,20.2-111.8,18.8c-13.3-1-44.3-7.8-41.5-54.3c2.8-46.5,6.6-80.3,6.6-80.3s29.9-69.8,18.8-103.3c-3.7-11.3-19.9-28.2-19.9-28.2l-74.2-72.2c0,0-19.4-22-55.9-19.9c-31.8,1.8-87.5,42.5-87.5,42.5l-140.3,54.4c-11.6,3.3-53.6,12.9-87.6-10.8c-34-23.7-49-55.2-49.8-85.5l25.3-0.8c0,0,24.9-4.2,24.5-22.4c-0.4-18.3-18.5-32.2-28.2-39.4c-6.6-5,2.7-25.1,7.5-29.9c6.2-6.2,39.1-51.3,112.1-61c12.5-1.7,51.5-2.5,51.5-2.5h142.4L400.2,54.2z");

function init(){
    // initialization
    var canvas;
    canvas=document.getElementById("maincanvas");
    canvas.width=SCREEN_WIDTH;
    canvas.height=SCREEN_HEIGHT;
    ctx=canvas.getContext("2d");
    ctx.font="12px Consolas";

    for(var i=0;i<checkpoints.length;i++){
        betweenCheckpoints[i]=math.norm(math.subtract(checkpoints[i], checkpoints[(i+1)%checkpoints.length]));
    }
    for(var i=0;i<INITIAL_ROCKETS;i++){
        rockets.push(new Rocket());
    }

    requestAnimationFrame(update);
}

var lastTimestamp = null;
var lastTopAliveScore=-1;
function update(timestamp){
    var topAliveScore;
    if(lastTimestamp!=null){
        timeInterval=(timestamp-lastTimestamp)/1000;
    }
    lastTimestamp=timestamp;

    for(var i=0;i<rockets.length;i++){
        if(rockets[i].alive){
            rockets[i].updateSensors(sugoMap);
            rockets[i].computeNN();
            rockets[i].move();
            rockets[i].calcScore(checkpoints);
        }
    }
    rockets.sort(function(a,b){
        if(a.score<b.score){
            return 1;
        }else{
            return -1;
        }
    });
    topAliveScore=-1;
    for(var i=0;i<rockets.length; i++){
        if(topScoreHistory[topScoreHistory.length-1]<rockets[i].score){
            topScoreHistory[topScoreHistory.length-1]=rockets[i].score;
        }
        if(rockets[i].alive){
            if(topAliveScore<rockets[i].score){
                topAliveScore=rockets[i].score;
            }
            break;
        }
    }
    if(keyDown[key.R] || lastTopAliveScore==topAliveScore){
        // new generation
        var newRockets=[];
        for(var i=0;i<rockets.length;i++){
            var dice=math.random();
            var eliteIdx=math.randomInt(ELITE_NUM);
            newRockets.push($.extend(true, new Rocket(), rockets[eliteIdx]));
            if(dice<0.1){
                // mutation
                for(var j=0;j<SENSOR_SIZE;j++){
                    for(var k=0;k<HIDDEN_SIZE;k++){
                        if(math.random()<0.03){
                            newRockets[newRockets.length-1].NN_A[j][k]=math.random(-1, 1);
                        }
                    }
                }
                for(var l=0;l<HIDDEN_LAYER;l++){
                    for(var j=0;j<HIDDEN_SIZE;j++){
                        for(var k=0;k<HIDDEN_SIZE;k++){
                            if(math.random()<0.03){
                                newRockets[newRockets.length-1].NN_R[l][j][k]=math.random(-1, 1);
                            }
                        }
                    }
                    for(var j=0;j<HIDDEN_SIZE;j++){
                        for(var k=0;k<HIDDEN_SIZE;k++){
                            if(math.random()<0.02){
                                newRockets[newRockets.length-1].NN_F[l][j][k]=math.random(-1, 1);
                            }
                        }
                    }
                }
                for(var j=0;j<HIDDEN_SIZE;j++){
                    for(var k=0;k<OUTPUT_SIZE;k++){
                        if(math.random()<0.02){
                            newRockets[newRockets.length-1].NN_B[j][k]=math.random(-1, 1);
                        }
                    }
                }
                newRockets[newRockets.length-1].born="mutation";
            }else if(dice<0.9){
                // crossover
                var pair=(eliteIdx+math.randomInt(ELITE_NUM))%ELITE_NUM;
                var crossoverBegin=math.randomInt(SENSOR_SIZE*HIDDEN_SIZE);
                var crossoverEnd=math.randomInt(crossoverBegin, SENSOR_SIZE*HIDDEN_SIZE);
                for(var j=crossoverBegin;j<crossoverEnd;j++){
                    newRockets[newRockets.length-1].NN_A[math.floor(j/HIDDEN_SIZE)][j%HIDDEN_SIZE]=rockets[pair].NN_A[math.floor(j/HIDDEN_SIZE)][j%HIDDEN_SIZE];
                }
                for(var l=0;l<HIDDEN_LAYER;l++){
                    var crossoverBegin=math.randomInt(HIDDEN_SIZE*HIDDEN_SIZE);
                    var crossoverEnd=math.randomInt(crossoverBegin, HIDDEN_SIZE*HIDDEN_SIZE);
                    for(var j=crossoverBegin;j<crossoverEnd;j++){
                        newRockets[newRockets.length-1].NN_R[l][math.floor(j/HIDDEN_SIZE)][j%HIDDEN_SIZE]=rockets[pair].NN_R[l][math.floor(j/HIDDEN_SIZE)][j%HIDDEN_SIZE];
                    }
                    var crossoverBegin=math.randomInt(HIDDEN_SIZE*HIDDEN_SIZE);
                    var crossoverEnd=math.randomInt(crossoverBegin, HIDDEN_SIZE*HIDDEN_SIZE);
                    for(var j=crossoverBegin;j<crossoverEnd;j++){
                        newRockets[newRockets.length-1].NN_F[l][math.floor(j/HIDDEN_SIZE)][j%HIDDEN_SIZE]=rockets[pair].NN_F[l][math.floor(j/HIDDEN_SIZE)][j%HIDDEN_SIZE];
                    }
                }
                crossoverBegin=math.randomInt(HIDDEN_SIZE*OUTPUT_SIZE);
                crossoverEnd=math.randomInt(crossoverBegin, HIDDEN_SIZE*OUTPUT_SIZE);
                for(var j=crossoverBegin;j<crossoverEnd;j++){
                    newRockets[newRockets.length-1].NN_B[math.floor(j/OUTPUT_SIZE)][j%OUTPUT_SIZE]=rockets[pair].NN_B[math.floor(j/OUTPUT_SIZE)][j%OUTPUT_SIZE];
                }
                newRockets[newRockets.length-1].born="cross";
            }else{
                // copy
                newRockets[newRockets.length-1].born="copy";
            }
            newRockets[newRockets.length-1].resetState();
        }

        rockets=newRockets;
        topCheckpoint=0;
        generation++;
        topScoreHistory.push(0);
    }else{
        lastTopAliveScore=topAliveScore;
    }
    render();
    requestAnimationFrame(update);
}

class Rocket{
    constructor(){
        this.alive=true;
        this.x=checkpoints[startCheckpoint][0];
        this.y=checkpoints[startCheckpoint][1];
        this.t=0;
        this.vx=0;
        this.vy=0;
        this.w=0;
        this.lastCheckpoint=0;
        this.distanceToNextCheckpoint=0;
        this.score=0;
        this.sensorDistance=[200, 200, 50, 200, 200, 200, 50, 200];
        this.sensors=new Array(SENSOR_SIZE);
        this.sensors[SENSOR_SIZE-1]=1;
        this.NN_A=math.random([SENSOR_SIZE, HIDDEN_SIZE], -1, 1);
        this.NN_hidden=[];
        this.NN_R=[];
        this.NN_F=[];
        for(var i=0;i<HIDDEN_LAYER;i++){
            this.NN_hidden.push(math.zeros(HIDDEN_SIZE)._data);
            this.NN_R.push(math.random([HIDDEN_SIZE, HIDDEN_SIZE], -1, 1));
            this.NN_F.push(math.random([HIDDEN_SIZE, HIDDEN_SIZE], -1, 1));
        }
        this.NN_B=math.random([HIDDEN_SIZE, OUTPUT_SIZE], -1, 1);
        this.NN_output=new Array(OUTPUT_SIZE);
        this.wasd=new Array(4);
        this.born="random";
    }

    resetState(){
        this.alive=true;
        this.x=checkpoints[startCheckpoint][0];
        this.y=checkpoints[startCheckpoint][1];
        this.t=0;
        this.vx=0;
        this.vy=0;
        this.w=0;
        this.lastCheckpoint=0;
        this.distanceToNextCheckpoint=0;
        this.NN_hidden=[];
        for(var i=0;i<HIDDEN_LAYER;i++){
            this.NN_hidden.push(math.zeros(HIDDEN_SIZE)._data);
        }
    }

    updateSensors(map){
        if(!ctx.isPointInPath(map, this.x, this.y)){
            this.alive=false;
            return;
        }
        for(var i=0;i<8;i++){
            /*for(var d=1;d<=this.sensorDistance[i];d++){
                if(!ctx.isPointInPath(map, this.x+d*math.cos(this.t+sensorDirections[i]), this.y+d*math.sin(this.t+sensorDirections[i]))){
                    break;
                }
                this.sensors[i]=1-d/this.sensorDistance[i];
            }*/
            // binary search may be not suitable for small corners
            var d=this.sensorDistance[i]/2;
            for(var dd=this.sensorDistance[i]/4; dd>=1; dd/=2){
                if(ctx.isPointInPath(map, this.x+d*math.cos(this.t+sensorDirections[i]), this.y+d*math.sin(this.t+sensorDirections[i]))){
                    d+=dd;
                }else{
                    d-=dd;
                }
            }
            this.sensors[i]=d/this.sensorDistance[i];
        }
        this.sensors[8]=this.w/speeds.rotateMax;
    }

    computeNN(){
        // sigmoid sensors
        //this.sensors=math.dotDivide(1, math.add(1, math.exp(math.multiply(-1, this.sensors))));
        if(enableRNN){
            this.NN_hidden[0]=math.dotDivide(1, math.add(1, math.exp(math.multiply(-1, math.add(math.multiply(this.sensors, this.NN_A), math.multiply(this.NN_hidden[0], this.NN_R[0]))))));
            for(var i=1;i<HIDDEN_LAYER;i++){
                this.NN_hidden[i]=math.dotDivide(1, math.add(1, math.exp(math.multiply(-1, math.add(math.multiply(this.NN_hidden[i-1], this.NN_F[i-1]), math.multiply(this.NN_hidden[i], this.NN_R[i]))))));
            }
            this.NN_output=math.dotDivide(1, math.add(1, math.exp(math.multiply(-1, math.multiply(this.NN_hidden[HIDDEN_LAYER-1], this.NN_B)))));
        }else{
            this.NN_hidden[0]=math.dotDivide(1, math.add(1, math.exp(math.multiply(-1, math.multiply(this.sensors, this.NN_A)))));
            for(var i=1;i<HIDDEN_LAYER;i++){
                this.NN_hidden[i]=math.dotDivide(1, math.add(1, math.exp(math.multiply(-1, math.multiply(this.NN_hidden[i-1], this.NN_F[i-1])))));
            }
            this.NN_output=math.dotDivide(1, math.add(1, math.exp(math.multiply(-1, math.multiply(this.NN_hidden[HIDDEN_LAYER-1], this.NN_B)))));
        }
        this.wasd[0]=false;
        this.wasd[2]=false;
        if(this.NN_output[0]-this.NN_output[2]>0.5){
            this.wasd[0]=true;
        }else if(this.NN_output[0]-this.NN_output[2]<-0.5){
            this.wasd[2]=true;
        }
        this.wasd[1]=false;
        this.wasd[3]=false;
        if(this.NN_output[1]-this.NN_output[3]>0.5){
            this.wasd[1]=true;
        }else if(this.NN_output[1]-this.NN_output[3]<-0.5){
            this.wasd[3]=true;
        }
    }

    move(){
        if(this.wasd[0]){
            if(this.vx+math.cos(this.t)*speeds.WSAcceleration<speeds.speedMax && this.vx+math.cos(this.t)*speeds.WSAcceleration>-speeds.speedMax){
                this.vx+=math.cos(this.t)*speeds.WSAcceleration;
            }
            if(this.vy+math.sin(this.t)*speeds.WSAcceleration<speeds.speedMax && this.vy+math.sin(this.t)*speeds.WSAcceleration>-speeds.speedMax){
                this.vy+=math.sin(this.t)*speeds.WSAcceleration;
            }
        }
        if(this.wasd[2]){
            if(this.vx-math.cos(this.t)*speeds.WSAcceleration<speeds.speedMax && this.vx-math.cos(this.t)*speeds.WSAcceleration>-speeds.speedMax){
                this.vx-=math.cos(this.t)*speeds.WSAcceleration;
            }
            if(this.vy-math.sin(this.t)*speeds.WSAcceleration<speeds.speedMax && this.vy-math.sin(this.t)*speeds.WSAcceleration>-speeds.speedMax){
                this.vy-=math.sin(this.t)*speeds.WSAcceleration;
            }
        }
        if(this.wasd[1]){
            if(this.w-speeds.ADAcceleration>-speeds.rotateMax){
                this.w-=speeds.ADAcceleration;
            }
        }
        if(this.wasd[3]){
            if(this.w+speeds.ADAcceleration<speeds.rotateMax){
                this.w+=speeds.ADAcceleration; 
            }
        }
    
        this.t+=this.w*speeds.wScale*timeInterval;
        this.x+=this.vx*speeds.vScale*timeInterval;
        this.y+=this.vy*speeds.vScale*timeInterval;
    }

    calcScore(checkpoints){
        this.distanceToNextCheckpoint=math.norm(math.subtract([this.x, this.y], checkpoints[(this.lastCheckpoint+1)%checkpoints.length]));
        if(this.distanceToNextCheckpoint<20){
            this.lastCheckpoint=this.lastCheckpoint+1;
            this.distanceToNextCheckpoint=math.norm(math.subtract([this.x, this.y], checkpoints[(this.lastCheckpoint+1)%checkpoints.length]));
        }
        this.score=this.lastCheckpoint+1-this.distanceToNextCheckpoint/betweenCheckpoints[this.lastCheckpoint];
        if(this.score<startCheckpoint){
            // kill rockets running backward
            //this.alive=false;
        }
    }
}

function render(){
    // redering
    ctx.clearRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.strokeStyle="black";
    ctx.stroke(sugoMap);
    for(var c=0;c<checkpoints.length;c++){
        ctx.strokeStyle="green";
        ctx.beginPath();
        ctx.arc(checkpoints[c][0], checkpoints[c][1], 20, 0, math.pi*2, false);
        ctx.closePath();
        ctx.stroke();
    }
    var renderedRocket=0;
    var aliveRocket=0;
    for(var r=0;r<rockets.length;r++){
        if(!rockets[r].alive){
            //continue;
        }else{
            aliveRocket++;
        }
        renderedRocket++;
        if(rockets[r].alive){
            ctx.strokeStyle="blue";
            // sensor dots
            /*for(var i=0;i<8;i++){
                ctx.beginPath();
                ctx.arc(rockets[r].x+(1-rockets[r].sensors[i])*rockets[r].sensorDistance[i]*math.cos(rockets[r].t+sensorDirections[i]), rockets[r].y+(1-rockets[r].sensors[i])*rockets[r].sensorDistance[i]*math.sin(rockets[r].t+sensorDirections[i]), 1, 0, math.pi*2, false);
                ctx.closePath();
                ctx.fill();
            }*/
        }else{
            ctx.strokeStyle="red";
        }
        ctx.beginPath();
        ctx.moveTo(rockets[r].x+14*math.cos(rockets[r].t), rockets[r].y+14*math.sin(rockets[r].t));
        ctx.lineTo(rockets[r].x-7*math.cos(rockets[r].t)+5*math.cos(rockets[r].t+math.pi/2), rockets[r].y-7*math.sin(rockets[r].t)+5*math.sin(rockets[r].t+math.pi/2));
        ctx.lineTo(rockets[r].x-7*math.cos(rockets[r].t)+5*math.cos(rockets[r].t-math.pi/2), rockets[r].y-7*math.sin(rockets[r].t)+5*math.sin(rockets[r].t-math.pi/2));
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle="black";
        ctx.beginPath();
        ctx.arc(rockets[r].x, rockets[r].y, 1, 0, math.pi*2, false);
        ctx.closePath();
        ctx.fill();
        ctx.fillText(rockets[r].born, 0, 400+12*renderedRocket);
        ctx.fillText(rockets[r].x.toFixed(1), 60, 400+12*renderedRocket);
        ctx.fillText(rockets[r].y.toFixed(1), 110, 400+12*renderedRocket);
        ctx.fillText(rockets[r].t.toFixed(1), 160, 400+12*renderedRocket);
        ctx.fillText(rockets[r].w.toFixed(1), 210, 400+12*renderedRocket);
        ctx.fillText(rockets[r].score.toFixed(2), 260, 400+12*renderedRocket);
        if(rockets[r].alive){
            if(rockets[r].wasd[0]){
                ctx.fillText("W", 310, 400+12*renderedRocket);
            }
            if(rockets[r].wasd[1]){
                ctx.fillText("A", 320, 400+12*renderedRocket);
            }
            if(rockets[r].wasd[2]){
                ctx.fillText("S", 330, 400+12*renderedRocket);
            }
            if(rockets[r].wasd[3]){
                ctx.fillText("D", 340, 400+12*renderedRocket);
            }
        }else{
            ctx.fillText("!", 310, 400+12*renderedRocket);
        }
    }
    ctx.fillText("Born", 0, 390);
    ctx.fillText("x", 60, 390);
    ctx.fillText("y", 110, 390);
    ctx.fillText("t", 160, 390);
    ctx.fillText("w", 210, 390);
    ctx.fillText("Score", 260, 390);
    ctx.fillText(math.max(topScoreHistory).toFixed(2), 770, 606);
    ctx.strokeStyle="black";
    ctx.beginPath();
    ctx.moveTo(800, 600);
    ctx.lineTo(800, 700);
    ctx.lineTo(1200, 700);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(800, 700-topScoreHistory[0]/math.max(topScoreHistory)*100);
    for(var i=1;i<topScoreHistory.length;i++){
        ctx.lineTo(800+i/(topScoreHistory.length-1)*400, 700-topScoreHistory[i]/math.max(topScoreHistory)*100);
    }
    ctx.stroke();

    for(var i=0;i<SENSOR_SIZE;i++){
        ctx.fillStyle="rgb("+((1-rockets[0].sensors[i])*255).toFixed(0)+","+((1-rockets[0].sensors[i])*255).toFixed(0)+","+((1-rockets[0].sensors[i])*255).toFixed(0)+")";
        ctx.fillRect(1300+i/SENSOR_SIZE*300, 50, 300/SENSOR_SIZE, 20);
    }
    for(var j=0;j<HIDDEN_LAYER;j++){
        for(var i=0;i<HIDDEN_SIZE;i++){
            ctx.fillStyle="rgb("+((1-rockets[0].NN_hidden[j][i])*255).toFixed(0)+","+((1-rockets[0].NN_hidden[j][i])*255).toFixed(0)+","+((1-rockets[0].NN_hidden[j][i])*255).toFixed(0)+")";
            ctx.fillRect(1300+i/HIDDEN_SIZE*300, 80+j*30, 300/HIDDEN_SIZE, 20);
        }
    }
    for(var i=0;i<OUTPUT_SIZE;i++){
        ctx.fillStyle="rgb("+((1-rockets[0].NN_output[i])*255).toFixed(0)+","+((1-rockets[0].NN_output[i])*255).toFixed(0)+","+((1-rockets[0].NN_output[i])*255).toFixed(0)+")";
        ctx.fillRect(1300+i/OUTPUT_SIZE*300, 80+HIDDEN_LAYER*30, 300/OUTPUT_SIZE, 20);
    }
    ctx.fillStyle="white";
    if(rockets[0].wasd[0]){
        ctx.fillText("W", 1335, 95+HIDDEN_LAYER*30);
    }
    if(rockets[0].wasd[1]){
        ctx.fillText("A", 1410, 95+HIDDEN_LAYER*30);
    }
    if(rockets[0].wasd[2]){
        ctx.fillText("S", 1485, 95+HIDDEN_LAYER*30);
    }
    if(rockets[0].wasd[3]){
        ctx.fillText("D", 1560, 95+HIDDEN_LAYER*30);
    }

    ctx.fillStyle="black";
    ctx.fillText((1/timeInterval).toFixed(1)+" fps", 0, 12);
    ctx.fillText("Alive: "+aliveRocket+"/"+INITIAL_ROCKETS, 80, 24);
    ctx.fillText("Gen: "+generation, 80, 12);
    ctx.fillText("Top: "+topScoreHistory[topScoreHistory.length-1].toFixed(2), 0, 24);
}

var keyDown={};
var key={
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    R: 82
};

function keyDownCallback(e){
    keyDown[e.keyCode]=true;
}

function keyUpCallback(e){
    keyDown[e.keyCode]=false;
}

document.addEventListener("keydown", keyDownCallback);
document.addEventListener("keyup", keyUpCallback);

// for humans
function getInput(){
    return [keyDown[key.W], keyDown[key.A], keyDown[key.S], keyDown[key.D]];
}

window.addEventListener("load", init);