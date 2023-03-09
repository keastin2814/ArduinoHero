//Kyle Eastin
// CSC 2463 Final Project
//Arduino Hero
// This is a knock-off version of guitar hero but 
//built with an arduino

var state = 0;
var guy = [];
var count = 5;
var squishedCount = 0;
var score = 0;
var timer = 26;
var synth, synthPart;

var osc;

var portName ="COM8";

var rx_flag = 255;
var sensorPot = 0;
var sensorPhoto = 1;
var buttonSensor = 2;
var sensors =[200,10,0];
var previousSensors = [200,10,0];
var sensorCounter = 0;

var mappedSensor = [];
var previousMappedSensor = [];

function preload()
{
			guy = [new Walker("empty-circle.png",500,200, 1, 0, 100,1),
						 new Walker("empty-circle.png",500,328, 1, 0, 200,2),
						 new Walker("empty-circle.png",500,456, 1, 0, 300,3),
						 new Walker("empty-circle.png",500,200, 1, 0, 400,1),
			 			 new Walker("empty-circle.png",500,328, 1, 0, 500,2),
						 new Walker("empty-circle.png",500,456, 1, 0, 600,4),
						 new Walker("empty-circle.png",500,456, 1, 0, 650,3),
						 new Walker("empty-circle.png",500,200, 1, 0, 800,1),
			 			 new Walker("empty-circle.png",500,328, 1, 0, 900,2),
			 			 new Walker("empty-circle.png",500,456, 1, 0, 1000,3),
			 			 new Walker("empty-circle.png",500,328, 1, 0, 1100,2),
			 			 new Walker("empty-circle.png",500,200, 1, 0, 1200,1)];

}

function setup()
{
	createCanvas(640,600);
	imageMode(CENTER);

	osc = new Tone.OmniOscillator('440','pwm').start();

	gainNode = new Tone.Gain();

	ampEnv = new Tone.Envelope({
		"attack": 0.1,
		"decay": 0.0,
		"sustain": 0.3,
		"release": 0.1
	});

	ampEnv.connect(gainNode.gain);
	osc.connect(gainNode);
	gainNode.toMaster();

	serial = new p5.SerialPort();
  	serial.list();
  	serial.open(portName);
  	serial.on('connected',serverConnected);
  	serial.on('list',gotList);
  	serial.on('data',gotData);
  	serial.on('error',gotError);
  	serial.on('open',gotOpen);

}

function Walker(imageName,x,y,move,squished, waiting, noteValue)
{
	this.splunkyGuy = loadImage(imageName);
	this.frame = 0;
	this.x = x;
	this.y = y;
	this.moving = move;
	this.facing = 0;
	this.squished = squished;
	this.waiting = waiting;
	this.noteValue = noteValue;


	this.draw = function()
	{
		push();

		translate(this.x,this.y);

		if(this.facing <0)
		{
			scale(-1.0,1.0);
		}

		if(this.waiting == 0)
		{
				this.moving = -1;
		}
		if(this.squished == 1)
		{
			this.moving = 0;
			//image(this.splunkyGuy,0,0);
			pop();
		}
		else if (this.waiting > 0) {
			this.waiting--;
			this.moving = 0;
			image(this.splunkyGuy,0,0);
			pop();
		}
		else
		{
			image(this.splunkyGuy,0,0);

			if(frameCount %8 ==0){
				this.frame = (this.frame + 1) % 8;
				this.x = this.x + 15 * this.moving;


				if(this.x < 18)
				{
					this.moving = +1;
					this.facing= + 1;
				}
				if(this.x > width - 18)
				{
					this.moving = -1;
					this.facing = -1;
				}
			}
			pop();
		}

		this.stop = function()
		{
			this.moving = 0;
			this.frame = 3;
		}

		this.go = function(direction)
		{
			this.moving = direction;
			this.facing = direction;
		}
	}
}


