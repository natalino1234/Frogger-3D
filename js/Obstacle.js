function Obstacle(scene, orientation, velocity, nameModel, positionInitial, positionFinal, height = 0){
	//1 = direita
	//0 = esquerda
	this.orientation = orientation;
	this.ready = false;
	this.name = nameModel;
	this.model = ml.getModel(nameModel, true, true);
	this.abaixou = 0;
	this.velocity = velocity;
	this.reduzindo = true;
	this.chegouNoMinimo = false;
	this.chegouNoMaximo = true;
	this.scaleInitial = this.model.scale;
	this.scale = 1;
	this.height = height;
	if(nameModel === "tronco"){
		this.model.scale -= 0.5;
	}
	this.collider = new BoxCollider(this, this.model);
	
	
	if(this.orientation == 1){
		this.positionFinal = positionFinal;
		this.positionInitial = positionInitial;
		this.model.rotation.z += degToRad(90);
	
	}else{
		this.positionInitial = positionFinal;
		this.positionFinal = positionInitial;
	
		this.model.rotation.z += degToRad(-90);
	}
	
	this.positionFinal.x = this.positionFinal.x - this.model.min.y;

	this.positionInitial.x = this.positionInitial.x - this.model.max.y;
	
	this.model.position.x += this.positionInitial.x;
	this.model.position.y += this.positionInitial.y;
	
	this.model.position = this.positionInitial;
	this.collider.calcBox();
	scene.add(this.model);
	
	objects.push(this);
	//if(nameModel === "caminhao"){
	//	console.log(this.model);
	//}
}

Obstacle.prototype.animate = function(){
	if(this.orientation == 0){
		if(this.model.position.x >= this.positionFinal.x){
			this.model.position.x = this.positionInitial.x;
		}
		this.model.position.x += this.velocity;
	}else{
		if(this.model.position.x <= this.positionFinal.x){
			this.model.position.x = this.positionInitial.x;
		}
		this.model.position.x -= this.velocity;
	}
	var ao = this.model.max.z - this.model.min.z;
	var proporcao = ao*this.scale;
	var difAltura = ao-proporcao;
	this.model.scale.z = this.scale;
	this.abaixou = this.height-difAltura/2;
	if(this.model.rescale.doThis){
		this.model.position.z = this.abaixou;
		if(this.reduzindo){
			//this.model.position.z = this.height-difAltura/2;
			this.scale -= this.model.rescale.velocity;
			if(this.scale <= this.model.rescale.min){
				this.reduzindo = false;
			}
		}else{
			this.scale += this.model.rescale.velocity;
			if(this.scale >= this.model.rescale.max){
				this.reduzindo = true;
			}
		}
	}
	//console.log(this.model);
	
	this.collider.calcBox(this.orientation);
};

function ObstacleBarrier(scene, orientation, velocity, nameModel, positionInitial, positionFinal, height, sizeGroup = 1, ordem){
	this.sizeGroup = sizeGroup;
	this.model = new THREE.Object3D();
	this.obstacles = Array();
	
	var tempPI = {
		x:positionInitial.x,
		y:positionInitial.y,
		z:positionInitial.z
	};
	var tempPF = {
		x:positionFinal.x,
		y:positionFinal.y,
		z:positionFinal.z
	};
	var obstacle = new Obstacle(scene, orientation, velocity, nameModel, tempPI, tempPF, height);
	this.model.add(obstacle.model);
	this.obstacles.push(obstacle);
	objs.add(ordem, obstacle);
	var xAnt = 0;
	var distAnterior = 0;
	for(i = 1; i< sizeGroup; i++){
		tempPI = {
			x:positionInitial.x,
			y:positionInitial.y,
			z:positionInitial.z
		};
		tempPF = {
			x:positionFinal.x,
			y:positionFinal.y,
			z:positionFinal.z
		};
		var distAleatoria = distAnterior;
		distAleatoria = parseFloat((Math.random()*2.5).toFixed(2));
		obstacle = new Obstacle(scene, orientation, velocity, nameModel, tempPI, tempPF, height);
		var newd = 1.65*(i*(4.7+distAleatoria))+distAnterior;
		switch(nameModel){
			case "caminhao":
				obstacle.model.position.x += newd;
				break;
			case "car":
				obstacle.model.position.x += newd;
				break;
			case "turtle":
				obstacle.model.position.x += newd;
				break;
			case "tronco":
				obstacle.model.position.x += newd;
				break;
				
		}
		this.model.add(obstacle.model);
		this.obstacles.push(obstacle);
		objs.add(ordem, obstacle);
	}
	scene.add(this.model);
}

ObstacleBarrier.prototype.animate = function(){
	for(var i = 0; i < this.obstacles.length; i++){
		this.obstacles[i].animate();
	}
}
