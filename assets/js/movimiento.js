// Motor de Movimiento
var sonidoTaladro;
var maxCupo;
var caminoglobal = [];

function ejecutarAccion() {
    var accion;
    if (caminoglobal.length == 0 || nave.mejoras.length == 0) {
        alertify.success("¡Felicidades la tierra se ha salvado!");
    } else {
        //console.log(caminoglobal);
        //accion = caminoglobal.shift();
        caminoglobal.splice(0, 1);
        accion = caminoglobal;
        console.log(accion);
    }
    
    switch (accion[0]) {
        case "Ex": //extraer Materiales
            accion[0] //iri
            accion[1] //pla
            accion[2] //pal
            accion[3] //eze
            preloadExtraerElementos();
            break;
        case "CC":
            nave.iridio -= accion[1];
            nabe.platino -= accion[2];
            nave.paladio -= accion[3];
            nave.eZero -= accion[4];
            nave.combustible.set(nave.combustible.value + accion[5]);
            break;
        case "CS":
            nave.iridio -= compraSondas[0];
            nave.platino -= compraSondas[1];
            nave.paladio -= compraSondas[2];
            nave.eZero -= compraSondas[3];
            nave.sondas += compraSondas[4];
            break;
        case "ME": //mejora
            accion[2] //nombre
            break;
        case "MOV":
            moverse(accion[1]);
            break;
    }
}

function moverse(arregloMovimiento) {
    caminoActual.push([500, 100, 0]);
    for (let i = 0; i < arregloMovimiento.length; i++) {
        const movi = arregloMovimiento[i];
        switch (movi[0]) {
            case "T":
                teletransportar(accion[1]);
                break;
            case "SN":
                salidaNave(true);
                break;
            case "S":
                salidaNave(false);
                break;
            case "E":
                salidaNave(false);
                break;
        }
    }
}

function empezarMovimiento() {
    if (caminoActual.length) {
        flagMovimiento = true;
        calcularMejorRuta();
        moverNave();
    }
}

function moverNave() {
    var etapa = caminoActual.shift();
    var cantRotacion = game.physics.arcade.angleBetween(nave.sprite, {
        x: etapa[0],
        y: etapa[1]
    });
    if (cantRotacion < 0) {
        cantRotacion += 2 * Math.PI;
    }
    var rotacion = game.add.tween(nave.sprite);
    var movimientoNave = game.add.tween(nave.sprite);
    rotacion.to({
        rotation: cantRotacion
    }, 500);
    movimientoNave.to({
        x: etapa[0],
        y: etapa[1]
    }, nave.msRecorrido);
    rotacion.onComplete.add(function () {
        rotacion.stop();
        if (etapa[2] > 0) {
            consumirCombustible(etapa[2] / 10, 0);
        }
        movimientoNave.start();
    });
    movimientoNave.onComplete.add(function () {
        movimientoNave.stop();
        if (caminoActual.length) {
            moverNave();
        } else {
            flagMovimiento = false;
            if (nebulosaActual.esPeligrosa) {
                $("#btnAtacar").css({
                    opacity: 1
                });
            }
            preloadExtraerElementos();
        }
    });
    rotacion.start();
}

function preloadExtraerElementos() {
    sacarSonda();
    sonidoTaladro = game.add.audio('taladro');
    sonidoTaladro.addMarker('inicioTaladro', 0, 0);
    sonidoTaladro.play("inicioTaladro");
    modificarBarraExtraccion(1);
}

// function quicksort(primero,ultimo,cantElementos,nombreElementos){
//     i = primero;
//     j = ultimo;
//     pivote = cantElementos[parseInt((i+j)/2)];
//     do{
//         while(cantElementos[i]<pivote){
//             i++;
//         }
//         while(cantElementos[j]>pivote){
//             j--;
//         }
//         if(i<=j){
//             aux=cantElementos[j];
//             cantElementos[j] = cantElementos[i]
//             cantElementos[i] = aux;
//             i++;
//             j--;
//         } 
//     }while(i<j);
//     if(primero<j){
//         quicksort(primero,j);
//     }
//     if(ultimo>i){    
//         quicksort(i,ultimo);
//     }
// }

