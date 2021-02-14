

import {
  // messages
  MessageWidget,
  MessageWidgetWelcome,
  MessageWidgetLetterReveal,
  MessageWidgetDefcon,
  MessageGameOver,
  MessageRoundTitle,

  LogoWidget,
  LobbyWidget,
  PlayerNameWidget,
  ReadyUpWidget,
  AssignRolesWidget,
  ChooseRoomWidget,
  EnterCodeWidget,
  DefconWidget,
  CreditsWidget
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
    next: () => 'lobby-prompt',
    delay: 600
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
      title: 'Mission Brief',
      text: `Someone has hacked into the Pentagon and stolen our nuclear codes! 
      The only way to recover them is through these rooms. Each round all agents will enter
      rooms, and be shown that room's letter. But there are spies in our midst.
      Spies are also shown a false letter, and can lie to you about the contents of the rooms they enter.
      The code changes after each incorrect guess.
      We only have five guesses to recover our nuclear codes, failure is not an option!`
    },
    next: () => 'assign-roles',
    delay: 2800
  },
  {
    id: 'assign-roles',
    widget: AssignRolesWidget,
    next: () => 'round-title',
    delay: 1600
  },
  {
    id: 'round-title',
    widget: MessageRoundTitle,
    next: () => 'room-picker-prompt',
  },
  {
    id: 'room-picker-prompt',
    widget: MessageWidget,
    data: {
      title: 'Choose Rooms',
      text: `Talk amongst yourselves, and decide who will enter which room.`
    },
    next: () => 'room-picker',
    delay: 200
  },
  {
    id: 'room-picker',
    widget: ChooseRoomWidget
  },
  {
    id: 'letter-reveal',
    widget: MessageWidgetLetterReveal,
    next: () => 'enter-code',
    delay: 1600
  },
  {
    id: 'enter-code',
    widget: EnterCodeWidget
  },
  {
    id: 'start-next-round',
    widget: MessageWidgetDefcon,
    next: () => 'defcon',
    delay: 1600
  },
  {
    id: 'defcon',
    widget: DefconWidget,
    next: () => 'round-title',
    delay: 1600
  },
  {
    id: 'gameover',
    widget: MessageGameOver,
    next: ({ result }) => (result === 'defeat') ? 'final-defcon' : 'credits',
    delay: 2800
  },
  {
    id: 'final-defcon',
    widget: DefconWidget,
    next: () => 'credits',
    delay: 1600
  },
  {
    id: 'credits',
    widget: CreditsWidget,
    next: () => 'play-again-prompt',
    delay: 600
  },
  {
    id: 'play-again-prompt',
    widget: MessageWidget,
    data: {
      text: `Would you like to play again?`
    },
    next: () => 'ready-up'
  }
];

export { GAMEPLAY };