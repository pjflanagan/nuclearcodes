
[![Netlify Status](https://api.netlify.com/api/v1/badges/cc32c9bf-a028-4662-b96a-80f6dd8818db/deploy-status)](https://app.netlify.com/sites/nuclear-codes/deploys)

![Nuclear Codes Logo](https://raw.githubusercontent.com/pjflanagan/nuclear-codes/master/media/social.png)

# Nuclear Codes

### [Play Nuclear Codes!](https://nuclearcodes.flanny.com)

This is a React based Socket.io game that can be played by 5 to 10 friends. Agents
try to recover a code while Spies try and stop them. Hosted on Netlify and Heroku.

## Game Rules

### 1. Starting a Match

At the beginning of a match, a subset of players are randomly assigned to be spies. They are made aware of who the other spies are.

### 2. Entering Rooms

Each round, players enter numbered rooms to reveal letters. Players should send at least one person into each room.

- When a spy enters a room, they see both letters
- When an agent enters a room, they see only true letter

### 3. Entering codes

After the letters are revealed, players then share to the other players which letter they saw. Spies can now choose to lie about which letter they saw, and accuse any roommate they might have of lying about the letter they shared. The group of players then decides which letters they believe and enters the code made by putting each room's letter in order.

### 4. Reveal

After all players have entered codes, the most voted on code will be tried in the system. 

- If it is correct, the agents win. 
- If it is incorrect
  - The amount of incorrect letters in the code is shared with the group. 
  - The code then changes for the next round and the agents are given another chance to figure out who the spies are. 
  
If the agents fail to enter a correct code after 5 rounds the spies win. 

## Develop

### Install

Clone this repository and then run `npm i` inside the `./client` and inside the `./server` folder.

### Run

After installation, in terminal run:

```bash
# terminal 1
$ cd ./client && npm run start

# terminal 2
$ cd ./server && npm run start
```
### Test 

#### Live Test

  1. http://localhost:5000/test to open the test, click one of the "Start Test" buttons
  2. http://localhost:3000/test in browser to join the test room

#### Mocha Test

```bash
# test
$ cd ./server && npm run test

# coverage
$ cd ./server && npm run coverage
```