import React, { useState, useEffect } from "react";
import { auth, db, storage } from "./firebase";
import { query, collection, where, getDocs, addDoc  } from "firebase/firestore";
import { async } from "@firebase/util";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useLocation } from "react-router-dom";
import Geocode from "react-geocode";


function Submit() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [locationaddress, setLocationaddress] = useState("");
    const [locationname, setLocationname] = useState("");
    const [contact, setContact] = useState("");
    const [wheelchair, setWheelchair] = useState("");
    const [parking, setParking] = useState("");
    const [lat, setlat] = useState("");
    const [lng, setlng] = useState("");


    // geocoding given address
    Geocode.setApiKey("AIzaSyAkfU18mlMtMx2Tvb6egPt8L9vkcWxOGuY");
    Geocode.setLanguage("en");
    Geocode.setLocationType("ROOFTOP");   // ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE
    

    const handleChange = async(event) => {
        // we should add this to make it work
        event.preventDefault()

        // sending info to database
        try {

            Geocode.fromAddress(locationaddress).then(
                (response) => {
                    const { lat, lng } = response.results[0].geometry.location;
                    setlat(lat);
                    setlng(lng);
                },
                (error) => {
                console.error(error);
                }
            );
            
            const ref = await addDoc(
                collection(db, "locations"),
                {
                    name : name,
                    email: email,
                    locationaddress : locationaddress,
                    locationname : locationname,
                    contact : contact,
                    wheelchair : wheelchair,
                    parking : parking,
                    lat: lat,
                    lng: lng
                }
            );


        } catch (error) {
            console.error("Error adding document: ", error);
        }
        
        navigate("/thanks")
    };

    


  return (

    <div className='text-center bg-backgroundC font-bold py-12 text-oliveGreen '>

    <h1 className='text-4xl italic '>Submit a New Accessible Location in New York City</h1>
    <form className='text-xl pt-8'>
        <label>Your Name</label>
        <br/>
        <input 
            type="text" 
            id = "name"
            value={name}
            onChange={(e) => setName(e.target.value)}                
        />
        <br/><br/>

        <label>Your Email Address </label>
        <br/>
            <input 
                type="email" 
                id = "email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}   
            />
        
        <br/><br/>

        <label>Complete Location Address</label>
        <br/>
            <input 
                type="text" 
                id = "locationaddress"
                value={locationaddress}
                onChange={(e) => setLocationaddress(e.target.value)}   
            />
        <br/><br/>

        <label>Complete Location Name</label>
        <br/>
            <input type="text" 
            id = "locationname"
            value={locationname}
            onChange={(e) => setLocationname(e.target.value)}                
            />
        <br/><br/>

        <label>Location Contact Number</label>
        <br/>
            <input type="text" 
                id = "contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}  
            />
        <br/><br/>

        <fieldset id="group1">
        <label>Does this Location have Wheelchair Accesiblity?</label>
        <br></br>
            <input type="radio" id="yes1" name="group1" 
                value="This Location has Wheelchair Accesiblity" 
                onChange={(e) => setWheelchair(e.target.value)}
            />
            <label htmlFor="yes1">Yes</label><br></br>
            <input type="radio" id="no1" name="group1" value="No"/>
            <label htmlFor="no1">No</label><br></br>
        </fieldset>

        <fieldset id="group2">
        <label>Does this Location have Disability Parking?</label>
        <br/>
            <input type="radio" id="yes2" name="group2"
                value="This Location has Disability Parking"
                onChange={(e) => setParking(e.target.value)} 
            />
            <label htmlFor="yes2">Yes</label><br></br>
            <input type="radio" id="no2" name="group2" value="No"/>
            <label htmlFor="no2">No</label><br></br>
        </fieldset>

        <button type='submit' className='bg-oliveGreen text-white px-12 py-2 m-4 rounded-full' onClick={handleChange}>Submit</button>
    </form>
    </div>
   
  )
}


export default Submit