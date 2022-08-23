import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Wrapper from '@/components/Wrapper';
import Table from '@/components/Table';
import AlertDialog from '@/components/AlertDialog';
import { Badge, Button, Group, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Receipt } from 'tabler-icons-react';
import { Appointment } from '@/services';
import moment from 'moment';

const RequestAppointments = () => {
  const params = useParams();
  const bloodRequestId = params.blood_request_id;
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

  const COLUMNS = [
    'Donor',
    'Schedule',
    'Status',
    'Actions'
  ];

  const getOrgAppointments = () => {
    Appointment.getOrgAllAppointments().then((response) => {
      setOrgAppointments(response.data.data);    
    }).catch(err => console.log(err));
  };

  //First load and filter
  useEffect(() => {
    Appointment.getOrgBloodRequestAppointments(bloodRequestId).then((response) => {
      setOrgAppointments(response.data.data);
    }).catch((err) => console.log(err));    
  }, [])

  const completeAppointment = () => {
    Appointment.complete(appointmentId).then((response) => {
      getOrgAppointments();            
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
    else if(toProceed && transactionType === 'complete')   
      completeAppointment();

    setToProceed(false);  
  }, [toProceed]);

  const rows = orgAppointments.map((element) => (
    <tr key={element.id}>
      <td>{element.attributes.donor_name}</td>
      <td>{moment(element.attributes.date_time).format('MM/DD/YYYY hh:mm a')}</td>      
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
              {/* //completeAppointment(element.id) */}
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
      <Table columns={COLUMNS} rows={orgAppointments}>
        <tbody>{rows}</tbody>
      </Table>      
    </Wrapper>
  );
}

export default RequestAppointments;