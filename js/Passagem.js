//var quantidade = 0;
function Passagem(scene, velocity = 0, mountBlocks, ordem = 0, type = 1, vizinhoBaixo = false, limiteObstaculos = 1){
	this.scene = scene;
	this.model;
	this.faixas = Array();
	this.type = type;
	var h = 0;
	this.objObstacle = new THREE.Object3D();
	this.obstacle = 0;
	this.nameObstacle = "";
	
	objs.createHeight(ordem);
	
	var randomType = Math.random();
	var randomLado = Math.random()<=0.5?0:1;
	//var randomLado = 0;
	//var vlc = Math.random();
	var vlcmin = 0.35;
	var vlcmax = 0.9;
	var vlc = 0;
	while(vlc < vlcmin || vlc > vlcmax){
		vlc = Math.random();
	}
	
	var limiteLateral = 1;
	
	//if(quantidade == 0 && type != 0){
	if(type == 2){
		h = -0.3;
		
		if(randomType < 0.2){
			nameObstacle = "turtle";
		}else{
			nameObstacle = "tronco";
		}
		this.obstacle = new ObstacleBarrier(
			scene, 
			randomLado, 
			vlc/velocity, 
			nameObstacle,
			{x: ((mountBlocks*3)+3)*limiteLateral, y: ordem*3, z: h},
			{x: -((mountBlocks*3)+3)*limiteLateral, y: ordem*3, z: h},
			h, 
			limiteObstaculos,
			ordem
		);
	}else if(type == 1){
		
		if(randomType < 0.5){
			nameObstacle = "car";
		}else{
			nameObstacle = "caminhao";
		}
		
		h = 0;
		this.obstacle = new ObstacleBarrier(
			scene, 
			randomLado, 
			vlc/velocity, 
			nameObstacle,
			{x: ((mountBlocks*3)+3)*limiteLateral, y: ordem*3, z: h},
			{x: -((mountBlocks*3)+3)*limiteLateral, y: ordem*3, z: h},
			h,
			limiteObstaculos,
			ordem
		);
	}
	
	//quantidade=1;
	//}
	
	switch(type){
		case (1):
			var geometry = new THREE.PlaneBufferGeometry(mountBlocks*3,3, 32, 32);
			var material = new THREE.MeshPhongMaterial({ color: 0x212121 });
			var plane = new THREE.Mesh(geometry, material);
			plane.position.y += ordem*3;
			plane.receiveShadow = true;
			this.model = plane;
			scene.add(plane);
			if(vizinhoBaixo){
				for(var i = 0; i<mountBlocks; i++){
					if(i % 2 == 0){
						geometry = new THREE.PlaneBufferGeometry(3,0.4, 32, 32);
						material = new THREE.MeshPhongMaterial( { color: 0xFFFF00 } );
						plane = new THREE.Mesh(geometry, material);
						plane.position.x -= (mountBlocks*3/2)-1.5;
						plane.position.x += i*3;
						plane.position.y -= 1.5-ordem*3;
						plane.position.z += 0.01;
						plane.receiveShadow = true;
						this.faixas[i] = plane;
						scene.add(plane);
					}
				}
			}
		break;
		case(0):
			for(var i = 0; i<mountBlocks; i++){
				var grass = ml.getModel("grass", true, true);
				var girar = Math.floor(Math.random() * 3) + 1 ;
				grass.rotation.z += degToRad(90*girar);
				grass.position.x -= (mountBlocks*3/2)-1.5;
				grass.position.x += i*3;
				grass.position.y += ordem*3;
				scene.add(grass);
			}
		break;
		case (2):
			var geometry = new THREE.PlaneBufferGeometry(mountBlocks*3,3, 32, 32);
			var material = new THREE.MeshPhongMaterial({ color: 0x000099 });
			var plane = new THREE.Mesh(geometry, material);
			plane.position.y += ordem*3;
			plane.position.z -= 0.3;
			plane.receiveShadow = true;
			this.model = plane;
			scene.add(plane);
		break;
		case (3):
			var geometry = new THREE.PlaneBufferGeometry(mountBlocks*3,3, 32, 32);
			var material = new THREE.MeshPhongMaterial({ color: 0x000099 });
			var plane = new THREE.Mesh(geometry, material);
			plane.position.y += ordem*3;
			plane.position.z -= 0.3;
			plane.receiveShadow = true;
			this.model = plane;
			scene.add(plane);
			for(var i = 0; i<mountBlocks; i++){
				if(i%2!=0){
					var grass = ml.getModel("grass", true, true);
					var girar = Math.floor(Math.random() * 3) + 1 ;
					grass.rotation.z += degToRad(90*girar);
					grass.position.x -= (mountBlocks*3/2)-1.5;
					grass.position.x += i*3;
					grass.position.y += ordem*3;
					scene.add(grass);
					qttprecisaAtravessar++;
				}
			}
		break;
	}
}

Passagem.prototype.animate = function(){
	if(this.type != 0 && this.obstacle != 0){
		this.obstacle.animate();
	}
}