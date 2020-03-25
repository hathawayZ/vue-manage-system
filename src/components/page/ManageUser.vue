<template>
    <div>
        <el-breadcrumb separator="/" style="margin-bottom: 15px">
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
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
                        <el-input
                            v-if="item.type == 'text'"
                            v-model="item.data"
                            :placeholder="item.placeholder"
                        ></el-input>
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
    name: 'ManageUser',
    data() {
        return {
            newForm: [
                {
                    label: '用户名',
                    data: '',
                    type: 'text'
                },
                {
                    label: '密码',
                    data: '',
                    type: 'text'
                },
                {
                    label: '姓名',
                    data: '',
                    type: 'text'
                },
                {
                    label: '邮箱',
                    data: '',
                    type: 'text'
                },
                {
                    label: '手机号',
                    data: '',
                    type: 'text'
                }
            ],
            tableColumn: [
                {
                    prop: 'username',
                    label: '用户名'
                },
                {
                    prop: 'name',
                    label: '姓名'
                },
                {
                    prop: 'email',
                    label: '邮箱'
                },
                {
                    prop: 'phone',
                    label: '手机号'
                }
            ],
            tableData: [
                {
                    username: 'zmm',
                    name: '张萌萌',
                    email: 'zmm@zmm.com',
                    phone: '13131313131'
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
                .get(this.baseUrl + '/api/user')
                .then(response => {
                    this.tableData = [];
                    for (var user of response.data) {
                        this.tableData.push({
                            id: user.id,
                            username: user.username,
                            password: user.password,
                            name: user.name,
                            email: user.email,
                            phone: user.phone
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
                this.newForm[i].placeholder = '';
            }
        },
        onAdd() {
            this.dialogVisible = true;
            this.dialogAction = 'add';
            this.clearDialog();
        },
        onSubmit() {
            var token = localStorage.getItem('ms_token');
            // this.dialogVisible = false;
            for (var i = 0; i < this.newForm.length; i++) {
                if (this.dialogAction == 'edit' && i == 1) {
                    continue; // 修改时如果不输入密码则默认是不修改密码
                }
                if (!this.newForm[i].data) {
                    this.$message.error('请输入' + this.newForm[i].label);
                    return;
                }
            }
            var newuser = {
                username: this.newForm[0].data,
                password: this.newForm[1].data,
                name: this.newForm[2].data,
                email: this.newForm[3].data,
                phone: this.newForm[4].data
            };
            if (this.dialogAction == 'add') {
                console.log('new user:', newuser);
                this.$axios
                    .post(this.baseUrl + '/api/user', newuser, {
                        headers: { Authorization: 'Bearer ' + token }
                    })
                    .then(response => {
                        console.log(response);
                        this.dialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.updateData();
                        this.refreshSidebar();
                    })
                    .catch(error => {
                        this.$message.error(error);
                        window.console.log(error);
                    });
            } else {
                console.log('edit section:', newuser, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                newuser['id'] = this.editId;
                this.$axios
                    .put(this.baseUrl + '/api/user/' + this.editId, newuser)
                    .then(response => {
                        console.log(response);
                        this.dialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.updateData();
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
            this.newForm[0].data = ele.row.username;
            this.newForm[1].data = ele.row.password;
            this.newForm[1].placeholder = '不填则不修改密码';
            this.newForm[2].data = ele.row.name;
            this.newForm[3].data = ele.row.email;
            this.newForm[4].data = ele.row.phone;
        },
        onDelete(ele) {
            console.log('delete ', ele.row.id);
            var token = localStorage.getItem('ms_token');

            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios
                        .delete(
                            this.baseUrl + '/api/user/' + ele.row.username,
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
                .catch(error => {
                    console.log(error);
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
