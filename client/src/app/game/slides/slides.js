
const SLIDES = [
  {
    id: 'welcome',
    type: 'prompt',
    text: 'Welcome to Nuclear Codes',
    next: 'what_room'
  },
  {
    id: 'what_room',
    type: 'text_entry',
    text: 'What room would you like to create or join',
    next: 'what_name'
  }
];

export { SLIDES };