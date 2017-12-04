var manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onLoad = function ( ) {
	console.log( 'Loading complete!');
};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	if(itemsLoaded == itemsTotal){
		modelosCarregados = true;
	}else{
		modelosCarregados = false;
	}
};

manager.onError = function (url){
	//console.log( 'There was an error loading ' + url );
};

var loaderOBJ = new THREE.OBJLoader(manager);
var loaderIMG = new THREE.ImageLoader(manager);

var pressedCtrl = false;
var pressedShift = false;
var cameraSelected = false;
var log = false;
var tecla = 0;
var vel = 1;
var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */
			tecla = 37; 
        } else {
            /* right swipe */
			tecla = 39;
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
			tecla = 38;
        } else { 
            /* down swipe */
			tecla = 40;
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};

$(document).ready(function(){
	document.onkeyup = function(e){
		if(e.keyCode == 17){ //CTRL
			pressedCtrl = false;
		}else
		if(e.keyCode == 16){ //SHIFT
			pressedShift = false;
		}
		
	};

	document.onkeydown = function(e){
		tecla = e.keyCode;
		if(e.keyCode == 17){
			pressedCtrl = true;
		}
		if(e.keyCode == 16){
			pressedShift = true;
		}
		if(e.keyCode == 67){
			cameraSelected = !cameraSelected;
		}
		if(e.keyCode == 76){
			log = !log;
		}
	};

	document.addEventListener('touchstart', handleTouchStart, false);        
	document.addEventListener('touchmove', handleTouchMove, false);


});

function degToRad(graus) {
	return graus * Math.PI / 180;
}

function ObjectsList(){
	this.objects = Array();
	this.count = Array();
	this.size = Array();
}

ObjectsList.prototype.createHeight = function(height){
	this.objects[height] = Array();
	this.size[height] = 0;
	this.count[height] = 0;
}

ObjectsList.prototype.add = function(height, object){
	this.objects[height].push(object);
	this.size[height]++;
}

ObjectsList.prototype.nextObject = function(height){
	if(this.count[height] == this.size[height]){
		this.count[height] = 0;
	}
	var c = this.count[height];
	this.count[height]++;
	return this.objects[height][c];
}

ObjectsList.prototype.sizes = function(){
	console.log("Quantidade de Passagens: "+this.objects.length);
	console.log("Quantidade de Objetos por Linha:");
	for(var i = 0; i < this.objects.length; i++){
		console.log("Linha "+i+": "+this.size[i]);
	}
}

var objs = new ObjectsList();
