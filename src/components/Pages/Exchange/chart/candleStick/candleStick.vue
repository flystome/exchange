<template>
  <section id='candleStick'>
  </section>
</template>

<script>
const TradingView = require('Static/charting_library/charting_library.min.js')
require('Static/datafeeds/udf/dist/polyfills.js')
const Datafeeds = require('Static/datafeeds/udf/dist/bundle.js')

export default {
  name: 'candleStick',
  props: ['market'],
  data () {
    return {
      widget: null,
      symbolInfo: null,
      url: '',
      HOST_URL: process.env.HOST_URL,
      curMarket: ''
    }
  },
  mounted () {
    this.curMarket = this.$route.params.id
    this.createWidget()
  },
  methods: {
    createWidget () {
      // let _this = this
      this.url = location.origin + '/static/charting_library/'
      this.cssUrl = location.origin + '/static/charting_library/static/style/selfTrading.scss'
      var udfDatafeed = new Datafeeds.UDFCompatibleDatafeed(this.HOST_URL + '/api/v2')

      var widget = new TradingView.widget({
        // debug: true, // uncomment this line to see Library errors and warnings in the console
        autosize: true,
        symbol: this.curMarket,
        interval: '30',
        toolbar_bg: '#f4f7f9',
        container_id: 'candleStick',
        datafeed: udfDatafeed,
        library_path: this.url,
        custom_css_url: this.cssUrl,
        // locale: getParameterByName('lang') || 'en',
        drawings_access: { type: 'black', tools: [ { name: 'Regression Trend' } ] },
        disabled_features: ['left_toolbar', 'header_saveload', 'compare_symbol', 'display_market_status', 'go_to_date', 'header_chart_type', 'header_compare', 'header_interval_dialog_button', 'header_resolutions', 'header_screenshot', 'header_symbol_search', 'header_undo_redo', 'legend_context_menu', 'show_hide_button_in_legend', 'show_interval_dialog_on_key_press', 'snapshot_trading_drawings', 'symbol_info', 'timeframes_toolbar', 'use_localstorage_for_settings', 'volume_force_overlay', 'hide_last_na_study_output', 'legend_context_menu', 'dont_show_boolean_study_arguments'],
        enabled_features: ['move_logo_to_main_pane', 'study_templates', 'adaptive_logo'],
        overrides: {
          'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0)',
          'volumePaneSize': 'small',
          'paneProperties.background': '#232e3a',
          'paneProperties.vertGridProperties.color': '#273646',
          'paneProperties.horzGridProperties.color': '#273646',
          'paneProperties.crossHairProperties.color': '#ffffff',
          'paneProperties.crossHairProperties.style': 'border',
          'scalesProperties.lineColor': '#728eaa',
          'mainSeriesProperties.haStyle.upColor': '#e9454d',
          'mainSeriesProperties.haStyle.downColor': '#40b246',
          'mainSeriesProperties.haStyle.borderUpColor': '#e9454d',
          'mainSeriesProperties.haStyle.borderDownColor': '#40b246',
          'mainSeriesProperties.haStyle.wickUpColor': '#e9454d',
          'mainSeriesProperties.haStyle.wickDownColor': '#40b246',
          'mainSeriesProperties.haStyle.drawWick': true,
          'mainSeriesProperties.haStyle.drawBorder': true,
          'study_Overlay@tv-basicstudies.hollowCandleStyle.wickColor': '#ffff00',
          'mainSeriesProperties.style': 8,
          'scalesProperties.showLeftScale': false,
          'scalesProperties.textColor': '#728eaa',
          'mainSeriesProperties.barStyle.upColor': '#ffff00',
          'paneProperties.rightMargin': 10,
          'paneProperties.bottomMargin': 10,
          'mainSeriesProperties.showPriceLine': true,
          'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0.00)'
        },
        timezone: 'Asia/Shanghai',
        studies_overrides: {
          'volume.volume.color.0': '#e9454d',
          'volume.volume.color.1': '#40b246',
          'volume.volume.transparency': 100,
          'volume.volume ma.color': '#FF0000',
          'volume.volume ma.transparency': 100,
          'volume.volume ma.linewidth': 5,
          'volume.show ma': true,
          'bollinger bands.median.color': '#33FF88',
          'bollinger bands.upper.linewidth': 7
          // "price.precision": 8
        },
        debug: true,
        time_frames: [
          { text: '50y', resolution: '6M' },
          { text: '3y', resolution: 'W' },
          { text: '8m', resolution: 'D' },
          { text: '2m', resolution: 'D' },
          { text: '1m', resolution: '60' },
          { text: '1w', resolution: '30' },
          { text: '7d', resolution: '30' },
          { text: '5d', resolution: '10' },
          { text: '3d', resolution: '10' },
          { text: '2d', resolution: '5' },
          { text: '1d', resolution: '5' }
        ],
        charts_storage_api_version: '1.1',
        favorites: {
          intervals: ['1D', '3D', '3W', 'W', 'M'],
          chartTypes: ['Area', 'Line']
        }
      })

      widget.onChartReady(function () {
        let chart = widget.chart()

        let mas = [{
          day: 5,
          color: '#c0a365'
        }, {
          day: 10,
          color: '#9856bb'
        }, {
          day: 30,
          color: '#3c91cc'
        }, {
          day: 60,
          color: '#3da235'
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
            // widget.MAStudies.push(entity)
          }, {'plot.color': item.color})
        })

        buttons.forEach((item, index) => {
          let button = widget.createButton()
          console.log(item)

          // item.resolution === widget.options.interval && updateSelectedIntervalButton(button)
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
                  widget.applyOverrides({
                   'mainSeriesProperties.style': chartType
                  })
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
    }
  }
}
</script>

<style lang='scss'>
  @import './candleStick.scss'
</style>
