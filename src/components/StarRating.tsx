import React, { Component } from 'react';

interface StarRatingProps {
  outOf?: number;
  onChange?: (newRating: number) => void;
}

interface StarRatingState {
  stars: number[];
  rating: number;
  hovered: number;
  selectedIcon: string;
  deselectedIcon: string;
}

class StarRating extends Component<StarRatingProps, StarRatingState> {
  constructor(props: StarRatingProps) {
    super(props);

    this.state = {
      stars: [],
      rating: 0,
      hovered: 0,
      selectedIcon: '★',
      deselectedIcon: '☆',
    };

    const outOf = props.outOf ? props.outOf : 5;

    for (let i = 0; i < outOf; i++) {
      this.state.stars.push(i + 1);
    }
  }

  changeRating(newRating: number) {
    this.setState({
      rating: newRating,
    });

    if (this.props.onChange) {
      this.props.onChange(newRating);
    }
    
  }

  hoverRating(rating: number) {
    this.setState({
      hovered: rating,
    });
  }

  render() {
    const { stars, rating, hovered, deselectedIcon, selectedIcon } = this.state;

    return (
      <div>
        <div className="rating" style={{ fontSize: '1.5em', color: '#0747A6' }}>
          {stars.map((star) => (
            <span
              key={star}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.changeRating(star);
              }}
              onMouseEnter={() => {
                this.hoverRating(star);
              }}
              onMouseLeave={() => {
                this.hoverRating(0);
              }}
            >
              {rating < star ? (hovered < star ? deselectedIcon : selectedIcon) : selectedIcon}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default StarRating;