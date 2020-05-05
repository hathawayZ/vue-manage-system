<template>
    <div>
        <el-breadcrumb separator="/" style="margin-bottom: 15px">
            <el-breadcrumb-item>事件管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{pageTitle}}事件管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form1" :inline="true">
            <el-form-item v-for="(item, index) in queryForm" :key="index" :label="item.label">
                <el-date-picker
                    v-model="item.date"
                    :type="item.type"
                    range-separator="至"
                    :start-placeholder="getPlaceholder(item.type).start"
                    :end-placeholder="getPlaceholder(item.type).end"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onQuery">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onClearSearch">清除查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onAdd">增加</el-button>
            </el-form-item>
        </el-form>

        <el-form :inline="true">
            <el-form-item label="插件访问地址">
                <el-input readonly :value="apiAddress"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button
                    type="primary"
                    v-clipboard:copy="apiAddress"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                >复制插件地址</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="filterTable" :data="tableData" style="width: 100%">
            <template v-for="item in tableColumn">
                <el-table-column
                    v-if="item.prop === 'x' || item.prop === 'y'"
                    :prop="item.prop"
                    :label="item.label"
                    :key="item.key"
                    sortable
                ></el-table-column>
                <el-table-column
                    v-else-if="item.prop === 'url'"
                    :prop="item.prop"
                    :label="item.label"
                    :key="item.key"
                    sortable
                >
                    <template slot-scope="scope">
                        <el-link :href="scope.row.url" target="_blank">{{ scope.row.url }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column v-else :prop="item.prop" :label="item.label" :key="item.key"></el-table-column>
            </template>
            <el-table-column prop="edit" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="onEdit(scope)">编辑</el-button>
                    <el-button type="text" size="small" @click="onDelete(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新建event对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
            <el-form ref="form2" label-width="80px">
                <template v-for="item in newForm">
                    <el-form-item :label="item.label" :key="item.key">
                        <el-input v-if="item.type == 'text'" v-model="item.data"></el-input>
                        <el-date-picker
                            v-else-if="item.type == 'date'"
                            v-model="item.data"
                            type="date"
                            placeholder="选择日期"
                        ></el-date-picker>
                        <el-date-picker
                            v-else-if="item.type == 'year'"
                            v-model="item.data"
                            type="year"
                            placeholder="选择年"
                        ></el-date-picker>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
function timeStamp2String(time) {
    var datetime = new Date(time * 1000);
    // var year = datetime.getFullYear();
    // var month = datetime.getMonth() + 1;
    // var date = datetime.getDate();
    // var hour = datetime.getHours();
    // var minute = datetime.getMinutes();
    // var second = datetime.getSeconds();
    // var mseconds = datetime.getMilliseconds();
    // return year + '-' + month + '-' + date;
    return datetime.toLocaleDateString().slice(0, 10);
}

export default {
    name: 'ManageTable',
    data() {
        return {
            newForm: [
                {
                    label: '返校时间',
                    data: '',
                    type: 'date'
                },
                {
                    label: '入学年份',
                    data: '',
                    type: 'year'
                },
                {
                    label: '新闻标题',
                    data: '',
                    type: 'text'
                },
                {
                    label: '新闻链接',
                    data: '',
                    type: 'text'
                }
            ],
            queryForm: [
                {
                    label: '返校时间',
                    date: '',
                    type: 'monthrange'
                },
                {
                    label: '入学年份',
                    date: '',
                    type: 'monthrange'
                }
            ],
            tableColumn: [
                {
                    prop: 'x',
                    label: '返校时间'
                },
                {
                    prop: 'y',
                    label: '入学年份'
                },
                {
                    prop: 'name',
                    label: '新闻标题'
                },
                {
                    prop: 'url',
                    label: '新闻链接'
                }
            ],
            tableData: [
                {
                    date: '2016-05-02',
                    grade: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }
            ],
            dialogVisible: false,
            dialogAction: 'add', // 'add' or 'edit'
            editId: null,
            pageTitle: '',
            apiBaseAddress: 'http://localhost:8082/#/tool/', //插件网页的地址
            apiKey: ''
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
    computed: {
        dialogTitle() {
            return this.dialogAction == 'add' ? '新增' : '修改';
        },
        apiAddress() {
            return this.apiBaseAddress + this.$route.params.id + '/' + this.apiKey;
        }
    },
    methods: {
        onCopy() {
            this.$message({
                type: 'success',
                message: '复制到剪贴板成功!'
            });
        },
        onError() {
            this.$message.error('复制到剪贴板失败');
        },

        getPlaceholder(type) {
            if (type === 'monthrange') {
                return {
                    start: '开始月份',
                    end: '结束月份'
                };
            } else {
                return {
                    start: '开始日期',
                    end: '结束日期'
                };
            }
        },
        onClearSearch() {
            this.queryForm[0].date = '';
            this.queryForm[1].date = '';
            this.updateData();
        },
        updateData() {
            // 获取section信息
            var param = {};
            if (this.queryForm[0].date) {
                // console.log('search x:', this.queryForm[0].date);
                param.x_low = this.queryForm[0].date[0].getTime() / 1000;
                param.x_high = this.queryForm[0].date[1].getTime() / 1000;
            }
            if (this.queryForm[1].date) {
                // console.log('search y:', this.queryForm[1].date);
                param.y_low = this.queryForm[1].date[0].getTime() / 1000;
                param.y_high = this.queryForm[1].date[1].getTime() / 1000;
            }

            var token = localStorage.getItem('ms_token');
            this.$axios
                .get(this.baseUrl + '/api/section/' + this.$route.params.id)
                .then(response => {
                    window.console.log('get section ', this.$route.params.id, response);
                    var xtitle = response.data.graph.x_axis.title;
                    var ytitle = response.data.graph.y_axis.title;

                    this.queryForm[0].label = xtitle;
                    this.queryForm[1].label = ytitle;
                    this.newForm[0].label = xtitle;
                    this.newForm[1].label = ytitle;
                    this.tableColumn[0].label = xtitle;
                    this.tableColumn[1].label = ytitle;

                    this.pageTitle = response.data.name;
                })
                .catch(error => {
                    window.console.log(error);
                });

            //获取事件列表
            console.log('param is ', param);
            this.$axios
                .get(this.baseUrl + '/api/section/' + this.$route.params.id + '/event', {
                    params: param,
                    headers: { Authorization: 'Bearer ' + token }
                })
                .then(response => {
                    window.console.log(response);
                    this.tableData = [];
                    for (var i = 0; i < response.data.length; i++) {
                        this.tableData.push({
                            id: response.data[i].id,
                            x: timeStamp2String(response.data[i].x),
                            y: timeStamp2String(response.data[i].y).slice(0, 4),
                            name: response.data[i].name,
                            url: response.data[i].url,
                            x_ts: response.data[i].x,
                            y_ts: response.data[i].y
                        });
                    }
                })
                .catch(error => {
                    window.console.log(error);
                });

            //获取api key
            var username = localStorage.getItem('ms_username');
            this.$axios
                .get(this.baseUrl + '/api/user/' + username, {
                    headers: { Authorization: 'Bearer ' + token }
                })
                .then(response => {
                    console.log(response);
                    this.apiKey = response.data.apikey;
                })
                .catch(error => {
                    window.console.log(error);
                });
        },
        formatter(row, column) {
            return row.address;
        },
        onQuery() {
            if (this.queryForm[0].date || this.queryForm[1].date) {
                this.updateData();
            } else {
                this.$message.error('请输入搜索条件');
            }
        },
        clearDialog() {
            for (var i = 0; i < this.newForm.length; i++) {
                this.newForm[i].data = '';
            }
        },
        onAdd() {
            this.dialogVisible = true;
            this.dialogAction = 'add';
            this.clearDialog();
        },
        onSubmit() {
            // this.dialogVisible = false;
            for (var i = 0; i < this.newForm.length; i++) {
                if (!this.newForm[i].data) {
                    this.$message.error('请输入' + this.newForm[i].label);
                    return;
                }
            }
            var newEvent = {
                name: this.newForm[2].data,
                desc: '',
                x: this.newForm[0].data.getTime() / 1000,
                y: this.newForm[1].data.getTime() / 1000,
                url: this.newForm[3].data
            };
            var token = localStorage.getItem('ms_token');
            if (this.dialogAction == 'add') {
                console.log('new event:', newEvent);
                this.$axios
                    .post(this.baseUrl + '/api/section/' + this.$route.params.id + '/event', newEvent, {
                        headers: { Authorization: 'Bearer ' + token }
                    })
                    .then(response => {
                        console.log(response);
                        if (response.data == 'ok') {
                            this.dialogVisible = false;
                            this.updateData();
                        } else {
                            console.log(response);
                            this.$message.error(response.data);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error);
                        window.console.log(error);
                    });
            } else {
                console.log('edit event:', newEvent);
                newEvent['id'] = this.editId;
                this.$axios
                    .put(this.baseUrl + '/api/section/' + this.$route.params.id + '/event/' + this.editId, newEvent, {
                        headers: { Authorization: 'Bearer ' + token }
                    })
                    .then(response => {
                        console.log(response);
                        if (response.data == 'ok') {
                            this.dialogVisible = false;
                            this.updateData();
                        } else {
                            console.log(response);
                            this.$message.error(response.data);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error);
                        window.console.log(error);
                    });
            }
        },
        onEdit(ele) {
            console.log('edit ', ele.row.id);
            this.dialogVisible = true;
            this.dialogAction = 'edit';
            this.clearDialog();

            this.editId = ele.row.id;

            // set origin data
            this.newForm[0].data = new Date(ele.row.x_ts * 1000);
            this.newForm[1].data = new Date(ele.row.y_ts * 1000);
            this.newForm[2].data = ele.row.name;
            this.newForm[3].data = ele.row.url;
        },
        onDelete(ele) {
            console.log('delete ', ele.row.id);
            var token = localStorage.getItem('ms_token');

            this.$confirm('此操作将永久删除该事件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios
                        .delete(
                            this.baseUrl + '/api/section/' + this.$route.params.id + '/event/' + ele.row.id,
                            {},
                            {
                                headers: { Authorization: 'Bearer ' + token }
                            }
                        )
                        .then(response => {
                            console.log(response);
                            if (response.data == 'ok') {
                                this.updateData();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            } else {
                                console.log(response);
                                this.$message.error(response.data);
                            }
                        })
                        .catch(error => {
                            this.$message.error(error);
                            window.console.log(error);
                        });
                })
                .catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });
        }
    }
};
</script>

<style scoped></style>
