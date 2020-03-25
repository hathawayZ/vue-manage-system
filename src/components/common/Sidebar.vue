<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in chartitems">
                <el-menu-item :index="item.index" :key="item.index">
                    <i :class="item.icon"></i>
                    <span slot="title">{{ item.title }}</span>
                </el-menu-item>
            </template>
            <el-submenu v-if="hasManageEvent" index="manageEvent">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>事件管理</span>
                </template>
                <template v-for="item in manageitems">
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </el-submenu>

            <el-menu-item v-if="hasManageEvent" index="/section">
                <i class="el-icon-s-order"></i>
                <span slot="title">栏目管理</span>
            </el-menu-item>

            <el-menu-item v-if="hasManageUser" index="/user">
                <i class="el-icon-user-solid"></i>
                <span slot="title">用户管理</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            chartitems: [
                {
                    icon: 'el-icon-s-data',
                    index: '/chart/2',
                    title: '返校密度气泡图'
                },
                {
                    icon: 'el-icon-s-data',
                    index: '/chart/3',
                    title: '微博热度气泡图'
                }
            ],
            manageitems: [
                {
                    icon: 'el-icon-s-data',
                    index: '/events/2',
                    title: '返校密度事件管理'
                },
                {
                    icon: 'el-icon-s-data',
                    index: '/events/3',
                    title: '微博热度事件管理'
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            console.log(this.$route.path);
            return this.$route.path;
        },
        hasManageEvent() {
            const role = localStorage.getItem('ms_username');
            return role && this.manageitems.length != 0;
        },
        hasManageUser() {
            const role = localStorage.getItem('ms_username');
            return role == 'admin';
        }
    },
    methods: {
        updateData(redirect) {
            // redirect为true则导航到第一个页面
            const role = localStorage.getItem('ms_username');
            this.$axios
                .get(this.baseUrl + '/api/section')
                .then(response => {
                    window.console.log(response);
                    this.chartitems = [];
                    this.manageitems = [];
                    for (var i = 0; i < response.data.length; i++) {
                        this.chartitems.push({
                            icon: 'el-icon-s-data',
                            index: '/chart/' + response.data[i].id,
                            title: response.data[i].name + '气泡图'
                        });
                        if (role) {
                            this.manageitems.push({
                                icon: 'el-icon-s-tools',
                                index: '/events/' + response.data[i].id,
                                title: response.data[i].name + '事件管理'
                            });
                        }
                    }
                    if (redirect) {
                        this.$router.push(this.chartitems[0].index); // 加载第一个页面
                    }
                })
                .catch(error => {
                    window.console.log(error);
                });
        }
    },
    mounted() {
        this.updateData(true);
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
        bus.$on('updateSidebar', msg => {
            console.log('update sidebar');
            this.updateData(msg);
        });
    }
};
</script>

<style scoped>
.iconfont {
    font-family: 'iconfont' !important;
    font-size: 18px;
    font-style: normal;
    margin-right: 2px;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>