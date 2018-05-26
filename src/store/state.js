import { CookieLocale } from '@/common/js/i18n/i18n.js'
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
    href: '',
    largeWidth: false
  },
  fromApp: false,
  language: CookieLocale,
  DepositAddress: {
  },
  SideSlipMenu: false,
  marketData: '',
  CmsUrl: '',
  Pc: false,
  api: {
    apiData: [],
    editId: '',
    editIp: '',
    editLabel: '',
    editKey: '',
    editIndex: ''
  },
  assets: '',
  TotalAssets: '',
  LockedAssets: '',
  Location: ''
}

export default state
