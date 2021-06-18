var enemigoExplorador = 8;

var cursors;
var weapon;
var weaponEnemigo;
var vidaEnemigo = 0;
var cantidadDisparosANave = 0;
var vidaMaximaEnemigo;
var dañoEnemigo = 0;
var SpriteEnemyNodriza;
var SpriteEnemyAvanz;
var SpriteEnemiesExp;
var enemigoAtacando;
var gifExplosion = [];
var disparosEnemigosExploradores = [];
var enemigosYaAtacados=[];

$(document).ready(function () {
    $("#btnConfigEnemigos").on("click", function () {
        alertify.prompt("<h6>Ingrese la cantidad de enemigos tipo exploradores.<br>En el comento hay <b>" + enemigoExplorador + "</b> enemigos.</h6>", "",
            function (closeEvent, cantidadEnemigoExplorador) {
                if (!$.isNumeric(cantidadEnemigoExplorador) || cantidadEnemigoExplorador < 0 || cantidadEnemigoExplorador > 8) {
                    closeEvent.cancel = true;
                    alertify.error('Ingrese un valor numérico positivo menor o igual a 8');
                } else {
                    enemigoExplorador = cantidadEnemigoExplorador;
                    alertify.success('Los enemigos se actualizaron de forma correcta.');
                }
            },
            function () {
                alertify.prompt().destroy();
            }).setHeader("Cantidad de enemigos exploradores");
    });
});

function NodrizaAlAtaque() {
    verificarSiHayAtaques();
    enemigoAtacando = "nodriza";
    vidaEnemigo = 500;
    vidaMaximaEnemigo = vidaEnemigo;
    dañoEnemigo = 150;
    if (probabilidadExito()) {
        modificarSeleccionNavesEnemigas();
        SpriteEnemyNodriza.hash.forEach(function (sprite) {
            var tween = game.add.tween(sprite);
            tween.to({
                x: game.rnd.between(900, 1100)
            }, 3000, Phaser.Easing.Bounce.Out);
            tween.start();
            tween.onComplete.add(disparoDeEnemigo, this);
        });
    }
}

function AvanzadaAlAtaque() {
    verificarSiHayAtaques();
    enemigoAtacando = "avanzada";
    vidaEnemigo = 400;
    vidaMaximaEnemigo = vidaEnemigo;
    dañoEnemigo = 100;
    if (probabilidadExito()) {
        modificarSeleccionNavesEnemigas();
        SpriteEnemyAvanz.hash.forEach(function (sprite) {
            var tween = game.add.tween(sprite);
            tween.to({
                x: game.rnd.between(900, 1100)
            }, 3000, Phaser.Easing.Bounce.Out);
            tween.start();
            tween.onComplete.add(disparoDeEnemigo, this);
        });
    }
}

function ExplAlAtaque() {
    verificarSiHayAtaques();
    enemigoAtacando = "exploradores";
    vidaEnemigo = 100;
    vidaMaximaEnemigo = vidaEnemigo;
    dañoEnemigo = 50;
    if (probabilidadExito()) {
        modificarSeleccionNavesEnemigas();
        SpriteEnemiesExp.hash.forEach(function (sprite) {
            var tween = game.add.tween(sprite);
            tween.to({
                x: game.rnd.between(900, 1100)
            }, 3000, Phaser.Easing.Bounce.Out);
            tween.start();
            tween.onComplete.add(disparoDeEnemigo, this);
        });
    }
}

function modificarSeleccionNavesEnemigas(){
    var listaOrdenadaEnemigos=["avanzada","exploradores","nodriza"];
    var listaOpcionesEnemigos=["optionAttackAvanzada","optionAttackExp","optionAttackNodriza"];
    enemigosYaAtacados.push(enemigoAtacando);
    for (var i =0;i<listaOrdenadaEnemigos.length;i++){
        if(!enemigosYaAtacados.includes( listaOrdenadaEnemigos[i] )){
            $('#'+listaOpcionesEnemigos[i]).trigger('click');
            break;
        }
    }
}

function verificarSiHayAtaques() {
    if (enemigoAtacando !== undefined) {
        switch (enemigoAtacando) {
            case "nodriza":
                SpriteEnemyNodriza.kill();
                break;
            case "avanzada":
                SpriteEnemyAvanz.kill();
                break;
            case "exploradores":
                SpriteEnemiesExp.kill();
                break;
        }
        enemigoAtacando = undefined;
    }
}

