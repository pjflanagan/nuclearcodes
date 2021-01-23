

import {
  MessageWidget,
  EnterTextWidget
} from './widgets';

// A slides object is complicated, it needs to 
// 1 hold the widget that this slide will be
// 2 hold the data this widget needs
// 3 point to which action or slide will come next

const SLIDES = [
  {
    id: 'welcome',
    widget: MessageWidget,
    data: {
      text: 'Welcome to Nuclear Codes',
    },
    next: {
      action: {
        name: 'check_already_in_room',
        // TODO: figure out what this should be shaped like
        // the nex slide will either be "what room" or "welcome to room"
      },
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
      slide: 'what_room_entry'
    }
  },
  {
    id: 'what_room_entry',
    widget: EnterTextWidget,
    data: {
      placeholder: 'Room Name',
    },
    next: {
      action: 'none for now',
      slide: 'what_name'
    }
  },
  {
    id: 'what_name',
    widget: MessageWidget,
    data: {
      text: 'And what is your name?',
    },
    next: {
      slide: 'what_name_entry'
    }
  },
  {
    id: 'what_name_entry',
    widget: EnterTextWidget,
    data: {
      placeholder: 'Your Name',
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