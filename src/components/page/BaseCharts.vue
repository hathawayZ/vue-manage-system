<template>
    <div>
        <div class="container">
            <div class="schart-box">
                <div class="content-title">回校统计</div>
                <!-- <schart class="schart" canvasId="bar" :options="options1"></schart> -->
                <v-chart class="schart" :options="bar" @click="clickBar" />
                <el-dialog
                    class="event-dialog"
                    title="返校活动列表"
                    :visible.sync="dialogVisible"
                    width="30%"
                >
                    <el-row v-for="(item, index) in eventList" :key="index">
                        <el-link :href="item.url" target="_blank">{{ index + 1 }}. {{ item.title }}</el-link>
                    </el-row>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts';
import 'echarts';

var data = [
    [2016, 2018, 2, '2016级 2018年 访问2次', 'https://www.bilibili.com/', '哔哩哔哩', 'https://www.bilibili.com/', '哔哩哔哩'],
    [
        1995,
        2017,
        3,
        '1995级 2017年 访问3次',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩'
    ],
    [
        1995,
        2005,
        5,
        '1995级 2005年 访问5次',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩'
    ],
    [
        2009,
        2014,
        3,
        '2009级 2014年 访问3次',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩'
    ],
    [
        2007,
        2013,
        4,
        '2007级 2013年 访问4次',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩'
    ],
    [
        1994,
        2014,
        4,
        '1994级 2014年 访问4次',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩'
    ],
    [1988, 1989, 1, '1988级 1989年 访问1次', 'https://www.bilibili.com/', '哔哩哔哩'],
    [2012, 2013, 2, '2012级 2013年 访问2次', 'https://www.bilibili.com/', '哔哩哔哩', 'https://www.bilibili.com/', '哔哩哔哩'],
    [2014, 2019, 1, '2014级 2019年 访问1次', 'https://www.bilibili.com/', '哔哩哔哩'],
    [
        2000,
        2013,
        3,
        '2000级 2013年 访问3次',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩',
        'https://www.bilibili.com/',
        '哔哩哔哩'
    ],
    [2010, 2013, 2, '2010级 2013年 访问2次', 'https://www.bilibili.com/', '哔哩哔哩', 'https://www.bilibili.com/', '哔哩哔哩']
];
export default {
    name: 'basecharts',
    components: {
        'v-chart': ECharts
    },
    data() {
        return {
            dialogVisible: false,
            eventList: [],
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
                tooltip: {
                    padding: 10,
                    backgroundColor: '#222',
                    borderColor: '#777',
                    borderWidth: 1,
                    // alwaysShowContent: true,
                    formatter: function(obj) {
                        let value = obj.value;
                        let schema = '';
                        for (let i = 0; i < value[2] * 2; i += 2) {
                            schema += i / 2 + 1;
                            schema += '. ' + value[i + 5] + '</br>';
                        }
                        return (
                            '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                            value[0] +
                            '级' +
                            value[1] +
                            '年' +
                            obj.seriesName +
                            '</div>' +
                            schema
                        );
                    }
                },
                xAxis: {
                    type: 'value',
                    name: '返校年份',
                    // max: 2020,
                    // min: 1980,
                    min: 1956,
                    max: 2020,
                    minInterval: 1,
                    nameGap: 25,
                    nameLocation: 'middle',
                    nameTextStyle: {
                        fontSize: 18
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value} 年',
                        showMinLabel: false,
                        showMaxLabel: false
                    },
                    scale: true
                },
                yAxis: {
                    type: 'value',
                    name: '毕业年份',
                    min: 1955,
                    max: 2020,
                    minInterval: 1,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value} 级',
                        showMinLabel: false,
                        showMaxLabel: false
                    },
                    scale: true
                },
                dataZoom: [
                    {
                        // id: 'dataZoomX',
                        type: 'inside',
                        xAxisIndex: [0],
                        filterMode: 'filter'
                        // labelPrecision: 1
                    },
                    {
                        // id: 'dataZoomY',
                        type: 'inside',
                        yAxisIndex: [0],
                        filterMode: 'empty'
                        // labelPrecision: 1
                    }
                ],
                dataset: {
                    // 在这里设置数据，在别处设不会自动更新图表
                    source: data
                },
                series: [
                    {
                        name: '返校活动列表',
                        // data: data,
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
                    }
                ]
            }
        };
    },
    mounted() {
        this.updateData();
    },
    watch: {
        $route(to, from) {
            // 对路由变化作出响应,当使用本页面传入不同参数时更新数据
            this.updateData();
        }
    },
    methods: {
        updateData() {
            this.$axios
                .get(this.baseUrl + '/api/section/' + this.$route.params.id)
                .then(response => {
                    window.console.log(response);
                    this.bar.dataset.source = response.data.graph.data;
                })
                .catch(error => {
                    window.console.log(error);
                });
        },
        clickBar(param) {
            window.console.log(param);
            this.eventList = [];
            let list = param.data;
            for (let i = 0; i < list[2] * 2; i += 2) {
                this.eventList.push({ url: list[i + 4], title: list[i + 5] });
            }
            this.dialogVisible = true;
        }
    }
};
</script>

<style scoped>
.event-dialog >>> .el-dialog__body {
    padding-top: 20px;
}
.schart-box {
    display: inline-block;
    margin: 0 20px 0 20px;
}
.schart {
    width: 1000px;
    height: 500px;
    display: block;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    font-size: 22px;
    color: #1f2f3d;
}
</style>
