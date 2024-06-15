//#region okvir
/// <reference path="../otter/lib-00-GameSettings.js"/>
/// <reference path="../otter/lib-01-tiled.js"/>
/// <reference path="../otter/lib-02-sensing.js"/>
/// <reference path="../otter/lib-03-display.js"/>
/// <reference path="../otter/lib-04-engine.js"/>
/// <reference path="../otter/lib-05-game.js"/>
/// <reference path="../otter/lib-06-main.js"/>
//#endregion



class Lik extends Sprite {       
  constructor(x, y, layer) {
    super(x + 4, y + 4, 128 - 8, 128 - 8); 
    if (this.constructor == Lik) { 
      throw new Error("Apstraktna klasa se ne može instancirati!");
    }
    //this.okvir = true; 
    this.frame_sets = {};
    this.layer = layer;
  }

  start(a, b) { //startna pozicija lika
    this.x = a * 128; 
    this.y = b * 128;
  }
}//Lik


class Slash extends Lik {     
  #zdravlje; 
  constructor(x, y, layer) {
    super(x, y, layer)
    this.frame_sets = {
      "up": [7],  
      "walk-up": [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41],
      "right": [7], 
      "walk-right": [7, 8, 9, 10, 11], 
      "down": [1],
      "walk-down": [1],
      "left": [1], 
      "walk-left": [1, 2, 3, 4, 5], 
    };

    this.visible = true; 
    this.direction = 90; 
    this.#zdravlje = 100; 
    this.bodovi = 0;

    // za kratko povecanje brzine livo-desno
    this.normalSpeed = 2.5; 
    this.speedMultiplier = 1; 
    this.speedDuration = 0; 
    //--

    //za kratko povecanje visine skoka
    this.normalJumpHeight = 110; 
    this.jumpHeightMultiplier = 1; 
    this.jumpHeightDuration = 0; 
    //----

  }//kons.

