import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Wrapper from '@/components/Wrapper';
import Table from '@/components/Table';
import AlertDialog from '@/components/AlertDialog';
import Alert from '@/components/AlertDialog';
import { Badge, Button, Stack, Select, Group, Drawer, Text, TextInput, Anchor } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { Clock, Pencil, Receipt, Trash } from 'tabler-icons-react';
import { Case, BloodRequest, RequestType, User } from '@/services';
import {formatDateTime} from '@/helpers';
import { APPOINTMENT_SCHEDS } from '@/constant';
import moment from 'moment';

const Requests = () => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [toProceed, setToProceed] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [debounced] = useDebouncedValue(searchValue, 500, {leading: true});
  //for dropdowns items
  const [cases, setCases] = useState([]); 
  const [requestTypes, setRequestTypes] = useState([]); 
  const [patients, setPatients] = useState([]); 
  //for table items
  const [bloodRequests, setBloodRequests] = useState([]);
  //selected blood request
  const [bloodRequestId, setBloodRequestId] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  
  const {authUser} = useSelector(state => state.users )

  const COLUMNS = [
    'Request Code',
    'Patient',
    'Blood Type',
    'Request Type',
    'Case',
    'Schedule',
    'No. of Appts.',
    'Status',
    'Actions'
  ];

  const form = useForm({
    initialValues: {
      date_time: new Date(),
      user_id: '', 
      case_id: '',
      request_type_id: '',      
    },

    validate: {
      date_time: (value) => value ? null : 'No selected date',
      time: (value) => value ? null : 'No selected time',
      case_id: (value) => value ? null : 'No selected case',
      request_type_id: (value) => value ? null : 'No selected request type',      
    },
  });

  //for edit on modal   
  const getSpecificBloodRequest = (id) => {
    setBloodRequestId(id);
    BloodRequest.getSpecificBloodRequest(id).then((response) => {
      const bloodRequest = response.data.data[0];
      form.setFieldValue('date_time', new Date(bloodRequest.attributes.date_time));                                   
      form.setFieldValue('time', moment(bloodRequest.attributes.date_time).format('h:mm a'));    
      form.setFieldValue('user_id', bloodRequest.attributes.user_id.toString());
      form.setFieldValue('request_type_id', bloodRequest.attributes.request_type_id.toString());
      form.setFieldValue('case_id', bloodRequest.attributes.case_id.toString());
      setErrors(response.data.errors);            
    }).catch(err => console.log(err));    
  }    

  //table items
  const getOrgBloodRequests = (params = {}) => {
    BloodRequest.getOrgAllBloodRequests(params).then((response) => {
      setBloodRequests(response.data.data);   
      setMaxPage(response.data.total_page);
    }).catch(err => console.log(err));
  };

  //First load and filter
  useEffect(() => {
    if (debounced)   {
      getOrgBloodRequests({ keyword: debounced });
    } else {
      getOrgBloodRequests();
    }
  }, [debounced])

  //dropdown items
  useEffect(() => {
    const getPatients = () => {
      User.getByRole(3).then((response) => {//Role ID 3 = patient
        setPatients(response.data.data);    
      }).catch(err => console.log(err));
    };

    getPatients();
  }, []);

  //dropdown items
  useEffect(() => {
    const getCases = () => {
      Case.getCases().then((response) => {
        setCases(response.data.data);    
      }).catch(err => console.log(err));
    };

    getCases();
  }, []);

  //dropdown items
  useEffect(() => {
    const getRequestTypes = () => {
      RequestType.getRequestTypes().then((response) => {
        setRequestTypes(response.data.data);    
      }).catch(err => console.log(err));
    };

    getRequestTypes();
  }, []);

  const createBloodRequest = (payload) => {
    var final_date_time = formatDateTime(payload.date_time, payload.time);
    BloodRequest.create({...payload, date_time: final_date_time, organization_id: authUser.organization_id}).then((response) => {
      getOrgBloodRequests();
      setErrors(response.data.errors);
      setIsDrawerOpened(false);  
      form.reset();    
    }).catch(err => console.log(err));    
  }

  const updateBloodRequest = (payload) => {
    var final_date_time = formatDateTime(payload.date_time, payload.time);
    BloodRequest.update(bloodRequestId, {...payload, date_time: final_date_time }).then((response) => {
      getOrgBloodRequests();
      setErrors(response.data.errors);
      setIsDrawerOpened(false);      
      setIsEdit(false);      
      form.reset();
    }).catch(err => console.log(err));    
  }

  const closeBloodRequest = () => {
    BloodRequest.close(bloodRequestId).then((response) => {
      getOrgBloodRequests(authUser.organization_id);      
    }).catch(err => console.log(err));    
    setToProceed(false);//reset
  }

  const reOpenBloodRequest = () => {
    BloodRequest.reOpen(bloodRequestId).then((response) => {
      getOrgBloodRequests();      
    }).catch(err => console.log(err));    
    setToProceed(false);//reset
  }

  const cancelBloodRequest = () => {
    BloodRequest.cancel(bloodRequestId).then((response) => {
      if (response.data.status === 'Successful')
        getOrgBloodRequests();
      else{
        setErrors(response.data.errors);
        setAlertMsg("Error");        
      }
    }).catch(err => console.log(err));
    setToProceed(false);//reset
  }

  useEffect(() => {
    if (!isDrawerOpened)
      form.reset();
  }, [isDrawerOpened])

  useEffect(() => {   
    if (toProceed && transactionType === 'delete')
      cancelBloodRequest();
    else if (toProceed && transactionType === 'close')
      closeBloodRequest();
    else if (toProceed && transactionType === 'reOpen')
      reOpenBloodRequest();
  }, [toProceed]);

  const rows = bloodRequests.map((element) => (
    <tr key={element.id}>
      <td>{element.attributes.code}</td>
      <td>{`${element.attributes.user.firstname} ${element.attributes.user.lastname}`}</td>
      <td>{element.attributes.blood_type.name}</td>
      <td>{element.attributes.request_type.name}</td>
      <td>{element.attributes.case.name}</td>
      <td>{moment(element.attributes.date_time).format('MM/DD/YYYY hh:mm a')}</td>
      <td>{element.attributes.total_appointments_made_per_request}</td>
      <td>
        <Badge color={element.attributes.is_closed? 'gray' : 'red'} variant="filled">
          {element.attributes.is_closed? 'Closed' : 'Pending'}
        </Badge>
      </td>
      <td>
        <Button leftIcon={<Pencil />} 
          disabled={element.attributes.is_closed}
          onClick={() => {
            getSpecificBloodRequest(element.id);
            setIsDrawerOpened(true);
            setIsEdit(true);          
          }}>
          Edit
        </Button>
        <Button ml={8} color='red' leftIcon={<Trash />}
          disabled={element.attributes.is_closed}
          onClick={() => {
            setIsDialogOpened(true);
            setBloodRequestId(element.id);
            setTransactionType('delete');
            setAlertMsg('Delete request?')
          }}>
          Delete
        </Button>
        <Button ml={8} color='gray' leftIcon={<Clock />}
          onClick={() => {
            setIsDialogOpened(true);
            setBloodRequestId(element.id);
            setTransactionType(element.attributes.is_closed? 'reOpen' : 'close');
            setAlertMsg(element.attributes.is_closed? 'Re-open request?' : 'Close request?')
        }}>
          {element.attributes.is_closed? 'Re-open' : 'Close'}
        </Button>
        <Anchor component={Link} to={'/requestappointments/' + element.id}>
          <Button ml={8} color='blue' leftIcon={<Receipt />}>
            View
          </Button>
        </Anchor>        
      </td>
    </tr>
  ));

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
        <form onSubmit={form.onSubmit((values) => isEdit? updateBloodRequest(values) : createBloodRequest(values))}>
          <Stack>
            <DatePicker 
              placeholder="Select date" 
              label="Event date" 
              minDate={new Date()}
              required
              {...form.getInputProps('date_time')}
            />
            <Select
              placeholder="Select here"
              {...form.getInputProps('time')}
              data = {APPOINTMENT_SCHEDS}
              required
              defaultValue={form.values.time} />
            <Select
                label="Patient Name"
                placeholder="Select here"
                {...form.getInputProps('user_id')}
                data = {patients.map(element => {
                  let item = {};
                  item["value"] = element.id;
                  item["label"] = element.attributes.name;
                  return item;
                })}
                searchable
                maxDropdownHeight={280}  
                defaultValue={form.values.user_id}              
              />
            <Select
              label="Request Type"
              placeholder="Select here"
              {...form.getInputProps('request_type_id')}
              data = {requestTypes.map(element => {
                let item = {};
                item["value"] = element.id;
                item["label"] = element.attributes.name;
                return item;
              })}
              searchable
              defaultValue={form.values.request_type_id}
            />
            <Select
              label="Case Type"
              placeholder="Select here"
              {...form.getInputProps('case_id')}
              data={cases.map(element => {
                let item = {};
                item["value"] = element.id;
                item["label"] = element.attributes.name;
                return item;
              })}
              searchable
              defaultValue={form.values.case_id}
            />
            <Button type='submit'>Save</Button>
          </Stack>
        </form>        
      </Drawer>
      <Alert
        isShow={isShowAlert}
        setIsShow={setIsShowAlert}
        type='error'
        text={alertMsg}
      />
      <AlertDialog
        isToggled={isDialogOpened}
        setIsToggled={setIsDialogOpened}
        setToProceed={setToProceed}
        text={alertMsg}
        type={transactionType}
      />
      <Group position="left" py='md'>
        <Text>Search:</Text>
        <TextInput styles={() => ({
          root: { width: '30%' }
          })}          
          placeholder="Req. code or Patient name"
          value={searchValue} 
          onChange={(event) => setSearchValue(event.target.value)} />        
      </Group>
      <Table columns={COLUMNS} rows={bloodRequests} dispatchHandler={getOrgBloodRequests} maxPage={maxPage}>
        <tbody>{rows}</tbody>
      </Table>      
      <Group position="right" py='md'>
        <Button onClick={() => {
          setIsDrawerOpened(true);
          setIsEdit(false);
        }}>Create Request</Button>
      </Group>
    </Wrapper>
  );
}

export default Requests;
