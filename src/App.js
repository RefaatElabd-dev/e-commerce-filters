import React, { Component } from "react";
import axios from "axios";
import { Slider } from "@material-ui/core";
import ReactStars from "react-rating-stars-component";
import $ from 'jquery';

import "./App.css";

import Category from "./category";
import Product from "./product";
import Color from './colorCheckBox';

class App extends Component {
  state = {
    catigories: [],
    products: [],
    selectedProducts: [],
    filteredProducts: [],
    selectedCategoryId: 1,
    priceRange:[1,1000],
    defaultPriceRange: [1,1000],
    filteredByPrice:[],
    selectedColorList:[],
    defaultColorList:[],
    filteredByColor:[],
    filteredByRate:[],
    selectedAverageRating:1
  };

  componentDidMount = async () => {
    await axios.get(`http://test-api.edfa3ly.io/category`).then(async (res) => {
      const catigories = res.data;
      await this.setState({ catigories });
    });

    await axios.get(`http://test-api.edfa3ly.io/product`).then(async (res) => {
      const products = res.data;
      await this.setState({ products });
    });

    //intialize Selected products
    let selectedProducts = this.state.products.filter(
      (p) => p.categoryId === 1
    );

    await this.setState({ selectedProducts });

    await this.setState({ filteredProducts: [...this.state.selectedProducts] });

    //get defaults
    await this.setState({defaultPriceRange: this.getPriceLimitation()})
    await this.setState({defaultColorList: this.getColorList()})

    //default individual filters
    await this.redefaultSubFilteredarrays();

  };

  selectCategoryProducts = async (id) => {

    await this.resetFilters();
    
    let selectedProducts = this.state.products.filter(
      (p) => p.categoryId === id
    );

    await this.setState({ selectedProducts });

    await this.setState({ selectedCategoryId: id });

    await this.setState({ filteredProducts: selectedProducts });

    //default individual filters
    await this.redefaultSubFilteredarrays();

  };

  redefaultSubFilteredarrays = async( ) =>{
    //default individual filters
    await this.setState({ filteredByPrice: [...this.state.selectedProducts] });
    await this.setState({ filteredByColor: [...this.state.selectedProducts] });
    await this.setState({ filteredByRate: [...this.state.selectedProducts] });
  }

  getSelectedProducts = () => this.state.selectedProducts;

  getCardStyle = (id) => {
    return this.state.selectedCategoryId === id
      ? "card col-2 p-2 shadow border border-1 border-primary"
      : "card col-2 p-2 border-0";
  };


  // price filter
  getPriceLimitation = () => {
    let min = Math.min.apply(null, this.state.products.map(item => item.price)),
    max = Math.max.apply(null, this.state.products.map(item => item.price));

    return [min, max];
  }

  filterByPrice = async (e, data) => {
    //update priceRange
    await this.setState({priceRange:data})
    
    //get filtered Products by price
    let filteredByPrice = this.state.selectedProducts.filter(p => p.price >= this.state.priceRange[0] && p.price <= this.state.priceRange[1]);
    await this.setState({filteredByPrice});

    await this.filterProducts();
  }

  resetPrice = async () => {
    await this.setState({priceRange:this.state.defaultPriceRange});

    let filteredByPrice = this.state.selectedProducts.filter(p => p.price >= this.state.priceRange[0] && p.price <= this.state.priceRange[1]);
    await this.setState({filteredByPrice});

    await this.filterProducts();
  }

  //color filter
  getColorList = () => [...new Set(this.state.products.map(item => item.color))];

  updateSelectedColorList = async (e) => {
    let isChecked = e.target.checked;
    
    let selectedColorList = [...this.state.selectedColorList];

    if(isChecked){
      selectedColorList.push(e.target.value);
    }
    else{
      const index = selectedColorList.indexOf(e.target.value);
      if (index > -1) {
        selectedColorList.splice(index, 1);
      }
    }

    await this.setState({selectedColorList});
  }

  updateFilteredByColor = async () => {
    const selectedColorList = [...this.state.selectedColorList];

    let filteredByColor = [];

    if(selectedColorList.length > 0){
       filteredByColor = this.state.selectedProducts.filter( product => selectedColorList.indexOf(product.color) !== -1);
    }
    else{
      filteredByColor = [...this.state.selectedProducts]
    }

    await this.setState({filteredByColor});
  }

  handleColorChange = async (e) => {
    await this.resetSearchColorBox()

    await this.updateSelectedColorList(e);

    await this.updateFilteredByColor();

    await this.filterProducts();
  }

  filterByColorText = async (e) => {

    await this.resetColorfilters();
    
    let filteredByColor = this.state.selectedProducts.filter(p => p.color.includes(e.target.value));

    await this.setState({filteredByColor});

    await this.filterProducts();
  }

  resetColorfilters = async () => {

    $( 'input[name="colorList"]' ).prop('checked', false);

    await this.setState({selectedColorList:[]});

    await this.setState({filteredByColor:[...this.state.selectedProducts]});
  }

