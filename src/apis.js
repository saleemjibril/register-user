import axios from "axios";


  
export const getAllEvents = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/events`, {
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("ERROR", error);
    throw error;
  }
};


export const getEvent = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/events/${id}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("ERROR", error);
    throw error;
  }
};

export const createUser = async (
  data,
) => {

  console.log('skepta', data);
  
 
  try {
    const res = await axios.post(
      `http://localhost:8000/api/v1/user`, data
    );

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

export const updateUser = async (
  id,
  data,
) => {

  console.log('skepta', data);
  
 
  try {
    const res = await axios.put(
      `http://localhost:8000/api/v1/user/${id}`, data
    );

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};


export const deleteEvent = async (
  token,
  id,
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_URL}/events/${id}`,
    config
    );

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

