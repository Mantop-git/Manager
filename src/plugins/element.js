import Vue from 'vue';
import { Button, Form } from 'element-ui';
import {Input,FormItem} from 'element-ui';
import {Message} from 'element-ui';
Vue.prototype.$message = Message;


Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
