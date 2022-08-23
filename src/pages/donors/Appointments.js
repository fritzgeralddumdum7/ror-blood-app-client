import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Wrapper from '@/components/Wrapper';
import Table from '@/components/Table';
import AlertDialog from '@/components/AlertDialog';
import { Badge, Button, Group, Stack, Modal, Select, Text, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { Receipt } from 'tabler-icons-react';
import { Appointment } from '@/services';
import { formatDateTime } from '@/helpers';
import { APPOINTMENT_SCHEDS } from '@/constant';
import moment from 'moment';

const Appointments = () => {
  const [opened, setOpened] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [toProceed, setToProceed] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [transactionType, setTransactionType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [debounced] = useDebouncedValue(searchValue, 500, {leading: true});
  //for table items
  const [donorAppointments, setDonorAppointments] = useState([]);
  //selected appointment
  const [appointmentId, setAppointmentId] = useState(0);
  const { authUser } = useSelector(state => state.users);
  const [maxPage, setMaxPage] = useState(0);

  const COLUMNS = [
    'Organization',
    'Blood Type',
    'Request Type',
    'Case',
    'Schedule',
    'Request Code',
    'Status',
    'Actions'
  ];
  
  const form = useForm({
    initialValues: {
      date_time: new Date(),
      blood_request_id: '',
    },

    validate: {
      date_time: (value) => (value ? null : "No schedule"),
      blood_request_id: (value) => (value ? null : "No selected request"),
    },
  });

  //table items
  const getDonorAppointments = (params = {}) => {
    if (authUser)
      Appointment.getDonorAllAppointments(params).then((response) => { //donor's id
        setDonorAppointments(response.data.data);   
        setMaxPage(response.data.total_page);
      }).catch(err => console.log(err));
  };

  //for edit on modal   
  const getSpecificAppoinment = (id) => {
    setAppointmentId(id);
    Appointment.getSpecificAppointment(id).then((response) => {
      var appointment = response.data.data[0]
      form.setValues({date_time: new Date(appointment.attributes.date_time),
                      time: new Date(appointment.attributes.date_time),
                      user_id: appointment.attributes.user_id.toString(),
                      blood_request_id: appointment.attributes.blood_request_id.toString()});   
                         
      setErrors(response.data.errors);            
    }).catch(err => console.log(err));    
  }

  const updateAppointment = (payload) => {
    var final_date_time = formatDateTime(payload.date_time, payload.time);
    Appointment.update(appointmentId, {...payload, date_time: final_date_time}).then((response) => {
      getDonorAppointments();
      setErrors(response.data.errors);
      setOpened(false);
    }).catch(err => console.log(err));    
  }

  const cancelAppointment = () => {
    Appointment.cancel(appointmentId).then((response) => {
      getDonorAppointments();
    }).catch(err => console.log(err));
    setToProceed(false);//reset
  }

  //First load and filter
  useEffect(() => {
    if (debounced) {
      getDonorAppointments({ keyword: debounced });
    } else {
      getDonorAppointments();
    } 
  }, [debounced])

  useEffect(() => {   
    if (toProceed && transactionType === 'cancel')
      cancelAppointment();         
  }, [toProceed]);

  const rows = donorAppointments.map((element) => (
    <tr key={element.id}>
      <td>{element.attributes.organization.data.attributes.name}</td>
      <td>{element.attributes.blood_type.data.attributes.name}</td>
      <td>{element.attributes.request_type.data.attributes.name}</td>
      <td>{element.attributes.case.data.attributes.name}</td>
      <td>{moment(element.attributes.date_time).format('MM/DD/YYYY hh:mm a')}</td>
      <td>{element.attributes.blood_request.code}</td>
      <td>
        <Badge color={element.attributes.is_completed? 'green' : 'red'} variant="filled">{element.attributes.is_completed? 'Completed' : 'Pending'}</Badge>
      </td>
      <td>
        <Group>
          <Button leftIcon={<Receipt />} 
            disabled={element.attributes.is_completed}
            onClick={() => {
              getSpecificAppoinment(element.id);
              setOpened(true);            
          }}>
            Rebook
          </Button>
          <Button
            leftIcon={<Receipt />}
            color='red'
            disabled={element.attributes.is_completed}
            onClick={() => {
              setIsDialogOpened(true);
              setAppointmentId(element.id);
              setTransactionType('cancel');
              setAlertMsg('Cancel appointment?')
            }}>
            Cancel
          </Button>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Wrapper>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Set Schedule"
      >
        <form onSubmit={form.onSubmit((values) => updateAppointment(values))}>
          <Stack>
            <DatePicker
              placeholder="Select date"
              label="Event date"
              required
              {...form.getInputProps("date_time")}
            />
            <Select
              placeholder="Select here"
              {...form.getInputProps('time')}
              data = {APPOINTMENT_SCHEDS}
              required />                
            <Button type="submit">Save</Button>
          </Stack>
        </form>
      </Modal>
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
          placeholder="Req. code or Organization name"
          value={searchValue} 
          onChange={(event) => setSearchValue(event.target.value)} />        
      </Group>
      <Table columns={COLUMNS} rows={donorAppointments} maxPage={maxPage} dispatchHandler={getDonorAppointments}>
        <tbody>{rows}</tbody>
      </Table>
    </Wrapper>
  );
}

export default Appointments;
