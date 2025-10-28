import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
export default function UseHandleVibrateLazy() {
  const { isLazy } = useSelector((state) => state.lazyReducer);
  const clear = useRef(null);
  const [isLazyout, setisLazyout] = useState(false);
  useEffect(() => {
    if (isLazy) {
      setisLazyout(true);
      clearTimeout(clear.current);
    } else {
      clear.current = setTimeout(() => {
        setisLazyout(false); 
      }, 100);
    }
  }, [isLazy]);
  return isLazyout;
}