function createAttack() {
    var numeroPlaneta = returnIdBackground(planetaActual);
    fondo = game.add.sprite(0, 0, 'fondoPlaneta' + numeroPlaneta);
    alistarEnemigos();
    fondo.height = alto;
    fondo.width = ancho;
    agregarNaveDefensa();
    empezarAtaque();
}

function empezarAtaque() {
    var nodr = SpriteEnemyNodriza.create(game.rnd.between(ancho + 50, ancho + 100), game.rnd.between(0, alto - 100), 'naveNodriza');
    nodr.anchor.setTo(0.5, 0.5);
    var avanz = SpriteEnemyAvanz.create(game.rnd.between(ancho + 50, ancho + 100), game.rnd.between(0, alto - 100), 'naveAvanzada');
    avanz.anchor.setTo(0.5, 0.5);

    for (var j = 0; j < enemigoExplorador; j++) {
        var exp = SpriteEnemiesExp.create(game.rnd.between(ancho + 50, ancho + 100), game.rnd.between(0, alto - 100), 'naveExploradora');
        exp.anchor.setTo(0.5, 0.5);
    }
}

function probabilidadExito() {
    var disparosNave = vidaEnemigo / nave.dañoArmaBase;
    var disparosEnemigos;
    if (enemigoAtacando == "exploradores") {
        disparosEnemigos = (nave.vida + nave.escudo) / (dañoEnemigo * enemigoExplorador);
    } else {
        disparosEnemigos = (nave.vida + nave.escudo) / dañoEnemigo;
    }
    if (Math.ceil(disparosEnemigos) <= Math.ceil(disparosNave) && !utilizarMejorAtaque()) {
        $("#containerEstadoVidaEnemigo").css({ opacity: 0 });
        $("#btnAtacar").css({ opacity: 0 });
        alertify.error("Por seguridad, nos vamos a retirar");
        return false;
    }
    return true;
}

function agregarNaveDefensa() {
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    weaponEnemigo = game.add.weapon(15, 'bala');
    weaponEnemigo.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weaponEnemigo.bulletSpeed = 400;
    weaponEnemigo.fireRate = 60;

    sprite = game.add.sprite(nave.sprite.position.x, nave.sprite.position.y, nave.sprite.key, nave.sprite.frame);
    sprite.anchor.set(0.5);
    sprite.width = 100;
    sprite.height = 100;
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    cargarDisparoNormal();
    cursors = game.input.keyboard.createCursorKeys();
}

function sonidoDisparo() {
    if (nave.disparoPorTanix == true) {
        var sonidoDisparo = game.add.audio('disparoTanix');
    } else {
        var sonidoDisparo = game.add.audio('disparo');
    }
    sonidoDisparo.addMarker('inicioDisparo', 0, 13);
    sonidoDisparo.play("inicioDisparo");
}

function cargarCañonTanix() {
    weapon = game.add.weapon(1, 'cañon');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 400;
    weapon.trackSprite(sprite, 0, 0, true);
}

function cargarDisparoNormal() {
    if (nave.dañoArmaBase > 60) {
        weapon = game.add.weapon(1, 'bala2');
    } else {
        weapon = game.add.weapon(1, 'bala');
    }
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 400;
    weapon.trackSprite(sprite, 0, 0, true);
}

function updateAttack() {
    if (enemigoAtacando) {
        switch (enemigoAtacando) {
            case "nodriza":
                SpriteEnemyNodriza.hash[0].rotation = game.physics.arcade.angleBetween(sprite, SpriteEnemyNodriza.hash[0]);
                sprite.rotation = game.physics.arcade.angleBetween(sprite, SpriteEnemyNodriza.hash[0]);
                break;
            case "avanzada":
                SpriteEnemyAvanz.hash[0].rotation = game.physics.arcade.angleBetween(sprite, SpriteEnemyAvanz.hash[0]);
                sprite.rotation = game.physics.arcade.angleBetween(sprite, SpriteEnemyAvanz.hash[0]);
                break;
            case "exploradores":
                SpriteEnemiesExp.hash.forEach(function (enemigo) {
                    enemigo.rotation = game.physics.arcade.angleBetween(sprite, enemigo);
                });
                sprite.rotation = game.physics.arcade.angleBetween(sprite, SpriteEnemiesExp.hash[0]);
                break;
        }
    }
    game.physics.arcade.overlap(weapon.bullets, SpriteEnemyAvanz, collAvz, null, this);
    game.physics.arcade.overlap(weapon.bullets, SpriteEnemyNodriza, collNod, null, this);
    game.physics.arcade.overlap(weapon.bullets, SpriteEnemiesExp, collExp, null, this);
    disparosEnemigosExploradores.forEach(function (wEnemigo) {
        game.physics.arcade.overlap(wEnemigo.bullets, sprite, collNave, null, this);
    });
}

