(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0b3876"],{2981:function(e,r,t){"use strict";t.r(r);var a=function(){var e=this,r=e.$createElement,t=e._self._c||r;return e.SHOW?t("q-page",{staticClass:"form-page row justify-center",attrs:{padding:""}},[t("q-card",{staticClass:"main-box self-start",attrs:{inline:"",dark:e.LAYOUT.isDark}},[t("q-card-section",[t("form-header",{attrs:{title:e.FORM.title(),subtitle:e.FORM.subtitle()}},[t("template",{slot:"menu-item"},[e.$route.params.id?t("list-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:e.$tc("label.remove"),icon:"delete",clickable:""},on:{click:e.FORM.delete}}):e._e()],1)],2)],1),t("q-card-section",[t("form",{ref:"MainForm",staticClass:"column q-gutter-sm"},[t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"code",label:e.$tc("label.code"),dark:e.LAYOUT.isDark,error:e.errors.has("code"),"error-message":e.errors.first("code")},model:{value:e.rsForm.code,callback:function(r){e.$set(e.rsForm,"code",r)},expression:"rsForm.code"}}),t("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"name",label:e.$tc("label.name"),dark:e.LAYOUT.isDark,error:e.errors.has("name"),"error-message":e.errors.first("name")},model:{value:e.rsForm.name,callback:function(r){e.$set(e.rsForm,"name",r)},expression:"rsForm.name"}})],1)]),t("q-separator",{attrs:{dark:e.LAYOUT.isDark}}),t("q-card-actions",{staticClass:"group"},[t("q-btn",{attrs:{label:e.$tc("label.cancel"),icon:"cancel",color:"dark"},on:{click:function(r){return e.FORM.toBack()}}}),t("q-btn",{attrs:{label:e.$tc("label.reset"),icon:"refresh",color:"light"},on:{click:function(r){return e.FORM.reset()}}}),t("q-btn",{attrs:{label:e.$tc("label.save"),icon:"save",color:"positive"},on:{click:function(r){return e.onSave()}}})],1)],1),t("q-inner-loading",{attrs:{showing:e.FORM.loading,dark:e.LAYOUT.isDark}},[t("q-spinner-dots",{attrs:{size:"70px",color:"primary"}})],1)],1):e._e()},s=[],i=(t("7f7f"),t("551c"),t("06db"),t("097d"),t("0ce1")),n={mixins:[i["a"]],data:function(){return{FORM:{resource:{uri:"/admin/references/units",api:"/api/v1/references/units"},options:{colors:{data:[],api:"/api/v1/references/units?mode=all"}}},rsForm:{},setDefault:function(){return{code:null,name:null}}}},created:function(){this.init()},computed:{},watch:{$route:"init"},methods:{init:function(){var e=this;this.SHOW=!1,this.FORM.load(function(r){e.setForm(r),setTimeout(function(){e.SHOW=!0},500)})},setForm:function(e){this.rsForm=JSON.parse(JSON.stringify(e))},onSave:function(){var e=this;this.$validator.validate().then(function(r){if(r){e.FORM.loading=!0;var t=e.FORM.meta(),a=t.method,s=(t.mode,t.apiUrl);e.$axios.set(a,s,e.rsForm).then(function(r){var t=r.data.name+" - #"+r.data.id;e.FORM.response.success({message:t}),e.FORM.toIndex()}).catch(function(r){e.FORM.response.fields(r.response),e.FORM.response.error(r.response,"Submit")}).finally(function(){e.FORM.loading=!1})}else e.$q.notify({color:"negative",icon:"error",position:"top-right",timeout:3e3,message:"Please complete the form fields"})})}}},o=n,l=t("2877"),c=Object(l["a"])(o,a,s,!1,null,null,null);r["default"]=c.exports}}]);