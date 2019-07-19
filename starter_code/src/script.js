// DOM -----------------------------------------------------
const history = document.getElementById('history');
const options = document.getElementById('options');
const board = document.getElementById('board');


// HTML functions -----------------------------------------
const buffer = [];
let isPrinting = false;

function printBuffer() {
  if (!buffer.length || isPrinting) {
    return;
  }

  isPrinting = true;

  const currentPhrase = buffer.shift();
  let i = 0;
  const intervalId = setInterval(() => {
    history.innerHTML += currentPhrase[i];
    i++;

    if (i <= currentPhrase.length - 1) {
      return;
    }

    history.innerHTML += '<br>';
    clearInterval(intervalId);
    isPrinting = false;
    printBuffer();
  }, 60);
}

function print(phrase) {
  buffer.push(phrase);
  printBuffer();
}


function optionsBtn(optionsArray) {
  options.innerHTML = '';

  optionsArray.forEach((element) => {
    let option = document.createElement('button');
    option.type = 'button';
    option.classList.add('btn', 'btn-outline-success', 'col-12', 'col-md-3');
    option.textContent = element.text || '';
    option.onclick = () => {
      element.callback(option);
      // option.setAttribute("disabled", "disabled"); ------ DELETAR ------
      // options.innerHTML = ''; ------ DELETAR ------
    };
    options.appendChild(option);
  });
}

let scrolled = false;
function updateScroll() {
  if (!scrolled) {
    board.scrollTop = board.scrollHeight;
    scrolled = false;
  }
}

setInterval(updateScroll, 100);

// board.onscroll = function() {
//   scrolled=true;
// };


// Game levels ----------------------------------------------
const gameDificulties = {
  easy: {
    dificulty: 'easy',
    rollCheck: 12,
    enemyhitPoints: 10,
    enemyWeapon: 'cimitarra',
    enemyDiceAttack: 6,
    habilityChances: 3,
  },
  medium: {
    dificulty: 'medium',
    rollCheck: 14,
    enemyhitPoints: 14,
    enemyWeapon: 'espada longa',
    enemyDiceAttack: 8,
    habilityChances: 2,
  },
  hard: {
    dificulty: 'hard',
    rollCheck: 16,
    enemyhitPoints: 18,
    enemyWeapon: 'machado grande',
    enemyDiceAttack: 12,
    habilityChances: 1,
  },
};

let gameDificulty = gameDificulties.easy;

function easyGame() {
  gameDificulty = gameDificulties.easy;
  print('Modo fácil escolhido.');
  begin();
}

function mediumGame() {
  gameDificulty = gameDificulties.medium;
  print('Modo médio escolhido.');
  begin();
}

function hardGame() {
  gameDificulty = gameDificulties.hard;
  print('Modo difícil escolhido.');
  begin();
}


// Game functions ------------------------------------------
let days = 0;

function rollDice(sides) {
  const roll = Math.ceil(Math.random() * sides);
  print(`O número rolado no dado de ${sides} lados (d${sides}) foi ${roll}.`);
  return roll;
}

function d20Check() {
  const roll = rollDice(20);
  const dificulty = gameDificulty.rollCheck;
  const check = roll >= dificulty;

  if (roll === 1) {
    print('Falhou miseravelmente.');
    return 'fail';
  }

  if (roll === 20) {
    print('Uau! Um crítico. Fenomenal!');
    return 'critical';
  }

  return check;
}


// Classes --------------------------------------------------
class Character {
  constructor(name, hitPoints, diceAttack, weapon) {
    this.name = name;
    this.hitPoints = hitPoints;
    this.diceAttack = diceAttack;
    this.weapon = weapon;
    this.life = true;
    this.habilityChances = gameDificulty.habilityChances;
    this.currentLocation = 'casa do prefeito';
  }

  attack() {
    const check = d20Check();

    if (check === 'fail') {
      print(`${this.name} derrubou seu(sua) ${this.weapon} no chão.`);
      return false;
    }

    if (check === 'critical') {
      print(`${this.name} acertou seu inimigo com maestria.`);
      return 30;
    }

    if (check === true) {
      print(`${this.name} acertou o golpe de ${this.weapon}.`);
      return rollDice(this.diceAttack);
    // eslint-disable-next-line no-else-return
    } else {
      print('Não foi dessa vez.');
      return false;
    }
  }

  receiveDamage(damage) {
    if (damage) this.hitPoints -= damage;
    if (this.hitPoints < 1) this.life = false;
    this.life ? print(`${this.name} recebeu ${damage} ponto(s) de dano.`) : print(`${this.name} levou um golpe mortal.`);
    return damage;
  }

  hability() {
    let check = false;
    if (this.habilityChances > 0) {
      check = d20Check();
      if (check) {
        print(`${this.name} passou no teste.`);
        this.habilityChances = gameDificulty.habilityChances;
      } else {
        this.habilityChances--;
        print('Não foi dessa vez.');
      }
    } else {
      print(`${this.name} se esforçou muito e por fim acabou desistindo, mas voltou no dia seguinte para tentar novamente.`);
      this.habilityChances = gameDificulty.habilityChances;
    }
    return check;
  }
}

let player = new Character('Ariel', 10, 8, 'rapieira');
let enemy = new Character('Sequestrador', gameDificulty.enemyhitPoints, gameDificulty.enemyDiceAttack, gameDificulty.enemyWeapon);
let daughter = new Character('Beatrice', 10, 4, 'adaga');


// Start Game ----------------------------------------------
function start() {
  player = new Character('Ariel', 10, 8, 'rapieira');
  enemy = new Character('Sequestrador', gameDificulty.enemyhitPoints, gameDificulty.enemyDiceAttack, gameDificulty.enemyWeapon);

  print('Escolha a dificuldade do jogo.')
  optionsBtn([
    {
      text: 'Fácil',
      callback: easyGame,
    },
    {
      text: 'Médio',
      callback: mediumGame,
    },
    {
      text: 'Difícil',
      callback: hardGame,
    },
  ]);
}
