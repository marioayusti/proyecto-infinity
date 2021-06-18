//Este modulo se encarga de tener los objetos y métodos necesarios para la creación de la simulación
var nave;
var galaxia = new Galaxia("Via Láctea");
var seleccionAux;
var notifierSeleccion;
var compraSondas = [10, 5, 5, 1, 5]; //iridio, platino, paladio, eZero, cantidad a recibir
var compraCombustible = [10, 10, 20, 10, 10000]; //iridio, platino, paladio, eZero, litros comprados

var ancho = $(window).width();
var alto = $(window).height();
var fondo;
var game;

$(document).ready(function () {
    //Creación de objetos luego de cargada la pagina
    game = new Phaser.Game(ancho, alto, Phaser.AUTO, 'gameContainer');

    var creacionState = {
        preload: preloadCreacion,
        create: createCreacion,
        update: updateCreacion,
        render: renderCreacion
    };

    var attackState = {
        preload: preloadAttack,
        create: createAttack,
        update: updateAttack
        //render: renderAttack
    };

    var simulacionState = {
        create: createSimulacion,
        update: updateSimulacion
        // render: render
    };

    function preloadAttack() {
        //Naves Enemigas
        game.load.image('naveNodriza', 'assets/images/naveNodriza.png');
        game.load.image('naveAvanzada', 'assets/images/naveAvanzada.png');
        game.load.image('naveExploradora', 'assets/images/naveExploradora.png');
        game.load.image('navePlayer', 'assets/images/nave2.png');
        game.load.image('cañon', 'assets/images/cañon.png');
        game.load.image('bala', 'assets/images/bala.png');
        game.load.image('bala2', 'assets/images/bala2.png');
        game.load.image('sonda', 'assets/images/sonda.png');
        game.load.audio('disparo', 'assets/sonidos/disparo.mp3');
        game.load.audio('disparoTanix', 'assets/sonidos/disparoTanix.mp3');
        game.load.audio('explosion', 'assets/sonidos/explosion.mp3');
        game.load.audio('explosionTanix', 'assets/sonidos/explosionTanix.mp3');
        game.load.audio('taladro', 'assets/sonidos/taladro.mp3');
        game.load.spritesheet('gifExplosion', 'assets/images/explosion.png', 80, 80, 17);
    }

    function preloadCreacion() {
        //Sprite galaxia
        game.load.image('fondoGalaxia', 'assets/images/galaxia.jpg');
        game.load.spritesheet('fondoHiperespacio', 'assets/images/teletransportacionSprite.png', 1366, 664, 40);
        //Sprites nebulosa
        game.load.image('nebulosa1', 'assets/images/nebulosa1.png');
        game.load.image('nebulosa2', 'assets/images/nebulosa2.png');
        game.load.image('nebulosa3', 'assets/images/nebulosa3.png');
        game.load.image('nebulosa4', 'assets/images/nebulosa4.png');
        game.load.image('nebulosa5', 'assets/images/nebulosa5.png');
        game.load.image('fondoNebulosa1', 'assets/images/fondoNebulosa1.png');
        game.load.image('fondoNebulosa2', 'assets/images/fondoNebulosa2.jpeg');
        game.load.image('fondoNebulosa3', 'assets/images/fondoNebulosa3.jpg');
        game.load.image('fondoNebulosa4', 'assets/images/fondoNebulosa4.jpg');
        game.load.image('fondoNebulosa5', 'assets/images/fondoNebulosa5.jpg');
        game.load.image('nebulosa1Peligrosa', 'assets/images/nebulosa1P.png');
        game.load.image('nebulosa2Peligrosa', 'assets/images/nebulosa2P.png');
        game.load.image('nebulosa3Peligrosa', 'assets/images/nebulosa3P.png');
        game.load.image('nebulosa4Peligrosa', 'assets/images/nebulosa4P.png');
        game.load.image('nebulosa5Peligrosa', 'assets/images/nebulosa5P.png');
        //Sprites sistema solar
        game.load.image('sistemasolar1', 'assets/images/sistemasolar1.png');
        game.load.image('sistemasolar2', 'assets/images/sistemasolar2.png');
        game.load.image('sistemasolar3', 'assets/images/sistemasolar3.png');
        //Sprites fondo sistema solar
        game.load.image('fondoSistemaSolar1', 'assets/images/fondoSistemaSolar1.jpg');
        game.load.image('fondoSistemaSolar2', 'assets/images/fondoSistemaSolar2.jpg');
        game.load.image('fondoSistemaSolar3', 'assets/images/fondoSistemaSolar3.jpg');
        //Sprites planeta
        game.load.spritesheet('planeta1', 'assets/images/planeta1.png', 100, 100, 91);
        game.load.spritesheet('planeta2', 'assets/images/planeta2.png', 100, 100, 43);
        game.load.spritesheet('planeta3', 'assets/images/planeta3.png', 100, 100, 49);
        game.load.spritesheet('planeta4', 'assets/images/planeta4.png', 100, 100, 80);
        game.load.spritesheet('planeta5', 'assets/images/planeta5.png', 100, 100, 14);
        game.load.image('fondoPlaneta1', 'assets/images/fondoPlaneta1.jpg');
        game.load.image('fondoPlaneta2', 'assets/images/fondoPlaneta2.jpg');
        game.load.image('fondoPlaneta3', 'assets/images/fondoPlaneta3.jpg');
        game.load.image('fondoPlaneta4', 'assets/images/fondoPlaneta4.jpg');
        game.load.image('fondoPlaneta5', 'assets/images/fondoPlaneta5.jpg');
        //Sprites estacion espacial
        game.load.image('estacionEspacial1', 'assets/images/estacionEspacial1.png');
        game.load.image('estacionEspacial2', 'assets/images/estacionEspacial2.png');
        //Sprites teletransportador
        game.load.spritesheet('teletransportador1', 'assets/images/teletransportador1.png', 100, 100, 49);
        game.load.spritesheet('teletransportador2', 'assets/images/teletransportador2.png', 100, 100, 72);
        //Sprites nave
        game.load.image('nave1', 'assets/images/nave1.png');
        game.load.image('nave2', 'assets/images/nave2.png');
        game.load.image('nave3', 'assets/images/nave3.png');
        game.load.image('sonda', 'assets/images/sonda.png');
        //Sonidos 
        game.load.audio('nave', 'assets/sonidos/naveEspacial.mp3');
        game.load.audio('taladro', 'assets/sonidos/taladro.mp3');
    }

    function createCreacion() {
        fondo = game.add.sprite(0, 0, 'fondoGalaxia');
        fondo.height = alto;
        fondo.width = ancho;
        game.input.mouse.capture = true;
    }



    function updateCreacion() {
        updateLines();
    }

    function renderCreacion() {
        if (nebulosaActual !== undefined) {
            if (sistemaSolarActual === undefined) {
                printLines(nebulosaActual.lineas);
            } else if (planetaActual === undefined) {
                printLines(sistemaSolarActual.lineas);
            } else {
                printLines([]);
            }
        } else {
            printLines([]);
        }
    }

    function createSimulacion() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    function updateSimulacion() {

    }

    game.state.add('creacion', creacionState);
    game.state.add('simulacion', simulacionState);
    game.state.add('attack', attackState);
    game.state.start('creacion');
});

