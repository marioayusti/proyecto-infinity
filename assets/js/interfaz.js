$(document).ready(function () {
    $("#btnPruebas").on("click", function () {
        for (let index = 0; index < galaxia.nebulosas.length; index++) {
            const element = galaxia.nebulosas[index].estacionEspacial;
            if (element.length > 0) {
                alert("una tiene");
            } else {
                alert("no tiene");
             }
        }
    });

    $(document).on('contextmenu', "canvas, .ajs-modal", function (e) {
        return false;
    });

    $("#portadaPrincipal").on("click", function () {
        $("#portadaPrincipal").fadeOut("slow", function () {
            $("#menuPrincipal").fadeIn("slow");
        });
    });

    $("#btnVolverPortada").on("click", function () {
        $("#menuPrincipal").fadeOut("slow", function () {
            $("#portadaPrincipal").fadeIn("slow");
        });
    });

    $("#btnAbrirCreditos").on("click", function () {
        $("#menuPrincipal").fadeOut("slow", function () {
            $("#creditos").fadeIn("slow");
        });
    });

    $("#btnCerrarCreditos").on("click", function () {
        $("#creditos").fadeOut("slow", function () {
            $("#menuPrincipal").fadeIn("slow");
        });
    });

    $("#btnSeguirCreando").on("click", function () {
        $("#portadaContainer").fadeOut("slow");
    });

    $("#btnSeleccionarMapa").on("click", function () {
        $(this).addClass("active");
        $("#btnConfigPrecios").removeClass("active");
        $("#submenuContainer .menuItem.menuPrecio").addClass("d-none");
        $("#submenuContainer .menuItem.menuMapa").removeClass("d-none");
    });

    $("#btnConfigPrecios").on("click", function () {
        $(this).addClass("active");
        $("#btnSeleccionarMapa").removeClass("active");
        $("#submenuContainer .menuItem.menuMapa").addClass("d-none");
        $("#submenuContainer .menuItem.menuPrecio").removeClass("d-none");
    });

    $("#submenuContainer .menuItem").on("click", function () {
        $("#btnConfigPrecios,#btnSeleccionarMapa").removeClass("active");
        $("#submenuContainer .menuItem").addClass("d-none");
    });

    //Botones de interfaz
    $('#btnCrear, #btnEditar, #btnEliminar, #btnAtras, #btnCargar, #cantIridioNave,#cantPlatinoNave,#cantPaladioNave,#cantEZeroNave,#submenuContainer .menuItem').popover({
        trigger: 'hover'
    });

    $("#btnEstado").on("click", function () {
        $(this).toggleClass("fa-chevron-circle-down fa-chevron-circle-up active");
        $("#containerEstado").toggleClass("active");
    });

    $("#btnCrear").on("click", function () {
        if ($("#btnUbicar").hasClass("d-none")) {
            $("#btnGuardar").addClass("d-none");
            $("#btnUbicar").removeClass("d-none");
            if (!$("#containerEstilos").is(":visible")) {
                $("#containerEstilos").removeClass("d-none");
            }
            if (sistemaSolarActual !== undefined) {
                cargarFormularioPlaneta();
            } else if (nebulosaActual !== undefined) {
                cargarFormularioSistemaSolar();
            } else {
                cargarFormularioNebulosa();
            }
        }
        mostrarSideBarConfig();
    });

    $("#btnCerrarSideBar").on("click", function () {
        $('#sideBarConfig, #btnCerrarSideBar').removeClass('active');
        $('#overlay').fadeOut();
    });

    $("#btnEditar").on("click", function () {
        cargarEdicion();
        mostrarSideBarConfig();
    });

    $("#btnGuardar").on("click", function () {
        guardarEdicion();
    });

    function mostrarSideBarConfig() {
        $('#sideBarConfig, #btnCerrarSideBar').addClass('active');
        $('#overlay').fadeIn();
    }

    $("#btnInfoFooter").on("click", function () {
        $('#overlay').fadeIn();
        $('#footerGame,#closeFooter').addClass("active");
    });

    $("#closeFooter").on("click", function () {
        $('#overlay').fadeOut();
        $('#footerGame,#closeFooter').removeClass("active");
    });

    $("#btnEliminar").on("click", function () {
        eliminarElementoActual();
    });

    $("#btnAtras").on("click", function () {
        if (nebulosaActual !== undefined) {
            if (planetaActual !== undefined) {
                cargarVistaEdicion("S");
            } else if (sistemaSolarActual !== undefined) {
                cargarVistaEdicion("N");
            } else {
                cargarVistaEdicion("G");
            }
            deseleccionar();
            salir();
        } else {
            $("#portadaContainer").fadeIn("slow");
        }
    });

    $("#btnUbicar").on("click", function () {
        if (nebulosaActual === undefined) {
            newNebulosa();
        } else if (sistemaSolarActual === undefined) {
            newSisPlanetario();
        } else if (planetaActual === undefined) {
            newPlanet();
        }
        document.getElementById("inputNombre").value = "";
    });

    $("#btnIniciarNave").on("click", function () {
        var numSondas = $("#inputSondas").val();
        if ($.isNumeric(numSondas)) {
            var cantIridio = parseInt($("#cantIridioRango").val(), 10);
            var cantPlatino = parseInt($("#cantPlatinoRango").val(), 10);
            var cantPaladio = parseInt($("#cantPaladioRango").val(), 10);
            var cantEZero = parseInt($("#cantEZeroRango").val(), 10);
            if ((cantIridio + cantPlatino + cantPaladio + cantEZero) > 8000) {
                alertify.error("La cantidad de materiales no debe superar la capacidad máxima de la nave");
            } else {
                numSondas = parseInt(numSondas, 10);
                mostrarInterfazNave();
                crearNave(cantIridio, cantPlatino, cantPaladio, cantEZero, numSondas);
                $('#sideBarConfig').removeClass('active');
                $('#overlay').fadeOut();
                $('#sideBarConfig').addClass("d-none");
                alertify.success('La Simulación Empezó!!');
            }
        } else {
            alertify.error("Se debe ingresar un número de sondas");
        }
    });

    $("#btnAtacar").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).text("Atacar");
            game.state.start('attack');
            $("#vidaNaveEnemiga").width("100%");
            $("#vidaNaveEnemiga").html("Vida Enemiga al 100%");
            setTimeout(function () {
                $("#containerEstadoVidaEnemigo").css({
                    opacity: 1
                });
                selected = $(".estiloEnemigo.activo").attr("data-tipoenemigo");
                switch (selected) {
                    case "Nave de Avanzada":
                        $("#optionAttackAvanzada").css({
                            opacity: 0
                        });
                        AvanzadaAlAtaque();
                        break;
                    case "Nave Exploradora":
                        $("#optionAttackExp").css({
                            opacity: 0
                        });
                        ExplAlAtaque();
                        break;
                    case "Nave Nodriza":
                        $("#optionAttackNodriza").css({
                            opacity: 0
                        });
                        NodrizaAlAtaque();
                        break;
                }
            }, 500);
        } else {
            $(this).text("¡Desplegar Ataque!");
        }
        $("#containerConfigAtaque, #btnAtacar").toggleClass("active");
    });

    //Activacion de estilo
    $('.estiloNave').on("click", function () {
        if (!$(this).hasClass("activo")) {
            $(".estiloNave.activo").removeClass("activo");
            $(this).addClass("activo");
        }
    });
    $('.estiloEnemigo').on("click", function () {
        if (!$(this).hasClass("activo")) {
            $(".estiloEnemigo.activo").removeClass("activo");
            $(this).addClass("activo");
            $("#infoTipoEnemigo").text($(this).attr("data-tipoEnemigo"));
        }
    });
    $('.estiloNebulosa').on("click", function () {
        if (!$(this).hasClass("activo")) {
            $(".estiloNebulosa.activo").removeClass("activo");
            $(this).addClass("activo");
        }
    });
    $('.estiloSistemaSolar').on("click", function () {
        if (!$(this).hasClass("activo")) {
            $(".estiloSistemaSolar.activo").removeClass("activo");
            $(this).addClass("activo");
        }
    });
    $('.estiloPlaneta').on("click", function () {
        if (!$(this).hasClass("activo")) {
            $(".estiloPlaneta.activo").removeClass("activo");
            $(this).addClass("activo");
        }
        switch ($(this).attr("data-idImg")) {
            case "planeta1":
                $("#cantIridioRango").val(1000);
                $("#cantPlatinoRango").val(1000);
                $("#cantPaladioRango").val(1000);
                $("#cantEZeroRango").val(1000);
                break;
            case "planeta2":
                $("#cantIridioRango").val(5000);
                $("#cantPlatinoRango").val(3000);
                $("#cantPaladioRango").val(1500);
                $("#cantEZeroRango").val(100);
                break;
            case "planeta3":
                $("#cantIridioRango").val(1000);
                $("#cantPlatinoRango").val(3000);
                $("#cantPaladioRango").val(5000);
                $("#cantEZeroRango").val(7000);
                break;
            case "planeta4":
                $("#cantIridioRango").val(2000);
                $("#cantPlatinoRango").val(5000);
                $("#cantPaladioRango").val(3000);
                $("#cantEZeroRango").val(3000);
                break;
            case "planeta5":
                $("#cantIridioRango").val(6000);
                $("#cantPlatinoRango").val(7000);
                $("#cantPaladioRango").val(5000);
                $("#cantEZeroRango").val(1000);
                break;
        }
        $("#cantIridioRango,#cantPlatinoRango,#cantPaladioRango,#cantEZeroRango").trigger("input");
    });
    $('.estiloEEspacial').on("click", function () {
        if (!$(this).hasClass("activo")) {
            $(".estiloEEspacial.activo").removeClass("activo");
            $(this).addClass("activo");
        }
    });
    $('.estiloTTransportador').on("click", function () {
        if (!$(this).hasClass("activo")) {
            $(".estiloTTransportador.activo").removeClass("activo");
            $(this).addClass("activo");
        }
    });

    $("#selectTipoPlaneta").change(function () {
        switch ($(this).val()) {
            case "planeta":
                $('.estiloPlaneta').removeClass("d-none"); // mostrar estilos planetas 
                $("#materialesPlaneta").removeClass("d-none"); //mostrar materiales
                $('.estiloEEspacial').addClass("d-none"); // ocultar estilos estacion espacial 
                $('.estiloTTransportador').addClass("d-none"); // ocultar estilos teletransportador 
                break;
            case "ecombustible":
                $('.estiloEEspacial').removeClass("d-none"); // mostrar estilos estacion espacial  
                $('.estiloPlaneta').addClass("d-none"); // ocultar estilos planetas 
                $("#materialesPlaneta").addClass("d-none"); // ocultar materiales
                $('.estiloTTransportador').addClass("d-none"); // ocultar estilos teletransportador 
                break;
            case "teletrasportador":
                $('.estiloTTransportador').removeClass("d-none"); // mostrar estilos planetas 
                $('.estiloPlaneta').addClass("d-none"); // ocultar estilos planetas 
                $("#materialesPlaneta").addClass("d-none"); // ocultar materiales
                $('.estiloEEspacial').addClass("d-none"); // ocultar estilos estacion espacial 
                break;
        }
    });
    $("#cantIridioRango").on("input", function () {
        $("#cantIridio").text(this.value + "T");
    });
    $("#cantPlatinoRango").on("input", function () {
        $("#cantPlatino").text(this.value + "T");
    });
    $("#cantPaladioRango").on("input", function () {
        $("#cantPaladio").text(this.value + "T");
    });
    $("#cantEZeroRango").on("input", function () {
        $("#cantEZero").text(this.value + "T");
    });
    $("#cantCombustibleInicial").on("input", function () {
        $("#cantCombustibleLabel").text(this.value + "L");
    });
});

