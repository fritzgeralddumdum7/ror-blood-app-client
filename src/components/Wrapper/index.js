import React, { useState, useEffect } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Anchor,
  Group,
  Avatar,
  Menu,
  Box,
  ThemeIcon,
  Modal,
  TextInput,
  Grid,
  Tooltip,
  Loader,
  Button,
  Stack,
  PasswordInput,
  Badge
} from '@mantine/core';
import { DONOR_NAV_ITEMS, ORGS_NAV_ITEMS, ADMIN_NAV_ITEMS } from '@/constant';
import { Pencil, Power, Mail, Lock } from 'tabler-icons-react';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useSelector, useDispatch } from 'react-redux';
import { User } from '@/services';
import API from '@/api/base';
import { fetchUserProfile } from '@/redux/users';
import Alert from '../Alert';
import { useDebouncedValue } from '@mantine/hooks';

const Wrapper = ({ children }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [isInfoOpened, setIsInfoOpened] = useState(false);
  const date = new Date();
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null);
  const { provinces } = useSelector(state => state.provinces);
  const [provinceList, setProvinceList] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const { authUser, tally } = useSelector(state => state.users);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [isPasswordOpened, setIsPasswordOpened] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [debounced] = useDebouncedValue(currentPassword, 1000, { leading: true });
  const [currentPasswordError, setCurrentPasswordError] = useState({});
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const location = useLocation();
  const [isToggled, setIsToggled] = useState(false);

  const form = useForm({
    initialValues: {
      firstname: null,
      lastname: null,
      birthday: null,
      province: null,
      city_municipality_id: null,
      middlename: null,
      address: null,
      email: null
    },

    validate: {
      firstname: (value) => value ? null : 'First name is required',
      lastname: (value) => value ? null : 'Last name is required',
      address: (value) => (!value || value) && null
    },
  });

  const passwordForm = useForm({
    initialValues: {
      password: null,
      new_password: null,
      confirm_password: null
    },

    validate: {
      password: (value) => value ? null : 'Current password is required',
      new_password: (value, values) => {
        if (values.password) {
          if (!value) {
            return 'Password is required';
          } else if (value.length < 8) {
            return 'Password must be at least 8 characters long';
          } else if (values.password === value) {
            return 'Please use another password.';
          }
  
          return null;
        }
      },
      confirm_password: (value, values) => {
        if (values.password) {
          return value === values.new_password && value ? null : 'Password does not match'
        }
      },
    },
  });

  const renderBadge = (withBadge) => {
    if ([1, 2].includes(authUser?.role) && withBadge && tally?.appointments > 0) {
      return (
        <div style={{ width: 'auto' }}>
          <Badge variant="filled" color='red' fullWidth sx={{ pointerEvents: 'none' }}>
            {tally.appointments}
          </Badge>
        </div>
      );
    }
  }

  const renderNavItems = () => {
    let items = [];

    if (authUser?.role === 1) {
      items = DONOR_NAV_ITEMS;
    } else if (authUser?.role === 2) {
      items = ORGS_NAV_ITEMS;
    } else if (authUser?.role === 4) {
      items = ADMIN_NAV_ITEMS;
    }

    return items.map(({ Component, text, href, withBadge, name }, i) => {
      return (
        <Anchor key={i} p={13} underline={false} href={href} styles={() => ({
          root: {
            '&:hover': {
              backgroundColor: 'rgb(248, 249, 250)',
              borderRadius: 3
            }
          }
        })}>
          <Navbar.Section>
            <Group
              position='apart'
              spacing={!href.includes(location.pathname) && 24}
              ml={!href.includes(location.pathname) && 7}
            >
              <Group>
                {
                  href.includes(location.pathname) ?
                    <ThemeIcon size='lg'>
                      <Component size={18} />
                    </ThemeIcon> :
                    <Component size={18} />
                }
                <Text>{text}</Text>
              </Group>
              {
                renderBadge(withBadge)
              }
            </Group>
          </Navbar.Section>
        </Anchor>
      );
    });
  }

  const handleLogout = () => {
    User.logout()
      .then(() => {
        auth.logout();
        delete API.defaults.headers['Authorization'];
        navigate('/login', { replace: true });
      })
  }

  useEffect(() => {
    setUserInfo(authUser);
  })

  useEffect(() => {
    if (userInfo) {
      for (const [key, value] of Object.entries(form.values)) {
        form.setFieldValue([key], userInfo[key])
      }
    }
  }, [userInfo])

  useEffect(() => {
    if (provinces.length) {
      setProvinceList(provinces);
    }
  }, [provinces])

  const updatePasswordHandler = () => {
    setIsInfoOpened(false);
    setTimeout(() => {
      setIsPasswordOpened(true);
    }, 300)
  }

  const editProfileHandler = () => {
    setIsPasswordOpened(false);
    setCurrentPasswordError({});
    setTimeout(() => {
      setIsInfoOpened(true);
    }, 300)
  }

  const getUserHeader = () => {
    if (authUser?.role === 1 || authUser?.role === 4) {
      return {
        profileIcon: authUser.blood_type?.name || 'BD',
        name: `${authUser.firstname} ${authUser.lastname}`,
        email: authUser.email
      }
    } else if (authUser?.role === 2) {
      return {
        profileIcon: 'BD',
        name: authUser.organization.name,
        email: authUser.email
      }
    }
  }

  useEffect(() => {
    if (debounced) {
      User.validatePassword({ password: debounced })
        .then(res => {
          if (res.data.error) {
            setCurrentPasswordError({ valid: false, msg: res.data.error });
          } else {
            setCurrentPasswordError({ valid: true });
          }
          setIsTypingPassword(false);
        })
    }
  }, [debounced])

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 300 }}>
          {renderNavItems()}
        </Navbar>
      }
      footer={
        <Footer height={50} p="md">
          Avion School - © {date.getFullYear()} - {date.getFullYear() + 1}
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <Group position='right'>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Menu control={
              <Group sx={{ cursor: 'pointer' }}>
                <Tooltip opened={isToggled} label={authUser?.role === 1 ? 'Blood Type' : 'Blood Donate'} withArrow>
                  <Avatar
                    styles={() => ({
                      root: {
                        border: '1px solid #FA5252'
                      }
                    })}
                    color="red" radius="xl"
                    onMouseEnter={() => setIsToggled(true)}
                    onMouseLeave={() => setIsToggled(false)}
                  >
                    {getUserHeader()?.profileIcon || 'BD'}
                  </Avatar>
                </Tooltip>
                <Box>
                  <Text size='sm' sx={{ lineHeight: '20px' }}>{getUserHeader()?.name}</Text>
                  <Text size='sm' color='#868e96' sx={{ lineHeight: '20px' }}>{getUserHeader()?.email}</Text>
                </Box>
              </Group>
            }>
              <Menu.Item icon={<Pencil size={20} />} onClick={() => setIsInfoOpened(true)}>
                Edit Profile
              </Menu.Item>
              <Menu.Item icon={<Power size={20} />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu>
          </Group>
        </Header>
      }
    >
      <Alert
        isShow={isShowAlert}
        setIsShow={setIsShowAlert}
        type='success'
        text={alertMsg}
      />
      <Modal
        opened={isPasswordOpened}
        onClose={() => {
          setIsPasswordOpened(false);
          setCurrentPassword(null);
          setCurrentPasswordError({});
        }}
        centered
        title="Update password"
      >
        <form onSubmit={passwordForm.onSubmit((values) => {
          console.log(values)
          User.updatePassword({ user: values }, 'PUT')
            .then(res => {
              setIsShowAlert(true);
              setAlertMsg(res.data.message);
              setIsPasswordOpened(false);
              setCurrentPassword(null);
            })
            .catch(err => console.error(err))
        })}>
          <Stack spacing={10}>
            <PasswordInput
              label="Current Password"
              icon={isTypingPassword && currentPassword ? <Loader size={18} /> : <Lock size="18" />}
              onChange={(event) => {
                passwordForm.clearFieldError('password');
                passwordForm.setFieldValue('password', event.target.value);
                setCurrentPassword(event.target.value);
                setIsTypingPassword(true);
              }}
              error={passwordForm.errors.password || currentPasswordError.msg}
            />
            {
              (currentPassword && currentPasswordError.valid) && (
                <>
                  <PasswordInput
                    label="New Password"
                    icon={<Lock size="18" />}
                    {...passwordForm.getInputProps('new_password')}
                  />
                  <PasswordInput
                    label="Confirm Password"
                    icon={<Lock size="18" />}
                    {...passwordForm.getInputProps('confirm_password')}
                  />
                </>
              )
            }
          </Stack>
          <Group mt='lg' position='right'>
            <Button onClick={editProfileHandler} variant='outline' >Edit Profile</Button>
            <Button type='submit' color='red'>Update Password</Button>
          </Group>
        </form>
      </Modal>
      <Modal
        opened={isInfoOpened}
        centered
        size='xl'
        onClose={() => setIsInfoOpened(false)}
        title="Your Profile"
      >
        <form onSubmit={form.onSubmit((values) => {
          User.upsert({ user: values }, 'PUT')
            .then(() => {
              dispatch(fetchUserProfile());
              setIsUpdate(false);
              setIsShowAlert(true);
              setIsInfoOpened(false);
              setAlertMsg('Profile updated successfully');
            })
            .catch(err => console.error(err))
        })}>
          <Grid grow>
            <Grid.Col span={4}>
              <TextInput
                label="First Name"
                readOnly={!isUpdate}
                rightSection={isUpdate && <Pencil color='gray' size="15" />}
                {...form.getInputProps('firstname')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Last Name"
                readOnly={!isUpdate}
                rightSection={isUpdate && <Pencil color='gray' size="15" />}
                {...form.getInputProps('lastname')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                placeholder="(optional)"
                label="Middle Name"
                readOnly={!isUpdate}
                {...form.getInputProps('middlename')}
                rightSection={isUpdate && <Pencil color='gray' size="15" />}
              />
            </Grid.Col>
          </Grid>
          <Grid grow>
            <Grid.Col span={12}>
              <TextInput
                label="Email Address"
                icon={<Mail size={18} />}
                disabled={true}
                {...form.getInputProps('email')}
              />
            </Grid.Col>
          </Grid>
          <Grid grow>
            <Grid.Col span={12}>
              <TextInput
                label="Address"
                readOnly={!isUpdate}
                rightSection={isUpdate && <Pencil color='gray' size="15" />}
                {...form.getInputProps('address')}
              />
            </Grid.Col>
          </Grid>
          <Group position='right'>
            <Button mt='xl' onClick={updatePasswordHandler} color='red'>Update Password</Button>
            {
              !isUpdate ?
                <Button mt='xl' onClick={(e) => {
                  e.preventDefault();
                  setIsUpdate(true);
                }}>Edit Profile</Button> :
                <Button mt='xl' type='submit' color='red'>Save Changes</Button>
            }
          </Group>
        </form>
      </Modal>
      {children}
    </AppShell>
  );
}

export default Wrapper;