//CREACIÓN DE OBJETOS
function newNebulosa() {
    var idNeb = galaxia.nebulosas.length;
    var peligrosa = document.getElementById("checkNebulosaEsPeligrosa").checked;
    var selected = $(".estiloNebulosa.activo").attr("data-idImg");
    if (peligrosa) {
        selected += "Peligrosa";
    }
    var nebulaSprite = game.add.sprite(100, 100, selected);
    nebulaSprite.width = 180;
    nebulaSprite.height = 180;
    nebulaSprite.anchor.setTo(0.5, 0.5);
    nebulaSprite.inputEnabled = true;
    nebulaSprite.events.onInputUp.add(clickNebula, {
        idNeb: idNeb
    }, this);
    nebulaSprite.input.enableDrag();
    var nombre = document.getElementById("inputNombre").value;
    spritesActuales.push(nebulaSprite);
    if ((nombre.trim()).length === 0) {
        if (peligrosa) {
            nombre = "Nebulosa Peligrosa " + (idNeb + 1);
        } else {
            nombre = "Nebulosa " + (idNeb + 1);
        }
    }
    var nebulosa = new Nebulosa(idNeb, nombre, peligrosa, nebulaSprite);
    galaxia.nebulosas.push(nebulosa);
}

function newSisPlanetario() {
    var idSisPlanetario = nebulosaActual.sistemasPlanetarios.length;
    var selected = $(".estiloSistemaSolar.activo").attr("data-idImg");
    var sisPlanSprite = game.add.sprite(100, 100, selected);
    sisPlanSprite.width = 100;
    sisPlanSprite.height = 100;
    sisPlanSprite.anchor.setTo(0.5, 0.5);
    sisPlanSprite.inputEnabled = true;
    sisPlanSprite.events.onInputDown.add(clickSisPlanetario, {
        id: idSisPlanetario
    }, this);
    sisPlanSprite.input.enableDrag();
    spritesActuales.push(sisPlanSprite);
    var nombre = document.getElementById("inputNombre").value;
    if ((nombre.trim()).length === 0) {
        nombre = "Sistema Solar " + (idSisPlanetario + 1)
    }
    var sistemaPlanetario = new SistemasPlanetario(idSisPlanetario, nombre, sisPlanSprite);
    nebulosaActual.sistemasPlanetarios.push(sistemaPlanetario);
    addColumnMatrizAdyacencia(nebulosaActual.matrizAdyacencia);
}