function mousePressed()
{
	if(state==0)
	{
		state = 1;
	}
	if(state == 1)
	{
		for (var i = 0; i < 12; i++)
		{
			if((guy[i].x > 36) && (guy[i].x < 164))
			{
				if(guy[i].squished == 0)
				{
						if(guy[i].noteValue == 1 && mouseY > 135 && mouseY < 265)
						{
							//play a b flat
							osc.frequency.value = 116.54;
							ampEnv.triggerAttackRelease(0.5);
							guy[i].squished = 1;
							score++;
						}
						else if(guy[i].noteValue == 2 && mouseY > 263 && mouseY < 393)
						{
							//play a d flat
							osc.frequency.value = 138.59;
							ampEnv.triggerAttackRelease(0.5);
							guy[i].squished = 1;
							score++;
						}
						else if(guy[i].noteValue == 3 && mouseY > 391 && mouseY < 521)
						{
							//play an e flat
							osc.frequency.value = 155.56;
							ampEnv.triggerAttackRelease(0.5);
							guy[i].squished = 1;
							score++;
						}
						else if(guy[i].noteValue == 4 && mouseY > 391 && mouseY < 521)
						{
							//play an e
							osc.frequency.value = 164.81;
							ampEnv.triggerAttackRelease(0.5);
							guy[i].squished = 1;
							score++;
						}
				}
			}
		}
	}
}


function draw()
{
	background(200,200,200);

	if(state == 0)
	{
		textAlign(CENTER);
		textSize(50);
		text("Arduino Hero", width/2, height/4);
		textSize(20);
		text("Use the potentionmeter to scroll up and down between playing zones",width/2,250);
		text("Click the button when the notes are in the playing zone",width/2,300);
		textSize(50);
		text("Click the Button to Start", width/2, 400);
	}
	else if(state == 1)
	{
		stroke(0,0,0);
		strokeWeight(3);
		line(36,100,36,570);
		line(164,100,164,570);
		if(mouseY > 135 && mouseY < 265)
		{
			stroke(0,255,0);
			line(36,136,164,136);
			line(36,264,164,264);
			stroke(0,0,0);
			line(36,392,164,392);
			line(36,520,164,520);
		}
		else if(mouseY > 263 && mouseY < 393)
		{
			stroke(0,255,0);
			line(36,392,164,392);
			line(36,264,164,264);
			stroke(0,0,0);
			line(36,136,164,136);
			line(36,520,164,520);
		}
		else if(mouseY > 391 && mouseY < 521)
		{
			stroke(0,255,0);
			line(36,392,164,392);
			line(36,520,164,520);
			stroke(0,0,0);
			line(36,136,164,136);
			line(36,264,164,264);
		}
		else {
			stroke(0,0,0);
			line(36,136,164,136);
			line(36,264,164,264);
			line(36,392,164,392);
			line(36,520,164,520);
		}




		//image(img,200,200);
		for(var i=0;i<12;i++)
			guy[i].draw();

		textSize(20);
		stroke(0,0,0);
		strokeWeight(0);
		if(frameCount %60 == 0)
		{
			timer--;
		}
		text("Notes Hit: " + score, 50, 20);
		text("Timer: " + timer + " seconds remaining", 540, 20);


	}
	else if(state == 2)
	{
		textSize(30);
		text("Good Job!", width/2, height/3);
		text("You hit " + score + "/12 notes correctly", width/2,height/2);
	}

	if(timer == 0)
	{
		state = 2;
	}

}

function serverConnected(){
  println("Connected Server!");
}

function gotList(thelist){
  println("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    println(i + " " + thelist[i]);
  }
}

function gotOpen(){
  println("Serial Port is Open!");
}

function gotError(theerror){
  println(theerror);
}

function gotRawData(thedata){
  println("gotRawData"+thedata);
}

function gotData(){
  while(serial.available()){
    var temp = serial.read();
    if(temp == rx_flag){
      sensorCounter = 0;
    }else{
      previousSensors[sensorCounter] = sensors[sensorCounter];
      sensors[sensorCounter] = temp;
      sensorCounter++;
    }
  }
}

function mapSensor(){
  //mapps based on canvas size

  mappedSensor[0] = (sensors[sensorPot]/255)*600;
  mappedSensor[1] = (sensors[sensorPhoto]/225)*400;

  previousMappedSensor[0] = (previousSensors[sensorPot]/255)*600;
  previousMappedSensor[1] = (previousSensors[sensorPhoto]/255)*400;
}
