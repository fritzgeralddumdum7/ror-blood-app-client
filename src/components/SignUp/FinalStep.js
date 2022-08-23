import {
  Container,
  Select,
  Stack,
  Box,
  Title
} from '@mantine/core';
import FooterAction from '@/components/SignUp/FooterAction';
import { useForm } from '@mantine/form';
import { useSelector } from 'react-redux';
import { ROLES } from '@/constant';

const FinalStep = ({ role, setRole, nextStepHandler, prevStepHandler, setUserInfoHandler, userInfo, setIsFinal }) => {
  const { bloodTypes } = useSelector(state => state.bloodTypes);
  const { orgs } = useSelector(state => state.orgs);

  const donorValidations = {
    role: (value) => value ? null : 'Role is required',
    blood_type_id: (value) => value ? null : 'Blood type is required',
  }
  const orgValidations = {
    role: (value) => value ? null : 'Role is required',
    organization_id: (value) => value ? null : 'Organization is required',
  }
  const form = useForm({
    initialValues: userInfo,
    validate: ['1', '3'].includes(role) ? donorValidations : orgValidations,
  });
  const renderRoleFields = () => {
    if (['1', '3'].includes(role)) {
      return (
        <Select
          label="Blood Type"
          placeholder="Select blood type"
          size='lg'
          data={bloodTypes}
          searchable
          onChange={(event) => {
            form.setFieldValue('blood_type_id', null);
            form.setFieldValue('role', null);
            form.setValues(values => ({ ...values, blood_type_id: event, role }));
          }}
          value={form.values.blood_type_id}
          error={form.errors.blood_type_id}
        />
      );
    } else if (role === '2') {
      return (
        <Select
          label="Organization"
          placeholder="Select organization"
          size='lg'
          data={orgs}
          searchable
          onChange={(event) => {
            form.setFieldValue('organization_id', null);
            form.setFieldValue('role', null);
            form.setValues(values => ({ ...values, organization_id: event, role }));
          }}
          value={form.values.organization_id}
          error={form.errors.organization_id}
        />
      );
    }
  };

  return (
    <Box pt={50}>
      <form onSubmit={form.onSubmit((values) => {
        setUserInfoHandler(values);
        setIsFinal(true);
      })}>
        <Title order={3} sx={{ textAlign: 'center' }}>Profile Information</Title>
        <Container size='xs' pt={50}>
          <Stack spacing={20}>
            <Select
              label="Role"
              placeholder="Select a role"
              size='lg'
              data={ROLES}
              searchable
              onChange={(event) => {
                form.setFieldValue('role', null);
                form.setFieldValue('blood_type_id', null);
                form.setFieldValue('organization_id', null);
                setRole(event);
                form.setValues(values => ({ ...values, role: event }));
              }}
              error={form.errors.role}
            />
            {renderRoleFields()}
          </Stack>
        </Container>
        <FooterAction
          nextStepHandler={nextStepHandler}
          prevStepHandler={prevStepHandler}
          isFinal={true}
        />
      </form>
    </Box>
  );
}

export default FinalStep;