  resetSearchColorBox = async () => {
    document.getElementById("searchColorBox").value = "";

    await this.setState({filteredByColor:[...this.state.selectedProducts]});
  }

  resetColor = async () => {
    if(this.state.selectedColorList.length > 0){
      await this.resetColorfilters();
    }
    else{
      await this.resetSearchColorBox();
    }

    await this.filterProducts();
  }

  ratingChanged = async (data) => {
    await this.setState({selectedAverageRating:data});

    let filteredByRate = 
         this.state.selectedProducts.filter( product => product.rating >= data);

    await this.setState({filteredByRate});

    await this.filterProducts();
  }

  resetRate = async () => {
    await this.setState({selectedAverageRating:1});
    $("#stars").attr("value", this.state.selectedAverageRating);
    await this.setState({filteredByColor:[...this.state.selectedProducts]});
  }

  filterProducts = async () =>{
    let filteredProducts = this.getArraysIntersection(this.state.filteredByPrice, this.state.filteredByColor);

    filteredProducts = this.getArraysIntersection(filteredProducts, this.state.filteredByRate);

    await this.setState({ filteredProducts });
  }

  getArraysIntersection = (a1,a2) => {
    return  a1.filter((n) => a2.indexOf(n) !== -1);
  }

  resetFilters = async () => {
    await this.resetPrice();
    await this.resetColor();
    await this.resetRate();
  }

  render() {
    
    return (
      <div className="container">
        <div className="row head">
          <header className="App-header text-center fs-2 mt-4">
            Our e-Commerece Store
          </header>
          <p className="text-center my-2">
            Choose one from our catigories from below.
          </p>
        </div>
        <div className="row justify-content-evenly m-4 p-4 shadowed categories">
          {this.state.catigories.map((category) => (
            <Category
              key={category.id}
              category={category}
              selectProducts={this.selectCategoryProducts}
              cardStyle={this.getCardStyle}
              {...this.props}
            />
          ))}
        </div>
        <div className="row justify-content-evenly my-5 prods">
          <div className="col-3 h-100 filters border border-muted">
            <h1>
              <span>Filters <i class="fas fa-microscope text-primary"></i></span>
            </h1>

            <div className="priceFilter col text-center m-3 p-2 border border-muted border-rounded">
              <p className="text-start fw-bold">Price range</p>

              <div className="row justify-content-evenly price-Boxes ">
                <span className="col-4 border border-1 border-muted rounded d-none d-lg-inline-block">
                  From ($)
                </span>
                <span className="col-3 border border-1 border-muted rounded d-none d-lg-inline-block">
                  To ($)
                </span>
              </div>

              <div className="mx-4">
                <Slider
                  value={this.state.priceRange}
                  onChange={this.filterByPrice}
                  min={this.state.defaultPriceRange[0]}
                  max={this.state.defaultPriceRange[1]}
                />
              </div>

              <button
                className="text-start ml-1 d-inline-block pointer btn btn-none"
                onClick={this.resetPrice}
              >
                clear <span className="text-danger">x</span>
              </button>
            </div>

            <div className="colorFilter col m-3 px-3 border border-muted border-rounded">
              
              <div className="my-2 fw-bold">
                <label htmlFor="searchColorBox" className="form-label fw-bold">
                  <span className="text-danger">C</span>
                  <span className="text-success">O</span>
                  <span className="text-primary">L</span>
                  <span className="text-warning">O</span>
                  <span classNamyarne="text-muted">R</span>
                  <span className="text-info">S</span>
                </label>
                <input type="text" className="form-control" id="searchColorBox" placeholder="----" onKeyUp={this.filterByColorText}/>
              </div>
              <div className="row m-1 p-3 border border-muted border-rounded overflow-auto" style={{maxHeight: '204px'}}>
                {this.state.defaultColorList.map( (c) =>
                  <Color key={c} Name={c} handleChange={this.handleColorChange} {...this.props}/>)
                }
              </div>

              <button
                className="text-start ml-1 my-2 d-inline-block pointer btn btn-none"
                onClick={this.resetColor}
              >
                clear <span className="text-danger">x</span>
              </button>
            </div>

            <div className="col m-3 p-3 border border-muted border-rounded">
              <p className="text-start fw-bold">Average Rating</p>
              <span className="m-1 text-danger fw-liight d-none d-lg-inline">more than or equal to : </span>
              <div className="m-1">
                <ReactStars
                  key={new Date().getTime()}
                  count={5}
                  onChange={this.ratingChanged}
                  size={50}
                  value={this.state.selectedAverageRating}
                  activeColor="#ffd700"
                />
              </div>
            </div>
          </div>

          {/* <div className="col-8 offset-1 justify-content-evenly products"> */}
            <div className="col-8 row justify-content-evenly p-4 products">
              {this.state.filteredProducts.map((product) => (
                <Product key={product.id} product={product} {...this.props} />
              ))}
            </div>
          {/* </div> */}
        </div>
      </div>
    );
  }
}

export default App;