function verificarLimiteCapacidad(elementoAgregar) {
    maxCupo = nave.capacidadCarga - (nave.cantEZero + nave.cantIridio + nave.cantPaladio + nave.cantPlatino);
    if (elementoAgregar <= maxCupo) {
        return true;
    }
    return false;
}

function extraerElementos(cantIridio, cantPaladio, cantPlatino, cantEZero) {
    nombreElementos = [""];
    cantElementos = [];

    array = [nave.cantIridio, nave.cantPaladio, nave.cantPlatino, nave.cantEZero];
    for (var i = 0; i < 4; i++) {
        if (i == 0 || i == 2) {
            nave.setCantSondas(nave.cantSondas - 1);
        }
        if (Math.min(nave.cantIridio, nave.cantPaladio, nave.cantPlatino, nave.cantEZero) == nave.cantIridio && array[0] != undefined) {
            if (verificarLimiteCapacidad(cantIridio)) {
                nave.setCantIridio(cantIridio + nave.cantIridio);
                planetaActual.iridio = 0;
                array[0] = undefined;
            } else {
                nave.setCantIridio(maxCupo + nave.cantIridio);
                planetaActual.iridio -= maxCupo;
                break;
            }
        } else if (Math.min(nave.cantIridio, nave.cantPaladio, nave.cantPlatino, nave.cantEZero) == nave.cantPaladio && array[1] != undefined) {
            if (verificarLimiteCapacidad(cantPaladio)) {
                nave.setCantPaladio(cantPaladio + nave.cantPaladio);
                planetaActual.paladio = 0;
                array[1] = undefined;
            } else {
                nave.setCantPaladio(maxCupo + nave.cantPaladio);
                planetaActual.paladio -= maxCupo;
                break;
            }
        } else if (Math.min(nave.cantIridio, nave.cantPaladio, nave.cantPlatino, nave.cantEZero) == nave.cantPlatino && array[2] != undefined) {
            if (verificarLimiteCapacidad(cantPlatino)) {
                nave.setCantPlatino(cantPlatino + nave.cantPlatino);
                planetaActual.platino = 0;
                array[2] = undefined;
            } else {
                nave.setCantPlatino(maxCupo + nave.cantPlatino);
                planetaActual.platino -= maxCupo;
                break;
            }
        } else if (Math.min(nave.cantIridio, nave.cantPaladio, nave.cantPlatino, nave.cantEZero) == nave.cantEZero && array[3] != undefined) {
            if (verificarLimiteCapacidad(cantEZero)) {
                nave.setCantEZero(cantEZero + nave.cantEZero);
                planetaActual.elementoZero = 0;
                array[3] = undefined;
            } else {
                nave.setCantEZero(maxCupo + nave.cantEZero);
                planetaActual.elementoZero -= maxCupo;
                break;
            }
        }
    }
    botarSonda();
    finalizarEstadiaPlaneta();
}

function finalizarEstadiaPlaneta() {
    reiniciarElementosPlaneta();
    alertify.success("La estadía en el planete ha terminado");
}

function reiniciarElementosPlaneta() {
    $("#btnAtacar").css({
        opacity: 0
    });
    $("#containerEstadoVidaEnemigo").css({
        opacity: 0
    });
    $("#optionAttackAvanzada").css({
        opacity: 1
    });
    $("#optionAttackExp").css({
        opacity: 1
    });
    $("#optionAttackNodriza").css({
        opacity: 1
    });
}

function modificarBarraExtraccion(porcentaje) {
    var $barraCantidad = $("#progressBarSonda");
    if (porcentaje < 101) {
        if (!enemigoAtacando) {
            $barraCantidad.width(porcentaje + "%");
            $("#progressBarSonda").html("Extrayendo Elementos... " + porcentaje + "%");
            setTimeout(function () {
                modificarBarraExtraccion(porcentaje + 1);
            }, 200);
        } else {
            interrumpirExtraccion();
        }
    } else {
        alertify.success("La extracción de los materiales se realizó correctamente.");
        extraerElementos(2000,2000,2000,2000);
        $barraCantidad.width("0%");
        $("#progressBarSonda").html("");
    }
}

