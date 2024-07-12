const getTodaysWordUrl = "https://words.dev-apis.com/word-of-the-day";
const postWordUrl = "https://words.dev-apis.com/validate-word";
let wordParts = "";
let currentGuess = "";
let answerLength = 5;
let guessWordNumber = 0;
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

async function getTodaysWord() {
  try {
    document.getElementById("spiral").style.display = "block";
    const promise = await fetch(getTodaysWordUrl);
    const json = await promise.json();
    const word = json.word;
    todaysWord = word.toUpperCase();
    wordParts = todaysWord.split("");
    document.getElementById("spiral").style.display = "none";
  } catch (error) {
    console.log("error yakalandi:", error);
  }
}

async function postWord(word) {
  try {
    document.getElementById("spiral").style.display = "block";
    const promise = await fetch(postWordUrl, {
      method: "POST",
      body: JSON.stringify({
        word: word,
      }),
    });
    const json = await promise.json();
    console.log(json);
    document.getElementById("spiral").style.display = "none";
    return json;
  } catch (error) {
    console.log("error yakalandi:", error);
  }
}

function addLetter(letter) {
  const dNum = guessWordNumber * 5 + currentGuess.length;
  if (currentGuess.length < answerLength) {
    document.getElementById(`letter-${dNum}`).innerText = letter;
    currentGuess += letter;
  } else {
    document.getElementById(`letter-${dNum - 1}`).innerText = letter;
    let currentGuessArray = currentGuess.split(""); // Stringi array'e çevir
    currentGuessArray[4] = letter; // Belirtilen pozisyondaki karakteri değiştir
    currentGuess = currentGuessArray.join("");
  }
}

async function commit() {
  const json = await postWord(currentGuess);
  const validate = json.validWord;
  const flashNum = guessWordNumber * 5;
  let arr = [flashNum, flashNum + 1, flashNum + 2, flashNum + 3, flashNum + 4];
  if (validate) {
    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);
    for (i = 0; i < answerLength; i++) {
      console.log(guessParts[i], "  ", wordParts[i]);
      if (guessParts[i] == wordParts[i]) {
        document
          .getElementById(`letter-${flashNum + i}`)
          .classList.add("correct");
        map[guessParts[i]]--;
      }
    }
    for (i = 0; i < answerLength; i++) {
      if (guessParts[i] == wordParts[i]) {
      } else if (map[guessParts[i]] && map[guessParts[i]] > 0) {
        document
          .getElementById(`letter-${flashNum + i}`)
          .classList.add("close");
        map[guessParts[i]]--;
      } else {
        document
          .getElementById(`letter-${flashNum + i}`)
          .classList.add("wrong");
      }
    }
    guessWordNumber++;
    currentGuess = "";
  } else {
    arr.forEach((e) => {
      document.getElementById(`letter-${e}`).classList.add("invalid");
      setTimeout(() => {
        document.getElementById(`letter-${e}`).classList.remove("invalid");
      }, 1500);
    });
  }
}

function backspace() {
  if (currentGuess.length !== 0) {
    const dNum = guessWordNumber * 5 + currentGuess.length;
    document.getElementById(`letter-${dNum - 1}`).innerText = "";
    currentGuess = currentGuess.slice(0, -1);
  }
}

async function init() {
  await getTodaysWord();
  document.addEventListener("keydown", function (event) {
    const action = event.key;

    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    }
  });
}
function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}
init();
