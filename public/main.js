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
var sensorDirections=[0, math.pi/64, math.pi/2, math.pi*63/64, math.pi, math.pi*65/64, math.pi*3/2, math.pi*127/64];
var checkpoints=[[390, 89], [1000, 90], [1040, 210], [855, 250], [790, 460], [920, 415], [1150, 215], [1260, 330], [490, 645], [530, 390], [410, 285], [110, 365], [15, 250], [90, 120]];
var startCheckpoint=0;
var enableRNN=false;

// global variables
var ctx;
var rockets=[];
var betweenCheckpoints=[];
var timeInterval=0;
var generation=0;
var topScoreHistory=[0];
var sugoMap=new Path2D("M1173.7,216.2c-19.6-15.2-40.6-10.4-52.7-1.7l-0.1,0.1l-0.1,0.1L936.1,361.6c-18.2,12.7-25.2,27-23.3,47.7c1.6,17.7-9.2,25.9-11.1,27.2l-65.1,29.1l-0.2,0.1l-0.2,0.1c-0.9,0.5-22.5,11.4-38.2-2.9c-11.6-10.5-6.5-27.1-6.3-27.8c0-0.1,44.9-148.4,46.8-155c10-25.8,22.5-36.7,46.1-40.2c8.9-0.2,120.7-3.2,131.9-4.5c44.4-5.4,43.6-45.2,43.6-45.2l-6.7-68.9c-2-24.5-20.1-38.1-50.8-38.1H211.1C126.5,84,91.6,110.9,72.8,125.3c-1.5,1.2-3,2.3-4.3,3.3c-29.8,22.1-51.6,60.2-57,99.3c-4.8,35.6,4,69,25.5,96.6c21.7,27.8,48.7,44.7,80.4,50.2c25.5,4.4,47.1,0.2,57.4-1.8l2.2-0.4l0.5-0.1l0.5-0.2l63-24.5l3.8-1.5l141.8-55.1c17.7-5.2,35.3,2.4,45,10.5c9.3,7.8,81.6,77.2,82.3,77.9l0.1,0.1l0.1,0.1c14.9,12.9,12.8,29.8,9.3,43.1c0-0.1-46.7,161.8-46.7,161.8c0,0.1-0.4,1.4-0.4,1.4c-3.9,14.5-9.9,36.5,8,60.6c18.2,24.4,51.2,17,66.6,9.6l140.3-43.3l0.3-0.1l0.3-0.1l556.1-249.2c13.5-10,19.6-23,21.2-39.2c1.6-15.9-3.1-31.5-12.4-41.8C1257,282.4,1183.2,223.6,1173.7,216.2z M23.3,229.4c1.6-11.8,4.8-23.4,9.4-34.5c4.6,8.3,12.4,15.8,18.4,21.6c2.8,2.7,5.1,9.5,4.3,13.7c-0.6,2.8-4.5,10.9-9,10.8c-11-0.3-18.9,1.3-24.2,3.5C22.2,239.1,22.6,234,23.3,229.4z M990,225c-31.1,1.2-82.4,2.5-106.1,3.1h-0.3h-0.3c-28.1,4-44.3,17.9-55.8,47.8l-0.1,0.2l-0.1,0.2l-46.9,155.1c-0.3,0.9-7.6,24.3,9.6,40c21.2,19.3,48.7,6.1,51.5,4.7l65.4-29.2l0.3-0.1l0.3-0.2c0.8-0.5,19.4-12,16.9-38.5c-1.5-16.5,3.7-26.9,18.5-37.1l0.2-0.1l0.2-0.1L1127.9,224c8.8-6.3,24.1-9.7,38.5,1.5c9.1,7.1,76.1,60.4,82.1,65.2c7,7.9,10.4,19.9,9.1,32.4c-1.3,12.7-7.1,23.8-16,30.5l-554,248.1L547.2,645l-0.5,0.1l-0.4,0.2c-1.4,0.7-35.4,17-52.4-5.8c-14.5-19.5-9.9-36.7-6.1-50.5l0.4-1.3c0,0.1,46.8-161.9,46.8-161.9c2.3-8.9,9.4-35.6-12.8-54.9c-3.1-3-73.3-70.4-82.9-78.4c-12.6-10.5-33.9-19.3-56.1-12.7l-0.2,0.1l-0.2,0.1l-208.4,81l-1.7,0.3c-19.8,3.8-79.9,15.5-126.3-44.1c-7.4-9.5-12.7-19.1-16.4-28.6l-2.8-8c-2.7-8.7-4.1-17.1-4.7-25.1c3.3-2,10.7-5.1,23.4-4.5c9.2,0.5,17.2-4.1,21.3-12.2c3.8-7.6,3.2-16.2-1.5-22c-1.8-2.2-4.5-4.8-7.6-7.7c-7.8-7.5-19.2-18.3-19.1-27.7c9.3-17.4,21.9-32.6,36.6-43.5c1.4-1,2.9-2.2,4.5-3.4c17.7-13.6,50.6-38.9,131.1-39.7h160.7l73.2,0.1h557.6c24.7,0,37.5,9,39,27.4c0,0.1,5.8,60,6.5,67.5c-0.8,4.4-6.7,30.1-33.4,33.9c-0.2,0-8.9,0.9-9.2,0.9L990,225z");

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
            this.NN_hidden.push(math.zeros(HIDDEN_SIZE));
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
            if(this.vx<speeds.speedMax){
                this.vx+=math.cos(this.t)*speeds.WSAcceleration;
            }
            if(this.vy<speeds.speedMax){
                this.vy+=math.sin(this.t)*speeds.WSAcceleration;
            }
        }
        if(this.wasd[2]){
            if(this.vx>-speeds.speedMax){
                this.vx-=math.cos(this.t)*speeds.WSAcceleration;
            }
            if(this.vy>-speeds.speedMax){
                this.vy-=math.sin(this.t)*speeds.WSAcceleration;
            }
        }
        if(this.wasd[1]){
            if(this.w>-speeds.rotateMax){
                this.w-=speeds.ADAcceleration;
            }
        }
        if(this.wasd[3]){
            if(this.w<speeds.rotateMax){
                this.w+=speeds.ADAcceleration; 
            }
        }
    
        this.t+=this.w*speeds.wScale*timeInterval;
        this.x+=this.vx*speeds.vScale*timeInterval;
        this.y+=this.vy*speeds.vScale*timeInterval;
    }

    calcScore(checkpoints){
        this.distanceToNextCheckpoint=math.norm(math.subtract([this.x, this.y], checkpoints[(this.lastCheckpoint+1)%checkpoints.length]));
        if(this.distanceToNextCheckpoint<10){
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
        ctx.arc(checkpoints[c][0], checkpoints[c][1], 10, 0, math.pi*2, false);
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