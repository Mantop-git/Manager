import Vue from 'vue';
// import { Button, Form } from 'element-ui';
// import {Input,FormItem} from 'element-ui';
import {
    Message,
    Container,
    FormItem,
    Input,
    Button,
    Form,
    Header,
    Aside,
    Main,
    Footer,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    Switch,
    TableColumn,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox
} from 'element-ui';
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;


Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Footer)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row);
Vue.use(Col);
Vue.use(TableColumn);
Vue.use(Table);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);