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
/// <reference path="kod_02-postavke.js"/>

/**
 * Promjena stanja likova - interakcije
 */


function update_main() {

  if (GAME.activeWorldMap.name == "mapa1") {
    mapa1();
  }
  else if (GAME.activeWorldMap.name == "mapa2") {
    mapa2();
  }
  GAME.update();

};


let lastCallTime = Date.now();
let lastCallTime2 = Date.now();
const interval = 250; //vrijeme u ms
const interval2 = 400;


//--
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowUp') {
    event.preventDefault();  
    SENSING.up.active = true;  
    if (GAME.activeWorldMap.name == "mapa1") {
      Postavke.slash.jump();
    }
    if (GAME.activeWorldMap.name == "mapa2") {
      Postavke.slash2.jump();
    }

  }
  if (event.key === "ArrowDown") {
    event.preventDefault(); 
  }
});

document.addEventListener('keyup', function (event) { //kada otpustimo tipku
  if (event.key === 'ArrowUp') {
    SENSING.up.active = false;                     
  }
});
//---



let swalCalled = false; //za prelazak iz mapa1 u mapa2
function mapa1() { 

  //kretanje slasha
  if (SENSING.left.active) {
    Postavke.slash.moveLeft();
  }
  if (SENSING.right.active) {
    Postavke.slash.moveRight();
  }
  if (SENSING.up.active) {
    Postavke.slash.jump();
  }
  

  //zvukovi
  var macZvuk = document.getElementById('macZvuk'); 
  var savladanZvuk = document.getElementById('savladanZvuk'); 
  var noviLevelZvuk = document.getElementById('noviLevelZvukId'); 
  var auZvuk = document.getElementById('auZvukId');
  


  //pucanje slasha
  if (SENSING.keyA.active) { 
    if (Postavke.slash.direction == 90 & Postavke.macL.moveL == false & Postavke.macD.moveD == false) { Postavke.slash.pucaj(Postavke.macD); } //ako je slash okrenut desno i mac nije ispucan ni livo ni desno
    if (Postavke.slash.direction == 270 & Postavke.macL.moveL == false & Postavke.macD.moveD == false) { Postavke.slash.pucaj(Postavke.macL); }
    macZvuk.play(); 
  }
  


  //neprijatelji diraju Slasha
  for (let i = 0; i < Postavke.neprijateljiNiz.length - 2; i++) {
    Postavke.neprijateljiNiz[i].touching();
  }
  Postavke.leteci1.touchingRaz1();
  Postavke.leteci2.touchingRaz1();



  //ako slash upuca neprijatelja
  for (let i = 0; i < Postavke.neprijateljiNiz.length; i++) {
    if (((Postavke.macL.touching(Postavke.neprijateljiNiz[i]) && Postavke.macL.visible == true) || (Postavke.macD.touching(Postavke.neprijateljiNiz[i]) && Postavke.macD.visible == true))) {

      let t = Postavke.slash.bodovi + Postavke.neprijateljiNiz[i].vrijednot    
      Postavke.slash.bodovi = t; 
      GameSettings.output("Bodovi: " + Postavke.slash.bodovi)
      Postavke.macL.stop();
      Postavke.macD.stop();
      Postavke.neprijateljiNiz[i].visible = false; 
      savladanZvuk.play();

      
      if (Postavke.neprijateljiNiz[i] == Postavke.nepKlas2_3) { //najdonji stvara se srce(na toj poziciji) i mrkva(na nekoj)
        Postavke.srce.postavi(Postavke.neprijateljiNiz[i].x / 128, Postavke.neprijateljiNiz[i].y / 128);
        Postavke.srce.visible = true;
        Postavke.srce.timer = Date.now();
        let indeksPozicijaMrkve = Postavke.generateRandomNumberOd_0_do_i_9();
        Postavke.mrkvaHrana1.postavi(Postavke.mogucePozicijeVoca[indeksPozicijaMrkve][0], Postavke.mogucePozicijeVoca[indeksPozicijaMrkve][1]);
        Postavke.mrkvaHrana1.visible = true;
      }

      if (Postavke.neprijateljiNiz[i] == Postavke.nepKlas2_2) { //srednji srce
        Postavke.srce.postavi(Postavke.neprijateljiNiz[i].x / 128, Postavke.neprijateljiNiz[i].y / 128);
        Postavke.srce.visible = true;
        Postavke.srce.timer = Date.now();
      }

      if (Postavke.neprijateljiNiz[i] == Postavke.nepKlas2_1) { //tresnja
        let indeksPozicijaTresnje = Postavke.generateRandomNumberOd_0_do_i_9();
        Postavke.tresnjaHrana2.postavi(Postavke.mogucePozicijeVoca[indeksPozicijaTresnje][0], Postavke.mogucePozicijeVoca[indeksPozicijaTresnje][1]);
        Postavke.tresnjaHrana2.visible = true;

      }
      if (Postavke.neprijateljiNiz[i].constructor.name == "Neprijatelj1") { 
        for (let i = 0; i < Postavke.projektil.length; i++) {
          Postavke.projektil[i].visible = false;
        }
      }
    }
  }

  
  //srce prestaje bit vidljivo
  if (Date.now() - Postavke.srce.timer > Postavke.srce.duration && Postavke.srce.visible == true) {
    Postavke.srce.visible = false;
  }
  
  //skupljenje srca,hrane
  if (Postavke.slash.touching(Postavke.mrkvaHrana1)) {
    Postavke.slash.pokupiPredmet(Postavke.mrkvaHrana1)
  }
  if (Postavke.slash.touching(Postavke.tresnjaHrana2)) {
    Postavke.slash.pokupiPredmet(Postavke.tresnjaHrana2);
  }
  if (Postavke.slash.touching(Postavke.srce)) {
    Postavke.slash.pokupiPredmet(Postavke.srce);
  }
 

  // kada projektil neprijatelja2(hodaju) dotakne slasha
  for (let i = 0; i < Postavke.vatra.length; i++) { //provjera za svaki od projektila
    const p = Postavke.vatra[i];
    if (p.touching(Postavke.slash) && p.visible == true) {
      p.stop();
      Postavke.slash.zdravlje -= 10; 
      if (Postavke.slash.zdravlje != 0) {
        auZvuk.play();
        GameSettings.output("Upucan od kostura! Preostalo zdravlja: " + Postavke.slash.zdravlje);
      }
      Postavke.slash.start(20, 15); 
      break;
    }
  }
  
  // kada projektil neprijatelja1(lete) dotakne slasha
  for (let i = 0; i < Postavke.projektil.length; i++) { //provjera za svaki od projektila
    const p = Postavke.projektil[i];
    if (p.touching(Postavke.slash) && p.visible == true) {
      p.stop();
      Postavke.slash.zdravlje -= 20; 
      if (Postavke.slash.zdravlje != 0) {
        auZvuk.play();
        GameSettings.output("Upucan! Preostalo zdravlja: " + Postavke.slash.zdravlje);
      }
      Postavke.slash.start(11, 11); 
      break;
    }
  }
  


  //pucanje neprijatelja2
  const currentTime = Date.now();
  if (currentTime - lastCallTime >= interval) {
    Postavke.nepKlas2_1.pucanje(Postavke.slash.x, Postavke.slash.y, 5, 6, "pro2OruzjeD", "pro2OruzjeL", 200, 15) //gornji
    Postavke.nepKlas2_2.pucanje(Postavke.slash.x, Postavke.slash.y, 5, 4, "pro2OruzjeD", "pro2OruzjeL", 200, 15) //srednji 
    Postavke.nepKlas2_3.pucanje(Postavke.slash.x, Postavke.slash.y, 6, 3, "pro2OruzjeD", "pro2OruzjeL", 200, 15); //donji 
    lastCallTime = currentTime;
  }

  //pucanje letecih
  Postavke.leteci1.pucanje(Postavke.slash.x, Postavke.slash.y, 5, 4, "pro1OruzjeD", "pro1OruzjeL", 500, 50);
  Postavke.leteci2.pucanje(Postavke.slash.x, Postavke.slash.y, 5, 4, "pro1OruzjeD", "pro1OruzjeL", 500, 50);
  


  //prelazak na razinu 2
  let sviNevidljivi = Postavke.neprijateljiNiz.every(function (element) {
    return element.visible === false;
  });

  if (sviNevidljivi && Postavke.slash.touching(Postavke.kraj1) && Postavke.slash.bodovi >= 130 && !swalCalled) {
    noviLevelZvuk.play();
    GameSettings.output("------------------------------", true) 
    GameSettings.output("Druga razina!")
    GameSettings.output("Ostvareni bodovi: " + Postavke.slash.bodovi);
    GameSettings.output("Zdravlje: " + Postavke.slash.zdravlje)
    GameSettings.output("------------------------------")
    Postavke.slash.touching(Postavke.kraj1) == false;
  
    Postavke.bodovi = Postavke.slash.bodovi;
    Postavke.zdravlje = Postavke.slash.zdravlje;
    swalCalled = true;
    Swal.fire({
      title: 'Druga razina!',
      html: 'Prešao si prvu razinu!<br>Ostvareni bodovi: ' + Postavke.bodovi + ', Razina zdravlja: ' + Postavke.zdravlje + '<br><br>Partnerica Alix je oslobođena, ali sada si suočen s novim izazovom - zombiji i preostali morfi te napadaju. <br><b>Za poraz zombija, morat ćeš ih pogoditi dvaput.</b> ',
      icon: 'success',
      footer: 'Krećeš se strelicama. Pucaš sa slovom A.',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        swalCalled = false;
        GAME.setActiveWorldMap("mapa2");
        setupMapa2();
        render_main();
      }
    });

  }
}//mapa1





