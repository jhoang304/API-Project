import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { singleSpotThunk } from "../../store/spot";
import { spotReviewsThunk } from "../../store/review";
import { useParams } from "react-router-dom";
import "./SpotDetails.css";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";

export default function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spot.singleSpot);
  const reviews = useSelector((state) => state.review.reviews);
  // const user = useSelector((state) => state.review.reviews);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(singleSpotThunk(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    dispatch(spotReviewsThunk(spotId));
  }, [dispatch, spotId]);

  if (!spot) {
    return <div>Loading Spot...</div>;
  }

  if (!spot.SpotImages) {
    return <div>Loading Spot...</div>;
  }

  if (!reviews) {
    return <div>Loading Reviews...</div>
  }

  const handleReserveClick = () => {
    alert("Feature Coming Soon...");
  };

  const convertedDate = (date) => {
    const newDate = new Date(date);
    const style = { month: 'long', day: 'numeric' };
    const goodDate = newDate.toLocaleString('en-US', style);
    return goodDate;
  }

  return (
    <div className="spot-container">
      <div className="name"> {spot.name}</div>
      <div className="location">
        {" "}
        {spot.city}, {spot.state}, {spot.country}{" "}
      </div>
      <div className="images-container">
        <div className="preview-image">
        <img id="main-img" src={spot.SpotImages[0].url} alt="Preview Pic of Spot"/>
        </div>
        <div className="other-images">
        {spot.SpotImages[1] ? (<img className="other-image" src={spot.SpotImages[1].url} alt="Pic of Spot"/>) : (<img className="other-image" src="https://cdn.discordapp.com/attachments/320286625521336341/1125935356320161852/no_photo.png" alt="Pic of Spot"/>)}
        {spot.SpotImages[2] ? (<img className="other-image" src={spot.SpotImages[2].url} alt="Pic of Spot"/>) : (<img className="other-image" src="https://cdn.discordapp.com/attachments/320286625521336341/1125935356320161852/no_photo.png" alt="Pic of Spot"/>)}
        {spot.SpotImages[3] ? (<img className="other-image" src={spot.SpotImages[3].url} alt="Pic of Spot"/>) : (<img className="other-image" src="https://cdn.discordapp.com/attachments/320286625521336341/1125935356320161852/no_photo.png" alt="Pic of Spot"/>)}
        {spot.SpotImages[4] ? (<img className="other-image" src={spot.SpotImages[4].url} alt="Pic of Spot"/>) : (<img className="other-image" src="https://cdn.discordapp.com/attachments/320286625521336341/1125935356320161852/no_photo.png" alt="Pic of Spot"/>)}
        </div>
      </div>
      <div className="belowImages">
        <div className="belowImages-info">
        <div className="hostInfo">
            Hosted by {spot.Owner && spot.Owner.firstName}{" "}
            {spot.Owner && spot.Owner.lastName}{" "}
          </div>
        <div className="description"> {spot.description}</div>
        </div>
        <div className="reserve-container">
            <div className="price-reviews">
          <div className="price">${spot.price} night</div>
          {/* <div className="reviews">
          <div className="starRating">
            <i className="fa-solid fa-star"></i>
            {spot.avgStarRating}
          </div>
          <div className="reviewCount">{spot.numReviews} reviews</div> */}
          <div className={spot.numReviews === 0 ? "noReviews" : "reviews"}>
              {spot.numReviews === 0 ? (
                <div className="noReviews">
                  <i className="fa-solid fa-star"></i>
                  <div className="newListing">New</div>
                </div>
              ) : (
                <div className="reviews">
                <div className="starRating">
                  <i className="fa-solid fa-star"></i>
                  {spot.avgStarRating}
                </div>
                  <div className="reviewCount">{spot.numReviews} reviews</div>
                </div>
              )}
          </div>
          </div>
          <button className="reserveButton" onClick={handleReserveClick}>
            Reserve Now
          </button>
        </div>
      </div>
      <div className="reviewsContainer">
      {/* <div className="mainReviews">
              <div className="starRating"> */}
               <div className={spot.numReviews === 0 ? "noReviews" : "mainReviews"}>
            {spot.numReviews === 0 ? (
                 <div className="noReviews">
                 <i className="fa-solid fa-star"></i>
                 <div className="newListing">New</div>
               </div>
            ) : (
                <div className="mainReviews">
                <div className="starRating">
                <i className="fa-solid fa-star"></i>
                {spot.avgStarRating}
                </div>
                <div className="reviewCount">{spot.numReviews} reviews</div>
              </div>
            //   <div className="reviewCount">{spot.numReviews} reviews</div>
            // </div>
            )}
            <div>
              {sessionUser && sessionUser.id !== spot.ownerId && (!reviews.find((review) => review.userId === sessionUser.id)) &&
               <OpenModalButton
              //  id="deleteButton"
               buttonText="Post Your Review"
               modalComponent={<CreateReviewModal spot={spot} user={sessionUser} />}
               />}
            </div>
        </div>
        {reviews &&
          reviews.map((review) => (
            <div className="individualReview" key={`review-${review.id}`}>
              <div className="reviewUser">{review.User.firstName}</div>
              <div className="createdAt">{convertedDate(review.createdAt)}</div>
              <div className="reviewDescription">{review.review}</div>
              {/* {user && review.userId === user.id
              && <OpenModalButton
              buttonText="Delete Your Review"
                modalComponent={<DeleteReviewModal spot={spot} review={review}
                 />}
              />
              } */}
              {sessionUser && sessionUser.id === review.userId && (
              <OpenModalButton
              buttonText="Delete Your Review"
              modalComponent={<DeleteReviewModal spot={spot} review={review} />}
              />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