function newPlanet() {
    var idPlaneta = sistemaSolarActual.planetas.length;
    var tipoPlaneta = document.getElementById("selectTipoPlaneta").value;
    var selected = "";
    switch (tipoPlaneta) {
        case "planeta":
            selected = $(".estiloPlaneta.activo").attr("data-idImg");
            if ($("#checkPlanetaEsOrigen").is(":checked")) {
                if (galaxia.planetaOrigen.length == 3) {
                    alertify.confirm('<h3 class="alertify-titulo-info">Planeta Inicial</h3>', '<div class="text-center">Ya existe un planeta inicial <br>' +
                        '¿Desea elegir este planeta como inicial?</div>',
                        function () {
                            galaxia.planetaOrigen = [nebulosaActual.id, sistemaSolarActual.id, idPlaneta];
                        },
                        function () {
                            alertify.confirm().destroy();
                        }).set({
                        labels: {
                            cancel: 'Cancelar',
                            ok: 'Aceptar'
                        },
                        reverseButtons: false
                    });
                } else {
                    galaxia.planetaOrigen = [nebulosaActual.id, sistemaSolarActual.id, idPlaneta];
                }
                $('#checkPlanetaEsOrigen').prop('checked', false);
            }
            break;
        case "ecombustible":
            selected = $(".estiloEEspacial.activo").attr("data-idImg");
            if (nebulosaActual.estacionEspacial.length > 0) {
                alertify.error('La nebulosa ya cuenta con estación de combustible');
                return;
            } else {
                nebulosaActual.estacionEspacial = [nebulosaActual.id, sistemaSolarActual.id, idPlaneta];
            }
            break;
        case "teletrasportador":
            selected = $(".estiloTTransportador.activo").attr("data-idImg");
            if (nebulosaActual.teletransportador.length > 0) {
                alertify.error('La nebulosa ya cuenta con teletransportador');
                return;
            } else {
                nebulosaActual.teletransportador = [nebulosaActual.id, sistemaSolarActual.id, idPlaneta];
            }
            break;
    }
    var Sprite = game.add.sprite(100, 100, selected);
    Sprite.width = 100;
    Sprite.height = 100;
    Sprite.anchor.setTo(0.5, 0.5);
    Sprite.events.onInputDown.add(clickPlaneta, {
        id: idPlaneta,
        tipo: tipoPlaneta
    }, this);
    Sprite.inputEnabled = true;
    Sprite.input.enableDrag();
    var elemento0 = 0;
    var iridio = 0;
    var platino = 0;
    var paladio = 0;
    if (tipoPlaneta === "planeta") {
        elemento0 = document.getElementById("cantEZeroRango").value;
        iridio = document.getElementById("cantIridioRango").value;
        platino = document.getElementById("cantPlatinoRango").value;
        paladio = document.getElementById("cantPaladioRango").value;
    }
    if (tipoPlaneta === "teletrasportador" || tipoPlaneta === "planeta") {
        var giro = Sprite.animations.add('giro');
        Sprite.animations.play('giro', 5, true);
    }
    var nombre = document.getElementById("inputNombre").value;
    if ((nombre.trim()).length === 0) {
        nombre = "Planeta " + (idPlaneta + 1)
    }
    spritesActuales.push(Sprite);
    var planeta = new Planetas(idPlaneta, nombre, iridio, platino, paladio, elemento0, tipoPlaneta, Sprite);
    sistemaSolarActual.planetas.push(planeta);
    addColumnMatrizAdyacencia(sistemaSolarActual.matrizAdyacencia);
}

