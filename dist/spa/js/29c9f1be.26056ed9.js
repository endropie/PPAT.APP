(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["29c9f1be"],{1192:function(t,i,e){},"92eb":function(t,i,e){"use strict";var s=e("1192"),a=e.n(s);a.a},c6f7:function(t,i,e){"use strict";e.r(i);var s=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",[t.FORM.show?e("div",{staticClass:"index-page bg-grey-2 window-height window-width column items-center no-wrap"},[e("div",{staticClass:"banner bg-primary flex flex-center"},[t._v("\n      PPA\n    ")]),e("div",{staticClass:"text-center"},[e("div",{staticClass:"card bg-white shadow-4 column no-wrap flex-center group"},[e("q-icon",{staticClass:"text-h2",attrs:{name:"widgets",color:"blue-7"}}),e("p",{staticClass:"text-h4 text-orange-14 text-weight-bolder",staticStyle:{font:"courier"}},[t._v("\n          PPA PLAY\n        ")]),e("div",{staticClass:"q-body "},[e("div",{staticClass:"row q-col-gutter-x-md"},[e("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12",attrs:{name:"email",type:"email",label:"Username",placeholder:"Username or valid email",disable:t.FORM.hasEmail,icon:"person",error:t.errors.has("email"),"error-message":t.errors.first("email")},model:{value:t.rsLogin.email,callback:function(i){t.$set(t.rsLogin,"email",i)},expression:"rsLogin.email"}},[t.FORM.hasEmail?e("q-btn",{attrs:{icon:"edit",size:"md",dense:"",flat:"",color:"grey-6",tabindex:5e3},on:{click:function(i){t.FORM.hasEmail=!1}}}):t._e()],1),e("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12",attrs:{name:"password",label:"Password",type:"password",icon:"lock",error:t.errors.has("password"),"error-message":t.errors.first("password")},on:{keyup:function(i){13===i.keyCode&&(i.preventDefault(),t.onLoginSubmit())}},model:{value:t.rsLogin.password,callback:function(i){t.$set(t.rsLogin,"password",i)},expression:"rsLogin.password"}}),e("div",{staticClass:"col-12 q-py-xs"},[e("q-btn",{staticClass:"float-right",attrs:{flat:"",label:"Forgot",color:"blue-grey-5",size:"sm",tabindex:5e3}})],1),e("div",{staticClass:"col-12 col-sm-6 q-py-xs"},[e("q-btn",{staticClass:"full-width",attrs:{label:"Login",color:"primary",loading:t.FORM.btnLoadingSubmit},on:{click:function(i){return t.onLoginSubmit()}}},[e("span",{attrs:{slot:"loading"},slot:"loading"},[t._v("Loading...")])])],1),e("div",{staticClass:"col-12 col-sm-6 q-py-xs"},[e("q-btn",{staticClass:"full-width",attrs:{label:"Register",color:"secondary"},on:{click:function(i){return t.setAuth()}}})],1)],1)])],1)]),e("a",{staticClass:"ribbon",attrs:{title:"PPA Administration Built on v"+t.$q.version}})]):t._e(),e("q-inner-loading",{attrs:{showing:t.FORM.loading}},[e("q-spinner-gears",{attrs:{size:"50px",color:"primary"}})],1)],1)},a=[],n=(e("551c"),e("06db"),e("097d"),e("02fa")),r=e.n(n),o=e("b178"),l=e("2f62"),c=e("0ce1"),d={mixins:[c["a"]],data:function(){return{rsLogin:{email:null,password:null},FORM:{show:!0,loading:!1,hasEmail:!1,btnLoadingSubmit:!1}}},computed:r()({},Object(l["c"])("admin",["AUTH"])),created:function(){this.AUTH.hasOwnProperty("user")&&(this.rsLogin.email=this.AUTH.user.email||null,this.FORM.hasEmail=!!this.rsLogin.email,this.AUTH.isTokenValid&&this.AUTH.user.email&&this.$router.push("/admin"))},methods:{launch:function(){Object(o["f"])("http://quasar-framework.org")},viewPrivacyPolicy:function(){this.$refs.privacy.show()},redirectToAdmin:function(){var t=this.$route.query.redirect||"/admin";this.$router.push(t)},onLoginSubmit:function(){var t=this;this.$validator.validate().then(function(i){i?(t.FORM.btnLoadingSubmit=!0,t.$axios.post("/api/v1/login",t.rsLogin).then(function(i){t.setAdminStore(i),setTimeout(function(){t.redirectToAdmin()},800)}).catch(function(i){t.$app.response.error(i.response,title)}).finally(function(){setTimeout(function(){t.FORM.btnLoadingSubmit=!1},800)})):t.$q.notify({color:"negative",icon:"error",position:"top-right",timeout:3e3,message:"Please complete the form fields"})})}}},u=d,m=(e("92eb"),e("2877")),p=Object(m["a"])(u,s,a,!1,null,null,null);i["default"]=p.exports}}]);