function cargarVistaEdicion(nivel) {
    switch (nivel) {
        case "P":
            $("#btnCrear").addClass("d-none");
            $("#btnEditar").attr("data-content", "Editar este planeta");
            $("#btnEliminar").attr("data-content", "Eliminar este planeta");
            break;
        case "S":
            cargarFormularioPlaneta();
            $("#btnCrear").attr("data-content", "Crear Nuevo Planeta");
            $("#btnEditar").attr("data-content", "Editar este sistema solar");
            $("#btnEliminar").attr("data-content", "Eliminar este sistema solar");
            $("#btnCrear").removeClass("d-none");
            break;
        case "N":
            cargarFormularioSistemaSolar();
            $("#btnCrear").attr("data-content", "Crear Nuevo Sistema Solar");
            $("#btnEditar").attr("data-content", "Editar esta nebulosa");
            $("#btnEliminar").attr("data-content", "Eliminar esta nebulosa");
            $("#btnEliminar").removeClass("d-none");
            break;
        case "G":
            cargarFormularioNebulosa();
            $("#btnCrear").attr("data-content", "Crear Nueva Nebulosa");
            $("#btnEditar").attr("data-content", "Editar la galaxia");
            $("#btnEliminar").addClass("d-none");
            break;
    }
}

function cargarFormularioNebulosa() {
    $('.estiloSistemaSolar').addClass("d-none"); // ocultar estilos sistema solar
    //Formulario Nebulosa
    $("#inputNombre").val("");
    $("#crearTituloInfo").text("Creación de Nebulosa"); // cambiar titulo
    $("#inputNombre").attr("placeholder", "Ingrese el nombre de la Nebulosa");
    $('#nebulosaEsPeligrosa').removeClass("d-none"); //mostrar check es peligrosa
    $('.estiloNebulosa').removeClass("d-none"); // mostrar estilos nebulosa
    $('#nebulosaEsPeligrosa').prop('checked', false);
    $(".estiloNebulosa").first().click();
}

