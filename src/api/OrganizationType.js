import API from './base';

const OrganizationType = {
  getOrganizationTypes: async () => {
    const options = {
      method: 'GET',
      url: '/organization_types'
    }
    return await API.request(options);
  }
}

export default OrganizationType;
