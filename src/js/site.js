import {TweenLite} from 'gsap'

const opts = {
	particleColor: "rgb(200,200,200)",
	lineColor: "rgb(200,200,200)",
	particleAmount: 10,
	defaultSpeed: 1,
	variantSpeed: 0.2,
	defaultRadius: 2,
	variantRadius: 2,
	linkRadius: 200,
	stepX: 150,
	stepY: 120,
	gridH: 10,
	gridW: 15
}

let w, h, tid //stepX, stepY
let particles = []
let delay = 500
let rgb = opts.lineColor.match(/\d+/g)

const canvasBody = document.getElementById("spiders")
let drawArea

function isMobile(){
	return window.innerWidth < 992
}

function startAnimate(){
	if(!canvasBody || isMobile()) return

	drawArea = canvasBody.getContext('2d')

	window.addEventListener('resize', deBouncer)

	resizeReset()
	setup()
}

function resizeReset() {
	w = canvasBody.width = window.innerWidth
	h = canvasBody.height = window.innerHeight

	//stepX = (w / opts.gridW + 2)
	//stepY = (h / opts.gridH + 2)
}

function deBouncer() {
	clearTimeout(tid);
	tid = setTimeout(function() {

		resizeReset();
		//setup()
	}, delay)
}

function checkDistance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function linkPoints(point1, hubs){
	for (let i = 0; i < hubs.length; i++) {
		let distance = checkDistance(point1.x, point1.y, hubs[i].x, hubs[i].y)
		let opacity = 1 - distance / opts.linkRadius;
		if (opacity > 0) {
			drawArea.lineWidth = 0.5;
			drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`
			drawArea.beginPath()
			drawArea.moveTo(point1.x, point1.y)
			drawArea.lineTo(hubs[i].x, hubs[i].y)
			drawArea.closePath()
			drawArea.stroke()
		}
	}
}

function Particle(gridX, gridY){

	this.gridX = gridX
	this.gridY = gridY

	this.initialX = (opts.stepX * gridX) + 20 //Math.random() * w
	this.initialY = (opts.stepY * gridY) + 20 //Math.random() * h

	this.x = this.initialX
	this.y = this.initialY

	this.direction = Math.round(Math.random()) ? 1 : -1

	this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
	this.directionAngle = Math.floor(Math.random() * 360);
	this.color = opts.particleColor;
	this.radius = 1 //opts.defaultRadius + Math.random() * opts. variantRadius;
	this.vector = {
		x: Math.cos(this.directionAngle) * this.speed,
	};

	this.prev = particles.find(p => p.gridY === gridY && p.gridX === gridX-1)


	this.update = () => {
		//console.log('-- this.update', this)
		const deviation = (1 + Math.random() * opts.stepX)
		const move = this.initialX + (deviation * this.direction)
		//this.border();

		//this.x += this.vector.x;
		//this.y += this.vector.y;

		TweenLite.to(
			this, // target
			this.speed,
			{
				x: move,
				onComplete: () => {
					//setNearest()
					//shiftPoint(p)

					this.direction = this.direction === 1 ? -1 : 1;
					this.update()
				}
			}
		)
	};

	this.border = function(){
		if (this.x >= w || this.x <= 0) {
			this.vector.x *= -1;
		}
		if (this.y >= h || this.y <= 0) {
			this.vector.y *= -1;
		}
		if (this.x > w) this.x = w;
		if (this.y > h) this.y = h;
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
	};

	this.draw = function(){
		drawArea.beginPath();
		drawArea.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		drawArea.closePath();
		drawArea.fillStyle = this.color;
		drawArea.fill();

		if(this.prev){
			const dist = checkDistance(this.x, this.y, this.prev.x, this.prev.y)
			if(dist < 50){
				const opacity = 1 - (dist / 50)
				drawArea.lineWidth = 0.5;
				drawArea.strokeStyle = `rgba(255, 255, 255, ${opacity})` // `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
				drawArea.beginPath();
				drawArea.moveTo(this.x, this.y);
				drawArea.lineTo(this.prev.x, this.prev.y);
				drawArea.closePath();
				drawArea.stroke();
			}
		}

		/*drawArea.beginPath();
		drawArea.arc(this.initialX, this.initialY, this.radius, 0, Math.PI*2);
		drawArea.closePath();
		drawArea.fillStyle = 'rgb(40,40,40)';
		drawArea.fill();*/
	};

	this.update()

}

