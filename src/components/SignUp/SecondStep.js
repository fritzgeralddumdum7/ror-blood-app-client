import {
  Container,
  SimpleGrid,
  Stack,
  TextInput,
  Box,
  Title,
  Select
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import FooterAction from '@/components/SignUp/FooterAction';
import { useForm } from '@mantine/form';
import { useSelector } from 'react-redux';

const SecondStep = ({ nextStepHandler, prevStepHandler, setUserInfoHandler, userInfo, fetchCityHandler, cities }) => {
  const { provinces } = useSelector(state => state.provinces);

  const form = useForm({
    initialValues: userInfo,
    validate: {
      firstname: (value) => value ? null : 'First name is required',
      lastname: (value) => value ? null : 'Last name is required',
      birthday: (value) => value ? null : 'Birthday is required',
      province: (value) => value ? null : 'Province is required',
      city_municipality_id: (value) => value ? null : 'City / Municipality is required',
      middlename: (value) => (!value || value) && null,
      address: (value) => (!value || value) && null
    },
  });

  return (
    <Box pt={50}>
      <form onSubmit={form.onSubmit((values) => {
        setUserInfoHandler(values);
        nextStepHandler();
      })}>
      <Title order={3} sx={{ textAlign: 'center' }}>Personal Information</Title>
      <Container size='lg' pt={50}>
        <Stack spacing={25}>
          <SimpleGrid cols={2} spacing={25}>
            <Box>
              <TextInput
                label="First name"
                size='lg'
                {...form.getInputProps('firstname')}
              />
            </Box>
            <TextInput
              label="Last Name"
              size='lg'
              {...form.getInputProps('lastname')}
            />
            <TextInput
              label="Middle Name"
              placeholder='Optional'
              size='lg'
              {...form.getInputProps('middlename')}
            />
            <DatePicker
              label="Birthday"
              placeholder='Select date'
              size='lg'
              {...form.getInputProps('birthday')}
            />
            <Select
              label="Province"
              placeholder="Select a province"
              size='lg'
              data={provinces}
              onChange={(event) => {
                fetchCityHandler(event);
                form.setValues(values => ({...values, province: event }));
                form.setFieldValue('city', null);
              }}
              value={form.values.province}
              searchable
            />
            <Select
              label="City / Municipality"
              placeholder={form.values.province ? 'Select a municipality' : 'Select province first'}
              size='lg'
              data={cities}
              searchable
              {...form.getInputProps('city_municipality_id')}
            />
          </SimpleGrid>
          <TextInput
            label="Address"
            size='lg'
            {...form.getInputProps('address')}
          />
        </Stack>
      </Container>
      <FooterAction
        nextStepHandler={nextStepHandler}
        prevStepHandler={prevStepHandler}
      />
      </form>
    </Box>
  );
}

export default SecondStep;
