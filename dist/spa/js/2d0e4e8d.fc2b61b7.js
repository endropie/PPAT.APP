(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0e4e8d"],{"91dc":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.SHOW?r("q-page",{staticClass:"form-page row justify-center",attrs:{padding:""}},[r("q-card",{staticClass:"main-box self-start",attrs:{inline:"",dark:e.LAYOUT.isDark}},[r("q-card-section",[r("form-header",{attrs:{title:e.FORM.title(),subtitle:e.FORM.subtitle()}},[r("template",{slot:"menu-item"},[e.$route.params.id?r("list-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:e.$tc("label.remove"),icon:"delete",clickable:""},on:{click:e.FORM.delete}}):e._e()],1)],2)],1),r("q-card-section",[r("div",{staticClass:"row q-col-gutter-md"},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12 col-sm-6",attrs:{name:"code",label:e.$tc("label.intern_code"),icon:"code",autocomplete:"off",dark:e.LAYOUT.isDark,error:e.errors.has("code"),"error-message":e.errors.first("code")},model:{value:e.rsForm.code,callback:function(t){e.$set(e.rsForm,"code",t)},expression:"rsForm.code"}}),r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12 col-sm-6",attrs:{name:"name",label:e.$tc("label.name"),dark:e.LAYOUT.isDark,error:e.errors.has("name"),"error-message":e.errors.first("name")},model:{value:e.rsForm.name,callback:function(t){e.$set(e.rsForm,"name",t)},expression:"rsForm.name"}}),r("q-input",{staticClass:"col-12",attrs:{type:"textarea",rows:"3",label:e.$tc("label.description"),"stack-label":"",dark:e.LAYOUT.isDark},model:{value:e.rsForm.description,callback:function(t){e.$set(e.rsForm,"description",t)},expression:"rsForm.description"}})],1)]),r("q-separator",{attrs:{dark:e.LAYOUT.isDark}}),r("q-card-actions",{staticClass:"group"},[r("q-btn",{attrs:{label:e.$tc("label.cancel"),icon:"cancel",color:"dark"},on:{click:function(t){return e.FORM.toBack()}}}),r("q-btn",{attrs:{label:e.$tc("label.reset"),icon:"refresh",color:"light"},on:{click:function(t){return e.FORM.reset()}}}),r("q-btn",{attrs:{label:e.$tc("label.save"),icon:"save",color:"positive"},on:{click:function(t){return e.onSave()}}})],1)],1),r("q-inner-loading",{attrs:{showing:e.FORM.loading,dark:e.LAYOUT.isDark}},[r("q-spinner-dots",{attrs:{size:"70px",color:"primary"}})],1)],1):e._e()},s=[],i=(r("7f7f"),r("551c"),r("06db"),r("097d"),r("0ce1")),o={mixins:[i["a"]],data:function(){return{FORM:{resource:{uri:"/admin/references/brands",api:"/api/v1/references/brands"}},rsForm:{},setDefault:function(){return{name:null,description:null}}}},created:function(){this.init()},computed:{},watch:{$route:"init"},methods:{init:function(){var e=this;this.SHOW=!1,this.FORM.load(function(t){e.setForm(t),setTimeout(function(){e.SHOW=!0},1e3)})},setForm:function(e){this.rsForm=JSON.parse(JSON.stringify(e))},onReset:function(){var e=this;this.$nextTick(function(){e.$validator.reset(),e.setForm(e.FORM.data)})},onSave:function(){var e=this;this.$validator.validate().then(function(t){if(t){e.FORM.loading=!0;var r=e.FORM.meta(),a=r.method,s=(r.mode,r.apiUrl);e.$axios.set(a,s,e.rsForm).then(function(t){var r=t.data.name+" - #"+t.data.id;e.FORM.response.success({message:r}),e.FORM.toIndex()}).catch(function(t){e.FORM.response.fields(t.response),e.FORM.response.error(t.response,"Submit")}).finally(function(){e.FORM.loading=!1})}else e.$q.notify({color:"negative",icon:"error",position:"top-right",timeout:3e3,message:"Please complete the form fields"})})}}},n=o,c=r("2877"),l=Object(c["a"])(n,a,s,!1,null,null,null);t["default"]=l.exports}}]);