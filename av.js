var videobox = document.getElementById('videobox');

rtc.createStream({'video': true, 'audio': true}, function(stream) {
	console.log('Initializing local stream');
	var video = document.createElement('video');
	video.id = 'you';
	videobox.appendChild(video);
	video.src = URL.createObjectURL(stream);
	video.muted = true;
	video.play();
	subdivideVideos();
});

rtc.on('connections', function(connections) {
	console.log('Received connections:');
	console.log(connections);
});

rtc.on('add remote stream', function(stream, socketId) {
	console.log('Adding a remote stream: ' + socketId);
	var video = document.createElement('video');
	video.id = 'remote' + socketId;
	videobox.appendChild(video);
	rtc.attachStream(stream, video.id);
	subdivideVideos();
});

rtc.on('disconnect stream', function(socketId) {
	console.log('Removing a remote stream: ' + socketId);
	var video = document.getElementById('remote' + socketId);
	video.parentNode.removeChild(video);
	subdivideVideos();
});

function getColumns(videoCount) {
	var biggest;

	if ((videoCount > 1) && (videoCount % 2 === 1)) {
		videoCount++;
	}

	biggest = Math.ceil(Math.sqrt(videoCount));
	while (videoCount % biggest !== 0) {
		biggest++;
	}
	return biggest;
}

function subdivideVideos() {
	var videoCount = videobox.childElementCount;
	var columns = getColumns(videoCount);
	var rows = Math.ceil(videoCount / columns);

	for (var i = 0; i < videobox.children.length; i++) {
		var video = videobox.children[i];
		video.width = Math.floor((videobox.clientWidth) / columns);
		video.height = Math.floor((videobox.clientHeight) / rows);
	}
}

rtc.connect('ws://10.18.14.44/webrtc.io/', 'testRoom');