function interrumpirExtraccion() {
    nave.sondaSprite.kill();
    $("#progressBarSonda").width("0%");
    $("#progressBarSonda").html("");
    sonidoTaladro.mute = true;
}

function sacarSonda() {
    nave.sondaSprite.reset(100, 300);
    var sacarSonda = game.add.tween(nave.sondaSprite);
    sacarSonda.to({
        width: 100
    }, 1000);
    sacarSonda.onComplete.add(function () {
        sacarSonda.stop();
    });
    sacarSonda.start();
}

function botarSonda() {
    var ocultarSonda = game.add.tween(nave.sondaSprite);
    ocultarSonda.to({
        x: 190
    }, 1000);
    ocultarSonda.onComplete.add(function () {
        ocultarSonda.stop();
        nave.sondaSprite.kill();
    });
    ocultarSonda.start();
}

function consumirCombustible(cantCombustible, tiempo) {
    nave.combustible.set(nave.combustible.value - cantCombustible);
    if (tiempo < (nave.msRecorrido - 200)) {
        setTimeout(() => {
            consumirCombustible(cantCombustible, tiempo + 200);
        }, 200);
    }
}

function salidaNave(salidaN) {
    var salida = game.add.tween(nave.sprite.scale);
    salida.to({
        x: 1,
        y: 1,
    }, 500);
    salida.onComplete.add(function () {
        salida.stop();
        nave.sprite.scale.setTo(0.001, 0.001);
        if (planetaActual !== undefined) {
            nave.sprite.x = planetaActual.sprite.x;
            nave.sprite.y = planetaActual.sprite.y;
        } else {
            nave.sprite.x = sistemaSolarActual.sprite.x;
            nave.sprite.y = sistemaSolarActual.sprite.y;
            salidaN = false;
        }
        salir();
        var salida2 = game.add.tween(nave.sprite);
        salida2.to({
            width: 100,
            height: 100,
        }, 500);
        salida2.onComplete.add(function () {
            salida2.stop();
            if (salidaN) {
                salidaNave(false);
            }
        });
        salida2.start();
    });
    salida.start();
}

function entradaNave(iPD) {
    var entrada = game.add.tween(nave.sprite.scale);
    entrada.to({
        x: 0.001,
        y: 0.001,
    }, 500);
    entrada.onComplete.add(function () {
        entrada.stop();
        planetaActual = sistemaSolarActual.planetas[iPD];
        actualizarVista();
        nave.sprite.x = 100;
        nave.sprite.y = 300;
        nave.sprite.rotation = 0;
        nave.sprite.scale.setTo(1, 1);
        var entrada2 = game.add.tween(nave.sprite);
        entrada2.to({
            width: 100,
            height: 100
        }, 500);
        entrada2.onComplete.add(function () {
            entrada2.stop();
            alert("entre a planeta");
        });
        entrada2.start();
    });
    entrada.start();
}

function teletransportar(iND) {
    var cantRotacion = game.physics.arcade.angleBetween(nave.sprite, {
        x: 0,
        y: 300
    });
    nave.sprite.x = 1410;
    nave.sprite.y = 300;
    nave.rotation = cantRotacion;
    killSpritesActuales();
    fondo.loadTexture('fondoHiperespacio');
    fondo.height = alto;
    fondo.width = ancho;
    fondo.animations.add('movimiento');
    fondo.animations.play('movimiento', 100, true);
    $("#infoUbic").text("En Algún lugar del Hiperespacio...");
    ocultarInterfazNave();
    var teletransporte = game.add.tween(nave.sprite);
    teletransporte.to({
        x: -110
    }, 1500);
    teletransporte.onComplete.add(function () {
        teletransporte.stop();
        var tele = galaxia.nebulosas[iND].teletransportador;
        alert("ya");
    });
    setTimeout(() => {
        teletransporte.start();
    }, 500);
}