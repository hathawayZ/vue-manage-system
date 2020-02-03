<template>
    <div>
        <el-form ref="form1"  :inline="true">
            <el-form-item v-for="(item, index) in formData" :key="index" :label="item.label">
                <el-date-picker
                    v-model="item.date"
                    type="monthrange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onAdd">增加</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="filterTable" :data="tableData" style="width: 100%">
            <template v-for="item in table">
                <el-table-column :prop="item.prop" :label="item.label" v-if="item.prop === 'date'" sortable></el-table-column>
                <el-table-column v-else :prop="item.prop" :label="item.label"></el-table-column>
            </template>
            <el-table-column prop="edit" label="编辑" @click="editEvent" width="50"> </el-table-column>
            <el-table-column prop="delete" label="删除" @click="deleteEvent" width="50"></el-table-column>
        </el-table>
        <el-dialog title="增加" :visible.sync="dialogVisible" width="30%" >
            <el-form ref="form2"  label-width="80px">
                <template v-for="item in form" >
                    <el-form-item :label="item.label">
                        <el-input v-model="item.prop"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ManageTable',
    data() {
        return {
            form: [
                {
                    label: '返校时间',
                    prop: '',
                },
                {
                    label: '活动时间',
                    prop: '',
                },
                {
                    label: '新闻链接',
                    prop: '',
                },
                {
                    label: '新闻标题',
                    prop: '',
                },
            ],
            formData: [
                {
                    label: '活动时间',
                    data: ''
                },
                {
                    label: '毕业时间',
                    data: ''
                }
            ],
            table: [
                {
                    prop: 'date',
                    label: '返校时间'
                },
                {
                    prop: 'grade',
                    label: '毕业年份'
                },
                {
                    prop: 'address',
                    label: '返校活动链接'
                }
            ],
            tableData: [
                {
                    date: '2016-05-02',
                    grade: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    edit: '编辑',
                    delete: '删除'
                },
                {
                    date: '2016-05-04',
                    grade: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                    edit: '编辑',
                    delete: '删除'
                },
                {
                    date: '2016-05-01',
                    grade: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    edit: '编辑',
                    delete: '删除'
                },
                {
                    date: '2016-05-03',
                    grade: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                    edit: '编辑',
                    delete: '删除'
                }
            ],
            dialogVisible: false
        };
    },
    methods: {
        formatter(row, column) {
            return row.address;
        },
        onSubmit() {
            console.log(this.form.eventDate);
        },
        onAdd() {
            this.dialogVisible = true
        },
        editEvent() {},
        deleteEvent() {}
    }
};
</script>

<style scoped></style>
