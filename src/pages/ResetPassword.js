import {
    Container,
    Stack,
    Button,
    TextInput,
    Anchor,
    Group
  } from '@mantine/core';
  import { useForm } from '@mantine/form';
  
  const ResetPassword = () => {
    const form = useForm({
      initialValues: {
        email: ''
      },
  
      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address')
      },
    });
  
    return (
      <Container size='xs'>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack spacing={30} pt={150}>
          <TextInput
            id="input-demo"
            size='lg'
            label="Email Address"
            placeholder='Email Address'
            {...form.getInputProps('email')}
          />
          <Group position='apart'>
            <Anchor href="/login" size='lg'>
              Back to login
            </Anchor>
            <Button size='lg' px={50} type='submit'>
              Reset Password
            </Button>
          </Group>
        </Stack>
        </form>
      </Container>
    );
  }
  
  export default ResetPassword;
  