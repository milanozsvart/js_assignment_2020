const shapes = ["oval", "triangle", "wavy"];
const colours = ["red", "green", "purple"];
const quantities = [1, 2, 3];
const contents = ["full", "striped", "empty"];

let konnyuPakli = [];
let nehezPakli = [];

const createKonnyuPakli = () => {
  for (shape in shapes) {
    for (colour in colours) {
      for (quantity in quantities) {
        konnyuPakli.push({
          shape: shapes[shape],
          colour: colours[colour],
          quantity: quantities[quantity],
        });
      }
    }
  }
};

const createNehezPakli = () => {
  for (shape in shapes) {
    for (colour in colours) {
      for (quantity in quantities) {
        for (content in contents) {
          nehezPakli.push({
            shape: shapes[shape],
            colour: colours[colour],
            quantity: quantities[quantity],
            content: contents[content],
          });
        }
      }
    }
  }
};

//-------------CREATING VARIABLES-----------------
const mainTitle = document.querySelector(".main-title");
const secondTitle = document.querySelector(".second-title");
const nextBtn = document.querySelector("#next");
const startBtn = document.querySelector("#start");
const difficultyBtns = document.querySelectorAll(".difficulty");
const gameModeBtns = document.querySelectorAll(".gamemode");
const numOfPlayersInput = document.querySelector("#num-of-players");
const helpChecks = document.querySelectorAll(".help-check");
const playerNames = document.querySelector(".player-names");
const automateCard = document.querySelector("#automate-card");
const game = document.querySelector(".game");
const cards = document.querySelectorAll(".card");
const playerContainer = document.querySelector(".player-container");
const tableOfGame = document.querySelector(".table-of-game");
const hintsContainer = document.querySelector(".hints-container");
const isThereSetBtn = document.querySelector("#isthereset");
const whereIsSetBtn = document.querySelector("#whereisset");
const isThereSetCheckBox = document.querySelector("#is-there-set");
const whereIsSetCheckBox = document.querySelector("#points-at-set");
const hintSpan = document.querySelector("#hint-span");
const rulesBtn = document.querySelector("#rules");
const rulesToggle = document.querySelector(".rules-toggle");
let difficultyOfGame = "advanced";
let gameModeOfGame = "not-defined-yet";
let selectedPlayer = "";
let setOfGame = [];
let numberOfPlayersOfGame = 0;
let playerPoints = [];
let playersOfGame = [];
let inPlayCard = [];
let selectedCardsForSet = [];
let selectedColours = [];
let selectedShapes = [];
let selectedQuantites = [];
let selectedContents = [];
let selectedCardsAsObjects = [];

//---------------ADDING EVENT LISTENERS----------

//when hitting NEXT button on main-title div
nextBtn.addEventListener("click", () => {
  //checking if user entered a valid player amount
  if (numOfPlayersInput.value < 1 || numOfPlayersInput.value > 10) {
    alert("A játékosok száma minimum 1, maximum 10 fő lehet.");
  } else if (gameModeOfGame === "not-defined-yet") {
    alert("Válassz játékmódot");
  } else {
    secondTitle.style.display = "flex";
    mainTitle.style.display = "none";
    numberOfPlayersOfGame = numOfPlayersInput.value;
    //if gamemode is race, hints are not available
    if (gameModeOfGame === "race") {
      helpChecks.forEach((check) => {
        check.disabled = true;
        automateCard.checked = true;
      });
    }
    //displaying the names of the players
    for (let i = 1; i <= numOfPlayersInput.value; i++) {
      let element = document.createElement("input");
      element.type = "text";
      element.value = `Játékos${i}`;
      element.className = "player-input";
      playerNames.appendChild(element);
    }
  }
});

//difficulty gets selected
difficultyBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    //removing all styling from buttons
    difficultyBtns.forEach((btn2) => {
      btn2.classList.remove("selected");
    });
    //adding the correct styling to the pressed button
    e.currentTarget.classList.add("selected");
    //setting in-game variable
    difficultyOfGame = e.currentTarget.id;
  });
});

//gamemode gets selected
gameModeBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    //removing all styling from buttons
    gameModeBtns.forEach((btn2) => {
      btn2.classList.remove("selected");
    });
    //adding the correct styling to the pressed button
    e.currentTarget.classList.add("selected");
    //setting in-game variable
    gameModeOfGame = e.currentTarget.id;
  });
});

