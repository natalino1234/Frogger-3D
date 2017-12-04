/*	
	Fase()
	**Cria uma fase com tamanho pré-definido**
	scene - cena que será guardado os objetos
	width - largura da fase (se par adiciona+1)
	height - quantidade de passagens de obstáculos
*/
function Fase(scene, width, height){
	this.saposAtravessaram = 0;
	this.passagens = Array();
	this.h = height;
	this.w = width;
	this.width = (width*2)+1;
	this.height = height;
	this.geracao = 0;
	this.scene = scene;
	if(Math.random()>0.4){
		//É dia
		var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 50, 0 );
		scene.add( hemiLight );
	}
}

/*
	generateRandom()
	**Gera a fase aleatoriamente de acordo com o tamanho da fase**
*/
Fase.prototype.generateRandom = function(){
	var chanceDeMato = 0.87;  //Chance de não aparecer mato
	var velocidadeMaxima = 7; //Velocidade máxima que pode ter a passagem
	var limiteObstaculos = this.w;
	for(this.geracao = 0; this.geracao<=this.height; this.geracao++){ //for para a geração de passagens
		var type = 0; //Define o tipo da passagem
		if(this.geracao == 0){ //A primeira passagem sempre é de mato (100% de chance)
			this.passagens[this.geracao] = new Passagem(this.scene, 0, this.width, this.geracao, 0, false);
		}else{
			if(Math.random()<chanceDeMato){	
				//Quando não é mato, sempre tem algum obstáculo
				type = Math.floor(Math.random() * 2)+1;
				if(type == 1 && this.passagens[this.geracao-1].type == 1){
					//se é rua: Tem carro ou caminhão que matam
					this.passagens[this.geracao] = new Passagem(this.scene, velocidadeMaxima, this.width, this.geracao, type, true, limiteObstaculos);
				}else{
					//se é água: tem uma forma de atravessar como tronco ou tartaruga (a água mata)
					this.passagens[this.geracao] = new Passagem(this.scene, velocidadeMaxima, this.width, this.geracao, type, false, limiteObstaculos);
				}
			}else{
				//Mato nunca tem obstáculo
				this.passagens[this.geracao] = new Passagem(this.scene, velocidadeMaxima, this.width, this.geracao, 0, false);
			}
		}
	}
	this.passagens[this.geracao] = new Passagem(this.scene, velocidadeMaxima, this.width, this.geracao, 3, false);
	this.height++;
}

/*
	animate()
	**executa a função de animação de cada passagem**	
*/
Fase.prototype.animate = function(){
	for(var i = 0; i<=this.height; i++){
		if(this.passagens[i].type != 0){ //Passagens de Mato nunca tem coisas para animar (por enquanto, não sei se coloco algo)
			this.passagens[i].animate(); //Executa animação da passagem
		}
	}
}