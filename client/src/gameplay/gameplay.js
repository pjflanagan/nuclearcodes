

import {
  // messages
  MessageWidget,
  MessageWidgetWelcome,
  MessageWidgetKeyRoom,
  MessageWidgetLetterReveal,

  LogoWidget,
  LobbyWidget,
  PlayerNameWidget,
  ReadyUpWidget,
  AssignRolesWidget,
  ChooseRoomWidget,
  KeyChoiceWidget
} from '../app/widgets';

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
    // no next here because we will instead wait for server response
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
    widget: MessageWidgetWelcome,
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
    next: () => 'room-picker'
  },
  {
    id: 'room-picker',
    widget: ChooseRoomWidget
  },
  {
    id: 'key-room-prompt',
    widget: MessageWidgetKeyRoom,
    next: ({ isSpy }) => (isSpy) ? 'key-choice' : 'WAIT'
  },
  {
    id: 'key-choice',
    widget: KeyChoiceWidget
  },
  {
    id: 'letter-reveal',
    widget: MessageWidgetLetterReveal
  },
  {
    id: 'gameover',
    next: () => 'credits'
  },
  {
    id: 'victory',
    next: () => 'credits'
  },
  {
    id: 'credits',
    next: () => 'play-again-prompt'
  },
  {
    id: 'play-again-prompt',
    next: () => 'ready-up'
  }
  // { TODO:
  //   id: 'error',
  //   widget: MessageWidgetError
  // }
];

export { GAMEPLAY };