//starting the game, hitting START button
startBtn.addEventListener("click", () => {
  const playerInputs = document.querySelectorAll(".player-input");
  const playerInputArray = Array.from(playerInputs);
  //searching for same names
  let areThereSameNames = false;
  for (let i = 0; i < playerInputArray.length; i++) {
    for (let j = 0; j < playerInputArray.length; j++) {
      if (playerInputArray[i].value === playerInputArray[j].value && i !== j) {
        areThereSameNames = true;
      }
    }
  }
  //checking if there are matching names
  if (areThereSameNames) {
    alert(
      "Több játékosnak ugyanazt a nevet adtad. Kérlek válassz egyedi neveket, hogy a játék során egyértelműen ki tudd választani, ki jön éppen."
    );
  } else {
    //pushing the names into an array
    playerInputs.forEach((input) => {
      playersOfGame.push(input.value);
      playerPoints.push(0);
    });
    //starting the game
    game.style.display = "flex";
    secondTitle.style.display = "none";
    hints();
    gamePlay();
  }
});

//--------FUNCTIONS FOR EVENT LISTENERS
//the actual gameplay
const gamePlay = () => {
  if (difficultyOfGame === "beginner") {
    createKonnyuPakli();
    cardDealer("beginner");
  } else if (difficultyOfGame === "advanced") {
    createNehezPakli();
    cardDealer("advanced");
  }
};

// dealing out the right set of cards
//--------------
// This function is responsible for setting up the initial 12 cards from the already-created deck.
// I am making a set object from the konnyuPakli and nehezPakli arrays, because removing elements from arrays
// often leave "undefined" empty holes. I select the element from the array, then delete the very same element
// from the set. After this I convert the set back to an array, so the deleted element will be deleted also
// from the array. This way I won't have empty holes of "undefined" in the arrays, and the size of the arrays will also
// decrease.
//---------------
const cardDealer = (diff) => {
  playerSetter();
  if (diff === "beginner") {
    number = 27;
    let randomNumber = Math.floor(Math.random() * number);
    for (let i = 0; i < 12; i++) {
      // creating a set from the pakli-array
      let setOfKonnyuPakli = new Set(konnyuPakli);
      // selecting a random card from an array
      let gameCard = konnyuPakli[randomNumber];
      // pushing the selected card into an array -- these cards will be displayed
      // in the game on the screen
      inPlayCard.push(gameCard);
      // deleting the selected card from the set
      setOfKonnyuPakli.delete(gameCard);
      // creating a new array from the set
      konnyuPakli = Array.from(setOfKonnyuPakli);
      // decreasing the number, because there will be fewer cards to choose from
      number--;
      randomNumber = Math.floor(Math.random() * number);
    }
  } else if (diff === "advanced") {
    number = 81;
    let randomNumber = Math.floor(Math.random() * number);
    for (let i = 0; i < 12; i++) {
      let setOfNehezPakli = new Set(nehezPakli);
      let gameCard = nehezPakli[randomNumber];
      inPlayCard.push(gameCard);
      setOfNehezPakli.delete(gameCard);
      nehezPakli = Array.from(setOfNehezPakli);
      number--;
      randomNumber = Math.floor(Math.random() * number);
    }
  }
  cardBgSetUp(diff);
  cardSelector();
};

const playerSetter = () => {
  for (player in playersOfGame) {
    let playerDiv = document.createElement("div");
    playerDiv.className = "player-info";
    playerDiv.id = playersOfGame[player];
    let playerDivText = document.createTextNode(playersOfGame[player]);
    let playerSpan = document.createElement("span");
    playerSpan.appendChild(playerDivText);
    playerDiv.appendChild(playerSpan);
    let pointsSpan = document.createElement("span");
    pointsSpan.id = player;
    let pointsSpanText = document.createTextNode(playerPoints[player]);
    pointsSpan.appendChild(pointsSpanText);
    pointsSpan.className = "points-counter";
    playerContainer.appendChild(playerDiv);
    playerContainer.appendChild(pointsSpan);
  }
  selectPlayer();
};