function addColumnMatrizAdyacencia(matriz) {
    matriz.push(new Array(matriz.length).fill(Infinity));
    for (var i = 0; i < matriz.length; i++) {
        matriz[i].push(Infinity);
    }
}

function createLine(arraySelected) {
    var seleccionado;
    var padreSeleccionado;
    if (sistemaSolarActual == undefined) {
        padreSeleccionado = nebulosaActual;
        seleccionado = padreSeleccionado.sistemasPlanetarios[arraySelected[2]];
    } else {
        padreSeleccionado = sistemaSolarActual;
        seleccionado = padreSeleccionado.planetas[arraySelected[2]];
    }
    if (seleccionAux == undefined) {
        seleccionAux = arraySelected;
        notifierSeleccion = alertify.message("Se Seleccionó " + seleccionado.nombre, 0);
        notifierSeleccion.ondismiss = function () {
            seleccionAux = undefined;
            notifierSeleccion = undefined;
        };
    } else if (seleccionAux[2] != arraySelected[2]) {
        var seleccionado0;
        if (sistemaSolarActual == undefined) {
            seleccionado0 = padreSeleccionado.sistemasPlanetarios[seleccionAux[2]];
            var origen = seleccionado0.nombre;
            var destino = seleccionado.nombre;
            alertify.prompt('<h3 class="alertify-titulo-info">Definir Camino</h3>', '<div class="input-group mb-3">' +
                '<div class="input-group-prepend">' +
                '<span class="input-group-text">Origen:&nbsp;&nbsp;</span>' +
                '</div>' +
                '<input id="inputOrigenCamino" type="text" class="form-control" placeholder="Elemento de Origen" value="' + origen + '" disabled>' +
                '</div>' +
                '<div class="input-group mb-3">' +
                '<div class="input-group-prepend">' +
                '<span class="input-group-text">Destino:</span>' +
                '</div>' +
                '<input id="inputDestinoCamino" type="text" class="form-control" placeholder="Elemento de Destino" value="' + destino + '" disabled>' +
                '</div>' +
                '<div class=" text-center p-1 mb-2">Ingrese el costo</div>', '',
                function (closeEvent, costo) {
                    if ($.isNumeric(costo)) {
                        padreSeleccionado.matrizAdyacencia[seleccionAux[2]][arraySelected[2]] = parseInt(costo);
                        padreSeleccionado.matrizAdyacencia[arraySelected[2]][seleccionAux[2]] = parseInt(costo);
                        var line = new Phaser.Line(seleccionAux[0], seleccionAux[1], arraySelected[0], arraySelected[1]);
                        padreSeleccionado.lineas.push([line, seleccionado0, seleccionado]);
                        printLine(line);
                        deseleccionar();
                        alertify.prompt().destroy();
                    } else {
                        closeEvent.cancel = true;
                        alertify.error('Ingrese un valor numérico');
                    }
                },
                function () {
                    alertify.prompt().destroy();
                });
        } else {
            seleccionado0 = padreSeleccionado.planetas[seleccionAux[2]];
            padreSeleccionado.matrizAdyacencia[seleccionAux[2]][arraySelected[2]] = 1;
            padreSeleccionado.matrizAdyacencia[arraySelected[2]][seleccionAux[2]] = 1;
            var line = new Phaser.Line(seleccionAux[1], seleccionAux[1], arraySelected[0], arraySelected[1]);
            padreSeleccionado.lineas.push([line, seleccionado0, seleccionado]);
            printLine(line);
            deseleccionar();
        }
    }
}

function deseleccionar() {
    if (seleccionAux !== undefined) {
        notifierSeleccion.dismiss();
    }
}

