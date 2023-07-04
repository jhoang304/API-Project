import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react'
import { singleSpotThunk } from '../../store/spot'
import { useParams } from 'react-router-dom'

export default function SpotDetail () {
    const { spotId } = useParams();
	const dispatch = useDispatch()
	const spot = useSelector(state => state.spot.singleSpot)
    console.log(spot)


	useEffect(() => {
		dispatch(singleSpotThunk(spotId))
	}, [dispatch, spotId])

    if (!spot) {
        return <div>Loading...</div>
    }

return (
    <div className='spot-container'>
        <div> {spot.name}</div>
        <div> {spot.city}, {spot.state} </div>
    </div>
  );
}