function cargarFormularioSistemaSolar() {
    //De nebulosa a sistema solar
    $('#nebulosaEsPeligrosa').addClass("d-none"); //ocultar check es peligrosa
    $('.estiloNebulosa').addClass("d-none"); // ocultar estilos nebulosa
    //De planeta a sistema Solar
    $("#planetaEsOrigen").addClass("d-none"); // ocultar opción de planeta origen
    $("#tipoPlanetaSelect").addClass("d-none"); // ocultar selección de tipo
    $('.estiloPlaneta, .estiloTTransportador, .estiloEEspacial').addClass("d-none"); // ocultar estilos planetas
    $("#materialesPlaneta").addClass("d-none"); // ocultar materiales
    //Formulario Sistema Solar
    $("#inputNombre").val("");
    $("#crearTituloInfo").text("Creación de Sistema Solar"); // cambiar titulo
    $("#inputNombre").attr("placeholder", "Ingrese el nombre del Sistema Solar"); //cambiar Placeholder
    $('.estiloSistemaSolar').removeClass("d-none"); // mostrar estilos sistema solar
    $(".estiloSistemaSolar").first().click();
}

function cargarFormularioPlaneta() {
    //De Sistema solar a Planeta
    $('.estiloSistemaSolar').addClass("d-none"); // ocultar estilos sistema solar
    $("#inputNombre").attr("placeholder", "Ingrese el nombre del Planeta");
    //Formulario Planeta
    $("#inputNombre").val("");
    $("#crearTituloInfo").text("Creación de Planeta"); // cambiar titulo
    $("#planetaEsOrigen").removeClass("d-none"); // mostrar opción de planeta origen
    $('#checkPlanetaEsOrigen').prop('checked', false);
    $("#tipoPlanetaSelect").removeClass("d-none"); // mostrar selección de tipo
    $("#selectTipoPlaneta").val("planeta"); //seleccionar tipo planeta
    $('.estiloPlaneta').removeClass("d-none"); // mostrar estilos planetas
    $(".estiloPlaneta").first().click();
    $('.estiloEEspacial').addClass("d-none"); // mostrar estilos planetas
    $('.estiloTTransportador').addClass("d-none"); // mostrar estilos planetas
    $("#materialesPlaneta").removeClass("d-none"); //mostrar materiales
}

