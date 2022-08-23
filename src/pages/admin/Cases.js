import { useState, useEffect } from 'react';
import Wrapper from '@/components/Wrapper';
import {
  Button,
  Stack,
  TextInput,
  Textarea,
  Group,
  Drawer
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Pencil, Trash } from 'tabler-icons-react';
import AlertDialog from '@/components/AlertDialog';
import { Case } from '@/services';
import Table from '@/components/Table';

const Cases = () => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [caseId, setCaseId] = useState(0);
  //for table items
  const [cases, setCases] = useState([]);
  
  const form = useForm({
    initialValues: {
      name: '',
      description: '',            
    },

    validate: {
      name: (value) => value ? null : 'No name',      
    },
  });

  //table items
  const getCases = () => {
    Case.getCases().then((response) => {
      setCases(response.data.data);
    }).catch(err => console.log(err));      
  };

  useEffect(() => {
    getCases();
  }, []);

  const rows = cases.map((element) => (
    <tr key={element.id}>
      <td>{element.attributes.name}</td>      
			<td>{element.attributes.description}</td>      
      <td>
        <Button leftIcon={<Pencil />}
          onClick={() => {
            getSpecificCase(element.id);
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
  const getSpecificCase = (id) => {
    setCaseId(id);
    Case.getSpecificCase(id).then((response) => {
      const selectedCase = response.data.data; 
      form.setValues({name: selectedCase.attributes.name,
                      description: selectedCase.attributes.description});                  
      setErrors(response.data.errors);            
    }).catch(err => console.log(err));    
  }    

  const createCase = (payload) => {
    Case.create(payload).then((response) => {
      getCases();
      setErrors(response.data.errors);
      setIsDrawerOpened(false);      
      form.reset();
    }).catch(err => console.log(err));    
  }

  const updateCase = (payload) => {
    Case.update(caseId, payload).then((response) => {
      getCases();
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
        title={isEdit ? 'Edit Case' : 'Create Case'}
        padding="xl"
        size="xl"
        styles={() => ({
          title: { fontWeight: 'bold' }
        })}
      >
        <form onSubmit={form.onSubmit((values) => isEdit? updateCase(values) : createCase(values))}>
          <Stack>
            <TextInput
              label="Name"
              {...form.getInputProps('name')}
              required
            />
            <Textarea
              label="Description"
              autosize
              minRows={5}
              {...form.getInputProps('description')}              
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
      <Table columns={['Name', 'Description']} rows={cases}>
        <tbody>{rows}</tbody>
      </Table>  
      <Group position="right" py='md'>
        <Button onClick={() => {
         setIsDrawerOpened(true);
         setIsEdit(false);
        }}>Create a Case</Button>
      </Group>
    </Wrapper>
  );
}

export default Cases;
