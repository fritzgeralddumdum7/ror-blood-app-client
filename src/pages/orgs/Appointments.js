import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Wrapper from '@/components/Wrapper';
import Table from '@/components/Table';
import AlertDialog from '@/components/AlertDialog';
import { Badge, Button, Group, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Receipt } from 'tabler-icons-react';
import { Appointment } from '@/services';
import moment from 'moment';
import { fetchTally } from '@/redux/users';


const Appointments = () => {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [toProceed, setToProceed] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [errors, setErrors] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [debounced] = useDebouncedValue(searchValue, 500, {leading: true});
  //for ui values
  const [valueDate, setValueDate] = useState(new Date());
  const [valueTime, setValueTime] = useState(new Date());
  //for table items
  const [orgAppointments, setOrgAppointments] = useState([]);
  //selected appointment
  const [appointmentId, setAppointmentId] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const dispatch = useDispatch();

  const COLUMNS = [
    'Donor',
    'Blood Type',
    'Request Type',
    'Case',
    'Schedule',
    'Request Code',
    'Status',
    'Actions'
  ];

  const getOrgAppointments = (params) => {
    Appointment.getOrgAllAppointments(params).then((response) => {
      setOrgAppointments(response.data.data);
      setMaxPage(response.data.total_page);
    }).catch(err => console.log(err));
  };

  //First load and filter
  useEffect(() => {
    if (debounced) {
      getOrgAppointments({ keyword: debounced });
    } else {
      getOrgAppointments();
    } 
  }, [debounced])

  const completeAppointment = () => {
    Appointment.complete(appointmentId).then((response) => {
      getOrgAppointments();
      dispatch(fetchTally());          
    }).catch(err => console.log(err));    
  }

  const cancelAppointment = () => {
    Appointment.cancel(appointmentId).then((response) => {
      getOrgAppointments();
    }).catch(err => console.log(err));
    setToProceed(false);//reset
  }

  useEffect(() => {   
    if (toProceed && transactionType === 'cancel')
      cancelAppointment();      
    else if(toProceed && transactionType === 'complete') { 
      completeAppointment();
    }

    setToProceed(false);  
  }, [toProceed]);

  const rows = orgAppointments.map((element) => (
    <tr key={element.id}>
      <td>{`${element.attributes.user.firstname} ${element.attributes.user.lastname}`}</td>
      <td>{element.attributes.blood_type.data.attributes.name}</td>
      <td>{element.attributes.request_type.data.attributes.name}</td>
      <td>{element.attributes.case.data.attributes.name}</td>
      <td>{moment(element.attributes.date_time).format('MM/DD/YYYY hh:mm a')}</td>
      <td>{element.attributes.blood_request.code}</td>
      <td>
        <Badge color={element.attributes.is_completed? 'green' : 'red' } variant="filled">
          {element.attributes.is_completed? 'Completed' : 'Pending'}
        </Badge>
      </td>
      <td>
        <Group>
          <Button leftIcon={<Receipt />}
            disabled={element.attributes.is_completed}
            onClick={() => {
              setIsDialogOpened(true);
              setAppointmentId(element.id);
              setTransactionType('complete');
              setAlertMsg('Complete appointment?')
            }}>
            Complete
          </Button>
          <Button leftIcon={<Receipt />} color='red'
            disabled={element.attributes.is_completed}
            onClick={() => {
              setIsDialogOpened(true);
              setAppointmentId(element.id);
              setTransactionType('cancel');
              setAlertMsg('Cancel appointment?')
            }}
          >
            Cancel
          </Button>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Wrapper>
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
          placeholder="Req. Code or Donor name"
          value={searchValue} 
          onChange={(event) => setSearchValue(event.target.value)} />        
      </Group>
      <Table columns={COLUMNS} rows={orgAppointments} maxPage={maxPage} dispatchHandler={getOrgAppointments}>
        <tbody>{rows}</tbody>
      </Table>
    </Wrapper>
  );
}

export default Appointments;