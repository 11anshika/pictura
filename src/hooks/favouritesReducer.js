export const initialState = {
  favourites: JSON.parse(localStorage.getItem("favourites")) || [],
};

export const favouritesReducer = (state, action) => {
  let updatedFavourites;

  switch (action.type) {
    case "TOGGLE_FAVOURITE":
      if (state.favourites.includes(action.payload)) {
        updatedFavourites = state.favourites.filter(
          (id) => id !== action.payload
        );
      } else {
        updatedFavourites = [...state.favourites, action.payload];
      }
      localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
      return { ...state, favourites: updatedFavourites };

    default:
      return state;
  }
};
