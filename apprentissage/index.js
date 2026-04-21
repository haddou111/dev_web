window.onload = function() {
  document.querySelector("h1").style.color="bleu";
};
// ca est un commentaire dans notre script de js 

console.log("haddou outalha ");
console.error(" ca est une grande erreur effectuer ");

console.table(["haddou","anns","nassime","mohammed"]);

function ditbonjour(chaine){
    window.alert("bonjour " + chaine + "profitée dans notre website ");
}

let Name="haddou outalha ";
let title="elziro";
let description="elzero web school";
let date="25/10";

let divparent=document.querySelector("#divpar");
let NamePlace=divparent.querySelector("h3");
let titlePlace=divparent.querySelector(".name");
let descriptionPlace=divparent.querySelector(".description");
let timePlace=divparent.querySelector("span");

NamePlace.textContent=Name;
titlePlace.textContent=title;
descriptionPlace.textContent=description;
timePlace.textContent=date;

let a=10;
let b="20";
let c=80;
console.log(++a + +b++ + +c++ - +a++);
console.log(a,b,c);