function disparoDeEnemigo(spriteEmenigo) {

    switch (enemigoAtacando) {
        case "nodriza":
            weaponEnemigo.trackSprite(SpriteEnemyNodriza.hash[0], 0, 0, true);
            break;
        case "avanzada":
            weaponEnemigo.trackSprite(SpriteEnemyAvanz.hash[0], 0, 0, true);
            break;
        case "exploradores":
            weaponEnemigo = game.add.weapon(1, 'bala');
            weaponEnemigo.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            weaponEnemigo.bulletSpeed = 400;
            weaponEnemigo.trackSprite(spriteEmenigo, 0, 0, true);

            break;
    }
    weaponEnemigo.fireAtXY(100, 300);
    sonidoDisparo();
    disparosEnemigosExploradores.push(weaponEnemigo);
}

function enemigoFueEliminado() {
    if (nave.disparoPorTanix == true) {
        vidaEnemigo -= vidaMaximaEnemigo / 2;
        nave.disparoPorTanix = false;
        cargarDisparoNormal();
    } else {
        vidaEnemigo -= nave.dañoArmaBase;
    }
    actualizarBarraVidaEnemiga(vidaEnemigo);
    if (vidaEnemigo <= 0) {
        $("#containerEstadoVidaEnemigo").css({ opacity: 0 });
        alertify.success("Enemigo Eliminado");
        enemigoAtacando = undefined;
        verificarSiMejoraVida();
        //hacerAlgunaMejora();
        preloadExtraerElementos();
        if(enemigosYaAtacados.length==3){
            $("#btnAtacar").css({ opacity: 0 });
        }
        return true;
    } else {
        game.time.events.add(Phaser.Timer.SECOND * 2, activarTurnoEnemigo, this);
    }

    return false;
}

function verificarSiMejoraVida(){
    if(nave.vida<480){//480 = 40%
        hacerMejora("vidaNave");
    }    
}

// function hacerAlgunaMejora(){
//     var encontrado=false;
//     nave.mejoras.forEach(function(mejora){
//         if(!encontrado && hacerMejora(mejora.nombre)){
//             encontrado=true;
//         }
//     });
// }

function collAvz(bullet, enemies) {
    efectoExplosion(SpriteEnemyAvanz.hash[0]);
    colision(bullet);
    if (enemigoFueEliminado()) {
        SpriteEnemyAvanz.kill();
    }
}

function collNod(bullet, enemies) {
    efectoExplosion(SpriteEnemyNodriza.hash[0]);
    colision(bullet);
    if (enemigoFueEliminado()) {
        SpriteEnemyNodriza.kill();
    }
}

function collExp(bullet, enemies) {
    SpriteEnemiesExp.hash.forEach(function (enemigo) {
        efectoExplosion(enemigo);
    });
    colision(bullet);
    if (enemigoFueEliminado()) {
        SpriteEnemiesExp.kill();
    }
}

function collNave(enemies, bullet) {
    interrumpirExtraccion();
    cantidadDisparosANave++;
    efectoExplosion(sprite);
    colision(bullet);
    comprarPlasma();
    if (nave.escudo > 0) {
        nave.setEscudo(nave.escudo - dañoEnemigo, "quitar");
    } else {
        nave.setVida(nave.vida - dañoEnemigo, "quitar");
    }
    if (enemigoAtacando == "exploradores") {
        if (cantidadDisparosANave == enemigoExplorador) { //ultimo disparo recibido
            game.time.events.add(Phaser.Timer.SECOND * 2, activarTurnoNave, this);
            cantidadDisparosANave = 0;
        }
    } else {
        game.time.events.add(Phaser.Timer.SECOND * 2, activarTurnoNave, this);
    }
}

