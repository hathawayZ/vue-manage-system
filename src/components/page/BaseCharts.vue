<template>
    <div class="container" ref="chartdiv" style="height: 75%">
        <div class="schart-box">
            <!-- <div class="content-title">回校统计</div> -->
            <div class="group-unit-box">
                x轴聚集基数：
                <el-radio-group v-model="groupRange" size="medium" @change="groupRangeChange">
                    <el-radio label="1"></el-radio>
                    <el-radio label="5"></el-radio>
                    <el-radio label="10"></el-radio>
                </el-radio-group>
            </div>
            <div class="group-unit-box" v-if="axisType == '连续值'">
                y轴聚集基数：
                <el-radio-group v-model="ygroupRange" size="medium" @change="groupRangeChange">
                    <el-radio label="1"></el-radio>
                    <el-radio label="5"></el-radio>
                    <el-radio label="10"></el-radio>
                </el-radio-group>
            </div>
            <div class="group-unit-box" v-else>
                y轴按分类聚集：
                <el-radio-group v-model="ygroupClass" size="medium" @change="groupRangeChange">
                    <el-radio v-for="item in yClasses" :label="item.label" :key="item.label"></el-radio>
                    <el-radio label="不聚集"></el-radio>
                </el-radio-group>
            </div>
            <v-chart
                ref="mychart"
                v-bind:style="{ width: chartwidth, height: chartheight }"
                :options="bar"
                @click="clickBar"
            />
            <el-dialog
                class="event-dialog"
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="30%"
            >
                <el-row v-for="(item, index) in eventList" :key="index">
                    <el-link :href="item.url" target="_blank">{{ index + 1 }}. {{ item.title }}</el-link>
                </el-row>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts';
import 'echarts';