function mapa2() { 


  var auZvuk = document.getElementById('auZvukId'); 

  //kretanje slasha
  if (SENSING.left.active) {
    Postavke.slash2.moveLeft();
  }
  if (SENSING.right.active) {
    Postavke.slash2.moveRight();
  }
  if (SENSING.up.active) {
    Postavke.slash2.jump();
  }
  

  //pucanje slasha
  if (SENSING.keyA.active) { 
    macZvuk.play();
    if (Postavke.slash2.direction == 90 & Postavke.macL.moveL == false & Postavke.macD.moveD == false) { Postavke.slash2.pucaj(Postavke.macD); } 
    if (Postavke.slash2.direction == 270 & Postavke.macL.moveL == false & Postavke.macD.moveD == false) { Postavke.slash2.pucaj(Postavke.macL); }

  }



  //neprijatelji diraju Slasha
  for (let i = 2; i < Postavke.neprijateljiNiz.length; i++) { //za one koji setaju
    Postavke.neprijateljiNiz[i].touching();
  }
  Postavke.leteci1.touchingRaz2();
  Postavke.leteci2.touchingRaz2();


  //pucanje letecih
  Postavke.leteci1.pucanje(Postavke.slash2.x, Postavke.slash2.y, 5, 4, "pro1OruzjeD", "pro1OruzjeL", 350, 50);
  Postavke.leteci2.pucanje(Postavke.slash2.x, Postavke.slash2.y, 5, 4, "pro1OruzjeD", "pro1OruzjeL", 350, 50);
 


  // kada projektil  dotakne slasha
  for (let i = 0; i < Postavke.projektil.length; i++) { //provjera za svaki od projektila
    const p = Postavke.projektil[i];
    if (p.touching(Postavke.slash2) && p.visible == true) {
      p.stop();
      Postavke.slash2.zdravlje -= 20; 
      if (Postavke.slash2.zdravlje != 0) {
        auZvuk.play();
        GameSettings.output("Upucan! Preostalo zdravlja: " + Postavke.slash2.zdravlje);
      }
      Postavke.slash2.start(15, 16); 
      break;
    }
  }
 


   //ako slash upuca neprijatelja
  for (let i = 0; i < Postavke.neprijateljiNiz.length; i++) {
    if (((Postavke.macL.touching(Postavke.neprijateljiNiz[i]) && Postavke.macL.visible == true) || (Postavke.macD.touching(Postavke.neprijateljiNiz[i]) && Postavke.macD.visible == true))) {
      Postavke.macL.stop(); 
      Postavke.macD.stop();
      savladanZvuk.play(); 
      if (Postavke.neprijateljiNiz[i].constructor.name == "Neprijatelj1") { 
        let t = Postavke.slash2.bodovi + Postavke.neprijateljiNiz[i].vrijednot    
        Postavke.slash2.bodovi = t; 
        GameSettings.output("Bodovi: " + Postavke.slash2.bodovi)
        Postavke.neprijateljiNiz[i].visible = false; 
        for (let i = 0; i < Postavke.projektil.length; i++) {
          Postavke.projektil[i].visible = false;
        }
      }
      else if (Postavke.neprijateljiNiz[i].constructor.name == "NeprijateljRaz2") { 
        Postavke.neprijateljiNiz[i].zivoti = Postavke.neprijateljiNiz[i].zivoti - 1;
      }
    }
  }
 


  //pucanje nekih NeprijateljRaz2
  const currentTime2 = Date.now();
  if (currentTime2 - lastCallTime2 >= interval2) {
    //pucanje(x_sl, y_sl, x_domet, y_domet,"pro2OruzjeD","pro2OruzjeL",150,15)
    Postavke.nepRaz2_3.pucanje(Postavke.slash2.x, Postavke.slash2.y, 6, 5, "pro2OruzjeD", "pro2OruzjeL", 150, 15);
    Postavke.nepRaz2_4.pucanje(Postavke.slash2.x, Postavke.slash2.y, 7, 5, "pro2OruzjeD", "pro2OruzjeL", 150, 15);
    lastCallTime2 = currentTime2;
  }
 

  //pobjeda
  let sviNevidljivi = Postavke.neprijateljiNiz.every(function (element) {
    return element.visible === false;
  });

  if (sviNevidljivi && Postavke.slash2.bodovi > 160 && Postavke.slash2.zdravlje>0) {
    Postavke.bodovi = Postavke.slash2.bodovi;
    Postavke.zdravlje = Postavke.slash2.zdravlje;

    let pobjedaZvuk = document.getElementById('pobjedaZvukId');
    pobjedaZvuk.play();
    Swal.fire({
      title: 'Pobjeda!',
      html: 'Čestitamo na pobjedi!<br><b> Ostvareni bodovi: </b> ' + Postavke.bodovi + ', <b> Razina zdravlja: </b> ' + Postavke.zdravlje,
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      document.getElementById('btnStop').click();
      Postavke.bodovi = 0;
      Postavke.zdravlje = 100;
    });
  }
}

