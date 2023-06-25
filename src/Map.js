import React, { useState, useEffect } from "react";
import {  db } from "./firebase";
import { query, collection, where, getDocs, addDoc  } from "firebase/firestore";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Marker,InfoWindow } from '@react-google-maps/api';
import { mapmarker } from './assets'


function Map() {
  // fetching and putting data of locations
  const [locations, setLocations] = useState([]);
  const [onlywheel, setOnlywheel] = useState([]);
  const [onlypark, setOnlypark] = useState([]);


  const fetchPost = async () => {
      const ref = collection(db, "locations")
      await getDocs(ref)
      .then((querySnapshot)=>{               
          const newData = querySnapshot.docs
              .map((doc) => ({...doc.data(), id:doc.id }));
          setLocations(newData);                
      })

      const wheel_q = query(ref, where("wheelchair", "==", "This Location has Wheelchair Accesiblity"));
      const park_q = query(ref, where("parking", "==", "This Location has Disability Parking"));

      await getDocs(wheel_q)
      .then((querySnapshot) => {
        const newData = querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }));
        setOnlywheel(newData);  
      })
      
      await getDocs(park_q)
      .then((querySnapshot) => {
        const newData = querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }));
        setOnlypark(newData);  
      })

  };
  
  
  
  useEffect(()=>{
    fetchPost();  
  }, []);

  // for google maps api
  const containerStyle = {
    width: '1250px',
    height: '720px'
  };
  
  const center = {
    lat: 40.730,
    lng: -73.935
  };

  //returns the lat, lng object
  const getPosition = (location) =>{
    const lat = location.lat;
    const lng = location.lng;
    const pos = {lat: lat, lng: lng};
    return pos;
  };

  const [activeMarker, setActiveMarker] = useState("");




  return (
    <div className='bg-backgroundC'>
        <h1 className='text-4xl p-24 text-center font-bold italic text-oliveGreen'>
            Accessibility Map for New York City, NY
        </h1>
        
        
      <LoadScript
        googleMapsApiKey="AIzaSyAkfU18mlMtMx2Tvb6egPt8L9vkcWxOGuY"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={30}
        >

      {locations.map((location) => (
        <Marker
          key={location.id}
          // icon= {inclusiMapLogo}
          position={getPosition(location)}
          icon= {mapmarker}
          onClick={() => setActiveMarker(location.id)}
        >
         
         {/* simple jsx logic here ==> boolean logic ? statement_if_true : statement_if_false */}
         
         {activeMarker == location.id && 
            <InfoWindow>
            <div className="text-oliveGreen p-2 text-left text-base">
              <h2 className="text-lg font-bold">{location.locationname}</h2>
              <i className=" p-2">{location.locationaddress}</i> <br></br>
              <b className="p-2">{location.wheelchair}</b> <br></br>
              <b className="p-2">{location.parking}</b><br></br>
              <p>{"Contact Number: (+1) " + location.contact}</p>
            </div>
            </InfoWindow>
          }

          
        </Marker>
      ))}
  
        </GoogleMap>
      </LoadScript>   



{/* 


        {locations.map((location) => (
          <div className="location">
              <h2>{location.locationname}</h2>
              <p>{location.locationaddress}</p>
              <p>{location.wheelchair}</p>              
              <p>{location.parking}</p>
              <p>{location.contact}</p>

          </div>
        ))}

        <h1>Only wheelchair Accessibility</h1>
        {onlywheel.map((location) => (
          <div className="location">
              <h2>{location.locationname}</h2>
              <p>{location.locationaddress}</p>
              <p>{location.wheelchair}</p>              
              <p>{location.parking}</p>
              <p>{location.contact}</p>

          </div>
        ))}

        <h1>Only parking Accessibility</h1>
        {onlypark.map((location) => (
          <div className="location">
              <h2>{location.locationname}</h2>
              <p>{location.locationaddress}</p>
              <p>{location.wheelchair}</p>              
              <p>{location.parking}</p>
              <p>{location.contact}</p>

          </div>
        ))} */}

    </div>
  )
}

// https://www.google.com/maps/d/embed?mid=1DZstpCpXbVqk9JYaeta0vYvyfgLEDBI&hl=en&ehbc=2E312F

export default Map