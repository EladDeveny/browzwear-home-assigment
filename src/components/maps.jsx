import React,{Component} from 'react';
import json from './clients.json';
const url ='https://maps.googleapis.com/maps/api/';
const apiKey = 'AIzaSyC5igZrrY-xEVeA3XllbqA2rtHBhkz5ddI';

class Maps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      countries:[],
      cities:[],
      companys:[],
      mapIsReady:false,
      loading: 'initial'
    };
  }

  componentDidMount (){
    //making list of countries
    createGoogleMap();
    var data = prepareData();
    let countries = data.map((country, index) =>{
        return(
          <option key={index} className="btn btn-link text-left btn-block" onClick={()=> this.updateCities(data[country],country)}>
            {country}
            </option>
        )
        })
    this.setState({ loading: 'false'});
    this.setState({countries});
    this.updateCities(data[data[0]] ,data[0]);
  }

  updateCities(data,country) {
    //making list of cities
    data.sort(function(a, b){
      return data[b].length-data[a].length
    });
    this.setState({companys:[]});
    let cities = data.map((citie, index) =>{
      return(
        <option key={index} className="btn btn-link text-left btn-block" onClick={()=> this.updateCompanys(data[citie],country)}>
         {citie}
       </option>
      )
    })
    this.setState({cities});
    this.updateCompanys(data[data[0]] ,country);
  }

  updateCompanys(data,country){
    //making list of companys
    data.sort();
      let companys = data.map((company, index) =>{
        return(
          <option  key={index} className="btn btn-link text-left btn-block" onClick={()=> this.updateMap(data[company],country)}>
           {company}
         </option>
        )
      })
      this.setState({companys});
      this.updateMap(data[0],country);
  }

  updateMap(address,country){
    console.log(country);
    let googleRequest = `${url}geocode/json?address=${address} ${country}&key=${apiKey}`;
    const res = encodeURI(googleRequest);
    fetch(res)
      .then(function(response) {
        return response.json();
      })
        .then(function(myJson) {
          console.log(myJson);
          if(myJson['results'].length !== 0 ){
          var location = {
            lat:myJson['results'][0]['geometry']['location']['lat'],
            lng: myJson['results'][0]['geometry']['location']['lng']
          };
            const map = new window.google.maps.Map(document.getElementById('map'), {
              center: location,
              zoom: 17
            });
            const marker = new window.google.maps.Marker({position: location, map: map});

          }

      }).catch((e) =>{console.log(e)});
  }

  render() {
    if (this.state.loading === 'initial') {
  console.log('This happens 2nd - after the class is constructed. You will not see this element because React is still computing changes to the DOM.');
  return <h2>Intializing...</h2>;
}


if (this.state.loading === 'true') {
  console.log('This happens 5th - when waiting for data.');
  return <h2>Loading...</h2>;
}
    return (
      <div className="container-fluid" >
          <div className="container-contact100">
            <div className="wrap-contact100">
              <div className="row" >
                <div className="col-2 h5 headline text-left">  Countries  </div>
                <div className="col-2 h5 headline  text-left">  Cities  </div>
                <div className="col-2 h5 headline  text-left">  Company  </div>
                <div className="col-6 h5 headline  text-left">  Map  </div>
              </div>
              <hr/>
              <div className="container-fluid" >
                <div className="row bla" >
                  <div className="col-2">
                  <select className="mySelect" data-width="75%" size="8">
                      {this.state.countries}
                    </select>
                  </div>
                  <div className="col-2">
                  <select className="mySelect" size="8">
                      {this.state.cities}
                    </select>
                  </div>
                  <div className="col-2">
                  <select className="mySelect" size="8">
                      {this.state.companys}
                    </select>
                  </div>
                  <div className="col-6 ">
                    <div id="map" className="map" ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}


function prepareData(){
  var temp ={
    country: []
  };
  if(json !=null){
  json.Customers.map((client, index) =>{
    if(temp.country.indexOf(client.Country) ===-1){
      temp.country.push(client.Country);
      temp.country[client.Country] = [];
    }
    if(temp.country[client.Country].indexOf(client.City) === -1){
      temp.country[client.Country].push(client.City);
      temp.country[client.Country][client.City] =[];
      temp.country[client.Country][client.City].push(client.CompanyName);
      temp.country[client.Country][client.City][client.CompanyName] = client.Address;
    }
    else{
      temp.country[client.Country][client.City].push(client.CompanyName);
      temp.country[client.Country][client.City][client.CompanyName] = client.Address;
    }
  })
  temp.country.sort(function(a, b){
    return temp.country[b].length-temp.country[a].length
  });
  return temp.country;
  }
  else{
    return [];
  }
}

function createGoogleMap(){
  const script = document.createElement('script');
  script.src = url+`js?key=${apiKey}`;
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.stirct = true;
  document.body.appendChild(script);
}
export default Maps;