// setting background-images for the cards displayed regarding the cards taking place in the inPlayCards[] array
const cardBgSetUp = (diff) => {
  let i = 0;
  if (diff === "beginner") {
    cards.forEach((card) => {
      // setting the background-image of the card element
      card.style.backgroundImage = `url(img/${inPlayCard[i].colour}-${inPlayCard[i].shape}-${inPlayCard[i].quantity}-full.svg)`;
      // setting up dataset properties to the cards for easier handling
      card.dataset.colour = inPlayCard[i].colour;
      card.dataset.shape = inPlayCard[i].shape;
      card.dataset.quantity = inPlayCard[i].quantity;
      i++;
    });
  } else if (diff === "advanced") {
    cards.forEach((card) => {
      // setting the background-image of the card element
      card.style.backgroundImage = `url(img/${inPlayCard[i].colour}-${inPlayCard[i].shape}-${inPlayCard[i].quantity}-${inPlayCard[i].content}.svg)`;
      // setting up dataset properties to the cards for easier handling
      card.dataset.colour = inPlayCard[i].colour;
      card.dataset.shape = inPlayCard[i].shape;
      card.dataset.quantity = inPlayCard[i].quantity;
      card.dataset.content = inPlayCard[i].content;
      i++;
    });
  }
};

//setting what happens when a player clicks on a card
const cardSelector = () => {
  // num represents the number of cards selected
  let num = 0;
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // handling the situation when no player is selected
      if (selectedPlayer === "") {
        alert("Nincs kiválasztva játékos! Kérlek válaszd ki, ki jön éppen!");
      } else {
        //toogling the current style to the selected card
        e.currentTarget.classList.toggle("card-selected");
        if (e.currentTarget.classList.contains("card-selected")) {
          num++;
        } else {
          num--;
        }
        // if 3 cards have been selected
        if (num === 3) {
          cards.forEach((card2) => {
            if (card2.classList.contains("card-selected")) {
              // pushing the card's properties to different arrays for determining if it is a set or not
              selectedCardsForSet.push(card2);
              selectedColours.push(card2.dataset.colour);
              selectedShapes.push(card2.dataset.shape);
              selectedQuantites.push(card2.dataset.quantity);
              if (difficultyOfGame === "advanced") {
                selectedContents.push(card2.dataset.content);
                selectedCardsAsObjects.push({
                  shape: card2.dataset.shape,
                  colour: card2.dataset.colour,
                  quantity: parseInt(card2.dataset.quantity),
                  content: card2.dataset.content,
                });
              } else if (difficultyOfGame === "beginner") {
                selectedCardsAsObjects.push({
                  shape: card2.dataset.shape,
                  colour: card2.dataset.colour,
                  quantity: parseInt(card2.dataset.quantity),
                });
              }
            }
          });
          // setting num back to zero, and waiting for the next selection of 3 cards
          num = 0;
          // remove style from all cards
          cards.forEach((card3) => {
            card3.classList.remove("card-selected");
          });
          afterSelectedASet();
          // setting back the arrays to empty
          selectedCardsForSet = [];
          selectedColours = [];
          selectedContents = [];
          selectedQuantites = [];
          selectedShapes = [];
          selectedCardsAsObjects = [];
        }
      }
    });
  });
};

const isSet = () => {
  let booleanSet = false;
  let booleanColour = selectedColours.every((colour) => {
    return colour === selectedColours[0];
  });
  let booleanShape = selectedShapes.every((shape) => {
    return shape === selectedShapes[0];
  });
  let booleanQuantity = selectedQuantites.every((quantity) => {
    return quantity === selectedQuantites[0];
  });
  let booleanContent = selectedContents.every((content) => {
    return content === selectedContents[0];
  });
  let setOfColours = new Set(selectedColours);
  let setOfShapes = new Set(selectedShapes);
  let setOfQuantities = new Set(selectedQuantites);
  let setOfContents = new Set(selectedContents);
  if (difficultyOfGame === "beginner") {
    if (
      (setOfColours.size === selectedColours.length ||
        booleanColour === true) &&
      (setOfShapes.size === selectedShapes.length || booleanShape === true) &&
      (setOfQuantities.size === selectedQuantites.length ||
        booleanQuantity === true)
    ) {
      booleanSet = true;
    }
  } else if (difficultyOfGame === "advanced") {
    if (
      (setOfColours.size === selectedColours.length ||
        booleanColour === true) &&
      (setOfShapes.size === selectedShapes.length || booleanShape === true) &&
      (setOfQuantities.size === selectedQuantites.length ||
        booleanQuantity === true) &&
      (setOfContents.size === selectedContents.length ||
        booleanContent === true)
    ) {
      booleanSet = true;
    }
  }

  return booleanSet;
};

