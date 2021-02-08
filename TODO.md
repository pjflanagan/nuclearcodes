
# Client

- [ ] redux production flag
- [ ] people want to be able to scroll up
- [ ] react router fix favicon, make own icon and remove them from credits

## Gameplay

- [ ] front end auto vote timer, no: the game moves fast enough

## Admin
- [ ] sanitize name by removing spaces (not just leading and trailing)
- [ ] share slide
- [ ] social media cards

## Visual
- [ ] make mobile ready so people can play on phone (IMPORTANT)
- [ ] ICONS: pill has copy on click with icons, whole pill is a link, also icons


# Server

- [ ] setup a mocha test for all the server functions
  - [ ] this can help make the code more functional and clear
  - [ ] also will help with the worry about runnning a server in the first place
- [ ] remove env from git and add a password to the server test

## Admin
- [ ] TODO: PRIORITY handle log back in

## Test
- [x] an auto tester that responds automatically
- [ ] auto test randomly drops and re-adds players
- [ ] an auto test for many different rooms



# Both
- [ ] make the gameRules.json file be the source of truth for Server and Client?
- [ ] also have some game decision logic like player models in a shared place



# NEW GAME RULES IDEAS

- Spies see both letters
- Agents only see true letter

This way the spy can choose to lie, and accuse the agent of being a spy, this will make it more a who is who kind of game, rather than a which is which. By the end of the game, the agents should know who to trust so that way they send one agent into each room.

- The code changes every round
  - could be too hard for agents (needs rooms=agents for this to work)
  - if we do it this way, say which percentage was correct:

Determine code logic:
  - select the most voted for code amongst agents
  - return the code that was voted for and what percent it was correct
