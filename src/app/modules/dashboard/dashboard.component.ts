import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import * as Highcharts from 'highcharts/highmaps';
import { MAP_DATA } from 'src/assets/world-map/world';
import { Summary, CountryCount, Country } from './dashboard.models';
import * as Highstock from 'highcharts/highstock';
import { OrderByPipe } from 'src/app/pipes/order-by.pipe';
import * as moment from 'moment';


Highcharts.maps['custom/world'] = MAP_DATA;

@Component({
  selector: 'cd-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'], providers: [OrderByPipe]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  loading = true;
  linechartloading = true;
  summary: Summary = new Summary();
  countryData: CountryCount[] = [];
  topCountries: Country[] = [];
  caseTypes = ['confirmed', 'recovered', 'deaths'];
  selectedCaseType = 'confirmed';
  top = 5;
  series = [];
  chart: Highcharts.Chart;

  orderByField = 'TotalConfirmed';
  order = 'desc';

  constructor(private dashboardService: DashboardService, private orderBy: OrderByPipe) {
    this.dashboardService.getTotal().subscribe(summary => {
      console.log(summary);
      this.summary = summary;

      this.countryData = this.summary.Countries.map(c => {
        return new CountryCount(c.CountryCode, c.Country, c.TotalConfirmed < 1 ? 1 : c.TotalConfirmed, c.Slug);
      });
      this.plotMap(this.countryData);


      this.topCountries = orderBy.transform(this.summary.Countries, 'TotalConfirmed', 'desc').slice(0, this.top);

      this.getTopContriesData();
      this.loading = false;
    })
  }

  ngOnInit(): void {

  }

  get orderIcon() {
    return this.order === 'desc' ? 'arrow-downward' : 'arrow-upward';
  }

  setOrderBy(field) {
    if (this.orderByField === field) {
      this.order = this.order === 'desc' ? 'asc' : 'desc';
    }else{
      this.orderByField=field;
    }
  }

  getPercentage(total, value) {
    if (total && value) {
      const per = (value * 100) / total;
      return per.toFixed(2) + '%';
    }
    return 0;
  }
  updateCaseType(caseType: string) {
    this.linechartloading=true;
    this.selectedCaseType = caseType;
    this.getTopContriesData();
  }
  updateLineChart(countries: Country[]) {
    //  console.log(countries);
    this.topCountries = countries;
    this.getTopContriesData();
  }

  getTopContriesData() {
    // console.log("Generating Series");
    this.series = [];
    let count = 0;
    this.topCountries.forEach((country, idx) => {
      //  console.log(country);
      this.dashboardService.getTrend(country.Slug, this.selectedCaseType).subscribe(trend => {
        const data = trend.map(point => {

          // { x: +moment(point.Date, 'YYYY-MM-DD\'T\'HH:mm:ss\'Z\'').format('x'), y: point.Cases };
          return [+moment(point.Date, 'YYYY-MM-DD\'T\'HH:mm:ss\'Z\'').format('x'), point.Cases];
        });
        // if (country.Slug === 'france') {
        //   console.log(data);
        // }
        this.series.push({
          name: country.Country,
          data,
          type: 'spline',
          tooltip: {
            valueDecimals: 0
          }
        });
        count += 1;
        //   console.log(count);
        if (count === this.topCountries.length) {
          this.linechartloading = false;
          this.plotLineChart();
        }
      });
    })
  }

  ngAfterViewInit(): void {
    this.plotMap(this.countryData);

  }
  plotLineChart() {
    if (this.chart)
      this.chart.destroy();
    this.chart = Highstock.stockChart('line-chart', {
      chart: {
        height: 270,
      },
      rangeSelector: {
        enabled: false,
        selected: 1
      },

      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      legend: {
        enabled: true
      },
      // title: {

      //   text: '',
      // },
      credits: {
        enabled: false
      },
      plotOptions: {
        spline: {
          dataGrouping: {
            units: [[
              'day',
              [1]
            ]]
          }
        }
      },

      series: this.series
    });
  }

  plotMap(countryData: CountryCount[]) {
    // Prevent logarithmic errors in color calulcation

    // Initiate the chart
    Highcharts.mapChart('world-map', {

      chart: {
        map: 'custom/world',
        spacing: [5, 5, 5, 5]
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Confirmed Cases'
      },

      legend: {
        enabled: true,
        align: 'right',
        layout: 'vertical',
        title: {
          text: '#',
          style: {
            color: ( // theme
              Highcharts.defaultOptions &&
              Highcharts.defaultOptions.legend &&
              Highcharts.defaultOptions.legend.title &&
              Highcharts.defaultOptions.legend.title.style &&
              Highcharts.defaultOptions.legend.title.style.color
            ) || 'black'
          }
        }
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },

      tooltip: {
        backgroundColor: 'none',
        borderWidth: 0,
        shadow: false,
        useHTML: true,
        padding: 0,
        pointFormat: '<span class="f32"><span class="flag {point.properties.hc-key}">' +
          '</span></span> {point.name}<br>' +
          '<span style="font-size:30px">{point.value}</span>',
        positioner: function () {
          return { x: 0, y: 0 };
        }
      },

      colorAxis: {
        min: null,
        max: null,
        // minColor:'#016400',
        // maxColor:'#920000',
        type: 'logarithmic'
      },

      series: [{
        type: undefined,
        data: countryData,
        joinBy: ['iso-a2', 'code'],
        name: 'Confirmed Cases',
        states: {
          hover: {
            color: '#a4edba'
          }
        }
      }]
    });
  }





  colorCountry(country) {

    // console.log(countries.numericToAlpha3(country.id));
  };

}
