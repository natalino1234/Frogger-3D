/*
	CameraController()
	**Cria um controlador de camera**
	camera - a camera a ser controlada
	object - objeto de referencia para camera se mover junto
*/
function CameraController(camera, object){
	this.camera = camera;
	this.object = object;
	this.offsetInit = { //calcula a diferença de distancia do objeto em relação a camera
		x: camera.position.x-object.position.x,
		y: camera.position.y-object.position.y,
		z: camera.position.z-object.position.z
	}
	this.selected = false;
}

/*
	animate()
	**Faz o movimento da camera de acordo com o objeto de referencia**
*/
CameraController.prototype.animate = function (){
	if(this.selected){ //Ativa o controle da camera fora do offset do objeto
		this.controls();
	}else{
		//move a camera de acordo com o objeto
		//this.camera.position.x = this.object.position.x+this.offsetInit.x;
		this.camera.position.y = this.object.position.y+this.offsetInit.y;
		this.camera.position.z = this.object.position.z+this.offsetInit.z;
	}
}

/*
	setObject()
	**Seta o objeto de referencia**
*/
CameraController.prototype.setObject = function(object){
	this.object = object;
	//recalcula a diferença de distancia do novo objeto em relação a camera
	//this.offsetInit.x = this.camera.position.x-this.object.position.x;
	//this.offsetInit.y = this.camera.position.y-this.object.position.y;
	//this.offsetInit.z = this.camera.position.z-this.object.position.z;
}

/*
	controls()
	**Analisa o controle da camera de acordo com a tecla pressionada**
*/
CameraController.prototype.controls = function(){
	if(pressedCtrl){
		if(tecla == 38){ // CIMA
			this.camera.rotation.x -= degToRad(5);
		}else if(tecla == 40){ // BAIXO
			this.camera.rotation.x += degToRad(5);
		}else if(tecla == 39){ // DIREITA
			this.camera.rotation.z += degToRad(5);
		}else if(tecla == 37){ // ESQUERDA
			this.camera.rotation.z -= degToRad(5);
		}
	}else if(pressedShift){
		if(tecla == 38){ // CIMA
			this.camera.position.z += 1;
		}else if(tecla == 40){ // BAIXO
			this.camera.position.z -= 1;
		}
	}else{
		if(tecla == 38){ // CIMA
			this.camera.position.y += 1;
		}else if(tecla == 40){ // BAIXO
			this.camera.position.y -= 1;
		}else if(tecla == 39){ // DIREITA
			this.camera.position.x += 1;
		}else if(tecla == 37){ // ESQUERDA
			this.camera.position.x -= 1;
		}
	}
	//calcula a diferença de distancia do novo objeto em relação a camera
	this.offsetInit.x = this.camera.position.x-this.object.position.x;
	this.offsetInit.y = this.camera.position.y-this.object.position.y;
	this.offsetInit.z = this.camera.position.z-this.object.position.z;
	tecla = 0;
}