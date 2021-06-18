$(document).ready(function () {
    $("#Mejoras").on("click", function () {
        hacerMejora("cañonPlasma");
    });
});

var posicionDeMejora;

function hacerMejora(tipo) {
    if (descontarElementos(tipo)) {
        switch (tipo) {
            // case "escudoMultinucleo":
            //     mejoraEscudoMultinucleo(400);
            //     return true;
            // break;
            // case "blindajeNavesPesadas":
            //     blindajeNavesPesadas();
            //     return true;
            // break;
            case "cañonTanix":
                mejoraCañonTanix();
                return true;
                break;
            case "propulsorOnix":
                mejoraPropulsorOnix();
                return true;
                break;
            case "cañonPlasma":
                mejoraCañonPlasma();
                return true;
                break;
            case "capacidadDepositos":
                mejoraCapacidadDepositos();
                return true;
                break;
            case "vidaNave":
                mejoraVidaNave();
                return true;
                break;
            case "capacidadCombustible":
                mejoraCapacidadCombustible();
                return true;
                break;
        }
    }
    return false;
}

// function mejoraEscudoMultinucleo(aumento){
//     nave.setVida(nave.vida+aumento,"aumentar");
//     alertify.success("La vida se aumentó en 400 puntos");
// }
// function blindajeNavesPesadas(){
//     nave.setEscudo(1200,"aumentar");
//     $("#escudoNave").width("100%");
//     alertify.success("El escudo se ha cargado al 100%");
// }

function mejorarEscudo() {
    nave.setEscudo(1200, "aumentar");
    $("#escudoNave").width("100%");
    alertify.success("El escudo se ha cargado al 100%");
}

function mejoraCañonTanix() {
    nave.cañonTanixComprado = true;
    nave.disparoPorTanix = 6;
    nave.mejoras.splice(posicionDeMejora, 1);
    alertify.success("El cañón Tanix está activado!");
}

function mejoraPropulsorOnix() {
    nave.msRecorrido = 1250;
    nave.mejoras.splice(posicionDeMejora, 1);
    alertify.success("Propulsor Comprado, la nave viajará más rápido");
}

function mejoraCañonPlasma() {
    nave.dañoArmaBase += 100;
    nave.mejoras.splice(posicionDeMejora, 1);
    alertify.success("Los disparos tiene 100 puntos más de daño.");
}

function mejoraCapacidadDepositos() {
    nave.capacidadCarga *= 1.5;
    nave.mejoras.splice(posicionDeMejora, 1);
    alertify.success("La capacidad de carga se aumentó en un 50%");
}

function mejoraVidaNave() {
    nave.setVida(1200, "aumentar");
    $("#vidaNave").width("100%");
    alertify.success("La nave tiene vida completa.");
}

function mejoraCapacidadCombustible() {
    nave.combustible.maxValue = 250000;
    nave.mejoras.splice(posicionDeMejora, 1);
    alertify.success("Se ha aumentado la capacidad del combustible.");
}

function descontarElementos(tipo) {
    var zero, paladio, iridio, platino, activa;
    var disponible = false;
    for (var i = 0; i < nave.mejoras.length; i++) {
        if (nave.mejoras[i].nombre == tipo) {
            zero = nave.mejoras[i].zero;
            paladio = nave.mejoras[i].paladio;
            iridio = nave.mejoras[i].iridio;
            platino = nave.mejoras[i].platino;
            disponible = true;
            posicionDeMejora = i;
            break;
        }
    }
    if (disponible && elementosSuficinetes(zero, paladio, iridio, platino)) {
        nave.setCantIridio(nave.cantIridio - iridio);
        nave.setCantPlatino((nave.cantPlatino - platino));
        nave.setCantPaladio(nave.cantPaladio - paladio);
        nave.setCantEZero(nave.cantEZero - zero);
        return true;
    }
    return false;
}

function elementosSuficinetes(zero, paladio, iridio, platino) {
    if (nave.cantIridio - iridio < 0) {
        return false;
    }
    if (nave.cantPlatino - platino < 0) {
        return false;
    }
    if (nave.cantPaladio - paladio < 0) {
        return false;
    }
    if (nave.cantEZero - zero < 0) {
        return false;
    }
    return true;
}