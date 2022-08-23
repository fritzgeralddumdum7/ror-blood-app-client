import { useState, useEffect } from 'react';
import Wrapper from '@/components/Wrapper';
import {
  Button,
  Stack,
  TextInput,
  Select,
  Group,
  Drawer
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Pencil, Trash } from 'tabler-icons-react';
import AlertDialog from '@/components/AlertDialog';
import { Organization, OrganizationType, CityMunicipality } from '@/services';
import { formatAsSelectData } from '@/helpers';
import { useSelector } from 'react-redux';
import Table from '@/components/Table';

const Organizations = () => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [organizationId, setOrganizationId] = useState(0);
  const [cities, setCities] = useState([]);
  //for dropdowns items
  const [organizationTypes, setOrganizationTypes] = useState([]); 
  const [provinceList, setProvinceList] = useState([]); 
  //for table items
  const [organizations, setOrganizations] = useState([]);
  
  const { provinces } = useSelector(state => state.provinces);

  const form = useForm({
    initialValues: {
      name: '',
      address: '',
      city_municipality_id: '',
      organization_type_id: ''
    },

    validate: {
      name: (value) => value ? null : 'No name',
      address: (value) => value ? null : 'No address',
      city_municipality_id: (value) => value ? null : 'No selected city/municipality',
      organization_type_id: (value) => value ? null : 'No organization type',
    },
  });

  //table items
  const getOrganizations = () => {
    Organization.getOrganizations().then((response) => {
      setOrganizations(response.data.data);
    }).catch(err => console.log(err));      
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  const rows = organizations.map((element) => (
    <tr key={element.id}>
      <td>{element.attributes.name}</td>
      <td>{element.attributes.city_municipality.name}</td>
      <td>{element.attributes.province.data.attributes.name}</td>
      <td>{element.attributes.organization_type.name}</td>      
      <td>
        <Button leftIcon={<Pencil />}
          onClick={() => {
            getSpecificOrganization(element.id);
            setIsDrawerOpened(true);
            setIsEdit(true);          
        }}>
          Edit
        </Button>
        <Button ml={8} color='red' leftIcon={<Trash />} >
          Delete
        </Button>
      </td>
    </tr>
  ));

  //for edit on modal   
  const getSpecificOrganization = (id) => {
    setOrganizationId(id);
    Organization.getSpecificOrganization(id).then((response) => {
      const organization = response.data.data[0]; 
      form.setValues({name: organization.attributes.name,
                      address: organization.attributes.address,
                      city_municipality_id: organization.attributes.city_municipality_id.toString(),
                      organization_type_id: organization.attributes.organization_type_id.toString()});                         
      setErrors(response.data.errors);            
    }).catch(err => console.log(err));    
  }    

  //dropdown items
  useEffect(() => {
    const getOrganizationTypes = () => {
      OrganizationType.getOrganizationTypes().then((response) => {
        setOrganizationTypes(response.data.data);    
      }).catch(err => console.log(err));
    };

    getOrganizationTypes();
  }, []);

  const fetchCityHandler = (id) => {
    CityMunicipality.getCityMunicipalities(id)
      .then(res => {
        const data = res.data.data;
        setCities(formatAsSelectData(data, 'name'));
      }).catch(err => console.error(err))
  }

  const createOrganization = (payload) => {
    Organization.create(payload).then((response) => {
      getOrganizations();
      setErrors(response.data.errors);
      setIsDrawerOpened(false);      
      form.reset();
    }).catch(err => console.log(err));    
  }

  const updateOrganization = (payload) => {
    Organization.update(organizationId, payload).then((response) => {
      getOrganizations();
      setErrors(response.data.errors);
      setIsDrawerOpened(false);      
      setIsEdit(false);
      form.reset();
    }).catch(err => console.log(err));    
  }

  useEffect(() => {
    if (!isDrawerOpened)
      form.reset();
  }, [isDrawerOpened])

  return (
    <Wrapper>
      <Drawer
        opened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
        title={isEdit ? 'Edit Request' : 'Create Request'}
        padding="xl"
        size="xl"
        styles={() => ({
          title: { fontWeight: 'bold' }
        })}
      >
        <form onSubmit={form.onSubmit((values) => isEdit? updateOrganization(values) : createOrganization(values))}>
          <Stack>
            <TextInput
              label="Name"
              {...form.getInputProps('name')}
              required
            />
            <TextInput
              label="Street Address"
              {...form.getInputProps('address')}
              required
            />
            <Select
              label="Organization Type"
              placeholder="Select here"
              {...form.getInputProps('organization_type_id')}
              data = {organizationTypes.map(element => {
                let item = {};
                item["value"] = element.id;
                item["label"] = element.attributes.name;
                return item;
              })}              
              searchable
            />
            <Select
              label="Province"
              placeholder="Select here"
              data={provinces}
              onChange={(event) => {
                fetchCityHandler(event);
                form.setValues(values => ({...values, province: event }));
                form.setFieldValue('city_municipality', null);
              }}
              searchable
            />
            <Select
              label="City/Municipality"
              placeholder="Select here"
              data={cities}
              {...form.getInputProps('city_municipality_id')}              
              searchable
            />
            <Button type='submit'>Save</Button>
          </Stack>
        </form>        
      </Drawer>
      <AlertDialog
        isToggled={isDialogOpened}
        setIsToggled={setIsDialogOpened}
        text='Would you like to delete?'
        type='delete'
      /> 
      <Table columns={['Name', 'City/Municipality', 'Province', 'Type', 'Actions']} rows={organizations}>
        <tbody>{rows}</tbody>
      </Table>   
      <Group position="right" py='md'>
        <Button onClick={() => {
         setIsDrawerOpened(true);
         setIsEdit(false);
        }}>Create an Organization</Button>
      </Group>
    </Wrapper>
  );
}

export default Organizations;
