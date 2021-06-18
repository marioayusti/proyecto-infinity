var spritesActuales = [];
var flagMovimiento = false;
var caminoActual = [];

function iniciarSimulacion() {
    if (galaxia.planetaOrigen.length === 3) {
        nebulosaActual = galaxia.nebulosas[galaxia.planetaOrigen[0]];
        sistemaSolarActual = nebulosaActual.sistemasPlanetarios[galaxia.planetaOrigen[1]];
        planetaActual = sistemaSolarActual.planetas[galaxia.planetaOrigen[2]];
        ocultarEdicion();
        actualizarVista();
        game.state.start('simulacion', false);
        $("#btnIniciar").toggleClass("fa-play-circle fa-pause-circle");
        $("#btnIniciar").attr("onclick", "pausarSimulacion()");
        $("title").text("Simulación - Proyecto Infinity");
        prepararElementos();
        cargarFormularioNave();
    } else {
        alertify.error('Para iniciar la simulación es necesario tener un planeta de inicio');
    }
}

function prepararElementos() {
    var planetaInicial = galaxia.nebulosas[galaxia.planetaOrigen[0]].sistemasPlanetarios[galaxia.planetaOrigen[1]].planetas[galaxia.planetaOrigen[2]];
    planetaInicial.iridio = 0;
    planetaInicial.platino = 0;
    planetaInicial.paladio = 0;
    planetaInicial.elementoZero = 0;
    for (var iN in galaxia.nebulosas) {
        var nebulosa = galaxia.nebulosas[iN];
        nebulosa.sprite.inputEnabled = false;
        nebulosa.matrizAdyacencia = floydWarshall(nebulosa.matrizAdyacencia, nebulosa.sistemasPlanetarios);
        for (var iS in nebulosa.sistemasPlanetarios) {
            if (nebulosa.sistemasPlanetarios[iS] !== undefined) {
                var sistemasolar = nebulosa.sistemasPlanetarios[iS];
                sistemasolar.sprite.inputEnabled = false;
                sistemasolar.matrizAdyacencia = floydWarshall(sistemasolar.matrizAdyacencia, sistemasolar.planetas);
                for (var iP in sistemasolar.planetas) {
                    if (sistemasolar.planetas[iP] !== undefined) {
                        sistemasolar.planetas[iP].sprite.inputEnabled = false;
                    }
                }
            }
        }
    }
}

function floydWarshall(matrizA, elementos) {
    var matrizCaminos = [];
    for (var i in elementos) {
        matrizCaminos[i] = [];
        for (var j in elementos) {
            matrizCaminos[i][j] = [j, (matrizA[i][j] / 100)];
        }
    }
    for (var k in elementos) {
        for (var i in elementos) {
            for (var j in elementos) {
                if (matrizCaminos[i][j][1] > matrizCaminos[i][k][1] + matrizCaminos[k][j][1]) {
                    matrizCaminos[i][j][1] = matrizCaminos[i][k][1] + matrizCaminos[k][j][1];
                    matrizCaminos[i][j][0] = k;
                }
            }
        }
    }
    return matrizCaminos;
}

function pausarSimulacion() {
    alertify.dismissAll();
    $("#btnIniciar").toggleClass("fa-play-circle fa-pause-circle");
    if (game.paused = !game.paused) {
        alertify.message('Simulación Pausada', 0);
    }
}

//Metodos Phaser

function isDrag() {
    var distanceFromLastUp = Phaser.Math.distance(game.input.activePointer.positionDown.x, game.input.activePointer.positionDown.y, game.input.activePointer.x, game.input.activePointer.y);
    if (distanceFromLastUp !== 0) {
        return true;
    } else {
        return false;
    }
}

//Metodos de update de Phaser

function printLines(arrayLineas) {
    if (arrayLineas.length === 0) {
        game.debug.geom();
    }
    arrayLineas.forEach(function (line) {
        printLine(line[0]);
    });
}

function printLine(line) {
    game.debug.geom(line, "#ffffff55");
}

function updateLines() {
    if (planetaActual === undefined && sistemaSolarActual !== undefined) {
        lineasObjectToDraw(sistemaSolarActual.lineas);
    } else if (nebulosaActual !== undefined) {
        lineasObjectToDraw(nebulosaActual.lineas);
    }
}

function lineasObjectToDraw(Lineas) {
    Lineas.forEach(function (linea) {
        linea[0].fromSprite(linea[1].sprite, linea[2].sprite, true);
    });
}

// indicadorCombustible.set(0);
// $("#combustibleNivelNave").attr("data-content", value + "L");
// $('#theprogressbar').attr('aria-valuenow', newprogress).css('width',newprogress);

// var numN = galaxia.nebulosas.length;
// var numS = 0;
// var numP = 0;
// for (let index = 0; index < galaxia.nebulosas.length; index++) {
//     const element = galaxia.nebulosas[index];
//     numS += element.sistemasPlanetarios.length;
//     for (let index2 = 0; index2 < element.sistemasPlanetarios.length; index2++) {
//         const element2 = element.sistemasPlanetarios[index2];
//         for (let index3 = 0; index3 < element2.planetas.length; index3++) {
//             const element3 = element2.planetas[index3];
//             if (element3.tipo == "planeta") {
//                 numP += 1;
//             }
//         }
//     }
// }
// alert("nebulosas=" + numN + ", sis=" + numS + ", pl=" + numP);