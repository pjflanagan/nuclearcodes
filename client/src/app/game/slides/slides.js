
import React from 'react';

import {
  MessageWidget
} from './widgets';

const SLIDES = [
  {
    id: 'welcome',
    widget: MessageWidget,
    data: {
      text: 'Welcome to Nuclear Codes',
    },
    next: {
      slide: 'what_room'
    }
  },
  {
    id: 'what_room',
    widget: MessageWidget,
    data: {
      text: 'What room would you like to join?',
    },
    next: {
      action: 'none for now',
      slide: 'end'
    }
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