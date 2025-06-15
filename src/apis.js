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
  operator,
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
      { key: 'physicalFitness', value: physicalFitness },
      { key: 'operator', value: operator }
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

export const getUsersNumbers = async (
 { term, 
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
  sortOrder,
  startDate,
  endDate
}
) => {
  console.log("Function called with parameters:", {
    term, type, page, disability, sex, state, lga, community, 
    religion, physicalFitness, sortBy, sortOrder, startDate, endDate
  });
  
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
     { key: 'lga', value: lga },
     { key: 'state', value: state },
     { key: 'community', value: community },
     { key: 'religion', value: religion },
     { key: 'physicalFitness', value: physicalFitness },
     { key: 'startDate', value: startDate },
     { key: 'endDate', value: endDate }
   ];
   
   // Append non-empty filters
   filters.forEach(filter => {
     if (filter.value) {
       queryString += `&${filter.key}=${encodeURIComponent(filter.value)}`;
       console.log(`Added filter: ${filter.key} = ${filter.value}`);
     }
   });

   // Add sorting if provided
   if (sortBy) {
     queryString += `&sortBy=${encodeURIComponent(sortBy)}`;
     queryString += `&sortOrder=${sortOrder || 'asc'}`;
   }

   console.log("Final query string:", queryString);
   console.log("Full URL:", `${process.env.REACT_APP_API_URL}/user/numbers${queryString}`);

   // Make API call with the queryString
   const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/numbers${queryString}`);

   return res;
 } catch (error) {
   console.log("ERROR", error);
   return error?.response;
 }
};

export const getTodaysMealRecords = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/meals`);

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


export const downloadExcel = async ({ 
  term, 
  type, 
  disability, 
  sex, 
  state, 
  lga, 
  community, 
  religion, 
  physicalFitness,
  sortBy,
  sortOrder,
  registeredUsersOnly = "false",
  startDate,  // Add startDate parameter
  endDate     // Add endDate parameter
} = {}) => {
  try {
    // Start building query string
    let queryString = '?';

    // Add search term if provided
    if (term && type) {
      queryString += `&searchTerm=${encodeURIComponent(term)}&searchType=${encodeURIComponent(type)}`;
    }

    // Add filters including date parameters
    const filters = [
      { key: 'disability', value: disability },
      { key: 'sex', value: sex },
      { key: 'state', value: state },
      { key: 'lga', value: lga },
      { key: 'community', value: community },
      { key: 'religion', value: religion },
      { key: 'physicalFitness', value: physicalFitness },
      { key: 'registeredUsersOnly', value: registeredUsersOnly },
     { key: 'startDate', value: startDate },
     { key: 'endDate', value: endDate }     // Add endDate to filters
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

    // Make API call with responseType: 'blob'
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/download${queryString}`, {
      responseType: 'blob'
    });

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
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user`, {
      ...data,
      mspType: Number(data?.age) > 35 ? "existing" : "new"
    });

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

export const recordMeal = async (userId) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/${userId}/meals`, {
      data: "data"
    });

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};

export const recordAttendance = async (userId, subject) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/${userId}/attendance`, {
      subject,
      attended: true
    });

    return res;
  } catch (error) {
    console.log("ERROR", error);
    return error?.response;
  }
};
export const recordAppointment = async (userId, data) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/${userId}/health`, 
      data
    );

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
      {...data,
        mspType: Number(data?.age) > 35 ? "existing" : "new"
      }
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


// Check-in tablet API request
export const checkInTablet = async (userId) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/${userId}/tablet-checkin`, {
     message: "hello"
    });

    return res;
  } catch (error) {
    console.log("CHECK-IN ERROR", error);
    return error?.response;
  }
};

// Check-out tablet API request
export const checkOutTablet = async (userId, checkoutData = {}) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/${userId}/tablet-checkout`, {
          message: "hello"

    });

    return res;
  } catch (error) {
    console.log("CHECK-OUT ERROR", error);
    return error?.response;
  }
};

// Get tablet status API request
export const getTabletStatus = async (userId) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}/tablet/status`);

    return res;
  } catch (error) {
    console.log("GET STATUS ERROR", error);
    return error?.response;
  }
};

// Get user's tablet history API request
export const getTabletHistory = async (userId) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}/tablet/history`);

    return res;
  } catch (error) {
    console.log("GET HISTORY ERROR", error);
    return error?.response;
  }
};

// Bulk check-in tablets for multiple users
export const bulkCheckInTablets = async (checkInData) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/tablets/bulk-checkin`, {
      checkIns: checkInData // Array of { userId, tabletId, assignedBy }
    });

    return res;
  } catch (error) {
    console.log("BULK CHECK-IN ERROR", error);
    return error?.response;
  }
};

// Bulk check-out tablets for multiple users
export const bulkCheckOutTablets = async (checkOutData) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/tablets/bulk-checkout`, {
      checkOuts: checkOutData // Array of { userId, condition, notes }
    });

    return res;
  } catch (error) {
    console.log("BULK CHECK-OUT ERROR", error);
    return error?.response;
  }
};