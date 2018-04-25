<template>
  <section id="candleStick">
  </section>
</template>

<script>
// import path from 'path'
// import TradingView from '@/common/js/tradingView/charting_library/charting_library.min.js'
// import '@/common/js/tradingView/datafeeds/udf/dist/polyfills.js'
// import '@/common/js/tradingView/datafeeds/udf/dist/bundle.js'
// import Datafeeds from '@/common/js/tradingView/datafeeds/udf/dist/datafeed.js'

// require('@/common/js/tradingView/datafeeds/udf/dist/datafeed.js')

export default {
  name: 'candleStick',
  data () {
    return {
      widget: null,
      symbolInfo: null
    }
  },
  methods: {
    updateData (data) {
      if (data) {
        // this.$emit('real-time', data)
      }
    },
    createWidget () {
      let _this = this

      console.log(__dirname)

      this.$nextTick(function () {
        let widget = new TradingView.widget({
          symbol: "ETH/BTC",
          interval: '5',
          container_id: 'candleStick',
          datafeed: new Datafeeds.UDFCompatibleDatafeed('/api/v2/k_data?market=ethbtc&resolution=1', 10000),
          library_path: path.resolve(__dirname, 'src/common/js/tradingView/charting_library/'),
          custom_css_url: '/src/common/js/tradingView/charting_library/static/style/selfTrading.css',
          locale: 'zh',
          width: '100%',
          height: 516,
          drawings_access: { type: 'black', tools: [ { name: 'Regression Trend' } ] },
          disabled_features: ['left_toolbar', 'header_settings', 'header_indicators', 'header_saveload', 'compare_symbol', 'display_market_status', 'go_to_date', 'header_chart_type', 'header_compare', 'header_interval_dialog_button', 'header_resolutions', 'header_screenshot', 'header_symbol_search', 'header_undo_redo', 'legend_context_menu', 'show_hide_button_in_legend', 'show_interval_dialog_on_key_press', 'snapshot_trading_drawings', 'symbol_info', 'timeframes_toolbar', 'use_localstorage_for_settings', 'volume_force_overlay'],
          enabled_features: ['dont_show_boolean_study_arguments', 'hide_last_na_study_output', 'move_logo_to_main_pane', 'same_data_requery', 'side_toolbar_in_fullscreen_mode'],
          charts_storage_url: location.host,
          charts_storage_api_version: '1.1',
          toolbar_bg: 'transparent',
          timezone: 'Asia/Shanghai',
          overrides: _this.overrides()
        })

        widget.MAStudies = []
        widget.selectedIntervalButton = null

        widget.onChartReady(function () {
          let chart = widget.chart()

          let mas = [{
            day: 5,
            color: '#821f68'
          }, {
            day: 10,
            color: '#5c7798'
          }, {
            day: 30,
            color: '#397d51'
          }, {
            day: 60,
            color: '#60407f'
          }]
          let buttons = [{
            label: '分时',
            resolution: '1',
            chartType: 3
          }, {
            label: '1分',
            resolution: '1'
          }, {
            label: '5分',
            resolution: '5'
          }, {
            label: '15分',
            resolution: '15'
          }, {
            label: '30分',
            resolution: '30'
          }, {
            label: '1小时',
            resolution: '60'
          }, {
            label: '4小时',
            resolution: '240'
          }, {
            label: '1天',
            resolution: '1D'
          }, {
            label: '5天',
            resolution: '5D'
          }, {
            label: '1周',
            resolution: '7D'
          }, {
            label: '1个月',
            resolution: '1M'
          }]

          mas.forEach(item => {
            chart.createStudy('Moving Average', false, false, [item.day], entity => {
              widget.MAStudies.push(entity)
            }, {'plot.color': item.color})
          })

          chart.onIntervalChanged().subscribe(null, function (interval, obj) {
            widget.changingInterval = false
          })

          buttons.forEach((item, index) => {
            let button = widget.createButton()

            item.resolution === widget.options.interval && updateSelectedIntervalButton(button)
            button.attr('data-resolution', item.resolution)
              .attr('data-chart-type', item.chartType === undefined ? 1 : item.chartType)
              .html('<span>' + item.label + '</span>')
              .on('click', function () {
                if (!widget.changingInterval && !button.hasClass('selected')) {
                  let chartType = +button.attr('data-chart-type')
                  let resolution = button.attr('data-resolution')

                  if (chart.resolution() !== resolution) {
                    widget.changingInterval = true
                    chart.setResolution(resolution)
                  }
                  if (chart.chartType() !== chartType) {
                    chart.setChartType(chartType)
                    // widget.applyOverrides({
                    //  'mainSeriesProperties.style': chartType
                    // })
                  }
                  updateSelectedIntervalButton(button)
                  showMAStudies(chartType !== 3)
                }
              })
          })

          function updateSelectedIntervalButton (button) {
            widget.selectedIntervalButton && widget.selectedIntervalButton.removeClass('selected')
            button.addClass('selected')
            widget.selectedIntervalButton = button
          }

          function showMAStudies (visible) {
            widget.MAStudies.forEach(item => {
              chart.setEntityVisibility(item, visible)
            })
          }
        })

        _this.widget = widget
      })
    },
    updateWidget (item) {
      this.symbolInfo = {
        name: item.virtualCoinName,
        ticker: item.virtualCoinId,
        description: '',
        session: '24x7',
        supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '5D', '1W', '1M'],
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: true,
        timezone: 'UTC'
      }

      this.removeWidget()
      this.createWidget()
    },
    removeWidget () {
      if (this.widget) {
        this.widget.remove()
        this.widget = null
      }
    },
    overrides () {
      let style = {
        up: '#589065',
        down: '#ae4e54',
        bg: '#1d1d29',
        grid: '#1f2943',
        cross: '#9194A3',
        border: '#4e5b85',
        text: '#61688A',
        areatop: 'rgba(122, 152, 247, .1)',
        areadown: 'rgba(122, 152, 247, .02)'
      }

      return {
        volumePaneSize: 'medium',
        'scalesProperties.lineColor': style.text,
        'scalesProperties.textColor': style.text,
        'paneProperties.background': style.bg,
        'paneProperties.vertGridProperties.color': style.grid,
        'paneProperties.horzGridProperties.color': style.grid,
        'paneProperties.crossHairProperties.color': style.cross,
        'paneProperties.legendProperties.showLegend': !!style.showLegend,
        'paneProperties.legendProperties.showStudyArguments': true,
        'paneProperties.legendProperties.showStudyTitles': true,
        'paneProperties.legendProperties.showStudyValues': true,
        'paneProperties.legendProperties.showSeriesTitle': true,
        'paneProperties.legendProperties.showSeriesOHLC': true,
        'mainSeriesProperties.candleStyle.upColor': style.up,
        'mainSeriesProperties.candleStyle.downColor': style.down,
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.drawBorder': true,
        'mainSeriesProperties.candleStyle.borderColor': style.border,
        'mainSeriesProperties.candleStyle.borderUpColor': style.up,
        'mainSeriesProperties.candleStyle.borderDownColor': style.down,
        'mainSeriesProperties.candleStyle.wickUpColor': style.up,
        'mainSeriesProperties.candleStyle.wickDownColor': style.down,
        'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
        'mainSeriesProperties.hollowCandleStyle.upColor': style.up,
        'mainSeriesProperties.hollowCandleStyle.downColor': style.down,
        'mainSeriesProperties.hollowCandleStyle.drawWick': true,
        'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
        'mainSeriesProperties.hollowCandleStyle.borderColor': style.border,
        'mainSeriesProperties.hollowCandleStyle.borderUpColor': style.up,
        'mainSeriesProperties.hollowCandleStyle.borderDownColor': style.down,
        'mainSeriesProperties.hollowCandleStyle.wickColor': style.line,
        'mainSeriesProperties.haStyle.upColor': style.up,
        'mainSeriesProperties.haStyle.downColor': style.down,
        'mainSeriesProperties.haStyle.drawWick': true,
        'mainSeriesProperties.haStyle.drawBorder': true,
        'mainSeriesProperties.haStyle.borderColor': style.border,
        'mainSeriesProperties.haStyle.borderUpColor': style.up,
        'mainSeriesProperties.haStyle.borderDownColor': style.down,
        'mainSeriesProperties.haStyle.wickColor': style.border,
        'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,
        'mainSeriesProperties.barStyle.upColor': style.up,
        'mainSeriesProperties.barStyle.downColor': style.down,
        'mainSeriesProperties.barStyle.barColorsOnPrevClose': false,
        'mainSeriesProperties.barStyle.dontDrawOpen': false,
        'mainSeriesProperties.lineStyle.color': style.border,
        'mainSeriesProperties.lineStyle.linewidth': 1,
        'mainSeriesProperties.lineStyle.priceSource': 'close',
        'mainSeriesProperties.areaStyle.color1': style.areatop,
        'mainSeriesProperties.areaStyle.color2': style.areadown,
        'mainSeriesProperties.areaStyle.linecolor': style.border,
        'mainSeriesProperties.areaStyle.linewidth': 1,
        'mainSeriesProperties.areaStyle.priceSource': 'close'
      }
    }
  },
  watch: {
    coin (newVal, oldVal) {
      if (newVal) {
        if (oldVal && newVal.virtualCoinId !== oldVal.virtualCoinId) {
          this.updateWidget(newVal)
        }
      }
    }
  },
  mounted () {
    // this.coin && this.coin.virtualCoinId && this.updateWidget(this.coin)
    this.createWidget()
  }
}
</script>

<style lang='scss'>
  @import './candleStick.scss'
</style>
