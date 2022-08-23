import { useState } from 'react';
import {
  Modal,
  Title,
  Stack,
  Center,
  ThemeIcon,
  Group,
  Button,
  Dialog,
  Notification,
} from '@mantine/core';
import { Trash, Check } from 'tabler-icons-react';

const Alert = ({ isShow, setIsShow, text, type }) => {

  const renderIcon = () => {
    if (type === 'success') {
      return (
        <ThemeIcon mt={20} color='red' size='xl' sx={{
          borderRadius: 9999
        }}
        >
          <Trash
            color={'#fff'}
          />
        </ThemeIcon>
      );
    }else if (type == 'error'){

    }
  }

  const alertObj = {
    success: {
      title: 'Success',
      icon: <Check size={18} />
    },
    error: {
      title: 'Unsuccessful',
      icon: <Trash size={18} />
    },
  }

  return (
    <Dialog
      opened={isShow}
      onClose={() => setIsShow(false)}
      size="md"
      radius="md"
      position={{ top: 20, right: 20 }}
      p={0}
      style={{ border: 0 }}
    >
      <Notification icon={alertObj[type].icon} color="teal" title={alertObj[type].title} onClose={() => setIsShow(false)}>
        {text}
      </Notification>
    </Dialog>
  )
};

export default Alert;
