//#region okvir
/// <reference path="../otter/lib-00-GameSettings.js"/>
/// <reference path="../otter/lib-01-tiled.js"/>
/// <reference path="../otter/lib-02-sensing.js"/>
/// <reference path="../otter/lib-03-display.js"/>
/// <reference path="../otter/lib-04-engine.js"/>
/// <reference path="../otter/lib-05-game.js"/>
/// <reference path="../otter/lib-06-main.js"/>
//#endregion
/// <reference path="kod_01-likovi.js"/>


// što će se pokrenuti kad se klikne button Setup:
let btnSetupGame = document.getElementById("btnSetupGame");
btnSetupGame.addEventListener("click", setup);

function setup() {

  GAME.clearSprites();
  Postavke.vatra = [];
  Postavke.projektil = [];
  Postavke.neprijateljiNiz = [];
  let odabrana = GAME.activeWorldMap.name;
  var noviLevelZvuk = document.getElementById('noviLevelZvukId');

  switch (odabrana) {
    case "mapa1":
      noviLevelZvuk.play();
      Swal.fire({ //umjesto alert je SweetAlert2
        title: 'Prva razina!',
        html: 'Godina je 2097. Neo New Yorkom upravlja tiranin Raptor, koristeći se prijevarama, podmićivanjem i svojom vojskom "morfa". Raptor je zarobio Alix kako bi te natjerao da predaš svoj mač, X-Kaliber. <br><b> Porazi sve morfe i oslobodi partnericu Alix!</b>',
        icon: 'info',
        footer: 'Krećeš se strelicama. Pucaš sa slovom A.',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          setupMapa1();
          render_main();
          document.getElementById('btnStart').click();
        }
      });
      break;

    case "mapa2":
      noviLevelZvuk.play();
      Swal.fire({
        title: 'Druga razina!',
        html: 'Partnerica Alix je oslobođena, ali sada si suočen s novim izazovom - zombiji i preostali morfi te napadaju. <br><b>Za poraz zombija, morat ćeš ih pogoditi dvaput.</b>',
        icon: 'info',
        footer: 'Krećeš se strelicama. Pucaš sa slovom A.',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          setupMapa2();
          render_main();
        }
      });
      break;
    default:
      throw "Ne postoji setup za " + GAME.activeWorldMap.name;
      break;
  }

}


/* LEVELS */

function setupMapa1() {
  GAME.clearSprites();
  Postavke.vatra = [];
  Postavke.projektil = [];
  Postavke.neprijateljiNiz = [];

  GAME.activeWorldMap.setCollisions("Platforme");


  //slash
  Postavke.slash = new Slash(0, 0, GAME.getSpriteLayer("Slash"));
  GAME.addSprite(Postavke.slash);
  Postavke.slash.start(0, 17);



  //mac(oruzje) slasha
  Postavke.macL = new Mac(GAME.getSpriteLayer("slashOruzjeL"));
  GAME.addSprite(Postavke.macL);

  Postavke.macD = new Mac(GAME.getSpriteLayer("slashOruzjeD"));
  GAME.addSprite(Postavke.macD);



  //neprijatelj2(hodaju)
  //x, y, layer, maxLeft=0 , maxRight =30, direction = -1, speed = 28
  Postavke.nepKlas2_1 = new Neprijatelj2(0, 0, GAME.getSpriteLayer("Protivnik2"), 0, 8.5, -1, 16); //gornji
  Postavke.neprijateljiNiz.push(Postavke.nepKlas2_1)
  GAME.addSprite(Postavke.nepKlas2_1);
  Postavke.nepKlas2_1.start(7, 5);

  Postavke.nepKlas2_2 = new Neprijatelj2(0, 0, GAME.getSpriteLayer("Protivnik2"), 22, 30, 1, 13); //srednji
  Postavke.neprijateljiNiz.push(Postavke.nepKlas2_2)
  GAME.addSprite(Postavke.nepKlas2_2);
  Postavke.nepKlas2_2.start(25, 11);

  Postavke.nepKlas2_3 = new Neprijatelj2(0, 0, GAME.getSpriteLayer("Protivnik2"), 0, 30, -1, 15); //donji
  Postavke.neprijateljiNiz.push(Postavke.nepKlas2_3)
  GAME.addSprite(Postavke.nepKlas2_3);
  Postavke.nepKlas2_3.start(23, 15);


  //neprijatelj1 (lete)
  Postavke.leteci1 = new Neprijatelj1(0, 0, GAME.getSpriteLayer("Protivnik1"));
  Postavke.neprijateljiNiz.push(Postavke.leteci1)
  GAME.addSprite(Postavke.leteci1);
  Postavke.leteci1.start(0, 14);

  Postavke.leteci2 = new Neprijatelj1(0, 0, GAME.getSpriteLayer("Protivnik1"), 0, 30, -1);
  Postavke.neprijateljiNiz.push(Postavke.leteci2)
  GAME.addSprite(Postavke.leteci2);
  Postavke.leteci2.start(30, 9);



  //kraj prve razine
  Postavke.kraj1 = new Predmeti(GAME.getSpriteLayer("kraj"))
  GAME.addSprite(Postavke.kraj1);
  Postavke.kraj1.postavi(29, 1);
  Postavke.kraj1.visible = true;



  //srce
  Postavke.srce = new Srce(GAME.getSpriteLayer("srce"));
  GAME.addSprite(Postavke.srce);



  //mrkva
  Postavke.mrkvaHrana1 = new Hrana1(GAME.getSpriteLayer("mrkva"))
  GAME.addSprite(Postavke.mrkvaHrana1);


  //tresnja
  Postavke.tresnjaHrana2 = new Hrana2(GAME.getSpriteLayer("tresnja"))
  GAME.addSprite(Postavke.tresnjaHrana2);


}

