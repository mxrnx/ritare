function getoffset(el){
	if(!el){
		el = this;
	}

	var x = el.offsetLeft;
	var y = el.offsetTop;

	while (el = el.offsetParent) {
		x += el.offsetLeft;
		y += el.offsetTop;
	}

	return [x, y];
}

function start(e){
	offsets = getoffset(Ritare.canvas);
	if(e.type == 'mousedown'){
		Ritare.mouseX = e.pageX - offsets[0] - 2;
		Ritare.mouseY = e.pageY - offsets[1] - 2;
		if(Ritare.touch == true){
			Ritare.touch = false;
			return;
		}
		Ritare.touch = false;
	}
	else if(e.type == 'touchstart'){
		Ritare.mouseX = e.changedTouches[0].pageX - offsets[0] - 2;
		Ritare.mouseY = e.changedTouches[0].pageY - offsets[1] - 2;
		Ritare.touch = true;
	}
	if(Ritare.bucketfill){
		//create a copy of the image's current state for modification
		var canvas = Ritare.context.getImageData(0, 0, Ritare.canvas.width, Ritare.canvas.height);
		//create an array of pixels to scan, and a 2d array to see if a pixel has already been scanned
		var scan = [{x: Ritare.mouseX, y: Ritare.mouseY}];
		var scanned = [];
		for(var x = 0; x < Ritare.canvas.width; x++){
			scanned[x] = new Array(Ritare.canvas.width);
		}
		scanned[Ritare.mouseX][Ritare.mouseY] = true;
		//get color of clicked pixel
		var target = [];
		var offset = (Ritare.mouseY * Ritare.canvas.width + Ritare.mouseX) * 4;
		target[0] = canvas.data[offset];
		target[1] = canvas.data[offset+1];
		target[2] = canvas.data[offset+2];
		//only fill if the selected color is different
		if(!(target[0] == Ritare.colors[0] && target[1] == Ritare.colors[1] && target[2] == Ritare.colors[2])){
			var translation = [[1, 0], [0, 1], [-1, 0], [0, -1]];
			for(var i = 0; i < scan.length; i++){
				//fill the current pixel
				var current = scan[i];
				offset = (current.y * Ritare.canvas.width + current.x) * 4;
				canvas.data[offset] = Ritare.colors[0];
				canvas.data[offset+1] = Ritare.colors[1];
				canvas.data[offset+2] = Ritare.colors[2];
				//check adjacent pixels
				for(var j = 0; j < 4; j++){
					var k = {x: current.x + translation[j][0], y: current.y + translation[j][1]};
					//don't go out of bounds
					if(k.x >= 0 && k.x < Ritare.canvas.width && k.y >= 0 && k.y < Ritare.canvas.height){
						offset = (k.y * Ritare.canvas.width + k.x) * 4;
						//don't go over a pixel more than once
						if(scanned[k.x][k.y] != true){
							scanned[k.x][k.y] = true;
							if(canvas.data[offset] == target[0] && canvas.data[offset+1] == target[1] && canvas.data[offset+2] == target[2]){
								scan.push(k);
							}
							else{
								//deal with anti-aliasing
								canvas.data[offset] = Ritare.colors[0];
								canvas.data[offset+1] = Ritare.colors[1];
								canvas.data[offset+2] = Ritare.colors[2];
							}
						}
					}
				}
			}
		}
		//write the stored copy back
		Ritare.context.putImageData(canvas, 0, 0);
	}
	else if(Ritare.paint != true){
		Ritare.paint = true;
		Ritare.context.beginPath();
		Ritare.context.fillStyle = Ritare.color;
		Ritare.context.arc(Ritare.mouseX, Ritare.mouseY, Ritare.width/2, 0, 2*Math.PI)
		Ritare.context.fill();
	}
}

