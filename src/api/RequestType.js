import API from './base';

const RequestType = {
  getRequestTypes: async () => {
    const options = {
      method: 'GET',
      url: '/request_types'
    }
    return await API.request(options);
  }
}

export default RequestType;