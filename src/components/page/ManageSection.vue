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
                    label: 'y轴单位',
                    data: '',
                    type: 'text'
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
                    prop: 'y_unit',
                    label: 'y轴单位'
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
            editId: null
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
                        this.tableData.push({
                            id: section.id,
                            name: section.name,
                            x_title: section.graph.x_axis.title,
                            x_unit: section.graph.x_axis.unit,
                            y_title: section.graph.y_axis.title,
                            y_unit: section.graph.y_axis.unit
                        });
                    }
                })
                .catch(error => {
                    window.console.log(error);
                });
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
            var newSection = {
                name: this.newForm[0].data,
                graph: {
                    x_axis: {
                        title: this.newForm[1].data,
                        unit: this.newForm[2].data
                    },
                    y_axis: {
                        title: this.newForm[3].data,
                        unit: this.newForm[4].data
                    }
                }
            };
            if (this.dialogAction == 'add') {
                console.log('new section:', newSection);
                this.$axios
                    .post(this.baseUrl + '/api/section', newSection)
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
                    });
            } else {
                console.log('edit section:', newSection);
                newSection['id'] = this.editId;
                this.$axios
                    .put(this.baseUrl + '/api/section/' + this.editId, newSection)
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
            this.newForm[4].data = ele.row.y_unit;
        },
        onDelete(ele) {
            console.log('delete ', ele.row.id);

            this.$confirm('此操作将永久删除该栏目及相关数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios
                        .delete(this.baseUrl + '/api/section/' + ele.row.id)
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
            bus.$emit('updateSidebar');
        }
    }
};
</script>

<style scoped></style>
