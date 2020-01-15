<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-pie-chart"></i> 回校統計
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="schart-box">
                <div class="content-title">气泡图</div>
                <!-- <schart class="schart" canvasId="bar" :options="options1"></schart> -->
                <v-chart class="schart" :options="bar" />
            </div>
            <div id="menu">
                <span id="menu-navi">
                    <el-button type="primary" icon="el-icon-arrow-left" circle></el-button>
                    <el-button type="primary" round>今天</el-button>
                    <el-button type="primary" icon="el-icon-arrow-right" circle></el-button>
                </span>
                <span id="renderRange" class="render-range"></span>
            </div>
            <calendar
                style="width: 800px; "
                :calendars="calendarList"
                :schedules="scheduleList"
                :view="view"
                :taskView="taskView"
                :scheduleView="scheduleView"
                :theme="theme"
                :week="week"
                :month="month"
                :timezones="timezones"
                :disableDblClick="disableDblClick"
                :isReadOnly="isReadOnly"
                :template="template"
                :useCreationPopup="useCreationPopup"
                :useDetailPopup="useDetailPopup"
            />
        </div>
    </div>
</template>

<script>
import Schart from 'vue-schart';
// echarts
import ECharts from 'vue-echarts/components/ECharts';
import 'echarts';

import 'tui-calendar/dist/tui-calendar.css';
import { Calendar } from '@toast-ui/vue-calendar';

var data = [
    [
        [2016, 2018, 2, '2016级 2018年 访问2次', 1990],
        [1995, 2017, 3, '1995级 2017年 访问3次', 1990],
        [2009, 2014, 3, '2009级 2014年 访问3次', 1990],
        [2007, 2013, 4, '2007级 2013年 访问4次', 1990],
        [1994, 2014, 4, '1994级 2014年 访问4次', 1990],
        [1988, 1989, 1, '1988级 1989年 访问1次', 1990],
        [2012, 2013, 2, '2012级 2013年 访问2次', 1990],
        [2014, 2019, 1, '2014级 2019年 访问1次', 1990],
        [2000, 2013, 3, '2000级 2013年 访问3次', 1990],
        [2010, 2013, 2, '2010级 2013年 访问2次', 1990],
    ],
    [
        [1986, 1998, 4, '1986级 1998年 访问4次', 2015],
        [2013, 2018, 1, '2013级 2018年 访问1次', 2015],
        [1994, 1996, 5, '1994级 1996年 访问5次', 2015],
        [1986, 1991, 4, '1986级 1991年 访问4次', 2015],
        [2006, 2019, 3, '2006级 2019年 访问3次', 2015],
        [1982, 1983, 3, '1982级 1983年 访问3次', 2015],
        [2015, 2016, 1, '2015级 2016年 访问1次', 2015],
        [1991, 1998, 3, '1991级 1998年 访问3次', 2015],
        [1981, 2002, 4, '1981级 2002年 访问4次', 2015],
        [2016, 2019, 3, '2016级 2019年 访问3次', 2015],
    ]
];

