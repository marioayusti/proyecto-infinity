$(document).ready(function () {
    $("#generarJSON").on("click", function () {
        console.log(generarJson());
    });
});

function cargarJson(mapa) {
    alertify.confirm('<h3 class="alertify-titulo-info">Cargar un mapa nuevo</h3>', '<div class="text-center">¡Todos los cambios realizados en el mapa se perderan!<br>' +
        '¿Desea continuar?</div>',
        function () {
            galaxia = new Galaxia("Via Láctea");
            $.getJSON("assets/Mapas/" + mapa + ".json", function (json) {
                galaxia.planetaOrigen = json.planetaOrigen;
                cargarNebulosas(json.nebulosas);
            });
            $("#portadaContainer").fadeOut("slow");
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

function cargarNebulosas(nebulosas) {
    nebulosas.forEach(function (neb) {
        if (!neb.undefined) {
            var idNeb = galaxia.nebulosas.length;
            peligrosa = neb.peligrosa;
            var nebulaSprite = game.add.sprite(neb.sprite.posx + 90, neb.sprite.posy + 90, neb.sprite.selected);
            nebulaSprite.width = 180;
            nebulaSprite.height = 180;
            nebulaSprite.anchor.setTo(0.5, 0.5);
            nebulaSprite.inputEnabled = true;
            nebulaSprite.events.onInputUp.add(clickNebula, {
                idNeb: idNeb
            }, this);
            nebulaSprite.input.enableDrag();
            spritesActuales.push(nebulaSprite);
            var nombre = neb.nombre
            if ((nombre.trim()).length === 0) {
                if (peligrosa) {
                    nombre = "Nebulosa Peligrosa " + (idNeb + 1);
                } else {
                    nombre = "Nebulosa " + (idNeb + 1);
                }
            }
            var nebulosa = new Nebulosa(idNeb, nombre, peligrosa, nebulaSprite);
            nebulosa.estacionEspacial= neb.estacionEspacial;
            nebulosa.teletransportador = neb.teletransportador;
            galaxia.nebulosas.push(nebulosa);
            cargarSistemasPlanetarios(nebulosa, neb.sistemasPlanetarios);
            cargarLineasJson(nebulosa, neb.lineas, neb.matrizAdy, "Nebulosa");
        } else {
            galaxia.nebulosas.push(undefined);
        }
    });
    actualizarVista();
}

function cargarSistemasPlanetarios(nebulosaActual, sistemasPlanetarios) {
    sistemasPlanetarios.forEach(function (sisPlan) {
        if (!sisPlan.undefined) {
            var idSisPlanetario = nebulosaActual.sistemasPlanetarios.length;
            var sisPlanSprite = game.add.sprite(sisPlan.sprite.posx + 50, sisPlan.sprite.posy + 50, sisPlan.sprite.selected);
            sisPlanSprite.width = 100;
            sisPlanSprite.height = 100;
            sisPlanSprite.anchor.setTo(0.5, 0.5);
            sisPlanSprite.inputEnabled = true;
            sisPlanSprite.events.onInputDown.add(clickSisPlanetario, {
                id: idSisPlanetario
            }, this);
            sisPlanSprite.input.enableDrag();
            spritesActuales.push(sisPlanSprite);
            var nombre = sisPlan.nombre;
            if ((nombre.trim()).length === 0) {
                nombre = "Sistema Solar " + (idSisPlanetario + 1)
            }
            var sistemaPlanetario = new SistemasPlanetario(idSisPlanetario, nombre, sisPlanSprite);
            nebulosaActual.sistemasPlanetarios.push(sistemaPlanetario);
            addColumnMatrizAdyacencia(nebulosaActual.matrizAdyacencia);
            cargarPlanetas(sistemaPlanetario, sisPlan.planetas);
            cargarLineasJson(sistemaPlanetario, sisPlan.lineas, sisPlan.matrizAdy, "SisPlanetarios");
            actualizarVista();
        } else {
            nebulosaActual.sistemasPlanetarios.push(undefined);
        }
    });
}

function cargarPlanetas(sistemaSolarActual, PlanetasJson) {
    PlanetasJson.forEach(function (planeta) {
        if (!planeta.undefined) {
            var idPlaneta = sistemaSolarActual.planetas.length;
            var tipoPlaneta = planeta.tipo;
            var Sprite = game.add.sprite(planeta.sprite.posx + 50, planeta.sprite.posy + 50, planeta.sprite.selected);
            Sprite.width = 100;
            Sprite.height = 100;
            Sprite.events.onInputDown.add(clickPlaneta, {
                id: idPlaneta,
                tipo: tipoPlaneta
            }, this);
            Sprite.anchor.setTo(0.5, 0.5);
            Sprite.inputEnabled = true;
            Sprite.input.enableDrag();
            var elemento0 = 0;
            var iridio = 0;
            var platino = 0;
            var paladio = 0;
            if (tipoPlaneta === "planeta") {
                elemento0 = planeta.elementoZero;
                iridio = planeta.iridio;
                platino = planeta.platino;
                paladio = planeta.paladio;
            }
            if (tipoPlaneta === "teletrasportador" || tipoPlaneta === "planeta") {
                var giro = Sprite.animations.add('giro');
                Sprite.animations.play('giro', 5, true);
            }
            var nombre = planeta.nombre;
            if ((nombre.trim()).length === 0) {
                nombre = "Planeta " + (idPlaneta + 1)
            }
            spritesActuales.push(Sprite);
            var planeta = new Planetas(idPlaneta, nombre, iridio, platino, paladio, elemento0, tipoPlaneta, Sprite);
            sistemaSolarActual.planetas.push(planeta);
            addColumnMatrizAdyacencia(sistemaSolarActual.matrizAdyacencia);
        } else {
            sistemaSolarActual.planetas.push(undefined);
        }
    });
    actualizarVista();
}

function cargarLineasJson(padreSeleccionado, Lineas, MatrizAdy, ubicacion) {
    Lineas.forEach(function (lineaJson) {
        if (ubicacion !== "Nebulosa") {
            var s1x = padreSeleccionado.planetas[lineaJson[0]].sprite.position.x;
            var s1y = padreSeleccionado.planetas[lineaJson[0]].sprite.position.y;
            var s2x = padreSeleccionado.planetas[lineaJson[1]].sprite.position.x;
            var s2y = padreSeleccionado.planetas[lineaJson[1]].sprite.position.y;
            var s1 = padreSeleccionado.planetas[lineaJson[0]];
            var s2 = padreSeleccionado.planetas[lineaJson[1]];
        } else {
            var s1x = padreSeleccionado.sistemasPlanetarios[lineaJson[0]].sprite.position.x;
            var s1y = padreSeleccionado.sistemasPlanetarios[lineaJson[0]].sprite.position.y;
            var s2x = padreSeleccionado.sistemasPlanetarios[lineaJson[1]].sprite.position.x;
            var s2y = padreSeleccionado.sistemasPlanetarios[lineaJson[1]].sprite.position.y;
            var s1 = padreSeleccionado.sistemasPlanetarios[lineaJson[0]];
            var s2 = padreSeleccionado.sistemasPlanetarios[lineaJson[1]];
        }
        var line = new Phaser.Line(s1x, s1y, s2x, s2y);
        padreSeleccionado.lineas.push([line, s1, s2]);
        printLine(line);
        deseleccionar();
        padreSeleccionado.matrizAdyacencia = MatrizAdy;
    });
}

function generarJson() {
    var salida = "{";
    salida += '"planetaOrigen":[' + (galaxia.planetaOrigen).join() + '],';
    salida += '"nebulosas":[';
    galaxia.nebulosas.forEach(function (neb) {
        if (neb != undefined) {
            salida += '{';
            salida += '"nombre":"' + neb.nombre + '",';
            if (neb.esPeligrosa) {
                salida += '"peligrosa":true,';
            } else {
                salida += '"peligrosa":false,';
            }
            salida += '"estacionEspacial":[' + (neb.estacionEspacial).join() + '],';
            salida += '"teletransportador":[' + (neb.teletransportador).join() + '],';
            salida += '"sprite":{';
            salida += '"posx":' + neb.sprite.position.x + ',';
            salida += '"posy":' + neb.sprite.position.y + ',';
            salida += '"selected":"' + neb.sprite.key + '"},';
            salida += '"sistemasPlanetarios":[';
            neb.sistemasPlanetarios.forEach(function (sis) {
                if (sis !== undefined) {
                    salida += '{';
                    salida += '"nombre":"' + sis.nombre + '",';
                    salida += '"sprite":{';
                    salida += '"posx":' + sis.sprite.position.x + ',';
                    salida += '"posy":' + sis.sprite.position.y + ',';
                    salida += '"selected":"' + sis.sprite.key + '"},';
                    salida += '"planetas":[';
                    sis.planetas.forEach(function (plan) {
                        if (plan !== undefined) {
                            salida += '{';
                            salida += '"nombre":"' + plan.nombre + '",';
                            salida += '"tipo":"' + plan.tipo + '",';
                            if (plan.tipo == "planeta") {
                                salida += '"iridio":' + plan.iridio + ',';
                                salida += '"platino":' + plan.platino + ',';
                                salida += '"paladio":' + plan.paladio + ',';
                                salida += '"elementoZero":' + plan.elementoZero + ',';
                            }
                            salida += '"sprite":{';
                            salida += '"posx":' + plan.sprite.position.x + ',';
                            salida += '"posy":' + plan.sprite.position.y + ',';
                            salida += '"selected":"' + plan.sprite.key + '"}';
                            salida += '},';
                        } else {
                            salida += '{"undefined":true},';
                        }
                    });
                    salida = salida.substring(0, salida.length - 1);
                    salida += '],"lineas":[';
                    sis.lineas.forEach(function (linea) {
                        salida += '[' + linea[1].id + ',' + linea[2].id + '],';
                    });
                    salida = salida.substring(0, salida.length - 1);
                    salida += '],"matrizAdy":[';
                    sis.matrizAdyacencia.forEach(function (linea) {
                        salida += '[' + linea.join() + '],';
                    });
                    salida = salida.substring(0, salida.length - 1);
                    salida += ']},';
                } else {
                    salida += '{"undefined":true},';
                }
            });
            salida = salida.substring(0, salida.length - 1);
            salida += '],"lineas":[';
            neb.lineas.forEach(function (linea) {
                salida += '[' + linea[1].id + ',' + linea[2].id + '],';
            });
            salida = salida.substring(0, salida.length - 1);
            salida += '],"matrizAdy":[';
            neb.matrizAdyacencia.forEach(function (linea) {
                salida += '[' + linea.join() + '],';
            });
            salida = salida.substring(0, salida.length - 1);
            salida += ']},';
        } else {
            salida += '{"undefined":true},';
        }
    });
    salida = salida.substring(0, salida.length - 1) + ']}';
    return salida;
}