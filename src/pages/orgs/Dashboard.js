import { useEffect, useState } from 'react';
import {
  Card,
  Grid,
  Title,
  Stack,
  Alert,
  LoadingOverlay
} from '@mantine/core';
import { Chart, registerables } from 'chart.js';
import { User } from '@/services';
import moment from 'moment';
import Wrapper from '@/components/Wrapper';
import { LINE_CHART_CONFIG } from '@/constant';
import Table from "@/components/Table";

const Dashboard = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [monthsLastYear, setMonthsLastYear] = useState([]);
  const [data, setData] = useState({});
  const [dataSet, setDataSet] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const COLUMNS = [
    'Organization',
    'Address',
    'Available requests',
    'Your # of patients helped',
    'Last blood donation'
  ];

  Chart.register(...registerables);

  const fetchUserDashboard = () => {
    User.dashboard()
      .then(res => {
        setData(res.data.data);
      })
  }

  useEffect(() => {
    setIsMounted(true);
    setMonthsLastYear(getAllMonthsLastYear());
  }, []);

  const getAllMonthsLastYear = () => {
    let months = []

    for (let i = 11; i >= 0; i--) {
      months.push(moment().subtract(i, 'months').calendar())
    }

    months = months.map((m, i) => {
      if (i === months.length - 1) {
        return moment().format('MMM, yyyy')
      } else {
        return moment(m).format('MMM, yyyy')
      }
    })

    return months;
  }

  useEffect(() => {
    if (isMounted) {
      fetchUserDashboard();
    }
  }, [isMounted])

  useEffect(() => {
    if (Object.keys(data).length) {
      const caseStats = data.case_stats.map(stat => ({
        label: stat.label,
        data: stat.data,
        fill: true,
        borderColor: rgbaRandomizer(0.5),
        backgroundColor: rgbaRandomizer(0.2),
        borderWidth: 1
      }))
      setDataSet(caseStats);
      setOrgList(data.orgs);
    }
  }, [data])

  useEffect(() => {
    if (dataSet.length) {
      LINE_CHART_CONFIG.data.datasets = dataSet;
      LINE_CHART_CONFIG.data.labels = monthsLastYear;

      const ctx = document.getElementById('myChart');
      const myChart = new Chart(ctx, LINE_CHART_CONFIG);

      return () => {
        myChart.destroy();
      }
    }
  }, [dataSet, monthsLastYear])

  const rgbaRandomizer = (opacity) => {
    const o = Math.round
    const r = Math.random
    const s = 255;
    return `rgba(${o(r() * s)}, ${o(r() * s)}, ${o(r() * s)}, ${opacity})`
  }



  const rows = data.orgs?.map((org) => (
    <tr>
      <td>{org.name}</td>
      <td>{org.address}</td>
      <td>{org.available_requests}</td>
      <td>{org.patients_helped}</td>
      <td>{org.last_donation ? moment(org.last_donation.created_at).format('MM/DD/YYYY hh:mm a') : 'No donations made'}</td>
    </tr>
  ));

  return (
    <Wrapper>
      <Stack>
      <Grid>
          <Grid.Col span={2}>
            <Card shadow="sm">
              <Stack>
                <Title order={5}>Total Requests</Title>
                <Title align='center'>{data.total_requests ?? 0}</Title>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={2}>
            <Card shadow="sm">
              <Stack>
                <Title order={5}>Pending Appointments</Title>
                <Title align='center'>{data.pending_appointments ?? 0}</Title>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={2}>
            <Card shadow="sm">
              <Stack>
                <Title order={5}>Total Patients</Title>
                <Title align='center'>{data.total_patients ?? 0}</Title>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={2}>
            <Card shadow="sm">
              <Stack>
                <Title order={5}>Total Patients Helped</Title>
                <Title align='center'>{data.patients_helped ?? 0}</Title>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="sm">
              <Stack spacing={12}>
                <Title order={5}>Next Appointment</Title>
                <Alert color="red">
                  {
                    data.next_appointment ? `${data.next_appointment.organization_name} @ ${moment(data.next_appointment.schedule).format('LLLL')}` : 'No appointments available'
                  }
                </Alert>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
        <Grid grow>
          <Grid.Col>
            <Card shadow="sm" sx={{ height: 600 }}>
              {
                isMounted ? <canvas id="myChart"></canvas> : <LoadingOverlay visible={true} />
              }
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Wrapper>
  );
}

export default Dashboard;