if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}

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
            xUnit: '年',
            yUnit: '级',
            dataname: '返校活动',
            bar: {
                // backgroundColor: new ECharts.graphic.RadialGradient(0.3, 0.3, 0.8, [
                //     {
                //         offset: 0,
                //         color: '#f7f8fa'
                //     },
                //     {
                //         offset: 1,
                //         color: '#cdd0d5'
                //     }
                // ]),
                grid: {
                    containLabel: true
                },
                title: {
                    text: ''
                },
                tooltip: {
                    padding: 10,
                    backgroundColor: '#222',
                    borderColor: '#777',
                    borderWidth: 1,
                    // alwaysShowContent: true,
                    formatter: this.tooltipFormatter
                },
                xAxis: {
                    type: 'value',
                    name: '返校年份',
                    // max: 2020,
                    // min: 1980,
                    // min: 1956,
                    // max: 2020,
                    boundaryGap: ['10%', '10%'],
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
                        // formatter: '{value} 年',
                        showMinLabel: false,
                        showMaxLabel: false
                    },
                    scale: true,
                    axisPointer: {
                        show: true,
                        triggerTooltip: false,
                        snap: true,
                        label: {
                            precision: 0
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '毕业年份',
                    // min: 1955,
                    // max: 2020,
                    boundaryGap: ['10%', '10%'],
                    minInterval: 1,
                    // nameGap: 40,
                    // nameLocation: 'middle',
                    // nameTextStyle: {
                    //     fontSize: 18
                    // },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        // formatter: '{value} 级',
                        showMinLabel: false,
                        showMaxLabel: false
                    },
                    scale: true,
                    axisPointer: {
                        show: true,
                        triggerTooltip: false,
                        snap: true,
                        label: {
                            precision: 0
                        }
                    }
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
                    // {
                    //     type: 'slider',
                    //     show: true,
                    //     xAxisIndex: [0],
                    //     labelPrecision: 0
                    // },
                    // {
                    //     type: 'slider',
                    //     show: true,
                    //     yAxisIndex: [0],
                    //     labelPrecision: 0,
                    //     left: '93%'
                    // }
                ],
                dataset: {
                    // 在这里设置数据，在别处设不会自动更新图表
                    source: data
                },
                series: [
                    {
                        name: '气泡图',
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
                        }
                        // itemStyle: {
                        //     shadowBlur: 10,
                        //     shadowColor: 'rgba(120, 36, 50, 0.5)',
                        //     shadowOffsetY: 5,
                        //     color: new ECharts.graphic.RadialGradient(0.4, 0.3, 1, [
                        //         {
                        //             offset: 0,
                        //             color: 'rgb(251, 118, 123)'
                        //         },
                        //         {
                        //             offset: 1,
                        //             color: 'rgb(204, 46, 72)'
                        //         }
                        //     ])
                        // }
                    }
                ]
            },
            chartwidth: '600px',
            chartheight: '400px',
            groupRange: '1',
            ygroupRange: '1',
            ygroupClass: '不聚集',
            axisType: '未定',
            yClasses: [{ label: '学校' }, { label: '学部' }, { label: '学院' }],
            ylabels: []
        };
    },
    mounted() {
        this.updateData();

        //初始化图表大小
        this.changeChartSize();
    },

    //设置窗口大小变化的监听函数
    created() {
        window.addEventListener('resize', this.changeChartSize);
    },
    destroyed() {
        window.removeEventListener('resize', this.changeChartSize);
    },

    watch: {
        $route(to, from) {
            // 对路由变化作出响应,当使用本页面传入不同参数时更新数据

            this.resetGroup();
            this.updateData();
        }
    },
    computed: {
        dialogTitle() {
            return this.dataname + '事件列表';
        }
    },
    methods: {
        //让图表大小自适应窗口
        changeChartSize(e) {
            // window.console.log(e, this.$refs.chartdiv.clientWidth + 'px', this.$refs.chartdiv.clientHeight + 'px');
            // window.console.log(this.$refs.mychart, this.$refs.chartdiv);
            this.chartwidth = this.$refs.chartdiv.clientWidth * 0.75 + 'px';
            this.chartheight = this.$refs.chartdiv.clientHeight * 0.75 + 'px';
            setTimeout(() => {
                this.$refs.mychart.resize();
            }, 100);
        },

        // 聚集范围更改回调
        groupRangeChange(dest) {
            // console.log('group range change to:', dest);
            this.updateData();
        },

        resetGroup() {
            this.axisType = '连续值';
            this.groupRange = '1';
            this.ygroupRange = '1';
            this.ygroupClass = '不聚集';
            this.yClasses = [];
        },

        updateData() {
            var groupunit = parseInt(this.groupRange);
            // if (this.groupRange == '1') {
            //     groupunit = 1;
            // } else if (this.groupRange == '5') {
            //     groupunit = 5;
            // } else {
            //     groupunit = 10;
            // }
            var ygroup = 1;
            if (this.axisType == '未定') {
                ygroup = '未定';
            } else if (this.axisType == '连续值') {
                ygroup = parseInt(this.ygroupRange);
            } else {
                ygroup = this.ygroupClass;
            }
            var param = { groupunit, ygroup };
            console.log(param);
            this.$axios
                .get(this.baseUrl + '/api/section/' + this.$route.params.id, {
                    params: param
                })
                .then(response => {
                    window.console.log(response);
                    this.bar.dataset.source = response.data.graph.data;

                    // set axis and title
                    this.dataname = response.data.name;

                    this.bar.xAxis.name = response.data.graph.x_axis.title;
                    this.bar.xAxis.axisLabel.formatter = '{value} ' + response.data.graph.x_axis.unit;
                    this.bar.xAxis.axisPointer.label.formatter = this.bar.xAxis.axisLabel.formatter;
                    this.xUnit = response.data.graph.x_axis.unit;
                    this.bar.yAxis.name = response.data.graph.y_axis.title;
                    if (response.data.graph.y_axis.type == '连续值') {
                        this.bar.yAxis.axisLabel.formatter = '{value} ' + response.data.graph.y_axis.unit;
                        this.bar.yAxis.axisPointer.label.formatter = this.bar.yAxis.axisLabel.formatter;
                        this.yUnit = response.data.graph.y_axis.unit;
                    } else {
                        this.ylabels = [];
                        for (var ele of response.data.graph.data) {
                            var newlabel = ele[4];
                            var newlines = Math.floor(ele[4].length / 8) + (ele[4].length % 8 != 0 ? 1 : 0) - 1;
                            console.log(newlabel, newlines);
                            for (var i = 0; i < newlines; i++) {
                                newlabel = newlabel.splice(8 + i * 8 + i, 0, '\n');
                            }
                            this.ylabels.push(newlabel);
                        }
                        console.log(this.ylabels);
                        this.bar.yAxis.axisLabel.formatter = (value, index) => {
                            return this.ylabels[index - 1];
                        };
                        // this.bar.yAxis.axisPointer.label.formatter = this.bar.yAxis.axisLabel.formatter;
                    }

                    this.bar.title.text = this.dataname + '气泡图';

                    this.axisType = response.data.graph.y_axis.type;
                    this.yClasses = [];
                    for (var i = 0; i < response.data.graph.y_axis.fields.length; i++) {
                        this.yClasses.push({ label: response.data.graph.y_axis.fields[i] });
                    }
                    console.log('yclasses:', this.yClasses);
                })
                .catch(error => {
                    window.console.log(error);
                    if (error.response.status == 401) {
                        this.$router.push('/login');
                        this.$message.error('用户验证失败，请重新登陆');
                    }
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
        },
        tooltipFormatter(obj) {
            let value = obj.value;
            let schema = '';
            for (let i = 0; i < value[2] * 2; i += 2) {
                schema += i / 2 + 1;
                schema += '. ' + value[i + 6] + '</br>';
            }
            // console.log(obj);
            return (
                '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                // value[0] +
                // this.xUnit +
                // ' ' +
                // value[1] +
                // this.yUnit +
                // ', ' +
                // this.dataname +
                value[3] +
                ', ' +
                '事件列表:' +
                '</div>' +
                schema
            );
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
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    font-size: 22px;
    color: #1f2f3d;
}
.group-unit-box {
    padding: 10px;
    margin-bottom: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
