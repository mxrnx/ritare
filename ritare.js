var Ritare = {
	parentel: null,
	applet: null,
	canvas: null,
	finishbutton: null,
	widthselect: null,

	colors: [0,0,0],
	mouseX: null,
	mouseY: null,
	width: 1,
	paint: null,
	start: function(options) {
		var controlwidth = 160;
		this.parentel = document.getElementById(options.parentel);

		// Prepare applet
		this.applet = document.createElement("div");
		this.applet.id = 'ritare';
		this.applet.style.width = options.width+'px';
		this.applet.style.height = options.height+'px';
		this.parentel.appendChild(this.applet);

		// Prepare canvas
		this.canvas = document.createElement("canvas");
		this.canvas.id = 'ritare-canvas';
		this.canvas.width = options.width - controlwidth;
		this.canvas.height = options.height;
		this.applet.appendChild(this.canvas);

		// Prepare context
		this.context = this.canvas.getContext("2d");
		this.context.fillStyle = "#fff";
		this.context.fillRect(0,0,options.width,options.height);

		// Prepare width select field
		this.widthselect = document.createElement("input");
		this.widthselect.type = 'number';
		this.widthselect.id = 'widthselect';
		this.widthselect.value = this.width;
		this.applet.appendChild(this.widthselect);
		this.widthselect.addEventListener("change", (function(e){
			Ritare.width = Ritare.widthselect.value;
		}));

		// Prepare color selectors
		this.selectors = document.createElement("div");
		this.selectors.id = "selectors";
		this.applet.appendChild(this.selectors);

		this.blueselect = document.createElement("input");
		this.blueselect.type = 'number';
		this.blueselect.min = '0';
		this.blueselect.max = '255';
		this.blueselect.value = this.width;
		this.selectors.appendChild(this.blueselect);
		this.blueselect.addEventListener("change", (function(e){
			Ritare.colors[2] = Ritare.blueselect.value;
		}));
		this.greenselect = document.createElement("input");
		this.greenselect.type = 'number';
		this.greenselect.min = '0';
		this.greenselect.max = '255';
		this.greenselect.value = this.width;
		this.selectors.appendChild(this.greenselect);
		this.greenselect.addEventListener("change", (function(e){
			Ritare.colors[1] = Ritare.greenselect.value;
		}));
		this.redselect = document.createElement("input");
		this.redselect.type = 'number';
		this.redselect.min = '0';
		this.redselect.max = '255';
		this.redselect.value = this.width;
		this.selectors.appendChild(this.redselect);
		this.redselect.addEventListener("change", (function(e){
			Ritare.colors[0] = Ritare.redselect.value;
		}));

		// Prepare finish button
		this.finishbutton = document.createElement("button");
		this.finishbutton.id = 'ritare-finished';
		this.finishbutton.type = 'button';
		this.finishbutton.innerHTML = 'Finished!';
		this.applet.appendChild(this.finishbutton);
		this.finishbutton.addEventListener("mousedown", options.onFinish);

		this.canvas.addEventListener("mousedown", (function(e){
			Ritare.mouseX = e.pageX - Ritare.canvas.offsetLeft;
			Ritare.mouseY = e.pageY - Ritare.canvas.offsetTop;
			Ritare.paint = true;
		}));

		this.canvas.addEventListener("mousemove", (function(e){
			Ritare.mouseX = e.pageX - Ritare.canvas.offsetLeft;
			Ritare.mouseY = e.pageY - Ritare.canvas.offsetTop;
			if(Ritare.paint){
				Ritare.context.fillStyle = "rgba("+Ritare.colors[0]+","+Ritare.colors[1]+","+Ritare.colors[2]+",255)";
				//Ritare.context.fillRect(Ritare.mouseX, Ritare.mouseY, Ritare.width, Ritare.width);
				Ritare.context.beginPath();
				Ritare.context.arc(Ritare.mouseX, Ritare.mouseY, Ritare.width, 0, 2*Math.PI)
				Ritare.context.fill();
			}
		}));

		document.body.addEventListener("mouseup", (function(e){
			Ritare.paint = false;
		}));
	}
};
