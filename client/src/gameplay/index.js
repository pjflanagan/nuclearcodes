

import {
  MessageWidget,
  LogoWidget,
  RoomWidget,
  LobbyWidget,
  MessageWidgetLobby,
  MessageWidgetName,
  ReadyUpWidget
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
    widget: LobbyWidget,
    next: () => 'game-room-welcome'
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
    widget: RoomWidget,
    next: () => 'welcome-agent'
  },
  {
    id: 'welcome-agent',
    widget: MessageWidgetName,
    next: () => 'ready_up'
  },
  {
    id: 'ready_up',
    widget: ReadyUpWidget,
    next: () => 'ready_up' // this one will have a switch based on state
  }
];

const getNextPlay = (nextPlayID, prevData = {}) => {
  const play = GAMEPLAY.find(play => play.id === nextPlayID);

  if (!!play.data) {
    Object.assign(play.data, prevData);
  } else {
    play.data = prevData;
  }

  return play;
};

export { GAMEPLAY, getNextPlay };