<template>
    <div>
        <el-breadcrumb separator="/" style="margin-bottom: 15px">
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form1" :inline="true">
            <el-form-item>
                <el-button type="primary" @click="onAdd">增加</el-button>
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
                        <div v-else-if="item.type == 'axisInfo'">
                            <el-radio v-model="axisInfo.type" label="0">连续值</el-radio>
                            <el-radio v-model="axisInfo.type" label="1">离散值</el-radio>
                            <div v-if="axisInfo.type == '0'">
                                <el-form-item label="x轴单位" key="100">
                                    <el-input v-model="axisInfo.unit"></el-input>
                                </el-form-item>
                            </div>
                            <el-form-item v-else label="分类层级" key="101">
                                <el-tag
                                    :key="tag"
                                    v-for="tag in axisInfo.fieldList"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(tag)"
                                >{{tag}}</el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm"
                                ></el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput"
                                >+ 层级</el-button>
                            </el-form-item>
                        </div>
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
import bus from '../common/bus';

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
                    label: '栏目标题',
                    data: '',
                    type: 'text'
                },
                {
                    label: 'x轴标题',
                    data: '',
                    type: 'text'
                },
                // {
                //     label: 'x轴信息',
                //     type: 'axisInfo'
                // },
                {
                    label: 'x轴单位',
                    data: '',
                    type: 'text'
                },
                {
                    label: 'y轴标题',
                    data: '',
                    type: 'text'
                },
                {
                    label: 'y轴信息',
                    data: 'nouse',
                    type: 'axisInfo'
                }
            ],
            tableColumn: [
                {
                    prop: 'name',
                    label: '栏目标题'
                },
                {
                    prop: 'x_title',
                    label: 'x轴标题'
                },
                {
                    prop: 'x_unit',
                    label: 'x轴单位'
                },
                {
                    prop: 'y_title',
                    label: 'y轴标题'
                },
                {
                    prop: 'y_type',
                    label: 'y轴类型'
                },
                {
                    prop: 'y_unit',
                    label: 'y轴单位'
                },
                {
                    prop: 'y_fields',
                    label: 'y轴分类'
                },
                {
                    prop: 'belongto',
                    label: '栏目管理员'
                }
            ],
            tableData: [
                {
                    name: '返校信息',
                    x_title: '返校时间',
                    x_unit: '',
                    y_title: '入学时间',
                    y_unit: '年'
                }
            ],
            dialogVisible: false,
            dialogAction: 'add', // 'add' or 'edit'
            editId: null,
            showBelongto: false,
            axisInfo: {
                type: '0', // 0表示连续数字，1表示离散值
                fieldList: [], //如果是离散值，是层级的列表
                unit: '' //如果是连续，是单位
            },
            inputVisible: false,
            inputValue: ''
        };
    },
    mounted() {
        this.updateData();
        var role = localStorage.getItem('ms_username');
        this.showBelongto = role === 'admin';
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
        }
    },
    methods: {
        updateData() {
            // 获取section信息
            this.$axios
                .get(this.baseUrl + '/api/section')
                .then(response => {
                    this.tableData = [];
                    for (var section of response.data) {
                        // admin可以管理所有section，其他的用户只能管理自己的section
                        if (section.belongto == localStorage.getItem('ms_username') || localStorage.getItem('ms_username') == 'admin') {
                            this.tableData.push({
                                id: section.id,
                                name: section.name,
                                x_title: section.graph.x_axis.title,
                                x_unit: section.graph.x_axis.unit,
                                y_title: section.graph.y_axis.title,
                                y_unit: section.graph.y_axis.unit,
                                y_type: section.graph.y_axis.type,
                                y_fields: section.graph.y_axis.fields.join('/'),
                                belongto: section.belongto,
                                fields: section.graph.y_axis.fields
                            });
                        }
                    }
                })
                .catch(error => {
                    window.console.log(error);
                    if (error.response.status == 401) {
                        this.$router.push('/login');
                        this.$message.error('用户验证失败，请重新登陆');
                    }
                });
        },

        clearDialog() {
            for (var i = 0; i < this.newForm.length; i++) {
                this.newForm[i].data = '';
            }
            this.axisInfo = {
                type: '0', // 0表示连续数字，1表示离散值
                fieldList: [], //如果是离散值，是层级的列表
                unit: '' //如果是连续，是单位
            };
        },
        onAdd() {
            this.dialogVisible = true;
            this.dialogAction = 'add';
            this.clearDialog();
        },
        onSubmit() {
            // this.dialogVisible = false;
            for (var i = 0; i < this.newForm.length; i++) {
                if (!this.newForm[i].data && this.newForm[i].label != 'y轴信息') {
                    this.$message.error('请输入' + this.newForm[i].label);
                    return;
                }
            }
            var newSection = {
                name: this.newForm[0].data,
                graph: {
                    x_axis: {
                        title: this.newForm[1].data,
                        unit: this.newForm[2].data
                    },
                    y_axis: {
                        title: this.newForm[3].data,
                        type: this.axisInfo.type,
                        unit: this.axisInfo.type == '0' ? this.axisInfo.unit : '',
                        fields: this.axisInfo.type == '1' ? this.axisInfo.fieldList : []
                    }
                }
            };
            var token = localStorage.getItem('ms_token');
            if (this.dialogAction == 'add') {
                console.log('new section:', newSection);
                this.$axios
                    .post(this.baseUrl + '/api/section', newSection, {
                        headers: { Authorization: 'Bearer ' + token }
                    })
                    .then(response => {
                        console.log(response);
                        if (response.data == 'ok') {
                            this.dialogVisible = false;
                            this.updateData();
                            this.refreshSidebar();
                        } else {
                            console.log(response);
                            this.$message.error(response.data);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error);
                        window.console.log(error);

                        if (error.response.status == 401) {
                            this.$router.push('/login');
                            this.$message.error('用户验证失败，请重新登陆');
                        }
                    });
            } else {
                console.log('edit section:', newSection);

                newSection['id'] = this.editId;
                this.$axios
                    .put(this.baseUrl + '/api/section/' + this.editId, newSection, {
                        headers: { Authorization: 'Bearer ' + token }
                    })
                    .then(response => {
                        console.log(response);
                        if (response.data == 'ok') {
                            this.dialogVisible = false;
                            this.updateData();
                            this.refreshSidebar();
                        } else {
                            console.log(response);
                            this.$message.error(response.data);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error);
                        window.console.log(error);
                        if (error.response.status == 401) {
                            this.$router.push('/login');
                            this.$message.error('用户验证失败，请重新登陆');
                        }
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
            this.newForm[0].data = ele.row.name;
            this.newForm[1].data = ele.row.x_title;
            this.newForm[2].data = ele.row.x_unit;
            this.newForm[3].data = ele.row.y_title;
            this.axisInfo.type = ele.row.y_type == '连续值' ? '0' : '1';
            this.axisInfo.unit = ele.row.y_unit;
            this.axisInfo.fieldList = ele.row.fields;
        },
        onDelete(ele) {
            console.log('delete ', ele.row.id);
            var token = localStorage.getItem('ms_token');

            this.$confirm('此操作将永久删除该栏目及相关数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios
                        .delete(this.baseUrl + '/api/section/' + ele.row.id, {
                            headers: { Authorization: 'Bearer ' + token }
                        })
                        .then(response => {
                            console.log(response);
                            if (response.data == 'ok') {
                                this.updateData();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.refreshSidebar();
                            } else {
                                console.log(response);
                                this.$message.error(response.data);
                            }
                        })
                        .catch(error => {
                            this.$message.error(error);
                            window.console.log(error);
                            if (error.response.status == 401) {
                                this.$router.push('/login');
                                this.$message.error('用户验证失败，请重新登陆');
                            }
                        });
                })
                .catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });
        },
        refreshSidebar() {
            bus.$emit('updateSidebar', false);
        },

        //////////////用于实现新建时的添加标签
        handleClose(tag) {
            this.axisInfo.fieldList.splice(this.axisInfo.fieldList.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.axisInfo.fieldList.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    }
};
</script>

<style scoped>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
