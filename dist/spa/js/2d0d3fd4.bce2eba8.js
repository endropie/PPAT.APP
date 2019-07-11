(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0d3fd4"],{"5eb0":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.SHOW?i("q-page",{staticClass:"row justify-center",attrs:{padding:"",dark:t.LAYOUT.isDark}},[i("page-print",{staticClass:"q-pa-md q-pr-lg shadow-2",staticStyle:{"max-width":"210mm"}},[i("div",{attrs:{slot:"header-title"},slot:"header-title"},[t._v("\n      PPA - INCOMING GOODS\n    ")]),i("div",{attrs:{slot:"header-tags"},slot:"header-tags"},[t.rsView.revise_id?i("q-chip",{attrs:{tag:"",outline:"",small:"",color:"negative"}},[t._v("\n        Revised\n      ")]):t._e()],1),i("div",{staticClass:"row  q-gutter-md"},[i("div",{staticClass:"col-12"},[i("div",{staticClass:"row q-gutter-sm",class:t.$q.screen.lt.sm?"justify-start":"justify-between"},[i("q-list",{staticClass:"identity",attrs:{"no-border":"",dense:""}},[i("q-item",{attrs:{multiline:""}},[i("q-item-section",[i("q-item-tile",{attrs:{label:""}},[t._v(t._s(t.rsView.customer.name))]),i("q-item-tile",{attrs:{sublabel:""}},[t._v("Customer")])],1)],1),i("q-item",{attrs:{multiline:""}},[i("q-item-section",[i("q-item-tile",{attrs:{label:""}},[t._v(t._s(t.rsView.reference_number||"-"))]),i("q-item-tile",{attrs:{sublabel:""}},[t._v("\n                    Refrence "+t._s(t.rsView.reference_date?"at "+t.$app.moment(t.rsView.reference_date).format("DD/MM/YYYY"):"")+"\n                  ")])],1)],1)],1),i("q-list",{staticClass:"identity",attrs:{"no-border":"",dense:""}},[i("q-item",{attrs:{multiline:""}},[i("q-item-section",[i("q-item-tile",{attrs:{label:""}},[t._v("No. "+t._s(t.rsView.number))]),i("q-item-tile",{attrs:{sublabel:""}},[t._v("created at "+t._s(t.rsView.created_at?t.$app.moment(t.rsView.created_at).format("DD/MM/YYYY hh:mm"):""))])],1)],1),i("q-item",{attrs:{multiline:""}},[i("q-item-section",[i("q-item-tile",{attrs:{label:""}},[t._v("No. REG "+t._s(t.rsView.registration))]),i("q-item-tile",{attrs:{sublabel:""}},[t._v("Income at "+t._s(t.rsView.date?t.$app.moment(t.rsView.date+" "+t.rsView.time).format("DD/MM/YYYY hh:mm"):""))])],1)],1)],1)],1)]),i("div",{staticClass:"col-12"},[i("q-table",{ref:"table",staticClass:"table-border d-grid no-shadow",attrs:{color:"secondary",separator:"vertical",dense:"","hide-bottom":"",dark:t.LAYOUT.isDark,data:t.rsView.incoming_good_items,"no-data-label":"No Production",columns:[{name:"code",label:"code",align:"left",field:function(t){return t.item.code}},{name:"part_name",label:"Part name",align:"left",field:function(t){return t.item.part_name}},{name:"quantity",label:"Quantity",align:"right",field:function(t){return t.quantity}},{name:"unit_id",label:"Unit",align:"center",field:function(t){return t.unit.code}}]}})],1),i("div",{staticClass:"col-12"},[i("div",{staticClass:"q-my-xs text-italic"},[t._v("Description:")]),i("div",{staticClass:"q-my-xs text-weight-light",staticStyle:{"min-height":"30px"}},[t._v(t._s(t.rsView.description))])]),i("div",{staticClass:"col-12 group print-hide ",staticStyle:{"padding-top":"50px"}},[i("q-btn",{attrs:{label:"Back","icon-right":t.btnIcon("cancel"),color:"dark",to:t.VIEW.resource.uri+"?return"}}),t.IS_EDITABLE?i("q-btn",{attrs:{color:"positive","icon-right":t.btnIcon("edit"),label:"Edit",to:t.VIEW.resource.uri+"/"+t.$route.params.id+"/edit"}}):t._e(),i("q-btn",{attrs:{label:"Print","icon-right":t.btnIcon("print"),color:"grey"},nativeOn:{click:function(e){return t.print()}}}),t.IS_EDITABLE?i("q-btn",{attrs:{color:"negative","icon-right":t.btnIcon("delete"),label:"Delete",outline:""},on:{click:t.VIEW.delete}}):t._e()],1)])]),i("q-inner-loading",{attrs:{visible:t.VIEW.loading}},[i("q-spinner-gears",{attrs:{size:"50px",color:"primary"}})],1)],1):t._e()},n=[],s=(i("551c"),i("097d"),i("ac6a"),i("cadf"),i("06db"),i("456d"),i("447e")),r=i("b44a"),o=i("3252"),l={mixins:[s["a"]],components:{PagePrint:r["a"],PagePrintBreak:o["a"]},data:function(){return{VIEW:{resource:{api:"/api/v1/warehouses/incoming-goods",uri:"/admin/warehouses/incoming-goods",params:"?mode=view"}},rsView:{},count:0}},created:function(){this.init()},computed:{IS_EDITABLE:function(){return!(this.rsView.hasOwnProperty("has_relationship")&&Object.keys(this.rsView.has_relationship).length>0)}},methods:{init:function(){var t=this;this.SHOW=!1,this.VIEW.onLoad(function(e){t.setView(e),setTimeout(function(){t.SHOW=!0},500)})},btnIcon:function(t){return this.$q.screen.lt.sm?"":t},print:function(){window.print()},getBaseUnit:function(t){return 1==t.unit_rate?"":"(".concat(t.unit_amount," ").concat(t.item.unit.code,")")},setView:function(t){this.rsView=t},routing:function(){var t=this;this.VIEW.show=!1,this.VIEW.loading=!0;var e=this.VIEW.resource.api+"/"+this.$route.params.id+"?mode=view";this.$axios.get(e).then(function(e){var i=e.data;t.setRsView(i)}).catch(function(e){console.warn("[FORM:routing()]",e),t.VIEW.onCatch(e.response,"Load form")}).finally(function(){t.VIEW.show=!0,setTimeout(function(){t.VIEW.loading=!1},1e3)})}}},c=l,d=i("2877"),u=Object(d["a"])(c,a,n,!1,null,null,null);e["default"]=u.exports}}]);