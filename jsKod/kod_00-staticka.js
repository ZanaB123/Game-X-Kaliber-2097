class Postavke {
  constructor() {
    if (this instanceof Postavke) {
      throw new Error("Statička klasa se ne smije instancirati!");
    }
  }

  /** @type {Slash} */
  static slash=null;  //glavni lik
  static slash2=null; //glavni lik za drugu razinu
  static bodovi=0;    //ako nikad nije pokrenuta rainua 1 
  static zdravlje=100;

  /** @type {Mac} */
  static macL=null;  //oružje glavnog lika
  static macD=null;

  /** @type {Oruzje} */
  static vatra=[];
  static ukloniProjektil(p){
    for (let i = Postavke.vatra.length - 1; i >= 0; i--) {
      if (Postavke.vatra[i] === p) {
        Postavke.vatra.splice(i, 1); //brisanje i-tog elementa       
        //console.log("uk");
        break; 
      }
    }
  }

  /** @type {Neprijatelj2} */
  static nepKlas2_1=null;  
  static nepKlas2_2=null; 
  static nepKlas2_3=null; 

  /** @type {Neprijatelj1} */
  static leteci1=null;
  static leteci2=null;
  static projektil =[];

 /** @type {NeprijateljRaz2} */   
  static nepRaz2 =null;   
  static nepRaz2_1=null;
  static nepRaz2_2=null;
  static nepRaz2_3=null;
  static nepRaz2_4=null;
  static nepRaz2_5=null;


  static neprijateljiNiz = [];

  
   /** @type {Kraj} */
  static kraj1=null;

  /** @type {Srce} */
  static srce=null;
  
   /** @type {Hrana1} */
  static mrkvaHrana1=null;

  /** @type {Hrana2} */
  static tresnjaHrana2=null;

  static mogucePozicijeVoca = [[12,2],[10,3],[9,4],[15,1],[18,2],[20,4],[21,2],[23,1],[20,9],[1,11]]; 


  static random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static generateRandomNumberOd_0_do_i_9() {
    return Math.floor(Math.random() * 10);
  }

}