function setup(){
	resizeReset();

	particles = []

	for(let x=0; x*opts.stepX<=w; x++){
		for(let y=0; y*opts.stepY<=h; y++){
			particles.push(new Particle(x, y))
		}
	}

	/*for (let x=1; x<opts.gridW; x++){

	}*/

	window.requestAnimationFrame(loop);
}

function loop(){
	window.requestAnimationFrame(loop);
	drawArea.clearRect(0,0,w,h);

	const r = 2

	//drawArea.rotate(-r * Math.PI / 180);

	for (let i = 0; i < particles.length; i++){
		//particles[i].update();
		particles[i].draw();
	}
	for (let i = 0; i < particles.length; i++){
		//linkPoints(particles[i], particles);
	}

	//drawArea.rotate(r * Math.PI / 180);

}


;(function(){

	const logo = document.querySelector('.logo')
	const as = document.querySelectorAll('.nav a')

	if(logo && as){
		logo.classList.add('on')

		logo.querySelectorAll('h2, h3')
			.forEach(h => {
				h.classList.add('on')
			})

		Array.from(as).forEach(a => a.classList.add('on'))
	}

	startAnimate()

})()

window.initMap = function(){

	const markers = [
		{lat: 44.920544, lng: -0.616478}, // ben
		{lat: 46.998632, lng: 2.251256},  // yo
		{lat: 45.757836, lng: 4.838039},  // remi
		{lat: 43.526376, lng: 1.540487}   // toulouse
	];

	/**
	 * Specify features and elements to define styles.
	 * https://snazzymaps.com/style/15/subtle-grayscale (base)
	 * https://snazzymaps.com/editor/edit-my-style/41310 (version perso de Kapp)
	 */
	const styleArray = [
		{
			"featureType": "administrative.country",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.country",
			"elementType": "labels.text",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.province",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.locality",
			"elementType": "labels.text",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "all",
			"stylers": [
				{
					"saturation": -100
				},
				{
					"lightness": 65
				},
				{
					"visibility": "on"
				}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#2d3232"
				}
			]
		},
		{
			"featureType": "landscape.natural",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "on"
				}
			]
		},
		{
			"featureType": "landscape.natural",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"visibility": "on"
				}
			]
		},
		{
			"featureType": "landscape.natural",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "poi",
			"elementType": "all",
			"stylers": [
				{
					"saturation": -100
				},
				{
					"lightness": 51
				},
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "all",
			"stylers": [
				{
					"saturation": -100
				},
				{
					"visibility": "simplified"
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road.highway.controlled_access",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "simplified"
				}
			]
		},
		{
			"featureType": "road.arterial",
			"elementType": "all",
			"stylers": [
				{
					"saturation": -100
				},
				{
					"lightness": 30
				},
				{
					"visibility": "on"
				}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "all",
			"stylers": [
				{
					"saturation": -100
				},
				{
					"lightness": 40
				},
				{
					"visibility": "on"
				}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "labels.text",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "transit",
			"elementType": "all",
			"stylers": [
				{
					"saturation": -100
				},
				{
					"visibility": "simplified"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
				{
					"lightness": -25
				},
				{
					"saturation": -97
				},
				{
					"color": "#f8f8f8"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				},
				{
					"lightness": -25
				},
				{
					"saturation": -100
				}
			]
		}
	];


	// Create a map object and specify the DOM element for display.
	const map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 46.722835, lng: 2.529725},
		zoom: 5,
		styles: styleArray,
		disableDefaultUI: true,
		draggable: false,
		scrollwheel: false,
		panControl: false
	});

	markers.forEach(marker => {
		new google.maps.Marker({
			map: map,
			position: marker
		});

	})

}



;(function(){

	const feedback = document.querySelector('#feedback')
	const email = document.querySelector('input[type="email"]')
	const msg = document.querySelector('textarea')
	const form = document.querySelector('.contact form')

	form.addEventListener('submit', submit)

	function submit(e){
		e.preventDefault()

		fetch('mailer.php', {
			method: 'POST',
			body: JSON.stringify({
				email: email.value,
				msg: msg.value
			}),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		})
		.then(res => res.json())
		.then(function(res){
			if(res.success) return feedback.innerHTML = 'Message envoyé, notre réponse ne vas pas tarder'
			return feedback.innerHTML = 'Une erreur est survenue'
		})

	}


})()