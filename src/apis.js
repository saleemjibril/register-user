import axios from "axios";

export const getRegisteredUsers= async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/registered`);
    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

export const getUsers = async ({ 
  term, 
  type, 
  page = 1, 
  disability, 
  sex, 
  state, 
  lga, 
  community, 
  religion, 
  physicalFitness,
  sortBy,
  sortOrder
} = {}) => {
  try {
    // Start building query string with page
    let queryString = `?page=${page}`;

    // Add search term if provided
    if (term && type) {
      queryString += `&searchTerm=${encodeURIComponent(term)}&searchType=${encodeURIComponent(type)}`;
    }

    // Add filters
    const filters = [
      { key: 'disability', value: disability },
      { key: 'sex', value: sex },
      { key: 'state', value: state },
      { key: 'lga', value: lga },
      { key: 'community', value: community },
      { key: 'religion', value: religion },
      { key: 'physicalFitness', value: physicalFitness }
    ];

    // Append non-empty filters
    filters.forEach(filter => {
      if (filter.value) {
        queryString += `&${filter.key}=${encodeURIComponent(filter.value)}`;
      }
    });

    // Add sorting if provided
    if (sortBy) {
      queryString += `&sortBy=${encodeURIComponent(sortBy)}`;
      queryString += `&sortOrder=${sortOrder || 'asc'}`;
    }

    // Make API call
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user${queryString}`);

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

export const getUser = async (id) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/${id}`);

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

export const searchUser = async (searchTerm) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/search?searchTerm=${searchTerm}`
    );

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

export const createUser = async (data) => {
  console.log("skepta", data);

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user`, data);

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

export const updateUser = async (id, data) => {
  console.log("skepta", data);

  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/user/${id}`,
      data
    );

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

export const deleteEvent = async (token, id) => {
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


export const login = async (
  data
) => {

  
  
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/login`, data);

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};