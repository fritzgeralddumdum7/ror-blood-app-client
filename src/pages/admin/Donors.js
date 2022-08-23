import { useState, useEffect } from 'react';
import Wrapper from '@/components/Wrapper';
import {
  Drawer
} from '@mantine/core';
import AlertDialog from '@/components/AlertDialog';
import Alert from '@/components/AlertDialog';
import { User } from '@/services';
import Table from '@/components/Table';

const Donors = () => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [toProceed, setToProceed] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [transactionType, setTransactionType] = useState('');
  //for table items
  const [donors, setDonors] = useState([]);
  
  //table items
  const getDonors = () => {
    User.getByRole(1).then((response) => {//Donor = Role 1 
      setDonors(response.data.data);    
    }).catch(err => console.log(err));
  };

  useEffect(() => {
    getDonors();
  }, []);

  const rows = donors.map((element) => (
    <tr key={element.id}>
      <td>{element.attributes.name}</td>
      <td>{element.attributes.blood_type.name}</td>
      <td>{element.attributes.city_municipality.name}</td>
      <td>{element.attributes.province.data.attributes.name}</td>
      <td></td>
    </tr>
  ));

  return (
    <Wrapper>
      <Drawer
        opened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
        title={isEdit ? 'Edit Patient' : 'Create Patient'}
        padding="xl"
        size="xl"
        styles={() => ({
          title: { fontWeight: 'bold' }
        })}
      >
      </Drawer>
      <Alert
        isShow={isShowAlert}
        setIsShow={setIsShowAlert}
        type='error'
        text={alertMsg}
      />
      <AlertDialog
        isToggled={isDialogOpened}
        setIsToggled={setIsDialogOpened}
        setToProceed={setToProceed}
        text={alertMsg}
        type={transactionType}
      />
      <Table columns={['Patient', 'Blood Type', 'City/Municipality', 'Province']} rows={donors}>
        <tbody>{rows}</tbody>
      </Table>      
    </Wrapper>
  );
}

export default Donors;
