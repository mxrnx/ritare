# ritare
Simple, pure javascript, no jQuery, oekaki applet. Originally written for [Fikaba](https://github.com/knarka/fikaba).

Here is a very professional test image, drawn with this very piece of software:

![An awfully drawn image of some awful chinese cartoon characters](https://github.com/knarka/ritare/raw/master/screenshot.png "Yes, it's really bad, I know")

# Features
* Not written in Java
* Does not use jQuery
* You can draw images and stuff

# Usage
```html
<!doctype html>
<html>
	<head>
		<title>ritare test</title>
		<meta charset="utf-8" />
		<script type="text/javascript" src="ritare.js"></script>
		<link type="text/css" href="ritare.css" rel="stylesheet" />
	</head>
	<body>
		<div id="painter">
			<script type="text/javascript">Ritare.start({parentel:"painter",onFinish:function(e){window.open(Ritare.canvas.toDataURL('image/png'))},width:600,height:300});</script>
		</div>
	</body>
</html>
```

Something like that. You'll figure it out.
