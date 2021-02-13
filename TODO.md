
# Client

- [!1] make mobile ready so people can play on phone
- [ ] Setup switch for frontend to be accessible on local network, that way we can test on a phone more easily
- [ ] icons
  - external link icon
  - door?
  - icons for slide titles
- [?] use `/rules` route be the source of truth for gamerules
  - MIN_PLAYERS_PER_GAME
  - TOTAL_ROUNDS
- Should spies be told the whole code so they can know if thier counterparts lied?

## Netlify

- [ ] Can probably remove some settings on Netlify

11:50:43 PM: Different build dir detected, going to use the one specified in the Netlify configuration file: 'client' versus '/client' in the Netlify UI
11:50:43 PM: Different publish path detected, going to use the one specified in the Netlify configuration file: 'client/build' versus 'build' in the Netlify UI

# Server

## Admin
- [!] handle log back in when a player drops (current behavior is okay)
- [!] Handle join late and watch game (will require client flags for frontend behavior?)

## Test
- [!2] make test coverage work
  - test all the server functions
- [ ] full auto test 
  - randomly drops and re-adds players
  - makes multiple rooms, sometimes removes all players from a room then tries to rejoin room ensuring the room was deleted



