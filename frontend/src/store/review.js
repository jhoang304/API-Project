import { csrfFetch } from "./csrf"

const GET_ALL_SPOT_REVIEWS = 'spot/reviews'

const getSpotDetails = reviews => ({
    type: GET_ALL_SPOT_REVIEWS,
    reviews
})

export const spotReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const reviews = await res.json();
    if (res.ok) {
        dispatch(getSpotDetails(reviews["Reviews"]))
    }
    return reviews;
}


export const reviewReducer = (state =  {}, action) => {
    let newState;
    switch(action.type) {
        case GET_ALL_SPOT_REVIEWS:
            newState = {...state, reviews: action.reviews}
            return newState
        default:
            return state
    }
}
