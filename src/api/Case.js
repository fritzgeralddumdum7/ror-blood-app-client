import API from './base';

const Case = {
  getCases: async () => {
    const options = {
      method: 'GET',
      url: '/cases'
    };
    
    return await API.request(options);
  },
  getSpecificCase: async (id) => {
    const options = {
      method: 'GET',
      url: `/cases/${id}`
    }

    return await API.request(options);
  },
  create: async (payload) => {
    const options = {
      method: 'POST',
      url: '/cases',
      data: payload
    };

    return await API.request(options);
  },
  update: async (id, payload) => {
    const options = {
      method: 'PATCH',
      url: `/cases/${id}`,
      data: payload
    };

    return await API.request(options);
  },
}

export default Case;