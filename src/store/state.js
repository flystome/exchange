import Cookies from 'js-cookie'

const state = {
  loginData: 'none',
  Wrapper: false,
  PopupBox: {
    type: 'success',
    status: false,
    message: '',
    url: '',
    buttonText: '',
    buttondisplay: true,
    confirm: false,
    b: ''
  },
  fromApp: false,
  language: Cookies.get('locale') ? Cookies.get('locale') : 'en',
  DepositAddress: {
  },
  SideSlipMenu: false,
  marketData: '',
  CmsUrl: '',
  Pc: false
}

export default state
