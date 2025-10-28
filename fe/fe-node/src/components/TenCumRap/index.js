import React from 'react';

import useStyles from './style';
import { colorTheater } from '../../constants/theaterData';

export default function TenCumRap({ tenCumRap, testSize }) {
  const theaterKey = (tenCumRap || '').slice(0, 3).toUpperCase();
  const color = colorTheater[theaterKey];
  const classes = useStyles({ color, testSize });

  const theaterName = tenCumRap ?? '';
  const hyphenIndex = theaterName.indexOf('-');
  const namePart = hyphenIndex !== -1 ? theaterName.slice(0, hyphenIndex).trim() : theaterName.trim();
  const locationPart = hyphenIndex !== -1 ? theaterName.slice(hyphenIndex + 1).trim() : '';

  return (
    <p className={classes.text__first}>
      <span>{namePart}</span>
      {locationPart && <span className={classes.text__second}>- {locationPart}</span>}
    </p>
  );
}