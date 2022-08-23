import API from './base';

const BloodType = {
  getBloodTypes: async () => {
    const options = {
      method: 'GET',
      url: '/blood_types'
    }
    return await API.request(options);
  }
}

export default BloodType;