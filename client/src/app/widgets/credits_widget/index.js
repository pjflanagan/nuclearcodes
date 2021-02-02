import React from 'react'
import { Slide, Title, Typeable, Text, TextBreak, Pill } from '../../elements'

const CreditsWidget = ({
  doneCallback
}) => (
  <Slide>
    <Title>{'Credits'}</Title>
    <Typeable doneTypingCallback={doneCallback}>
      <Text>{'Game by '}</Text>
      <Pill><a rel="noreferrer" target="_blank" href="https://pjflanagan.me" title="Peter James Flanagan">{`Peter James Flanagan`}</a></Pill>
      <Text>{`. If you enjoyed, please share this game with more friends! If you REALLY enjoyed, please `}</Text>
      <Pill><a rel="noreferrer" target="_blank" href="https://paypal.me/pjflanagan1" title="Make a donation">{'Make A Donation!'}</a></Pill>
      <Text>{` The cost of hosting this game isn't much, but it isn't zero, and every donation encourages me to take on more projects like this. Thank you!`}</Text>
      <TextBreak />
      <TextBreak />
      <Text>{'Icons by '}</Text>
      <Pill><a rel="noreferrer" target="_blank" href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">{'Kiranshastry'}</a></Pill>
      <Text>{'.'}</Text>
    </Typeable>
  </Slide>
);

const ShareWidget = () => {
  // TODO: after credits, point to share icons here
}

export { CreditsWidget, ShareWidget }