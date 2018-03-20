<template>
  <transition name='SideSlipMenu'>
    <div class='btc-SideSlipMenu' v-if='SideSlipMenu' @click='SideSlipMenuDisplay(false)'>
      <div>
        <ul>
          <li class='btc-marginL30 btc-marginT30'>
            {{ loginData.show_name }}
          </li>
          <li>
            <router-link :to="`${ROUTER_VERSION}/currency/deposit`">
              <img src='~Img/sideslip-assets.png'>
              {{ $t('side_slip_menu.asset_management') }}
            </router-link>
          </li>
          <li class='btc-paddingB0'>
            <img src='~Img/sideslip-consulting.png'> {{ $t('side_slip_menu.consulting_center') }}
            <span class="btc-right">
              <img src="~Img/triangle-down.png">
              <img src="~Img/triangle-up.png">
            </span>
            <ul>
              <li class='btc-paddingT60 btc-marginL30'>
                <a :href="`${HOST_URL}/xchg`">
                  {{ $t('side_slip_menu.announcement') }}
                </a>
              </li>
              <li class='btc-marginL30'>
                FAQ
              </li>
              <li class='btc-marginL30'>
                {{ $t('side_slip_menu.news') }}
              </li>
            </ul>
          </li>
          <li>
            <img src='~Img/sideslip-myaccount.png'> {{ $t('side_slip_menu.my_account') }}
          </li>
          <li>
            <img src='~Img/sideslip-lang.png'> {{ $t('side_slip_menu.language') }}
            <ul>
              <li class='btc-paddingT60 btc-marginL30'>
                正體中文
              </li>
              <li class='btc-marginL30'>
                English
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  name: 'SideSlipMenu',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION
    }
  },
  methods: {
    ...mapMutations(['SideSlipMenuDisplay'])
  },
  computed: mapState(['SideSlipMenu', 'loginData'])
}
</script>

<style lang='scss' scoped>
  @import './SideSlipMenu.scss'
</style>
