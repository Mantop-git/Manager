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
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Alert,
    Tabs,
    TabPane,
    Cascader,
    Steps,
    Step,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Upload,
    Timeline,
    TimelineItem,

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
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Option);
Vue.use(Select);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Step);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(Steps);
Vue.use(CheckboxGroup);
Vue.use(Upload);
Vue.use(TimelineItem);
Vue.use(Timeline);