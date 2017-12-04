/*
	ModelsLoader()
	**Classe para carregar modelos que serão usados no jogo**
	loaderOBJ - OBJLoader para carregamento dos objetos
*/
function ModelsLoader(loaderOBJ, loaderIMG){
	this.loaderOBJ = loaderOBJ;
	this.loaderIMG = loaderIMG;
	this.models = Array(); //Inicia o array de modelos
}

/*
	addModelUrl()
	**Adiciona o local do modelo obj**
	name - nome para representar o modelo no jogo
	url - local do modelo
	rescale - verificar se vai ser possível redimensionar tamanho
	maxScale - tamanho maximo da escala
	minScale - tamanho minimo da escala
	velocityScale - velocidade com que será feito o redimensionamento
*/
ModelsLoader.prototype.addModelUrl = function(
		name, 
		url, 
		imgUrl,
		rescale = false, 
		maxScale = 1, 
		minScale = 1, 
		velocityScale = 0
	){
	this.models[name] = {
		name: name, 
		url: url, 
		model: "", 
		imgUrl: imgUrl,  
		loaded: false, 
		rescale: {
			min: minScale, 
			max: maxScale, 
			velocity: velocityScale, 
			doThis: rescale
			},
		texture: "",
		image: "",
		textLoaded: false
	};
}

/*
	setModel()
	**Seta o modelo 3d carregado no sistema**
	name - nome do modelo para localizar no vetor
	model - modelo carregado
*/
ModelsLoader.prototype.setModel = function(name, model){
	this.models[name].model = model;
	this.models[name].loaded = true;
}

ModelsLoader.prototype.setTexture = function(name, image){
	this.models[name].image = image;
	this.models[name].texture = new THREE.Texture();
	this.models[name].texture.image = image;
    this.models[name].texture.needsUpdate = true;
	this.models[name].textLoaded = true;
}

/*
	load()
	**carrega o modelo obj para utilizar no jogo**
	name - nome do jogo 
*/
ModelsLoader.prototype.load = function(name){
	var tempModel;
	this.loaderOBJ.load(
		// local do modelo
		this.models[name].url,
		// função chamada quando o modelo é carregado
		function (model) {
			model.scale -= 0.5; //reduz o tamanho do modelo para a metade
			model.children[0].geometry.computeBoundingBox(); //calcula a box do objeto
			model.min = model.children[0].geometry.boundingBox.min; //pega os tamanhos mínimos e torna de mais fácil acesso
			model.max = model.children[0].geometry.boundingBox.max; //pega os tamanhos máximos e torna de mais fácil acesso
			ml.setModel(name, model); //seta o modelo quando carregado
			//console.log(name);
			//console.log(model);
		},
		// função chamada quando o modelo está sendo carregado
		function ( xhr ) {
			console.log( name+" Model: "+( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		// função chamada quando ocorre o um erro no carregamento
		function ( error ) {
			console.log( 'An error happened' );
		}
	);
	if(this.models[name].imgUrl != ""){
		//("IMGLOADER: "+this.models[name].imgUrl);
		this.loaderIMG.load(
			// local do modelo
			this.models[name].imgUrl,
			// função chamada quando o modelo é carregado
			function (imagem) {
				ml.setTexture(name, imagem);
			},
			// função chamada quando o modelo está sendo carregado
			function ( xhr ) {
				console.log( name+" Model: "+( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			// função chamada quando ocorre o um erro no carregamento
			function ( error ) {
				console.log( 'An error happened' );
			}
		);
	}
}

/*
	loadAll()
	**Carrega todos os modelos pre-carregados**
*/
ModelsLoader.prototype.loadAll = function(){
	var keys = Object.keys(this.models);
	for(var i = 0; i<keys.length; i++){
		if(!this.models[keys[i]].loaded){
			this.load(keys[i]);
		}
	}
}

ModelsLoader.prototype.getModel = function(name, castShadow = false, receiveShadow = false){
	var model;
	//try{
		model = this.models[name].model.clone();
	//}catch(e){
	//	alert(name);
	//}
	model.min = {
		x: parseFloat(this.models[name].model.min.x.toFixed(2)),
		y: parseFloat(this.models[name].model.min.y.toFixed(2)),
		z: parseFloat(this.models[name].model.min.z.toFixed(2))
	};
	model.max = {
		x: parseFloat(this.models[name].model.max.x.toFixed(2)),
		y: parseFloat(this.models[name].model.max.y.toFixed(2)),
		z: parseFloat(this.models[name].model.max.z.toFixed(2))
	};
	if(castShadow){
		model.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.castShadow = true;
			}
		});
	}
	if(receiveShadow){
		model.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.receiveShadow = true;
			}
		});
	}
	if(this.models[name].imgUrl != ""){
	var texture = this.models[name].texture;
		model.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = texture;
			}
		});
	}
	model.rescale = this.models[name].rescale;
	if(name == "tronco"){
		model.scale.z = 0.1;
		model.children[0].geometry.computeBoundingBox();
		model.min = model.children[0].geometry.boundingBox.min;
		model.max = model.children[0].geometry.boundingBox.max;
	}
	return model;
}

function TexturesLoader(){
	
}