function move(e){
	if(Ritare.paint){
		Ritare.context.strokeStyle = Ritare.color;
		Ritare.context.lineJoin = 'round';
		Ritare.context.lineCap = 'round';
		Ritare.context.lineWidth = Ritare.width;
		Ritare.context.beginPath();
		Ritare.context.moveTo(Ritare.mouseX, Ritare.mouseY)
		offsets = getoffset(Ritare.canvas);
		if(e.type == 'mousemove'){
			Ritare.mouseX = e.pageX - offsets[0] - 2;
			Ritare.mouseY = e.pageY - offsets[1] - 2;
		}
		else if(e.type == 'touchmove'){
			Ritare.mouseX = e.changedTouches[0].pageX - offsets[0] - 2;
			Ritare.mouseY = e.changedTouches[0].pageY - offsets[1] - 2;
		}
		Ritare.context.lineTo(Ritare.mouseX, Ritare.mouseY);
		Ritare.context.stroke();
	}
}

function end(e){
	Ritare.paint = false;
}

var Ritare = {
	parentel: null,
	applet: null,
	canvas: null,
	finishbutton: null,
	widthselect: null,

	colors: [0,0,0],
	color: '#000000',
	mouseX: null,
	mouseY: null,
	width: 3,
	paint: false,
	touch: null,
	bucketfill: null,
	start: function(options) {
		this.parentel = document.getElementById(options.parentel);

		// Prepare applet
		this.applet = document.createElement('div');
		this.applet.id = 'ritare';
		this.applet.style.width = options.width+'px';
		this.applet.style.height = options.height+'px';
		this.parentel.appendChild(this.applet);

		// Prepare canvas
		this.canvas = document.createElement('canvas');
		this.canvas.id = 'ritare-canvas';
		this.canvas.width = options.width;
		this.canvas.height = options.height;
		this.applet.appendChild(this.canvas);

		// Prepare context
		this.context = this.canvas.getContext('2d');
		this.context.fillStyle = '#fff';
		this.context.fillRect(0,0,options.width,options.height);

		// Prepare width select field
		this.widthselect = document.createElement('input');
		this.widthselect.type = 'number';
		this.widthselect.id = 'widthselect';
		this.widthselect.value = this.width;
		this.widthselect.placeholder = 'width';
		this.applet.appendChild(this.widthselect);
		this.widthselect.addEventListener('change', (function(e){
			Ritare.width = Ritare.widthselect.value;
		}));

		// Prepare color picker
		this.picker = document.createElement('input');
		this.picker.id = 'picker';
		this.picker.className = 'jscolor {value:\'' + this.color + '\'}';
		this.applet.appendChild(this.picker);
		this.picker.addEventListener('change', (function(){
			Ritare.color = Ritare.picker.jscolor.toHEXString();
			Ritare.colors = Ritare.picker.jscolor.rgb.map(function(value){
				return parseInt(value.toFixed());
			});
		}));

		//Prepare bucket fill toggle and label
		this.buckettoggle = document.createElement('input');
		this.buckettoggle.id = 'buckettoggle';
		this.buckettoggle.type = 'checkbox';
		this.buckettoggle.checked = this.bucketfill;
		this.bucketlabel = document.createElement('label');
		this.bucketlabel.htmlFor = 'buckettoggle';
		this.bucketlabel.appendChild(document.createTextNode('fill'));
		this.applet.appendChild(this.bucketlabel);
		this.applet.appendChild(this.buckettoggle);
		this.buckettoggle.addEventListener('change', (function(e){
			Ritare.bucketfill = Ritare.buckettoggle.checked;
		}));

		// Prepare finish button
		this.finishbutton = document.createElement('button');
		this.finishbutton.id = 'ritare-finished';
		this.finishbutton.type = 'button';
		this.finishbutton.innerHTML = 'Finished!';
		this.applet.appendChild(this.finishbutton);
		this.finishbutton.addEventListener('mousedown', options.onFinish);

		this.canvas.addEventListener('mousedown', start);
		this.canvas.addEventListener('touchstart', start);
		
		this.canvas.addEventListener('mousemove', move);
		this.canvas.addEventListener('touchmove', move);

		document.body.addEventListener('mouseup', end);
		document.body.addEventListener('touchend', end);
		
	}
};
