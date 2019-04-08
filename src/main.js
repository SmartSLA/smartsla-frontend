import Vue from "vue";
import { applicationInit, getApplication } from "@/application-init";

import "@/main.styl";
import "@mdi/font/css/materialdesignicons.css";
import "v-markdown-editor/dist/index.css";
import Editor from "v-markdown-editor";
Vue.use(Editor);
window.Application = getApplication(applicationInit(Vue));