function comprarPlasma(){
    if(nave.dañoArmaBase==60 && enemigoAtacando!="exploradores" && vidaEnemigo>vidaMaximaEnemigo/2){
        mejoraCañonPlasma();
        nave.setCantIridio(nave.cantIridio - 500);
        nave.setCantPlatino(nave.cantPlatino - 600);
        nave.setCantPaladio(nave.cantPaladio - 800);
        nave.setCantEZero(nave.cantEZero - 250);
    }
}

function activarTurnoEnemigo() {
    if (enemigoAtacando == "exploradores") {
        SpriteEnemiesExp.hash.forEach(function (sprite) {
            disparoDeEnemigo(sprite);
        });
    } else {
        disparoDeEnemigo(null);
    }
}

function utilizarMejorAtaque(){
    if (nave.cañonTanixComprado && nave.contadorDisparos > 5) {
        if(vidaEnemigo>=vidaMaximaEnemigo/2){
            if(vidaEnemigo / nave.dañoArmaBase>4){
                if((enemigosYaAtacados.includes("nodriza") && nave.dañoArmaBase==60) || !enemigosYaAtacados.includes("nodriza")){
                    return true;
                }
            }            
        }
    }
    return false;
}

function activarTurnoNave() {
    if (utilizarMejorAtaque()) {
        nave.disparoPorTanix = true;
        nave.contadorDisparos = 0;
        cargarCañonTanix();
    }else{
        nave.disparoPorTanix = false;
        cargarDisparoNormal();
    }
    nave.contadorDisparos++;
    sonidoDisparo();
    weapon.fire();
}

function efectoExplosion(sprite) {
    explosion = game.add.sprite(sprite.position.x + 20, sprite.position.y, 'gifExplosion');
    explosion.width = 100;
    explosion.height = 100;
    explosion.anchor.setTo(0.5, 0.5);
    explosion.animations.add('giro');
    explosion.animations.play('giro', 10, true);
    gifExplosion.push(explosion);
    game.time.events.add(Phaser.Timer.SECOND * 2, destroyExplosion, this);
}

function destroyExplosion() {
    gifExplosion.forEach(function (explosion) {
        explosion.kill();
    });
    gifExplosion = [];
}

function colision(bullet) {
    bullet.kill();
    if (nave.disparoPorTanix == true) {
        var sonidoExp = game.add.audio('explosionTanix');
    } else {
        var sonidoExp = game.add.audio('explosion');
    }
    sonidoExp.addMarker('inicioExplosion', 0, 13);
    sonidoExp.play("inicioExplosion");
}

function actualizarBarraVidaEnemiga(cant) {
    var porcentaje = (100 * cant) / vidaMaximaEnemigo;
    var $barraCantidad = $("#vidaNaveEnemiga");
    if (porcentaje < 0) {
        porcentaje = 0;
    }
    $barraCantidad.width(porcentaje + "%");
    $("#vidaNaveEnemiga").html("Vida Enemiga al " + porcentaje + "%");
}

function alistarEnemigos() {
    SpriteEnemyNodriza = game.add.group();
    SpriteEnemyAvanz = game.add.group();
    SpriteEnemiesExp = game.add.group();
    SpriteEnemyNodriza.enableBody = true;
    SpriteEnemyAvanz.enableBody = true;
    SpriteEnemiesExp.enableBody = true;
    SpriteEnemyNodriza.physicsBodyType = Phaser.Physics.ARCADE;
    SpriteEnemyAvanz.physicsBodyType = Phaser.Physics.ARCADE;
    SpriteEnemiesExp.physicsBodyType = Phaser.Physics.ARCADE;
}

function calculoMejorasEstimado(){
    var daño1=150;
    var daño2=100;
    var daño3=50;
    var disparosTotales=0;
    var dañoTotal=0;
    if (enemigoAtacando == "exploradores") {
        disparosTotales+= (nave.vida + nave.escudo) / (daño3 * enemigoExplorador);
    } else {
        disparosTotales+= (nave.vida + nave.escudo) / daño3;
    }
    disparosTotales+=(nave.vida + nave.escudo) / daño2;
    disparosTotales+=(nave.vida + nave.escudo) / daño1;
    alert(Math.ceil(disparosTotales));
    dañoTotal=disparosTotales*((daño1+daño2+daño3)/3);
    var mejorasPorHacer=Math.round(dañoTotal/(30*nave.vidaMaxima));//30 es la vida minima para hacer mejora
    alert(mejorasPorHacer);
}