export default {
    name: 'basecharts',
    components: {
        Schart,
        'v-chart': ECharts,
        calendar: Calendar
    },
    data() {
        return {
            bar: {
                backgroundColor: new ECharts.graphic.RadialGradient(0.3, 0.3, 0.8, [
                    {
                        offset: 0,
                        color: '#f7f8fa'
                    },
                    {
                        offset: 1,
                        color: '#cdd0d5'
                    }
                ]),
                title: {
                    text: '返校密度气泡图'
                },
                legend: {
                    right: 10,
                    data: ['学院A', '学院B']
                },
                // xAxis: {
                //     splitLine: {
                //         lineStyle: {
                //             type: 'dashed'
                //         }
                //     }
                // },
                // yAxis: {
                //     splitLine: {
                //         lineStyle: {
                //             type: 'dashed'
                //         }
                //     },
                //     scale: true
                // },
                xAxis: {
                    type: 'value',
                    name: '返校年份',
                    // max: 2020,
                    // min: 1980,
                    nameGap: 25,
                    nameLocation: 'middle',
                    nameTextStyle: {
                        fontSize: 18
                    },
                    splitLine: {
                        show: false
                    },
                    // axisLine: {
                    //     lineStyle: {
                    //         color: '#ccc'
                    //     }
                    // },
                    axisLabel: {
                        formatter: '{value} 年'
                    },
                    scale: true
                },
                yAxis: {
                    type: 'value',
                    name: '入学年份',
                    // max: 100,
                    // nameTextStyle: {
                    //     color: '#ccc',
                    //     fontSize: 18
                    // },
                    // axisLine: {
                    //     lineStyle: {
                    //         color: '#ccc'
                    //     }
                    // },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value} 级'
                    },
                    scale: true
                },
                series: [
                    {
                        name: '学院A',
                        data: data[0],
                        type: 'scatter',
                        symbolSize: function(data) {
                            // return Math.sqrt(data[2]) / 5e2;
                            return data[2] * 10;
                        },
                        emphasis: {
                            label: {
                                show: true,
                                formatter: function(param) {
                                    return param.data[3];
                                },
                                position: 'top'
                            }
                        },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(120, 36, 50, 0.5)',
                            shadowOffsetY: 5,
                            color: new ECharts.graphic.RadialGradient(0.4, 0.3, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(251, 118, 123)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(204, 46, 72)'
                                }
                            ])
                        }
                    },
                    {
                        name: '学院B',
                        data: data[1],
                        type: 'scatter',
                        symbolSize: function(data) {
                            // return Math.sqrt(data[2]) / 5e2;
                            return data[2] * 10;
                        },
                        emphasis: {
                            label: {
                                show: true,
                                formatter: function(param) {
                                    return param.data[3];
                                },
                                position: 'top'
                            }
                        },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(25, 100, 150, 0.5)',
                            shadowOffsetY: 5,
                            color: new ECharts.graphic.RadialGradient(0.4, 0.3, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(129, 227, 238)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(25, 183, 207)'
                                }
                            ])
                        }
                    }
                ]
            },

            //=================================================
            // tui calendar
            calendarList: [
                {
                    id: '0',
                    name: 'home'
                },
                {
                    id: '1',
                    name: 'office'
                }
            ],
            scheduleList: [
                {
                    id: '1',
                    calendarId: '1',
                    title: '2000级返校',
                    category: 'time',
                    dueDateClass: '',
                    start: '2020-01-15T22:30:00+09:00',
                    end: '2020-01-16T02:30:00+09:00'
                },
                {
                    id: '2',
                    calendarId: '1',
                    title: '1996级返校',
                    category: 'time',
                    dueDateClass: '',
                    start: '2020-01-13T22:30:00+09:00',
                    end: '2020-01-14T02:30:00+09:00'
                },
                {
                    id: '3',
                    calendarId: '1',
                    title: '2008级返校',
                    category: 'time',
                    dueDateClass: '',
                    start: '2020-01-12T22:30:00+09:00',
                    end: '2020-01-13T02:30:00+09:00'
                },
                {
                    id: '4',
                    calendarId: '1',
                    title: '2004级返校',
                    category: 'time',
                    dueDateClass: '',
                    start: '2020-01-15T22:30:00+09:00',
                    end: '2020-01-16T02:30:00+09:00'
                },
            ],
            view: 'month',
            taskView: true,
            scheduleView: ['time'],
            theme: {
                'month.dayname.height': '30px',
                'month.dayname.borderLeft': '1px solid #ff0000',
                'month.dayname.textAlign': 'center',
                'week.today.color': '#333',
                'week.daygridLeft.width': '100px',
                'week.timegridLeft.width': '100px'
            },
            week: {
                narrowWeekend: true,
                showTimezoneCollapseButton: true,
                timezonesCollapsed: false
            },
            month: {
                visibleWeeksCount: 6,
                startDayOfWeek: 1,
                daynames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            },
            timezones: [
                {
                    timezoneOffset: 540,
                    displayLabel: 'GMT+09:00',
                    tooltip: 'Seoul'
                },
                {
                    timezoneOffset: -420,
                    displayLabel: 'GMT-08:00',
                    tooltip: 'Los Angeles'
                }
            ],
            disableDblClick: true,
            isReadOnly: true,
            template: {
                milestone: function(schedule) {
                    return `<span style="color:red;">${schedule.title}</span>`;
                },
                milestoneTitle: function() {
                    return 'MILESTONE';
                }
            },
            useCreationPopup: true,
            useDetailPopup: true
        };
    }
};
</script>

<style scoped>
.schart-box {
    display: inline-block;
    margin: 20px;
}
.schart {
    width: 600px;
    height: 400px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
</style>