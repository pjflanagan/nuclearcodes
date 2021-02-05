import React from 'react'
import { Slide, Title, Typeable, Text, PillLink } from '../../elements'; // TextBreak

const CreditsWidget = ({
  doneCallback
}) => (
  <Slide>
    <Title>{'Credits'}</Title>
    <Typeable doneTypingCallback={doneCallback}>
      <Text>{'Game by '}</Text>
      <PillLink href="https://pjflanagan.me">{`Peter James Flanagan`}</PillLink>
      <Text>{`. If you enjoyed, please share this game with more friends! If you REALLY enjoyed, please `}</Text>
      <PillLink href="https://paypal.me/pjflanagan1">{'Make A Donation!'}</PillLink>
      <Text>{` The cost of hosting this game isn't much, but it isn't zero, and every donation encourages me to take on more projects like this. Thank you!`}</Text>
      {/* <TextBreak />
      <TextBreak />
      <Text>{'Icons by '}</Text>
      <PillLink href="https://www.flaticon.com/authors/kiranshastry">{'Kiranshastry'}</PillLink>
      <Text>{'.'}</Text> */}
    </Typeable>
  </Slide>
);

const ShareWidget = () => {
  // TODO: after credits, point to share icons here
}

export { CreditsWidget, ShareWidget }