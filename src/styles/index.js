const button = {
  root: {
    color: '#456DC7',
    backgroundColor: '#fff',
    borderColor: '#e1e7f4',
    borderRadius: 30,
    fontSize: 12,
    '&:hover': {
      backgroundColor: '#3256a7',
      borderColor: 'transparent',
      color: '#fff'
    }
  }
}

const custom = {
  graySection: {
    backgroundColor: '#F4F6FB'
  },
  stepFooter: {
    position: 'absolute',
    right: 0,
    borderTop: '1px solid #ced4da',
    width: '100%',
    bottom: 0,
    backgroundColor: '#fff'
  }
}

export {
  button,
  custom
};