//EDICIÓN DE OBJETOS
function guardarEdicion() {
    var newNombre = $("#inputNombre").val();
    if (planetaActual !== undefined) {
        selected = $(".estiloPlaneta.activo").attr("data-idImg");
        if ($("#checkPlanetaEsOrigen").is(":checked")) {
            if (galaxia.planetaOrigen.length == 3) {
                alertify.confirm('<h3 class="alertify-titulo-info">Planeta Inicial</h3>', '<div class="text-center">Ya existe un planeta inicial <br>' +
                    '¿Desea elegir este planeta como inicial?</div>',
                    function () {
                        galaxia.planetaOrigen = [nebulosaActual.id, sistemaSolarActual.id, planetaActual.id];
                    },
                    function () {
                        alertify.confirm().destroy();
                    }).set({
                    labels: {
                        cancel: 'Cancelar',
                        ok: 'Aceptar'
                    },
                    reverseButtons: false
                });
            } else {
                galaxia.planetaOrigen = [nebulosaActual.id, sistemaSolarActual.id, planetaActual.id];
            }
            $('#checkPlanetaEsOrigen').prop('checked', false);
        }
        var Sprite = game.add.sprite(planetaActual.sprite.position.x, planetaActual.sprite.position.y, selected);
        Sprite.width = 100;
        Sprite.height = 100;
        Sprite.events.onInputDown.add(clickPlaneta, {
            id: planetaActual.id,
            tipo: "planeta"
        }, this);
        Sprite.anchor.setTo(0.5, 0.5);
        Sprite.inputEnabled = true;
        Sprite.input.enableDrag();
        Sprite.animations.add('giro');
        Sprite.animations.play('giro', 5, true);
        planetaActual.sprite = Sprite;
        Sprite.kill();
        planetaActual.nombre = newNombre;
        var elemento0 = document.getElementById("cantEZeroRango").value;
        var iridio = document.getElementById("cantIridioRango").value;
        var platino = document.getElementById("cantPlatinoRango").value;
        var paladio = document.getElementById("cantPaladioRango").value;
        planetaActual.iridio = iridio;
        planetaActual.platino = platino;
        planetaActual.paladio = paladio;
        planetaActual.elementoZero = elemento0;
    } else if (sistemaSolarActual !== undefined) {
        var selected = $(".estiloSistemaSolar.activo").attr("data-idImg");
        var sisPlanSprite = game.add.sprite(sistemaSolarActual.sprite.position.x, sistemaSolarActual.sprite.position.y, selected);
        sisPlanSprite.width = 100;
        sisPlanSprite.height = 100;
        sisPlanSprite.anchor.setTo(0.5, 0.5);
        sisPlanSprite.inputEnabled = true;
        sisPlanSprite.events.onInputDown.add(clickSisPlanetario, {
            id: sistemaSolarActual.id
        }, this);
        sisPlanSprite.input.enableDrag();
        sistemaSolarActual.sprite = sisPlanSprite;
        sisPlanSprite.kill();
        sistemaSolarActual.nombre = newNombre;
    } else if (nebulosaActual !== undefined) {
        var peligrosa = document.getElementById("checkNebulosaEsPeligrosa").checked;
        var selected = $(".estiloNebulosa.activo").attr("data-idImg");
        if (peligrosa) {
            selected += "Peligrosa";
        }
        var nebulaSprite = game.add.sprite(nebulosaActual.sprite.position.x, nebulosaActual.sprite.position.y, selected);
        nebulaSprite.width = 180;
        nebulaSprite.height = 180;
        nebulaSprite.anchor.setTo(0.5, 0.5);
        nebulaSprite.inputEnabled = true;
        nebulaSprite.events.onInputUp.add(clickNebula, {
            idNeb: nebulosaActual.id
        }, this);
        nebulaSprite.input.enableDrag();
        nebulosaActual.sprite = nebulaSprite;
        nebulaSprite.kill();
        nebulosaActual.nombre = newNombre;
        nebulosaActual.esPeligrosa = peligrosa;
    } else {
        galaxia.nombre = newNombre;
    }
    actualizarVista();
    $("#btnCerrarSideBar").click();
}

