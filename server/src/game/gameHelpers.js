
const GAME_STATES = {
  LOBBY: 'LOBBY', // after here we will set spies and game code, introduce the rules
  ROUND_CHOOSE_ROOM: 'ROUND_CHOOSE_ROOM', // vote on which room to go into
  ROUND_ENTER_CODE: 'ROUND_ENTER_CODE', // enter a code into the game
  // ROUND_KILL: 'ROUND_KILL'
  // no round game over, just move them to a gameover slide -> credits -> play again prompt -> lobby
};

const MIN_PLAYERS_PER_GAME = 5;
const MAX_PLAYERS_PER_GAME = 10;
const TOTAL_ROUNDS = 5;
const CHARSET = 'BCDFGHJKLMNPQRSTVWXYZ'; // no vowels

const makeRandomArray = (length, range) => {
  var arr = [];
  while (arr.length < length) {
    let c = Math.floor(Math.random() * range);
    if (arr.indexOf(c) === -1) arr.push(c);
  }
  return arr;
}

const makeCode = (codeLength, charset = CHARSET) => {
  const arr = makeRandomArray(codeLength, charset.length);
  return arr.map(c => charset[c]).join('');
}

const makeFakeCode = (realCode) => {
  let fakeCharset = CHARSET;
  for (let i = 0; i < realCode.length; ++i) {
    fakeCharset = fakeCharset.replace(realCode[i], '');
  }
  return makeCode(realCode.length, fakeCharset);
}


const calcSpyCount = (playerCount) => {
  // 5 or 6 players 2 spies
  // 7 or 8 players 3 spies
  // 9 o 10 players 4 spies
  return Math.floor((playerCount - 1) / 2);
}


// this function returns the most voted for, and alphabetically last code
const mostCommonCode = (codeResponses) => {
  // order by most common responses and return
  // the first element in that array
  return codeResponses.sort((a, b) =>
    codeResponses.filter(r => r.code === a.code).length
    - codeResponses.filter(r => r.code === b.code).length
  ).pop();
}

const stringDiff = (str1, str2) => {
  let diff = "";
  str2.split('').forEach(function (val, i) {
    if (val != str1.charAt(i))
      diff += val;
  });
  return diff;
}


export {
  GAME_STATES,
  MIN_PLAYERS_PER_GAME,
  MAX_PLAYERS_PER_GAME,
  TOTAL_ROUNDS,
  makeCode,
  makeFakeCode,
  makeRandomArray,
  calcSpyCount,
  mostCommonCode,
  stringDiff
};