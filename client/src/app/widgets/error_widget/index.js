import React from 'react'

import { Slide } from '../../elements'

import Style from './style.module.css'

const ErrorWidget = ({ errors }) => (
  <Slide>
    <div className={Style.errors}>
      {
        !!errors && errors.map((error, i) => (
          <p key={i}>{error}</p>
        ))
      }
    </div>
  </Slide>
);

export { ErrorWidget }