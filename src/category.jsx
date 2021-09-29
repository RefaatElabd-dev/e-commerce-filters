import React, { Component } from "react";
class Category extends Component {
  state = {
    id: this.props.category.id,
    name: this.props.category.name,
    image: this.props.category.image,
  };

  render() {
    return (
      <div
        className={this.props.cardStyle(this.state.id)}
        style={{ width: "11rem", cursor: "pointer" }}
        onClick={() => this.props.selectProducts(this.state.id)}
      >
        <div className="card-body">
          <h5 className="card-title text-center text-primary">
            {this.state.name} <i className="fas fa-key text-warning"></i>
          </h5>
        </div>

        <img
          src={this.state.image}
          className="card-img-bottom rounded-circle image-shadow"
          width="50%"
          alt="..."
        />
      </div>
    );
  }
}

export default Category;
