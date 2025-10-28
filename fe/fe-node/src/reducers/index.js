import { combineReducers } from "redux";
import authReducer from "./Auth";
import movieReducer from "./Movie";
import usersManagementReducer from "./UsersManagement";
import theaterReducer from "./Theater";
import BookTicketReducer from "./BookTicket";
import movieDetailReducer from "./MovieDetail";
import modalTrailerReducer from "./ModalTrailer";
import lazyReducer from "./Lazy";

const rootReducer = combineReducers({
  authReducer, movieReducer, usersManagementReducer,
  theaterReducer, BookTicketReducer, movieDetailReducer,
  modalTrailerReducer, lazyReducer,
});
export default rootReducer;