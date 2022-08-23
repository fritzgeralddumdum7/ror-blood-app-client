import { useState } from 'react';
import {
  Group,
  Text,
  Anchor,
  Button
} from '@mantine/core';
import { custom } from '@/styles';

const FooterAction = ({ isFinal = false, prevStepHandler }) => {
  const [active, setActive] = useState(0);
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Group position="apart" px={30} py={50} sx={custom.stepFooter}>
      <Text size="lg">
        Already have an account?
        <Anchor href="/login" size='lg' ml={5}>
          Sign in here
        </Anchor>
      </Text>
      <Group>
        <Button variant="default" size='lg' onClick={prevStepHandler}>Back</Button>
        {
          isFinal ?
            <Button color='red' type='submit' size='lg'>Register</Button> :
            <Button type='submit' size='lg'>Next step</Button>
        }
      </Group>
    </Group>
  );
}

export default FooterAction;