  get zdravlje() { return this.#zdravlje; } 
  set zdravlje(br) { 
    if (br <= 0) { 
      this.#zdravlje = 0; 
      btnStop_click(); 
      GameSettings.output("GAME OVER!");
      Postavke.bodovi = 0; 
      Postavke.zdravlje = 100;
      let gameoverZvuk = document.getElementById('gameoverZvukId');
      gameoverZvuk.play();
      Swal.fire({
        title: 'GAME OVER!',
        html: 'Pokušaj ponovo.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
    else if (br > 100) {
      this.#zdravlje = 100;
      GameSettings.output("Zdravlje je vec maksimalno.");
    }
    else { 
      this.#zdravlje = br;
    }
  }
  
  jump(h = 110) {
    if (!this.jumping) {
      this.jumping = true;
      this.velocity_y -= h;
    }
  }
 
  pucaj(p) {
    if (this.direction == 90) { p.start(this.x, this.y, "D"); }
    if (this.direction == 270) { p.start(this.x, this.y, "L"); }
  }
  

  pokupiPredmet(predmet) {
    let pokupljenoZvuk = document.getElementById('pokupljenoZvukId');
    pokupljenoZvuk.play();
    if (predmet.constructor === Hrana1) { //mrkva
      predmet.visible = false; 
      predmet.ubrzajSlasha(); // povecava brzinu  na 15 sekundi
      this.bodovi += predmet.dodatibodova; 
      GameSettings.output("Pokupljena mrkva! Brze se krecete lijevo-desno 15 sekundi. Dobili ste 20 bodova. Stanje bodova: " + this.bodovi);
    }
    else if (predmet instanceof Srce) {
      GameSettings.output("Pokupljeno srce! Uvecana razina zdravlja.")
      predmet.visible = false; 
      this.zdravlje = this.zdravlje + predmet.dodajZdravje;
      GameSettings.output("Razina zdravlja: " + this.zdravlje);
    }
    else if (predmet.constructor === Hrana2) { //tresnja
      predmet.visible = false; 
      predmet.povecajSkokSlasha(); // povecava visinu skoka na odredeno vrijeme
      predmet.ubrzajSlasha(); 
      this.bodovi += predmet.dodatibodova; 
      GameSettings.output("Pokupljena tresnja! Brze se krecete lijevo-desno i visina skoka je povecana na 15 sekundi. Dobili ste 10 bodova. Stanje bodova: " + this.bodovi);
    }
  }

  //----
  increaseSpeed(multiplier, duration) { 
    this.speedMultiplier = multiplier;
    this.speedDuration = duration;
    setTimeout(() => this.resetSpeed(), duration);
  }
  
  resetSpeed() {
    this.speedMultiplier = 1;
  }
  //--

  moveRight() {
    this.direction = 90;
    this.velocity_x += this.normalSpeed * this.speedMultiplier;
  }
  
  moveLeft() {
    this.direction = 270;
    this.velocity_x -= this.normalSpeed * this.speedMultiplier;
  }
  
  //---
  increaseJumpHeight(multiplier, duration) {   
    this.jumpHeightMultiplier = multiplier;
    this.jumpHeightDuration = duration;
    setTimeout(() => this.resetJumpHeight(), duration);
  }

  resetJumpHeight() { 
    this.jumpHeightMultiplier = 1;
  }
  //---
  
  jump(h = this.normalJumpHeight) {
    if (!this.jumping) {
      this.jumping = true;
      this.velocity_y -= h * this.jumpHeightMultiplier;
    }
  }
}//Slash



class Neprijatelj extends Lik {
  constructor(x, y, layer, maxLeft = 0, maxRight = 30, direction = -1, speed = 28) {
    super(x, y, layer)
    if (this.constructor == Neprijatelj) { 
      throw new Error("Apstraktna klasa se ne može instancirati");
    }
    this.maxLeft = maxLeft * 128;
    this.maxRight = maxRight * 128;
    this.direction = direction //1 za desno,-1 za livo
    this.speed = speed;
    this.puca = false;

  }//const.

  updatePosition() {

    //treba dodat promjenu animacija
   
    this.x +=  this.speed * this.direction;
    if (this.x + this.width > this.maxRight || this.x <= this.maxLeft) {
      this.direction *= -1; // Promjena smjera
    }
  }

  touching(iznos_stete,xSlasha,ySlasha,slash2_ili_slash) {  
    //prima koliko ce Sleshu oduzet zdravlja, koordinate di ce ga teleportirat i slash2 ili slash
    const dodirSlasha = super.touching(slash2_ili_slash);
    
    if (dodirSlasha && this.visible == true) {
      slash2_ili_slash.zdravlje -= iznos_stete;
  
      if (slash2_ili_slash.zdravlje != 0) {
        GameSettings.output("Preostalo zdravlja: " + slash2_ili_slash.zdravlje);
        let auZvuk = document.getElementById('auZvukId'); 
        auZvuk.play();
      }
      this.visible = true; 
      slash2_ili_slash.start(xSlasha, ySlasha);
      slash2_ili_slash.visible=true;
    }
  }
  
  pucanje(x_sl, y_sl, x_domet, y_domet,D_projektil,L_projektil,x_kretanje,y_kretanje) { 
    if (Math.abs(this.x - x_sl) < x_domet * 128 && Math.abs(this.y - y_sl) < y_domet * 128 && this.visible == true) { //ako si u radijusu slasha i ako si vidljiv pucaj
      if (!this.puca) { //da ne puca cijelo vrijeme
        this.puca = true;
        if (this.direction == 1) {
         
          let p = new Oruzje(GAME.getSpriteLayer(D_projektil)); 
          GAME.addSprite(p);
          p.rbr = Postavke.projektil.length;
          Postavke.projektil.push(p);
          
          p.moveD = true;
          p.y = this.y + y_kretanje;
          p.x = this.x + x_kretanje;
          p.direction = 90;
          p.put = 0;
          p.visible = true;
        }
        else {
          
          let p = new Oruzje(GAME.getSpriteLayer(L_projektil));
          GAME.addSprite(p);
          p.rbr = Postavke.projektil.length;
          Postavke.projektil.push(p);

          p.moveL = true;
          p.y = this.y + y_kretanje;
          p.x = this.x - x_kretanje;
          p.direction = 270;
          p.put = 0;
          p.visible = true;
        }
      }
      else {
        this.puca = false;
      }
    }
  }
}//Neprijatelj


class Neprijatelj1 extends Neprijatelj { //neprijatelji koji lete 
  #put
  constructor(x, y, layer, maxLeft = 0, maxRight = 30, direction = -1, speed = 25) { 
    super(x, y, layer, maxLeft, maxRight, direction, speed)
    this.frame_sets = {
      "up": [1],
      "walk-up": [1],
      "right": [1],
      "walk-right": [1, 2, 3, 4, 5], 
      "down": [1],
      "walk-down": [1],
      "left": [31], 
      "walk-left": [31, 32, 33, 34, 35] 
    };
    this.visible = true; 
   
  
    this.vrijednot = 20; //ovoliko bodova će Slash dobit
    this.steta = 10;
    this.xSlashaTeleRaz1=11;
    this.ySlashaTeleRaz1=11;
    this.xSlashaTeleRaz2=15;
    this.ySlashaTeleRaz2=16;
  }

  updatePosition() {
    super.updatePosition();
    if (this.direction < 0) { 
      this.changeFrameSet(this.frameSets("walk-left"), "loop", 5);
    }
    else { 
      this.changeFrameSet(this.frameSets("walk-right"), "loop", 5);
    }
  }
 
 
  touchingRaz1(){
     //touching(iznos_stete,xSlasha,ySlasha,slash2_ili_slash)
    super.touching(this.steta,this.xSlashaTeleRaz1,this.ySlashaTeleRaz1,Postavke.slash);
  }
  
  touchingRaz2() {
    super.touching(this.steta, this.xSlashaTeleRaz2, this.ySlashaTeleRaz2, Postavke.slash2);
  }
}//Neprijatelj1



class NeprijateljRaz2 extends Neprijatelj{
  #zivoti;
  constructor(x, y, layer, maxLeft=0 , maxRight =30, direction = -1, speed = 28) {  
    super(x, y, layer, maxLeft, maxRight, direction, speed)
    this.frame_sets = {
      "up": [1],
      "walk-up": [1],
      "right": [1], 
      "walk-right": [1, 2, 3, 4, 9, 6, 7, 8, 9, 10], 
      "down": [1],
      "walk-down": [1],
      "left": [12], 
      "walk-left": [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] 
    };
    this.visible=true;
    this.vrijednot = 40; // slash dobiva bodova
    this.#zivoti = 2; //tek kad ga slash pogodi 2 puta on nestane
    this.steta = 20;
    this.xSlashaTele=8;
    this.ySlashaTele=15;

  }
  get zivoti() { return this.#zivoti; }
  set zivoti(br) {
    if (br <= 0) { 
      this.#zivoti = 0;
      this.visible = false; 
      Postavke.slash2.bodovi = Postavke.slash2.bodovi + this.vrijednot; 
      GameSettings.output("Bodovi: " + Postavke.slash2.bodovi)
    }
    else { 
      this.#zivoti = br;
    }
  }

  updatePosition() {
    if (this.direction < 0) { 
      this.changeFrameSet(this.frameSets("walk-left"), "loop", 5);
    }
    else { 
      this.changeFrameSet(this.frameSets("walk-right"), "loop", 5);
    }

    super.updatePosition();
  }

  
  touching(){
    //iznos_stete,xSlasha,ySlasha,slash2_ili_slash
    super.touching(this.steta,this.xSlashaTele,this.ySlashaTele,Postavke.slash2);
  }
}//NeprijateljRaz2



class Neprijatelj2 extends Neprijatelj { //neprijatelji koji šetaju
  constructor(x, y, layer, maxLeft=0 , maxRight =30, direction = -1, speed = 28)  {
    super(x, y, layer, maxLeft, maxRight, direction, speed)
    this.frame_sets = {
      "up": [1],
      "walk-up": [1],
      "right": [91], 
      "walk-right": [91, 92, 93, 94, 95, 96, 97, 98, 99, 100], 
      "down": [1],
      "walk-down": [1],
      "left": [1], 
      "walk-left": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 
    };
    this.visible=true;
    this.vrijednot = 30; 
    this.steta = 10;

    this.velocity_y = 0;
    this.gravity = 0.5; 
    this.xSlashaTele=20;
    this.ySlashaTele=15;   
  }//kons.

  updatePosition() {
    if (this.direction < 0) { 
      this.changeFrameSet(this.frameSets("walk-left"), "loop", 5);
    }
    else { 
      this.changeFrameSet(this.frameSets("walk-right"), "loop", 5);
    }
   
    this.velocity_y +=this.gravity; 
    this.y += this.velocity_y;      //da pada doli 
    this.x +=  this.speed * this.direction;

    if (this.x + this.width > this.maxRight || this.x <= this.maxLeft) {
      this.direction *= -1; 
    }
  }

  touching(){
    //iznos_stete,xSlasha,ySlasha,slash2_ili_slash
    super.touching(this.steta,this.xSlashaTele,this.ySlashaTele,Postavke.slash);
  }
}//Neprijatelj2



class Mac extends Item { //za oružje glavnog lika
  #put;
  constructor(layer) {
    super(layer);
    this.visible = false; 
    this.moveD = false; 
    this.moveL = false; 
    this.#put = 0; 

    // ne možemo koristiti #collidedPlatform jer će se dogoditi greška
    // klasa Sprite nema svojstvo, a collidedPlatform se koristi na više mjesta
    this._collidedPlatform = "";
  }

  get collidedPlatform() {
    return this._collidedPlatform;
  }
  set collidedPlatform(v) {
    // ako dira platformu, onda string nije prazan već se radi o strani s koje je dira
    if (v != "") {
      // zaustavi projektil
      this.stop(); // vraća sve postavke za projektil
    }
    this._collidedPlatform = v;
  }

  get put() {
    return this.#put;
  }
  set put(v) {
    if (v >= 2 * 128) { 
      this.stop();
    }
    else {
      this.#put = v;
    }
  }
  updatePosition() {
    if (this.moveD) {
      this.x = this.x + 15;  
      this.put += 15;       
    }
    if (this.moveL) {
      this.x = this.x - 15;
      this.put += 15;

    }
  }
  start(x, y, orjentacija) { //na poziciju Slasha

    this.visible = true; 
    this.x = x;
    this.y = y;

    if (orjentacija == "D") {
      this.moveD = true; 
    }
    if (orjentacija == "L") {
      this.moveL = true;
    }
    this.put = 0; 
  }
  stop() {
    this.visible = false;
    this.moveL = false; 
    this.moveD = false;
  }
} //Mac



class Oruzje extends Mac { 
  #put;
  constructor(layer) {
    super(layer);
    this.put = 0;

  }
  get put() {
    return this.#put;
  }
  set put(v) {
    if (v >= 6 * 128) {
      this.#put = 0;
      this.stop(); // vraća sve postavke za projektil
    }
    else {
      this.#put = v;
    }
  }

  updatePosition() {
    if (this.moveD) {

      this.x += 20; 
      this.put += 20; 
      if(this.x>=29.5*128){
        this.visible=false;
      }
    }
    if (this.moveL) {
      this.x -= 20; 
      this.put += 20; 
      if(this.x<=0*128){
        this.visible=false;
      }
    }
  }
  stop() {
    this.visible = false;
    this.moveD = false; 
    this.moveL = false; 

    // popis svih likova u mapi
    let sprites = GAME.activeWorldMap.sprites;

    // izbaci onog koji staje (tako da se više ne crta)
    for (let i = sprites.length - 1; i >= 0; i--) {
      if (sprites[i] === this) {
        sprites.splice(i, 1); // brisanje i-tog elementa        

        Postavke.ukloniProjektil(this);
        break;
      }
    }

  }
}//Oruzje


class Predmeti extends Item { 
  constructor(layer) { 
    super(layer); 
    this.visible = false; 
  }
  updatePosition() { } 
  getType() {
    return this.constructor.name; 
  }
  postavi(a, b) {
    this.x = a * 128;
    this.y = b * 128;
  }
}


class Srce extends Predmeti {
  constructor(layer) { 
    super(layer);
    this.dodajZdravje = 10;
    this.timer = 0; //vrijeme kada je  postalo vidljivo
    this.duration = 3000; //koliko ms ce biti vidljivo
  }  
}


class Hrana1 extends Predmeti { //za mrkvu koja ubrzava Slasha lijevo-desno
  constructor(layer) { 
    super(layer);
    this.speedMultiplier = 2;
    this.duration = 15000; //15sek se brze krece
    this.dodatibodova = 20;  //dobiva bodova
  }
  ubrzajSlasha() {
    Postavke.slash.increaseSpeed(this.speedMultiplier, this.duration);
  }
}


class Hrana2 extends Hrana1 { //za tresnje koja ubrzava Slasha lijevo-desno i da moze skakat vise
  constructor(layer) { 
    super(layer);
    this.dodatibodova = 10;  
    this.jumpHeightMultiplier = 1.5; 
  }
  povecajSkokSlasha() {
    Postavke.slash.increaseJumpHeight(this.jumpHeightMultiplier, this.duration);
  }
}





