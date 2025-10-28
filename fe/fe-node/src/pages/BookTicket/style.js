import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  bookTicked: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 32,
    padding: '80px clamp(16px, 5vw, 56px) 48px',
    boxSizing: 'border-box',
  },
  left: {
    flex: '1 1 720px',
    minWidth: 0,
  },
  right: {
    flex: '0 1 360px',
    minWidth: 0,
    width: '100%',
    maxWidth: 420,
  },
})

export default useStyles