function cargarFormularioNave() {
    $("#nombreContainer").addClass("d-none");
    $('#nebulosaEsPeligrosa').addClass("d-none"); //ocultar check es peligrosa
    $("#planetaEsOrigen").addClass("d-none"); // ocultar opción de planeta origen
    $("#tipoPlanetaSelect").addClass("d-none"); // ocultar selección de tipo
    $('.estiloSistemaSolar').addClass("d-none"); // ocultar estilos sistema solar
    $('.estiloNebulosa').addClass("d-none"); // ocultar estilos nebulosa
    $('.estiloPlaneta, .estiloTTransportador, .estiloEEspacial').addClass("d-none"); // ocultar estilos planetas
    $("#btnUbicar").addClass("d-none");
    //Formulario Nave
    $("#crearTituloInfo").text("Nave Infinity"); // cambiar titulo
    $('.estiloNave').removeClass("d-none"); // ocultar estilos nebulosa
    $("#combustibleNaveContainer").removeClass("d-none");
    $("#inputSondasContainer").removeClass("d-none");
    $("#materialesPlaneta").removeClass("d-none"); //mostrar materiales
    $("#cantIridioRango").val(2000);
    $("#cantPlatinoRango").val(2000);
    $("#cantPaladioRango").val(2000);
    $("#cantEZeroRango").val(2000);
    $("#cantCombustibleInicial").val(100000);
    $("#cantIridioRango,#cantPlatinoRango,#cantPaladioRango,#cantEZeroRango,#cantCombustibleInicial").trigger("input");
    $("#btnIniciarNave").removeClass("d-none");
    $('#sideBarConfig').addClass('active');
    $('#overlay').fadeIn();
    alertify.success('¡Seleccione la configuración inicial de la nave Infinity!');
}

