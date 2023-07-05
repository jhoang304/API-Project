import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'spots/spots'
const GET_SPOT_DETAILS = 'spots/single_spot'
const GET_USER_SPOTS='spots/currentUser'
const DELETE_SPOT='spots/delete'
const UPDATE_SPOT='spots/update'
// const CREATE_SPOT = 'spots/create'
// const ADD_IMAGE = 'spots/images/add'

const getAllSpotsAction = spots => ({
        type: GET_ALL_SPOTS,
        spots
})

const getSpotDetailAction = spot => ({
    type: GET_SPOT_DETAILS,
    spot
})

const getUserSpots = spots => ({
    type: GET_USER_SPOTS,
    spots
})

const updateSpot = spot => ({
    type: UPDATE_SPOT,
    spot
})

const deleteSpot = spotId => ({
    type: DELETE_SPOT,
    spotId
})

// const createImage = image => ({
//     type: ADD_IMAGE,
//     image
// })

// const createSpot = spot => ({
//     type: CREATE_SPOT,
//     spot
// })

export const allSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const spots = await res.json();
    if (res.ok) {
        dispatch(getAllSpotsAction(spots["Spots"]))
        return spots;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const getUserSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current')
    const spots = await res.json();
    if (res.ok) {
        dispatch(getUserSpots(spots["Spots"]))
        return spots;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const singleSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)
    const spot = await res.json()
    if (res.ok) {
        dispatch(getSpotDetailAction(spot))
        return spot;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const createSpotThunk = (spot, owner, imagesArray) => async (dispatch) => {
    try {
        const res = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spot)
        })
        if (res.ok) {
            const newSpot = await res.json();
            const spotImagesArray = [];

            for (let image of imagesArray) {
                image.spotId = newSpot.id;
                const imageData = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(image)
                })
                if (imageData.ok) {
                    const image = await imageData.json();
                    spotImagesArray.push(image)
                }
            }
            newSpot.SpotImages = spotImagesArray;
            newSpot.owner = owner
            await dispatch(getSpotDetailAction(newSpot))
            return newSpot
        }
    } catch (err) {
        const error = await err.json();
        return error;
    }
}

export const updateSpotThunk = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    });
    if (res.ok) {
        const updatedSpot = await res.json()
        dispatch(updateSpot(updatedSpot))
        return updatedSpot
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(deleteSpot(spotId))
    } else {
        const errorData = await res.json()
        return errorData
    }
}

// export const createImageThunk = (image, spotId) => async dispatch => {
//     const res = await csrfFetch(`/api/spots/${spotId}/images`, {
//         method: "POST",
//         headers: {
//             "content-type": "application/json"
//         },
//         body: JSON.stringify(image)
//     })
//     const data = await res.json();
//     if (res.ok) {
//         dispatch(createImage(image))
//         return data
//     }
//     else {
//         const errorData = await res.json()
//         return errorData
//     }
// }


export const spotReducer = (state =  {}, action) => {
    let newState;
    switch(action.type) {
        case GET_ALL_SPOTS:
            newState = {...state, allSpots: action.spots}
            return newState
        case GET_SPOT_DETAILS:
            newState = {...state, singleSpot: action.spot}
            return newState
        // case CREATE_SPOT:
        //     newState = {...state, allSpots: {...state.AllSpots, [action.spot.id]: action.spot}}
        //     return newState;
        // case ADD_IMAGE:
        //     newState = {...state, singleSpot: {...state.singleSpot, spotImages: [action.image]}}
        case GET_USER_SPOTS:
            newState =  {...state, allSpots: action.spots}
            return newState
        case UPDATE_SPOT: {
            newState = {...state, singleSpot: action.spot}
            return newState
        }
        case DELETE_SPOT:
            newState = {...state}
            delete newState[action.spotId];
            return newState
        default:
            return state
    }
}
