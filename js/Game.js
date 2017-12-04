function Game(){
	this.fase = "";
	this.scene = "";
	this.player = undefined;
	this.points = 0;
}

Game.prototype.start = function(){
	init();
	this.fase = new Fase(scene,9,5);
	this.player = new Frogger(scene);
}

Game.prototype.init = function(){
	objects = Array();
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x0000 );
	scene.fog = new THREE.Fog( 0x59472b, 1000, FAR );
	scene.fog = new THREE.Fog( scene.background, 1, 5000 );
	
	dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.color.setHSL( 0.1, 1, 0.95 );
	dirLight.position.set( -1, 1.75, 1 );
	dirLight.position.multiplyScalar( 100 );
	scene.add( dirLight );
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.width = 2048;
	dirLight.shadow.mapSize.height = 2048;
	d = 50;
	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;
	dirLight.shadow.camera.far = 500;
	dirLight.shadow.bias = -0.0001;
	
	
	camera.position.z = 20;
	camera.position.y = -15;
	camera.rotation.x += 0.6;
}

Game.prototype.next = function(){
	this.fase = new Fase(scene,9,5);
	this.fase.generateRandom();
}

Game.prototype.animate = function(){
	if(.saposAtravessaram == Math.floor(fase.width/2)){
		montarCenario = true;
		jogar = false;
	}
	this.fase.animate();
	this.player.animate();
}