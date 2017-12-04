var frogger;

function Frogger(scene){
	this.scene = scene;
	this.vida = 5;
	this.name = "frogger";
	this.model = ml.getModel("frogger", true, true);
	this.scene.add(this.model);
	this.collider = new BoxCollider(this, this.model);;
	var metade = Math.floor(fase.width/2);
	this.limits = {maxx: metade, minx: -metade};
	this.position = {x:0, y:0};
	this.flutuando = false;
	this.MaiorY = 0;
}

var lado = 1;
var velocidadeFrogger = 3;
var offset = 0.5;

Frogger.prototype.controlFrogger = function(){
	var girar = 0;
	if(tecla == 39){ // DIREITA
		if(this.position.x<this.limits.maxx){
			this.model.position.x += velocidadeFrogger;
			switch(lado){
				case 1: //CIMA
					girar = degToRad(-90);
					break;
				case 2: //ESQUERDA
					girar = degToRad(180);
					break;
				case 3: //BAIXO
					girar = degToRad(90);
					break;
			}
			this.model.rotation.z += girar;
			lado = 0;
			this.position.x++;
		}else{
			this.position.x = this.limits.maxx;
		}
	}else
	if(tecla == 37){ // ESQUERDA
		if(this.position.x>this.limits.minx){
			this.model.position.x -= velocidadeFrogger;
			switch(lado){
				case 1: //CIMA
					girar = degToRad(90);
					break;
				case 0: //DIREITA
					girar = degToRad(-180);
					break;
				case 3: //BAIXO
					girar = degToRad(-90);
					break;
			}
			this.model.rotation.z += girar;
			lado = 2;
			this.position.x--;
		}else{
			this.position.x = this.limits.minx;
		}
	}else
	if(tecla == 38){ // CIMA
		if(this.position.y<fase.height){
			this.model.position.y += velocidadeFrogger;
			switch(lado){
				case 2: // ESQUERDA
					girar = degToRad(-90);
					break;
				case 0: // DIREITA
					girar = degToRad(90);
					break;
				case 3: //BAIXO
					girar = degToRad(180);
					break;
			}
			this.model.rotation.z += girar;
			lado = 1;
			this.position.y++;
		}else{
			this.position.y = fase.height;
		}
	}else
	if(tecla == 40){ // BAIXO
		if(this.position.y>0){
			this.model.position.y -= velocidadeFrogger;
			switch(lado){
				case 1: // CIMA
					girar = degToRad(180);
					break;
				case 0: // DIREITA
					girar = degToRad(-90);
					break;
				case 2: //ESQUERDA
					girar = degToRad(90);
					break;
			}
			this.model.rotation.z += girar;
			lado = 3;
			this.position.y--;
		}else{
			this.position.y = 0;
		}
	}
	tecla = 0;
}

Frogger.prototype.ressurect = function(){
	this.model.position.x = 0;
	this.model.position.y = 0;
	this.flutuando = false;
	this.position = {x:0,y:0};
	mortes++;
	if(pontos > 0){
		pontos--;
	}
}

Frogger.prototype.animate = function(){
	this.controlFrogger();
	this.collider.calcBox();
	if(fase.passagens[this.position.y].type == 3){
		if(fase.w%2 != 0){
			if(this.position.x%2!=0){
				msg = "Você caiu na água!";
				exibirMensagem = true;
				this.ressurect();
			}else{
				frogger = new Frogger(scene);
				cc.setObject(frogger.model);
				fase.saposAtravessaram++;
			}
		}else{
			if(this.position.x%2==0){
				msg = "Você caiu na água!";
				exibirMensagem = true;
				this.ressurect();
			}else{
				var temSapo = false;
				for(var i = 0; i < checkpointSapos.length; i++){
					if(checkpointSapos[i] == this.position.x){
						temSapo = true;
						break;
					}
				}
				if(!temSapo){
					checkpointSapos.push(this.position.x);
					frogger = new Frogger(scene);
					cc.setObject(frogger.model);
					fase.saposAtravessaram++;
					pontos+=2;
				}else{
					this.model.position.y-=3;
					this.position.y--;
				}
			}
		}
	}
	this.flutuando = false;
	this.collider.detect(function(objectDetect, objectCollider){
		if(objectCollider.name === "tronco" || objectCollider.name === "turtle"){
			objectDetect.position.x = Math.round(objectDetect.model.position.x/3);
			if(objectCollider.reduzindo){
				objectDetect.model.position.z += objectCollider.abaixou/50;
			}else{
				objectDetect.model.position.z -= objectCollider.abaixou/50;
			}
			if(objectCollider.orientation == 0){
				//Se tiver indo para a direita
				if(objectCollider.name == "turtle"){
					//alert(objectCollider.model.scale.z);
					if(objectCollider.model.scale.z < 0.5){
						objectDetect.ressurect();
						return;
					}
				}
				objectDetect.model.position.x += objectCollider.velocity;
			}else{
				//Se tiver indo para a esquerda
				if(objectCollider.name == "turtle"){
					//alert(objectCollider.model.scale.z);
					if(objectCollider.model.scale.z < 0.5){
						objectDetect.ressurect();
						return;
					}
				}
				objectDetect.model.position.x -= objectCollider.velocity;
			}
			objectDetect.flutuando = true;
		}else{
			msg = "Você foi atropelado!";
			exibirMensagem = true;
			objectDetect.ressurect();
		}
	});
	if(!this.flutuando){
		this.model.position.x = Math.floor(this.model.position.x);
		var md = this.model.position.x%3;
		if(md == 1 || md == -2){
			this.model.position.x--;
		}else if(md == 2 || md == -1){
			this.model.position.x++;
		}
		this.position.x = Math.round(this.model.position.x/3);
		this.model.position.z = 0;
	}
	if(this.model.position.x>this.limits.maxx*3){
		this.model.position.x = this.limits.maxx*3;
		this.position.x = this.limits.maxx;
	}else if(this.model.position.x<this.limits.minx*3){
		this.model.position.x = this.limits.minx*3;
		this.position.x = this.limits.minx;
	}
	if(fase.passagens[this.position.y].type == 2){
		if(!this.flutuando){
			msg = "Você caiu na água!";
			exibirMensagem = true;
			this.ressurect();
		}
	}
	if(this.position.y>this.MaiorY){
		this.MaiorY = this.position.y;
		pontos+=1;
	}
}