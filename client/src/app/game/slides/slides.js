

import {
  MessageWidget,
  LogoWidget,
  RoomWidget,
  LobbyWidget
} from './widgets';

import {
  checkInRoom
} from './actions';

// A slides object is complicated, it needs to 
// 1 hold the widget that this slide will be
// 2 hold the data this widget needs
// 3 point to which action or slide will come next

const SLIDES = [
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
    next: checkInRoom
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
    next: () => 'end'
  },
  {
    id: 'end',
    widget: MessageWidget,
    data: {
      text: 'Game over, congradulations to whoever won. Would you like to play again?'
    }
  }
];

export { SLIDES };