function ocultarEdicion() {
    deseleccionar();
    $("#btnAtras").addClass("d-none");
    $("#navToolsCreate").addClass("d-none");
    $("#infoUbicacion").addClass("leftInfo");
}

function cargarEdicion() {
    $("#btnGuardar").removeClass("d-none");
    $("#btnUbicar").addClass("d-none");
    if (planetaActual !== undefined) {
        cargarFormularioPlaneta();
        var esOrigen = galaxia.planetaOrigen.length > 0 && nebulosaActual.id === galaxia.planetaOrigen[0] && sistemaSolarActual.id === galaxia.planetaOrigen[1] && planetaActual.id === galaxia.planetaOrigen[2];
        $("#crearTituloInfo").text("Edición de Planeta");
        $("#inputNombre").val(planetaActual.nombre);
        $("#inputNombre").attr("placeholder", "Ingrese el nombre del Planeta");
        $('#checkPlanetaEsOrigen').prop('checked', esOrigen);
        $("#tipoPlanetaSelect").addClass("d-none");
        $('.estiloPlaneta[data-idImg="planeta' + returnIdBackground(planetaActual) + '"]').click();
        $("#cantIridioRango").val(planetaActual.iridio);
        $("#cantPlatinoRango").val(planetaActual.platino);
        $("#cantPaladioRango").val(planetaActual.paladio);
        $("#cantEZeroRango").val(planetaActual.elementoZero);
        $("#cantIridioRango,#cantPlatinoRango,#cantPaladioRango,#cantEZeroRango").trigger("input");
    } else if (sistemaSolarActual !== undefined) {
        cargarFormularioSistemaSolar();
        $("#crearTituloInfo").text("Edición de Sistema Solar");
        $("#inputNombre").val(sistemaSolarActual.nombre);
        $("#inputNombre").attr("placeholder", "Ingrese el nombre del Sistema Solar");
        $('.estiloSistemaSolar[data-idImg="sistemasolar' + returnIdBackground(sistemaSolarActual) + '"]').click();
    } else if (nebulosaActual !== undefined) {
        cargarFormularioNebulosa();
        $("#crearTituloInfo").text("Edición de Nebulosa");
        $("#inputNombre").val(nebulosaActual.nombre);
        $("#inputNombre").attr("placeholder", "Ingrese el nombre de la Nebulosa");
        $('#nebulosaEsPeligrosa').prop('checked', nebulosaActual.esPeligrosa);
        $('.estiloNebulosa[data-idImg="nebulosa' + returnIdBackground(nebulosaActual) + '"]').click();
    } else {
        $("#crearTituloInfo").text("Editar Galaxia");
        $("#inputNombre").val(galaxia.nombre);
        $("#inputNombre").attr("placeholder", "Ingrese el nombre de la Galaxia");
        $("#nebulosaEsPeligrosa").addClass("d-none");
        $("#containerEstilos").addClass("d-none");
    }
}

function mostrarInterfazNave() {
    $("#containerEstadoVida, #containerEstadoCombustible, #containerEstadoSondas, #containerEstadoMateriales").fadeIn("slow");
}

function ocultarInterfazNave() {
    $("#containerEstadoVida, #containerEstadoCombustible, #containerEstadoSondas, #containerEstadoMateriales").fadeOut("slow");
}

function actualizarBarraMaterial(cant, material) {
    var porcentaje = (100 * cant) / 8000;
    var $barraCantidad = $("#cant" + material + "Nave");
    $barraCantidad.css({
        width: (porcentaje + "%")
    });
    if (porcentaje < 5) {
        $barraCantidad.attr("data-content", "Cantidad " + material + ": " + cant + "T");
        $barraCantidad.text("");
    } else {
        $barraCantidad.attr("data-content", cant + "T");
        if ($barraCantidad.text() == "")
            $barraCantidad.text(material);
    }
}

function actualizarBarraEscudo(cant) {
    var porcentaje = (100 * cant) / nave.escudoMaximo;
    var $barraCantidad = $("#escudoNave");
    $barraCantidad.width(porcentaje + "%");
}

function actualizarBarraVidaNave(cant) {
    var porcentaje = (100 * cant) / nave.vidaMaxima;
    var $barraCantidad = $("#vidaNave");
    $("#vidaNave").html("Vida al " + porcentaje + "%");
    $barraCantidad.width(porcentaje + "%");
}