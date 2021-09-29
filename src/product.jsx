import React, { Component } from "react";
import ReactStars from "react-rating-stars-component";

class Product extends Component {
  state = {
    id: this.props.product.id,
    name: this.props.product.name,
    image: this.props.product.image,
    color: this.props.product.color,
    price: this.props.product.price,
    currency: this.props.product.currency,
    releaseDate: this.props.product.releaseDate,
    categoryId: this.props.product.categoryId,
    rating: this.props.product.rating,
  };
  render() {
    return (
      <div className="card col-5 p-3 my-2 border-0 shadow">
        <div className="card-body">
          <h5 className="card-title text-center p-2 rounded" id="product-name">
            {this.state.name}
          </h5>
          <br />
          <sub className="fw-light text-muted">
            {this.state.releaseDate.substring(0, 10)}
          </sub>
        </div>
        <div className="text-center w-100">
          <img
            src={this.state.image}
            className="iimg rounded-circle w-50 d-flex justify-content-center"
            alt="..."
          />
        </div>
        <div className="card-body row justify-content-evenly">
          <h4 className="col col-md-4">
            <span className="badge rounded-pill align-middle bg-success ">
              {this.state.price} {this.state.currency}
            </span>
          </h4>
          <h4 className="col col-md-4">
            <span className="badge rounded-pill align-middle bg-light text-dark border border-1 border-muted">
              Color:{" "}
              <i className="fas fa-circle" style={{ color: this.state.color }}></i>
            </span>
          </h4>
        </div>
        <div className="card-body row justify-content-evenly">
          <div className="col-7 text-center m-aute">
            <ReactStars
              key={new Date().getTime()}
              count={5}
              size={32}
              edit={false}
              value={this.state.rating}
              activeColor="#ffd700"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Product;