const afterSelectedASet = () => {
  if (isSet()) {
    plusPoint();
    deSelectPlayer();
    plusCards("beginner");
  } else {
    minusPoint();
    deSelectPlayer();
  }
  hintSpan.innerText = "";
  console.log(isThereSetInTheGame());
};

const isEqualObject = (a, b) => {
  let aProp = Object.getOwnPropertyNames(a);
  let bProp = Object.getOwnPropertyNames(b);

  for (let i = 0; i < aProp.length; i++) {
    let propName = aProp[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
};

const selectPlayer = () => {
  const playerInfo = document.querySelectorAll(".player-info");
  if (Array.from(playerInfo).length === 1) {
    selectedPlayer = playerInfo[0].id;
    playerInfo[0].classList.add("selected");
  }
  playerInfo.forEach((info) => {
    info.addEventListener("click", (e) => {
      selectedPlayer = e.currentTarget.id;
      playerInfo.forEach((info2) => {
        info2.classList.remove("selected");
      });
      e.currentTarget.classList.add("selected");
    });
  });
};

const deSelectPlayer = () => {
  const playerInfo = document.querySelectorAll(".player-info");
  if (playerInfo.length > 1) {
    playerInfo.forEach((info) => {
      info.classList.remove("selected");
    });
    selectedPlayer = "";
  }
};

const plusPoint = () => {
  for (player in playersOfGame) {
    if (playersOfGame[player] == selectedPlayer) {
      playerPoints[player]++;
    }
  }
  const pointsOfPlayersContainer = document.querySelectorAll(".points-counter");
  pointsOfPlayersContainer.forEach((item) => {
    let pointText = document.createTextNode(playerPoints[item.id]);
    item.innerHTML = "";
    item.appendChild(pointText);
  });
};

const minusPoint = () => {
  for (player in playersOfGame) {
    if (playersOfGame[player] == selectedPlayer) {
      playerPoints[player]--;
    }
  }
  const pointsOfPlayersContainer = document.querySelectorAll(".points-counter");
  pointsOfPlayersContainer.forEach((item) => {
    let pointText = document.createTextNode(playerPoints[item.id]);
    item.innerHTML = "";
    item.appendChild(pointText);
  });
};

const plusCards = (diff) => {
  if (diff === "beginner") {
    if (konnyuPakli.length > 2) {
      let setOfKonnyuPakli = new Set(konnyuPakli);
      let number = setOfKonnyuPakli.size;
      let randomNumber = Math.floor(Math.random() * number);
      for (let i = 0; i < 3; i++) {
        let gameCard = konnyuPakli[randomNumber];
        inPlayCard.push(gameCard);
        setOfKonnyuPakli.delete(gameCard);
        konnyuPakli = Array.from(setOfKonnyuPakli);
        number--;
        randomNumber = Math.floor(Math.random() * number);
      }
    }
  } else if (diff === "advanced") {
    if (nehezPakli.length > 2) {
      let setOfNehezPakli = new Set(nehezPakli);
      let number = setOfNehezPakli.size;
      let randomNumber = Math.floor(Math.random() * number);
      for (let i = 0; i < 3; i++) {
        let gameCard = nehezPakli[randomNumber];
        inPlayCard.push(gameCard);
        setOfNehezPakli.delete(gameCard);
        nehezPakli = Array.from(setOfNehezPakli);
        number--;
        randomNumber = Math.floor(Math.random() * number);
      }
    }
  }
  deleteExistingCards();
  if (konnyuPakli.length > 2 || inPlayCard.length === 12) {
    cardBgSetUp(difficultyOfGame);
  } else if (
    nehezPakli.length < 2 &&
    konnyuPakli.length < 2 &&
    inPlayCard.length < 12
  ) {
    cardRemover();
    if (!isThereSetInTheGame()) {
      alert("Nincs több SET, játék vége");
      tableOfGame.style.display = "none";
    }
  }
};

const deleteExistingCards = () => {
  for (let i = 0; i < inPlayCard.length; i++) {
    for (let j = 0; j < selectedCardsAsObjects.length; j++) {
      if (isEqualObject(inPlayCard[i], selectedCardsAsObjects[j])) {
        delete inPlayCard[i];
        i++;
      }
    }
  }
  inPlayCard = inPlayCard.filter((card) => {
    return card != null;
  });
};

const cardRemover = () => {
  selectedCardsForSet.forEach((card) => {
    card.remove();
  });
};

const isThereSetInTheGame = () => {
  l = false;
  for (i in inPlayCard) {
    for (j in inPlayCard) {
      for (k in inPlayCard) {
        if (i !== j && i !== k && j !== k) {
          if (
            ((inPlayCard[i].colour === inPlayCard[j].colour &&
              inPlayCard[i].colour === inPlayCard[k].colour) ||
              (inPlayCard[i].colour !== inPlayCard[j].colour &&
                inPlayCard[i].colour !== inPlayCard[k].colour &&
                inPlayCard[j].colour !== inPlayCard[k].colour)) &&
            ((inPlayCard[i].shape === inPlayCard[j].shape &&
              inPlayCard[i].shape === inPlayCard[k].shape) ||
              (inPlayCard[i].shape !== inPlayCard[j].shape &&
                inPlayCard[i].shape !== inPlayCard[k].shape &&
                inPlayCard[j].shape !== inPlayCard[k].shape)) &&
            ((inPlayCard[i].quantity === inPlayCard[j].quantity &&
              inPlayCard[i].quantity === inPlayCard[k].quantity) ||
              (inPlayCard[i].quantity !== inPlayCard[j].quantity &&
                inPlayCard[i].quantity !== inPlayCard[k].quantity &&
                inPlayCard[j].quantity !== inPlayCard[k].quantity))
          ) {
            if (difficultyOfGame === "beginner") {
              l = true;
              setOfGame = [
                `${+i + 1}. kártya`,
                ` ${+j + 1}. kártya`,
                ` ${+k + 1}. kártya`,
              ];
            } else if (difficultyOfGame === "advanced") {
              if (
                (inPlayCard[i].content === inPlayCard[j].content &&
                  inPlayCard[i].content === inPlayCard[k].content) ||
                (inPlayCard[i].content !== inPlayCard[j].content &&
                  inPlayCard[i].content !== inPlayCard[k].content &&
                  inPlayCard[j].content !== inPlayCard[k].content)
              ) {
                l = true;
                setOfGame = [
                  `${+i + 1}. kártya`,
                  ` ${+j + 1}. kártya`,
                  ` ${+k + 1}. kártya`,
                ];
              }
            }
          }
        }
      }
    }
  }
  return l;
};

const cardAdder = () => {
  for (let i = 0; i < 3; i++) {
    let cardDiv = document.createElement("div");
    cardDiv.class = "card";
    cardDiv.id = `${12 + i + 1}`;
  }
  cardBgSetUp(difficultyOfGame);
};

const hints = () => {
  if (gameModeOfGame === "race") {
    hintsContainer.style.display = "none";
  } else if (gameModeOfGame === "sandbox") {
    if (isThereSetCheckBox.checked === false) {
      isThereSetBtn.style.cursor = "not-allowed";
      isThereSetBtn.classList.add("disabled");
    } else if (isThereSetCheckBox.checked) {
      isThereSetBtn.addEventListener("click", () => {
        if (isThereSetInTheGame()) {
          hintSpan.innerText = "Van SET, meg fogod találni! :)";
        } else {
          hintSpan.innerText = "Sajnos nincs SET :(";
        }
      });
    }
    if (whereIsSetCheckBox.checked === false) {
      whereIsSetBtn.style.cursor = "not-allowed";
      whereIsSetBtn.classList.add("disabled");
    } else if (whereIsSetCheckBox.checked) {
      whereIsSetBtn.addEventListener("click", () => {
        isThereSetInTheGame();
        console.log(setOfGame);
        hintSpan.innerText = setOfGame;
      });
    }
  }
};

rulesBtn.addEventListener("click", () => {
  rulesToggle.classList.toggle("block");
});