function setupMapa2() {


  GAME.clearSprites();
  Postavke.vatra = [];
  Postavke.projektil = [];
  //GAME.setActiveWorldMap("mapa2");
  GAME.activeWorldMap.setCollisions("Platforme");
  Postavke.neprijateljiNiz = [];



  //kada prode razinu1 prenosi se broj bodova i zdravlje,a ako ne prode i krene igrat razinu2 onda zdravlje=100,bodovi=0
  if (!Postavke.slash || Postavke.slash.bodovi < 130) {
    GameSettings.output("", reset = true);
    Swal.fire({
      title: 'Upozorenje!',
      icon: 'warning',
      html: '<i>Iako nisi prošao prvu razinu igraš drugu razinu!</i><br><b>Zdravlje je postavljeno na 100. Bodovi su postavljeni na 0.</b>',
      confirmButtonText: 'OK'
    }).then((result) => {
      document.getElementById('btnStart').click();
    });
  }

  //slash
  Postavke.slash2 = new Slash(0, 0, GAME.getSpriteLayer("Slash"));
  GAME.addSprite(Postavke.slash2);
  Postavke.slash2.start(0, 17);

  Postavke.slash2.bodovi = Postavke.bodovi; //da se prenesu bodovi ili iz prethodne razine ili 0
  Postavke.slash2.zdravlje = Postavke.zdravlje; //da se prenese zdravlje ili iz prethodne razine ili 100
  GameSettings.output("Imate zdravlja: " + Postavke.slash2.zdravlje);
  GameSettings.output("Do sada ste ostvarili bodova: " + Postavke.slash2.bodovi);



  //mac(oruzje) slasha
  Postavke.macL = new Mac(GAME.getSpriteLayer("slashOruzjeL"));
  GAME.addSprite(Postavke.macL);

  Postavke.macD = new Mac(GAME.getSpriteLayer("slashOruzjeD"));
  GAME.addSprite(Postavke.macD);



  //neprijatelj1 (lete)
  //constructor(x, y, layer, maxLeft = 0, maxRight = 30, direction = -1, speed = 25) 
  Postavke.leteci1 = new Neprijatelj1(0, 0, GAME.getSpriteLayer("Protivnik1"));
  GAME.addSprite(Postavke.leteci1);
  Postavke.neprijateljiNiz.push(Postavke.leteci1);
  Postavke.leteci1.start(0, 10);

  Postavke.leteci2 = new Neprijatelj1(0, 0, GAME.getSpriteLayer("Protivnik1"), 0, 30, -1);
  GAME.addSprite(Postavke.leteci2);
  Postavke.neprijateljiNiz.push(Postavke.leteci2);
  Postavke.leteci2.start(30, 1);
  
 
  //constructor(x, y, layer, maxLeft = 0, maxRight = 30, direction = -1, speed = 28)
  Postavke.nepRaz2 = new NeprijateljRaz2(0, 0, GAME.getSpriteLayer("GlavniProtivnik")); //najdonji
  GAME.addSprite(Postavke.nepRaz2);
  Postavke.neprijateljiNiz.push(Postavke.nepRaz2)
  Postavke.nepRaz2.start(23, 18);


  Postavke.nepRaz2_1 = new NeprijateljRaz2(0, 0, GAME.getSpriteLayer("GlavniProtivnik"), 23, 30, -1); //desno najgornji
  GAME.addSprite(Postavke.nepRaz2_1);
  Postavke.neprijateljiNiz.push(Postavke.nepRaz2_1)
  Postavke.nepRaz2_1.start(28, 2);


  Postavke.nepRaz2_2 = new NeprijateljRaz2(0, 0, GAME.getSpriteLayer("GlavniProtivnik"), 22, 29, 1, 23); //desno na  najdonjoj platformi
  GAME.addSprite(Postavke.nepRaz2_2);
  Postavke.neprijateljiNiz.push(Postavke.nepRaz2_2)
  Postavke.nepRaz2_2.start(25, 11);

  Postavke.nepRaz2_3 = new NeprijateljRaz2(0, 0, GAME.getSpriteLayer("GlavniProtivnik"), 0, 6, -1, 9); //livo na najdonjoj platformi
  GAME.addSprite(Postavke.nepRaz2_3);
  Postavke.neprijateljiNiz.push(Postavke.nepRaz2_3)
  Postavke.nepRaz2_3.start(2, 13);

  Postavke.nepRaz2_4 = new NeprijateljRaz2(0, 0, GAME.getSpriteLayer("GlavniProtivnik"), 11, 17, 1, 13); //sredina 
  GAME.addSprite(Postavke.nepRaz2_4);
  Postavke.neprijateljiNiz.push(Postavke.nepRaz2_4)
  Postavke.nepRaz2_4.start(13, 8);

  Postavke.nepRaz2_5 = new NeprijateljRaz2(0, 0, GAME.getSpriteLayer("GlavniProtivnik"), 0, 11, -1); //livi najgornji 
  GAME.addSprite(Postavke.nepRaz2_5);
  Postavke.neprijateljiNiz.push(Postavke.nepRaz2_5)
  Postavke.nepRaz2_5.start(10, 5);
}
