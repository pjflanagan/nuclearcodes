import React from 'react'
import {
  // EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";
import {
  GrTwitter,
  GrFacebook,
  GrPaypal
} from 'react-icons/gr';
import {
  FaGamepad
} from 'react-icons/fa'


import { Slide, Title, Typeable, Text, PillLink, TextBreak, Pill } from '../../elements';

const CreditsWidget = ({
  doneCallback
}) => (
  <Slide>
    <Title>{'Credits'}</Title>
    <Typeable doneTypingCallback={doneCallback}>
      <Text>{'Game by '}</Text>
      <PillLink color="red" href="https://pjflanagan.me">
        <FaGamepad />{`Peter James Flanagan`}
      </PillLink>
      <Text>{`.`}</Text>
      <TextBreak />
      <Text>{`If you enjoyed, please share this game with more friends! `}</Text>
      <Pill color="facebook">
        <FacebookShareButton url="https://nuclearcodes.flanny.app">
          <GrFacebook />{`Facebook`}
        </FacebookShareButton>
      </Pill>
      <Pill color="twitter">
        <TwitterShareButton url="https://nuclearcodes.flanny.app" hashtags={["NuclearCodes"]} >
          <GrTwitter />{`Twitter`}
        </TwitterShareButton>
      </Pill>
      <TextBreak />
      <Text>{`If you REALLY enjoyed, please consider making a donation on`}</Text>
      <PillLink color="paypal" href="https://paypal.me/pjflanagan1">
        <GrPaypal />{'PayPal'}
      </PillLink>
      <Text>{`! The cost of hosting this game isn't much, but it isn't zero, and every donation encourages me to take on more projects like this. Thank you!`}</Text>
    </Typeable>
  </Slide>
);

export { CreditsWidget }