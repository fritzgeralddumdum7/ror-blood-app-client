import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Stepper,
  Box,
  LoadingOverlay
} from '@mantine/core';
import FirstStep from '@/components/SignUp/FirstStep';
import SecondStep from '@/components/SignUp/SecondStep';
import FinalStep from '@/components/SignUp/FinalStep';
import { User, CityMunicipality } from '@/services';
import { formatAsSelectData } from '@/helpers';

const SignUp = () => {
  const [visible, setVisible] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [active, setActive] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);

  const nextStepHandler = () => {
    if (active === 2 || error) {
      return
    }
    setActive(state => state += 1);
  }

  const prevStepHandler = () => {
    if (active !== 0) {
      setActive(state => state -= 1);
    }
  }

  const setUserInfoHandler = (user) => {
    setUserInfo(state => ({ ...state, ...user }));
  }

  const fetchCityHandler = (id) => {
    CityMunicipality.getCityMunicipalities(id)
      .then(res => {
        const data = res.data.data;
        setCities(formatAsSelectData(data, 'name'));
      }).catch(err => console.error(err))
  }

  useEffect(() => {
    if (isFinal) {
      setVisible(true);
      User.upsert({ user: userInfo })
        .then(() => {
          navigate('/login');
        })
        .catch(error => {
          const res = error.response.data;
          setError(res.email[0]);
          setActive(0);
        })
        .finally(() => setVisible(false))
    }
  }, [userInfo, isFinal]);

  return (
    <Box>
      <LoadingOverlay visible={visible} />
      <Container size='md' pt={100} pb={150}>
        <Stepper active={active <= 2 && active} breakpoint="sm">
          <Stepper.Step label="First step" description="Create account">
            <FirstStep
              nextStepHandler={nextStepHandler}
              prevStepHandler={prevStepHandler}
              userInfo={userInfo}
              setUserInfoHandler={setUserInfoHandler}
              error={error}
            />
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Basic Info">
            <SecondStep
              nextStepHandler={nextStepHandler}
              prevStepHandler={prevStepHandler}
              userInfo={userInfo}
              setUserInfoHandler={setUserInfoHandler}
              setCities={setCities}
              cities={cities}
              fetchCityHandler={fetchCityHandler}
            />
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Profile">
            <FinalStep
              role={role}
              setRole={setRole}
              nextStepHandler={nextStepHandler}
              prevStepHandler={prevStepHandler}
              userInfo={userInfo}
              setUserInfoHandler={setUserInfoHandler}
              setIsFinal={setIsFinal}
            />
          </Stepper.Step>
        </Stepper>
      </Container>
    </Box>
  );
}

export default SignUp;
