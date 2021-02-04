
# Client

- [ ] react router fix favicon, make own icon and remove them from credits
- [ ] player list widget does ready up (shown on rooms, ready up, and code entry)

## Gameplay

- [ ] highlight room you cannot enter
- [ ] front end auto vote timer, use diff with same code as previous time, first round excluded, 2 minutes, spy auto vote wrong

## Admin
- [ ] sanitize name by removing spaces (not just leading and trailing)
- [ ] share slide

## Visual

- [ ] make mobile ready so people can play on phone (IMPORTANT)
- [ ] pill has copy on click with icons, whole pill is a link, also icons



# Server

- [ ] remove env from git and add a password to the server test

## Admin
- [ ] TODO: PRIORITY handle log back in
- [ ] show error on midgame disconnect

## Test
- [x] an auto tester that responds automatically
- [ ] auto test randomly drops and re-adds players



# Both
- [ ] make the gameRules.json file be the source of truth for Server and Client?
- [ ] also have some game decision logic like player models in a shared place



# NEW GAME RULES

- Two spies in a room: only show a fake letter, that way can they both lie together and it’ll look like they’re innocent
- One spy, one agent: show the agent the real letter, show the spy both
- Both agents, both see the real letter

This way the spy can choose to lie, and accuse the agent of being a spy, this will make it a more who is who kind of game, rather than a which is which

- The code changes every round (it could be too easy for agents to figure out who a spy is by reentering a room and seeing who was lying). 
- By the end of the game, the agents should know who to trust so that way they send one agent into each room (still 5 agents, still 5 rooms, you're allowed to enter a room alone)

