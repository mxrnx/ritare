# ritare
Simple, pure javascript, no jQuery, oekaki applet. Originally written for [Fikaba](https://github.com/knarka/fikaba).

[Demo page here.](https://knarka.github.io/ritare/)

Here is a really professional test image, drawn with (an older version of) this very piece of software:

![An awfully drawn image of some awful chinese cartoon characters](https://github.com/knarka/ritare/raw/master/screenshot.png "Yes, it's really bad, I know")

# Features
* Not written in Java
* Does not use jQuery
* Pencil and bucket fill tools
* Width picker
* Color picker
* You can draw images and stuff

# Usage
```html
<!doctype html>
<html>
	<head>
		<title>ritare</title>
		<meta charset="utf-8" />
		<script type="text/javascript" src="ritare.js"></script>
		<link type="text/css" href="ritare.css" rel="stylesheet" />
	</head>
	<body>
		<div id="painter">
			<script type="text/javascript">
				Ritare.start({
					parentel: "painter",
					onFinish: function(e) {
						window.open(Ritare.canvas.toDataURL('image/png'))
					},
					width:600,
					height:300
				});
			</script>
		</div>
	</body>
</html>
```

Something like that. You'll figure it out.
