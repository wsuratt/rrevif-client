import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './review.css'
import StarRating from './StarRating';

const API_BASE: string = "http://localhost:8080/";

interface ReviewProps {
  token: string | null;
  reviewee: any[];
  review_type: string;
  task_id: string | undefined;
}

interface newReview {
  reviewee_id: string;
  rating: number;
  rating_desc: string;
  review_type: string;
  task_id: string | undefined;
}

async function addReview(token: string | null, new_review: newReview) {
  if(token) {
    return fetch(API_BASE + "api/new-rating", {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(new_review)
    })
      .then(data => data.json())
  }
}

export default function Review({token, reviewee, review_type, task_id}: ReviewProps) {
  const [reviewee_id, setRevieweeId] = useState<string>(reviewee[0]?.user_id);
  const [rating, setRating] = useState<number>(0);
  const [rating_desc, setRatingDesc] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRevieweeId(reviewee[0].user_id)

    console.log(JSON.stringify({
      reviewee_id,
      rating,
      rating_desc,
      review_type
    }))

    const addedReview = await addReview(token, {
      reviewee_id: reviewee[0].user_id,
      rating,
      rating_desc,
      review_type,
      task_id
    })
    
  }

  return(
    <>
      <div className="profile-dimmed"></div>
      <div className="review-wrapper">
        <h1>{`Submit a review for ${reviewee[0]?.username}`}</h1>
        <form onSubmit={handleSubmit}>
          <label className="review-label stars">
            <StarRating onChange={(e) => setRating(e)}/>
          </label>
          <label className="review-label">
            <input maxLength={250} className="review-input review-desc" placeholder='Please add an explanation for your review' onChange={(e: ChangeEvent<HTMLInputElement>) => setRatingDesc(e.target.value)}/>
          </label>
          <div>
            <button className="add-review-submit" type="submit">Submit Review</button>
          </div>
        </form>
      </div>
    </>
  )
}
