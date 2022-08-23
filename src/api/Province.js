import API from './base';

const Province = {
  all: async () => {
    const options = {
      method: 'GET',
      url: '/provinces'
    }
    return await API.request(options);
  }
}

export default Province;
