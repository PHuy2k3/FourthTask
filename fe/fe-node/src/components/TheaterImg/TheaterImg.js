import React from 'react'
import { dataTheaterImg, returnRandomItem } from '../../constants/theaterData';
export default function FakeImgTheater({ nameTheater, imgStyle }) {
  let imgTheater
  const itemData = dataTheaterImg?.find(item => item.nameTheater === nameTheater)
  if (!itemData?.nameTheater) {
    let img = returnRandomItem()
    dataTheaterImg.push({ nameTheater, img })
    imgTheater = img
  } else {
    imgTheater = itemData.img
  }
  return (
    <img className={imgStyle} src={imgTheater} alt="theater" />
  )
}
