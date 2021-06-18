//Este modulo maneja la ubicación actual de la simulación
var nebulosaActual = undefined;
var sistemaSolarActual = undefined;
var planetaActual = undefined;

function actualizarVista() {
    killSpritesActuales();
    if (planetaActual !== undefined) {
        document.getElementById("infoUbic").innerHTML = galaxia.nombre + " / " + nebulosaActual.nombre + " / " + sistemaSolarActual.nombre + " / " + planetaActual.nombre;
        var numeroPlaneta = returnIdBackground(planetaActual);
        fondo.loadTexture('fondoPlaneta' + numeroPlaneta, 0);
        printLines([]);
    } else if (sistemaSolarActual !== undefined) {
        resetSprites(sistemaSolarActual.planetas);
        var numeroSisP = returnIdBackground(sistemaSolarActual);
        fondo.loadTexture('fondoSistemaSolar' + numeroSisP, 0);
        document.getElementById("infoUbic").innerHTML = galaxia.nombre + " / " + nebulosaActual.nombre + " / " + sistemaSolarActual.nombre;
        printLines(sistemaSolarActual.lineas);
    } else if (nebulosaActual !== undefined) {
        resetSprites(nebulosaActual.sistemasPlanetarios);
        document.getElementById("infoUbic").innerHTML = galaxia.nombre + " / " + nebulosaActual.nombre;
        var numeroNebulosa = returnIdBackground(nebulosaActual);
        fondo.loadTexture('fondoNebulosa' + numeroNebulosa, 0);
        printLines(nebulosaActual.lineas);
    } else {
        resetSprites(galaxia.nebulosas);
        document.getElementById("infoUbic").innerHTML = galaxia.nombre;
        fondo.loadTexture('fondoGalaxia', 0);
        printLines([]);
    }
    fondo.height = alto;
    fondo.width = ancho;
}

function salir() {
    if (planetaActual !== undefined) {
        planetaActual = undefined;
    } else if (sistemaSolarActual !== undefined) {
        sistemaSolarActual = undefined;
    } else {
        nebulosaActual = undefined;
    }
    actualizarVista();
}

function clickNebula(sprite, pointer) {
    if (!isDrag()) {
        deseleccionar();
        cargarVistaEdicion("N");
        nebulosaActual = galaxia.nebulosas[this.idNeb];
        actualizarVista();
    }
}

function clickSisPlanetario(sprite, pointer) {
    if (!isDrag()) {
        if (pointer.rightButton.isUp) { //Click IZQUIERDO
            var idaux = this.id;
            setTimeout(function () {
                if (!isDrag()) {
                    deseleccionar();
                    cargarVistaEdicion("S");
                    sistemaSolarActual = nebulosaActual.sistemasPlanetarios[idaux];
                    actualizarVista();
                }
            }, 200);
        } else {
            createLine([pointer.position.x, pointer.position.y, this.id]); //Click DERECHO
        }
    }
}

function clickPlaneta(sprite, pointer) {
    if (!isDrag()) {
        if (pointer.rightButton.isUp) { //Click IZQUIERDO
            var idaux = this.id;
            var tipoaux = this.tipo;
            setTimeout(function () {
                if (!isDrag() && tipoaux === "planeta") {
                    // alert(nebulosaActual.nombre+": "+nebulosaActual.id);
                    // alert(sistemaSolarActual.nombre+": "+sistemaSolarActual.id);
                    // alert(sistemaSolarActual.planetas[idaux].nombre+": "+sistemaSolarActual.planetas[idaux].id);
                    deseleccionar();
                    planetaActual = sistemaSolarActual.planetas[idaux];
                    cargarVistaEdicion("P");
                    actualizarVista();
                }
                // else if(!isDrag()){
                //     alert(nebulosaActual.nombre+": "+nebulosaActual.id);
                //     alert(sistemaSolarActual.nombre+": "+sistemaSolarActual.id);
                //     alert(sistemaSolarActual.planetas[idaux].nombre+": "+sistemaSolarActual.planetas[idaux].id);
                // }
            }, 200);
        } else {
            createLine([pointer.position.x, pointer.position.y, this.id]); //Click DERECHO
        }
    }
}

function returnIdBackground(objecto) {
    var objectKey = "";
    var numero = -1;
    objectKey = objecto.sprite.key;
    numero = objectKey.substr(objectKey.length - 1, objectKey.length - 1);
    if (numero === "a") { //ultima letra de peligrosa => a
        numero = objectKey.substr(objectKey.length - 10, objectKey.length - 10); //elimino la subsecuencia Peligrosa
    }
    return parseInt(numero);
}

function resetSprites(Object) {
    Object.forEach(function (obj) {
        if (obj != undefined) {
            obj.sprite.reset(obj.sprite.position.x, obj.sprite.position.y);
            spritesActuales.push(obj.sprite);
        }
    });
}

function killSpritesActuales() {
    spritesActuales.forEach(function (sprite) {
        sprite.kill();
    });
    spritesActuales = [];
}