//ELIMINACIÓN DE OBJETOS
function eliminarElementoActual() {
    var lineas;
    var elemento;
    var padreElemento;
    var esOrigen;
    var contTeletransportador = false;
    var contEstacionEspacial = false;
    var alertOrigen = "";
    var tipo;
    if (planetaActual !== undefined) {
        padreElemento = sistemaSolarActual;
        elemento = planetaActual;
        lineas = padreElemento.lineas;
        esOrigen = galaxia.planetaOrigen.length > 0 && nebulosaActual === galaxia.planetaOrigen[0] && sistemaSolarActual === galaxia.planetaOrigen[1] && planetaActual === galaxia.planetaOrigen[2];
        tipo = "Planeta";
        if (esOrigen) {
            alertOrigen = "<br>(Es el planeta Inicial)"
        }
        if (nebulosaActual.teletransportador.length > 0) {
            if (nebulosaActual.teletransportador[1] == sistemaSolarActual.id && nebulosaActual.teletransportador[2] == planetaActual.id) {
                contTeletransportador = true;
            }
        }
        if (nebulosaActual.estacionEspacial.length > 0) {
            if (nebulosaActual.estacionEspacial[1] == sistemaSolarActual.id && nebulosaActual.estacionEspacial[2] == planetaActual.id) {
                contEstacionEspacial = true;
            }
        }
    } else if (sistemaSolarActual !== undefined) {
        padreElemento = nebulosaActual;
        elemento = sistemaSolarActual;
        lineas = padreElemento.lineas;
        esOrigen = galaxia.planetaOrigen.length > 0 && nebulosaActual === galaxia.planetaOrigen[0] && sistemaSolarActual === galaxia.planetaOrigen[1];
        tipo = "Sistema Solar";
        if (esOrigen) {
            alertOrigen = "<br>(Contiene el planeta Inicial)"
        }
        if (nebulosaActual.teletransportador.length > 0) {
            if (nebulosaActual.teletransportador[1] == sistemaSolarActual.id) {
                contTeletransportador = true;
            }
        }
        if (nebulosaActual.estacionEspacial.length > 0) {
            if (nebulosaActual.estacionEspacial[1] == sistemaSolarActual.id) {
                contEstacionEspacial = true;
            }
        }
    } else {
        padreElemento = galaxia;
        elemento = nebulosaActual;
        esOrigen = galaxia.planetaOrigen.length > 0 && nebulosaActual === galaxia.planetaOrigen[0];
        tipo = "Nebulosa";
        if (esOrigen) {
            alertOrigen = "<br>(Contiene el planeta Inicial)"
        }
    }
    alertify.confirm('<h3 class="alertify-titulo-info">Eliminar ' + tipo + '</h3>', '<div class="text-center">¿Desea eliminar ' + elemento.nombre + '?' + alertOrigen + ' </div>',
        function () {
            $("#btnAtras").click();
            if (lineas !== undefined) {
                padreElemento.lineas = lineas.filter(function (linea) {
                    return linea[1] != elemento && linea[2] != elemento;
                });
            }
            delete padreElemento.arrayElementos[elemento.id];
            if (esOrigen) {
                galaxia.planetaOrigen = [];
                alertify.message('Se elimino el planeta origen');
            }
            if (contTeletransportador) {
                nebulosaActual.teletransportador = [];
                alertify.message('Se elimino el teletransportador de la nebulosa actual');
            }
            if (contEstacionEspacial) {
                nebulosaActual.estacionEspacial = [];
                alertify.message('Se elimino la estación espacial de la nebulosa actual');
            }
            elemento.sprite.destroy();
            alertify.confirm().destroy();
        },
        function () {
            alertify.confirm().destroy();
        }).set({
        labels: {
            cancel: 'Cancelar',
            ok: 'Aceptar'
        },
        reverseButtons: false
    });
}

