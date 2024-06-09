import React,{useEffect,useState} from 'react';
import { CssBaseline,Grid } from '@material-ui/core';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import { getPlacesData } from './api';

const App = () => {
  const [places,setPlaces]=useState([]);
  const [filteredPlaces,setFilteredPlaces]=useState([]);
  const [childClicked,setChildClicked]=useState(null);
  const [coords,setCoords]=useState({});
  const [bounds,setBounds]=useState({});
  const [isLoading,setIsLoading]=useState(false);
  const [autocomplete,setAutocomplete]=useState(null);
  const [type,setType]=useState('restaurants');
  const [rating,setRating]=useState('');
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords:{latitude,longitude}})=>{
      setCoords({lat:latitude,lng:longitude});
    });
  },[]);
  useEffect(()=>{
    const filtered=places.filter((place)=>Number(place.rating)>rating);
    setFilteredPlaces(filtered);
  },[rating,places]);
  useEffect(()=>{
    if(bounds.sw&&bounds.ne){
        setIsLoading(true);
        getPlacesData(type,bounds.sw,bounds.ne)
           .then((data)=>{
              setPlaces(data?.filter((place)=>place.name && place.num_reviews>0));
              setFilteredPlaces([]);
              setRating('');
              setIsLoading(false);
           });
    }   
  },[bounds,type]);
  const onLoad=(autoC)=>setAutocomplete(autoC);
    const onPlaceChanged=()=>{
        const lat=autocomplete.getPlace().geometry.location.lat();
        const lng=autocomplete.getPlace().geometry.location.lng();
        setCoords({lat,lng});
    }
  return (
    <>
      <CssBaseline/>
      <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad}/>
      <Grid container spacing={3} style={{width:'100%'}}>
        <Grid item xs={12} md={4}>
            <List 
               places={filteredPlaces.length? filteredPlaces: places}
               childClicked={childClicked}
               isLoading={isLoading}
               type={type}
               setType={setType}
               rating={rating}
               setRating={setRating}
            />
        </Grid>
        <Grid item xs={12} md={8} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Map
              setCoords={setCoords}
              setBounds={setBounds}
              coords={coords}
              places={filteredPlaces.length? filteredPlaces: places}
              setChildClicked={setChildClicked}
            />
        </Grid>
      </Grid>
    </>
  );
}

export default App;