import API from './base';

const BloodRequest = {
  getOrgAllBloodRequests: async (qParams) => {
    let params = {
      transaction_type: 'requests_of_org',
      ...qParams
    };
    
    const options = {
      method: 'GET',
      url: '/blood_requests',
      params
    }
    return await API.request(options);
  },
  getOpenBloodRequestsForDonor: async (qParams) => {
    let params = {
      transaction_type: 'openrequests_for_donor' ,
      ...qParams
    }

    const options = {
      method: 'GET',
      url: `/blood_requests/`,
      params
    }
    return await API.request(options);
  },
  getSpecificBloodRequest: async (id) => {
    const options = {
      method: 'GET',
      url: `/blood_requests/${id}`,      
    }
    return await API.request(options);
  },
  create: async (payload) => {
    const options = {
        method: 'POST',
        url: '/blood_requests',
        data: payload,
    };

    return await API.request(options);
  },
  update: async (id, payload) => {
    const options = {
        method: 'PATCH',
        url: `/blood_requests/${id}`,
        data: payload,
    };

    return await API.request(options);
  },
  delete: async (id) => {
    const options = {
      method: 'DELETE',
      url: `/blood_requests/${id}`,      
    }    

    return await API.request(options);
  },
  close: async (id) => {
    const options = {
        method: 'PATCH',
        url: `/blood_requests/${id}/close`,        
    };

    return await API.request(options);
  },
  reOpen: async (id) => {
    const options = {
        method: 'PATCH',
        url: `/blood_requests/${id}/reOpen`,        
    };

    return await API.request(options);
  },
  cancel: async (id) => {
    const options = {
        method: 'PATCH',
        url: `/blood_requests/${id}/cancel`,
    };
    return await API.request(options);
  },
}

export default BloodRequest;