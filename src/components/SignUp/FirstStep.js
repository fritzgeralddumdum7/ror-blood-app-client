import {
  Container,
  PasswordInput,
  Stack,
  TextInput,
  Box,
  Title
} from '@mantine/core';
import FooterAction from '@/components/SignUp/FooterAction';
import { useForm } from '@mantine/form';

const FirstStep = ({ nextStepHandler, prevStepHandler, setUserInfoHandler, userInfo, error }) => {
  const form = useForm({
    initialValues: userInfo,
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      password: (value) => {
        if (!value) {
          return 'Password is required';
        } else if (value.length < 8) {
          return 'Password must be at least 8 characters long';
        }

        return null;
      },
      confirm_password: (value, values) => value === values.password && value ? null : 'Password does not match',
    },
  });

  return (
    <Box pt={50}>
      <form onSubmit={form.onSubmit((values) => {
        setUserInfoHandler(values);
        nextStepHandler();
      })}>
        <Title order={3} sx={{ textAlign: 'center' }}>Account Information</Title>
        <Container size='xs' pt={50}>
          <Stack spacing={20}>
            <Box>
              <TextInput
                label="Email Address"
                size='lg'
                {...form.getInputProps('email')}
                error={error}
              />
            </Box>
            <PasswordInput
              size='lg'
              label="Password"
              {...form.getInputProps('password')}
            />
            <PasswordInput
              size='lg'
              label="Confirm Password"
              {...form.getInputProps('confirm_password')}
            />
          </Stack>
        </Container>
        <FooterAction
          nextStepHandler={nextStepHandler}
          prevStepHandler={prevStepHandler}
          isFinal={error}
        />
      </form>
    </Box>
  );
}

export default FirstStep;