function crearNave(cantIridio, cantPlatino, cantPaladio, cantEZero, cantSondas) {
    var estiloSeleccionado = $(".estiloNave.activo").attr("data-idImg");
    var spriteSonda = game.add.sprite(100, 300, "sonda");
    spriteSonda.width = 0;
    spriteSonda.height = 10;
    spriteSonda.anchor.setTo(0, 0.5);
    spriteSonda.kill();
    var spriteNave = game.add.sprite(1500, 600, estiloSeleccionado);
    spriteNave.width = 100;
    spriteNave.height = 100;
    spriteNave.anchor.setTo(0.5, 0.5);
    game.physics.enable(spriteNave, Phaser.Physics.ARCADE);
    spriteNave.body.allowRotation = false;
    var indicadorCombustible = new Gauge(document.getElementById("combustibleNivelNave")).setOptions({
        angle: -0.3,
        lineWidth: 0.07,
        radiusScale: 0.75,
        pointer: {
            length: 0.6,
            strokeWidth: 0.02,
            color: '#22A7F0'
        },
        limitMax: true,
        limitMin: false,
        colorStart: '#4183D7',
        colorStop: '#4183D7',
        strokeColor: '#ECECEC',
        generateGradient: true,
        highDpiSupport: true,
        percentColors: [
            [0.0, "#F03434"],
            [0.45, "#F9BF3B"],
            [1.0, "#26A65B"]
        ],
        renderTicks: {
            divisions: 10,
            divWidth: 1,
            divLength: 0.6,
            divColor: '#22313F',
            subDivisions: 3,
            subLength: 0.5,
            subWidth: 0.6,
            subColor: '#2C3E50'
        }
    });
    indicadorCombustible.maxValue = 200000;
    indicadorCombustible.setMinValue(0);
    indicadorCombustible.setTextField(document.getElementById("labelCombustible"));
    nave = new NaveInfinity(spriteNave, spriteSonda, indicadorCombustible);
    nave.combustible.set($("#cantCombustibleInicial").val());
    nave.setCantIridio(cantIridio);
    nave.setCantPlatino(cantPlatino);
    nave.setCantPaladio(cantPaladio);
    nave.setCantEZero(cantEZero);
    nave.setCantSondas(cantSondas);
    asociarMejoras();
    //Vuelo Inicial
    var sonidoNave = game.add.audio('nave');
    sonidoNave.addMarker('Inicial', 0, 13);
    caminoActual.push([500, 100, 0]);
    caminoActual.push([90, 300, 0]);
    caminoActual.push([100, 300, 0]);
    sonidoNave.play("Inicial");
    empezarMovimiento();
}

function asociarMejoras() {
    //var mejoraEscudoMultinucleo = new Mejora("escudoMultinucleo",500,1200,1800,1600);
    //var mejoraBlindajeNavesPesadas = new Mejora("blindajeNavesPesadas",2000,3000,1500,3100);
    var mejoraCañonTTanix = new Mejora("cañonTanix", 1000, 3000, 3000, 3000);
    var mejoraPropulsorOnix = new Mejora("propulsorOnix", 1000, 800, 1200, 1500);
    var mejoraCañonPlasma = new Mejora("cañonPlasma", 500, 2000, 1800, 2500);
    var mejoraCapacidadDepositos = new Mejora("capacidadDepositos", 2000, 2000, 2000, 2000);
    var mejoraVidaNave = new Mejora("vidaNave", 2500, 1000, 1000, 1000);
    var mejoraCapacidadCombustible = new Mejora("capacidadCombustible", 1500, 2000, 1500, 3000);
    nave.mejoras = [];
    nave.mejoras.push(mejoraVidaNave);
    //nave.mejoras.push(mejoraEscudoMultinucleo);
    //nave.mejoras.push(mejoraBlindajeNavesPesadas);
    nave.mejoras.push(mejoraCañonTTanix);
    nave.mejoras.push(mejoraCañonPlasma);
    nave.mejoras.push(mejoraCapacidadCombustible);
    nave.mejoras.push(mejoraCapacidadDepositos);
    nave.mejoras.push(mejoraPropulsorOnix);
}

function cambiarPrecioCombustible() {
    alertify.confirm('<h3 class="alertify-titulo-info">Definir Precio Combustible</h3>',
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Cantidad de Combustible (L):&nbsp;&nbsp;</span>' +
        '</div>' +
        '<input id="cantComb" type="number" class="form-control" placeholder="Combustible a recibir" value="' + compraCombustible[4] + '">' +
        '</div>' +
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Cantidad de Iridio (T):</span>' +
        '</div>' +
        '<input id="cantIridioCC" type="number" class="form-control" placeholder="Cantidad de Iridio" value="' + compraCombustible[0] + '">' +
        '</div>' +
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Cantidad de Platino (T):</span>' +
        '</div>' +
        '<input id="cantPlatinoCC" type="number" class="form-control" placeholder="Cantidad de Platino" value="' + compraCombustible[1] + '">' +
        '</div>' +
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Cantidad de Paladio (T):</span>' +
        '</div>' +
        '<input id="cantPaladioCC" type="number" class="form-control" placeholder="Cantidad de Paladio" value="' + compraCombustible[2] + '">' +
        '</div>' +
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Cantidad de E. Zero (T):</span>' +
        '</div>' +
        '<input id="cantEZeroCC" type="number" class="form-control" placeholder="Cantidad de E. Zero" value="' + compraCombustible[3] + '">' +
        '</div>',
        function (closeEvent) {
            var cir = document.getElementById("cantIridioCC").value;
            var cpl = document.getElementById("cantPlatinoCC").value;
            var cpa = document.getElementById("cantPaladioCC").value;
            var cez = document.getElementById("cantEZeroCC").value;
            var cco = document.getElementById("cantComb").value;
            if (($.isNumeric(cir) && $.isNumeric(cpl) && $.isNumeric(cpa) && $.isNumeric(cez) && $.isNumeric(cco)) && cir >= 0 && cir <= 100 && cpl >= 0 && cpl <= 100 && cpa >= 0 && cpa <= 100 && cez >= 0 && cez <= 100) {
                compraCombustible[0] = cir;
                compraCombustible[1] = cpl;
                compraCombustible[2] = cpa;
                compraCombustible[3] = cez;
                compraCombustible[4] = cco;
                alertify.confirm().destroy();
                alertify.success("Información guardada con exito");
            } else {
                closeEvent.cancel = true;
                alertify.error('Ingrese un valores numérico entre 0-100');
            }
        },
        function () {
            alertify.confirm().destroy();
        });
}

