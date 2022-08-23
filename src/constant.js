import {
  HeartHandshake,
  Mail,
  Notes,
  LayoutDashboard,
  Users,
  BuildingCommunity
} from 'tabler-icons-react';

export const DONOR_NAV_ITEMS = [
  {
    text: 'Dashboard',
    Component: LayoutDashboard,
    href: ['/'],
    withBadge: false
  },
  {
    text: 'Requests',
    Component: HeartHandshake,
    href: ['/requests'],
    withBadge: false
  },
  {
    text: 'Appointments',
    Component: Notes,
    href: ['/appointments'],
    withBadge: true
  },  
]

export const ORGS_NAV_ITEMS = [
  {
    text: 'Dashboard',
    Component: LayoutDashboard,
    href: ['/'],
    withBadge: false
  },
  {
    text: 'Requests',
    Component: HeartHandshake,
    href: ['/requests'],
    withBadge: false
  },
  {
    text: 'Appointments',
    Component: Notes,
    href: ['/appointments'],
    withBadge: true,
    name: 'appointments'
  },
  {
    text: 'Patients',
    Component: Users,
    href: ['/patients']
  }
]

export const ADMIN_NAV_ITEMS = [
  {
    text: 'Organizations',
    Component: BuildingCommunity,
    href: ['/organizations']
  },
  {
    text: 'Patients',
    Component: Users,
    href: ['/patients']
  },
  {
    text: 'Donors',
    Component: HeartHandshake,
    href: ['/donors']
  },
  {
    text: 'Cases',
    Component: Notes,
    href: '/cases'
  },  
]

export const ROLES = [
  {
    value: '1',
    label: 'Donor'
  },
  {
    value: '2',
    label: 'Organization Member'
  },
  {
    value: '3',
    label: 'Patient'
  }
]

export const LINE_CHART_CONFIG = {
  type: 'line',
  data: {
    datasets: []
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'right',
        align: 'start'
      },
      title: {
        display: true,
        text: 'Cases per Month',
        position: 'bottom',
        padding: 20,
        color: '#000',
        font: {
          size: 16
        }
      }
    }
  }
}
export const APPOINTMENT_SCHEDS = [
  {
    value: '7:30 am',
    label: "7:30 am"                
  },
  {
    value: '8:00 am',
    label: "8:00 am"                
  },
  {
    value: '8:30 am',
    label: "8:30 am"                
  },
  {
    value: '9:00 am',
    label: "9:00 am"                
  },
  {
    value: '9:30 am',
    label: "9:30 am"                
  },
  {
    value: '10:00 am',
    label: "10:00 am"                
  },
  {
    value: '10:30 am',
    label: "10:30 am"                
  },
  {
    value: '11:00 am',
    label: "11:00 am"                
  },
  {
    value: '11:30 am',
    label: "11:30 am"                
  },
  {
    value: '12:00 pm',
    label: "12:00 pm"                
  },
  {
    value: '1:00 pm',
    label: "1:00 pm"                
  },
  {
    value: '1:30 pm',
    label: "1:30 pm"                
  },
  {
    value: '2:00 pm',
    label: "2:00 pm"                
  },
  {
    value: '2:30 pm',
    label: "2:30 pm"                
  },
  {
    value: '3:00 pm',
    label: "3:00 pm"                
  },
  {
    value: '3:30 pm',
    label: "3:30 pm"                
  },
  {
    value: '4:00 pm',
    label: "4:00 pm"                
  },
  {
    value: '4:30 pm',
    label: "4:30 pm"                
  },
  {
    value: '5:00 pm',
    label: "5:00 pm"                
  },
]
