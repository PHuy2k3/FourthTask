import React, { useMemo } from 'react'

import { useSelector, useDispatch } from 'react-redux';
import Countdown, { zeroPad } from "react-countdown";
import { TIMEOUT } from '../../../reducers/constants/BookTicket';

export default function Index() {
  const { loadingBookTicketTicket, successBookTicketTicketMessage, errorBookTicketMessage } = useSelector(state => state.BookTicketReducer);
  const dispatch = useDispatch();
  const setTimeCount = useMemo(() => { 
    return Date.now() + 300000
  }, [])

  const handleTimeOut = () => {
    if (!loadingBookTicketTicket && !(successBookTicketTicketMessage || errorBookTicketMessage)) {
      dispatch({
        type: TIMEOUT,
      })
    }
  }
  const style = {
    fontWeight: 25,
    fontWeight: 'bold',
    color: "rgb(238, 130, 59)",
    lineHeight: '39px',
  }
  return (
    <Countdown
      date={setTimeCount}
      renderer={({ minutes, seconds }) => (
        <span style={style}>
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>)
      }
      onComplete={() => handleTimeOut()}
    />
  )
}
