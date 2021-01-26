

import {
  MessageWidget,
  LogoWidget,
  PlayerNameWidget,
  LobbyWidget,
  MessageWidgetLobby,
  MessageWidgetName,
  ReadyUpWidget,
  AssignRolesWidget
} from '../app/widgets';

// import {
//   addPlayer
// } from '../actions';

// A slides object is complicated, it needs to 
// 1 hold the widget that this slide will be
// 2 hold the data this widget needs
// 3 point to which action or slide will come next

const GAMEPLAY = [
  {
    id: 'welcome',
    widget: MessageWidget,
    data: { text: 'Welcome to' },
    next: () => 'logo'
  },
  {
    id: 'logo',
    widget: LogoWidget,
    data: { text: 'Nuclear Codes' },
    next: () => 'lobby-prompt'
  },
  {
    id: 'lobby-prompt',
    widget: MessageWidget,
    data: { text: 'What room would you like to join?' },
    next: () => 'lobby-form'
  },
  {
    id: 'lobby-form',
    widget: LobbyWidget
  },
  {
    id: 'game-room-welcome',
    widget: MessageWidgetLobby,
    next: () => 'name-prompt'
  },
  {
    id: 'name-prompt',
    widget: MessageWidget,
    data: { text: 'What is your alias?' },
    next: () => 'name-form'
  },
  {
    id: 'name-form',
    widget: PlayerNameWidget
  },
  {
    id: 'welcome-agent',
    widget: MessageWidgetName,
    next: () => 'ready-up-prompt'
  },
  {
    id: 'ready-up-prompt',
    widget: MessageWidget,
    data: { text: "Let's wait for the team to assemble." },
    next: () => 'ready-up'
  },
  {
    id: 'ready-up',
    widget: ReadyUpWidget,
    // no next here because we will instead wait for server response
  },
  {
    id: 'introduction',
    widget: MessageWidget,
    data: {
      text: `Someone has hacked into the Pentagon and stolen our nuclear codes! 
      The only way to recover them is through these rooms. Each round all agents will enter
      rooms in pairs, each pair will be shown that room's letter. But there are spies in our midst.
      If a spy enters a room with you, they can choose to show you a false letter.
      We only have five guesses to recover our nuclear codes, failure is not an option!`
    },
    next: () => 'assign-roles'
  },
  {
    id: 'assign-roles',
    widget: AssignRolesWidget,
    next: () => 'room-picker-prompt'
  },
  {
    id: 'room-picker-prompt',
    widget: MessageWidget,
    data: {
      text: `Talk amongst yourselves, and decide who will enter which room.`
    },
    // next: () => 'room-picker'
  },
  {
    id: 'error',
    widget: () => (<div />)
  }
];

const getNextPlay = (nextPlayID, prevData = {}) => {
  const play = GAMEPLAY.find(play => play.id === nextPlayID);

  if (!play) {
    console.error(`Cannot find ${nextPlayID} in GAMEPLAY`);
    return GAMEPLAY.find(play => play.id === 'error')
  }

  if (!!play.data) {
    Object.assign(play.data, prevData);
  } else {
    play.data = prevData;
  }

  return play;
};

export { GAMEPLAY, getNextPlay };