function cambiarPrecioSondas() {
    alertify.confirm('<h3 class="alertify-titulo-info">Definir Precio Sondas</h3>',
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Paquete de Sondas:&nbsp;&nbsp;</span>' +
        '</div>' +
        '<input id="cantSondasP" type="number" class="form-control" placeholder="Sondas a recibir" value="' + compraSondas[4] + '">' +
        '</div>' +
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Cantidad de Iridio (T):</span>' +
        '</div>' +
        '<input id="cantIridioSC" type="number" class="form-control" placeholder="Cantidad de Iridio" value="' + compraSondas[0] + '">' +
        '</div>' +
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Cantidad de Platino (T):</span>' +
        '</div>' +
        '<input id="cantPlatinoSC" type="number" class="form-control" placeholder="Cantidad de Platino" value="' + compraSondas[1] + '">' +
        '</div>' +
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Cantidad de Paladio (T):</span>' +
        '</div>' +
        '<input id="cantPaladioSC" type="number" class="form-control" placeholder="Cantidad de Paladio" value="' + compraSondas[2] + '">' +
        '</div>' +
        '<div class="input-group mb-3">' +
        '<div class="input-group-prepend">' +
        '<span class="input-group-text">Cantidad de E. Zero (T):</span>' +
        '</div>' +
        '<input id="cantEZeroSC" type="number" class="form-control" placeholder="Cantidad de E. Zero" value="' + compraSondas[3] + '">' +
        '</div>',
        function (closeEvent) {
            var cir = document.getElementById("cantIridioSC").value;
            var cpl = document.getElementById("cantPlatinoSC").value;
            var cpa = document.getElementById("cantPaladioSC").value;
            var cez = document.getElementById("cantEZeroSC").value;
            var cso = document.getElementById("cantSondasP").value;
            if (($.isNumeric(cir) && $.isNumeric(cpl) && $.isNumeric(cpa) && $.isNumeric(cez) && $.isNumeric(cso)) && cir >= 0 && cir <= 100 && cpl >= 0 && cpl <= 100 && cpa >= 0 && cpa <= 100 && cez >= 0 && cez <= 100) {
                compraSondas[0] = cir;
                compraSondas[1] = cpl;
                compraSondas[2] = cpa;
                compraSondas[3] = cez;
                compraSondas[4] = cso;
                alertify.success("Información guardada con exito");
                alertify.confirm().destroy();
            } else {
                closeEvent.cancel = true;
                alertify.error('Ingrese un valores numérico entre 0-100');
            }
        },
        function () {
            alertify.confirm().destroy();
        });
}

alertify.defaults = {
    autoReset: true,
    basic: false,
    closable: false,
    closableByDimmer: false,
    frameless: false,
    maintainFocus: false,
    maximizable: false,
    modal: true,
    movable: false,
    moveBounded: false,
    overflow: true,
    padding: false,
    pinnable: true,
    pinned: true,
    preventBodyShift: false,
    resizable: false,
    startMaximized: false,
    transition: "zoom",
    notifier: {
        delay: 5,
        position: 'top-center',
        closeButton: false
    },
    glossary: {
        ok: 'Aceptar',
        cancel: 'Cancelar'
    },
    theme: {
        input: "form-control",
        ok: "btn btn-primario",
        cancel: "btn btn-secundario"
    }
};