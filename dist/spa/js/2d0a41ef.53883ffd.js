(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0a41ef"],{"04a6":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.SHOW?i("q-page",{staticClass:"row justify-center",attrs:{padding:""}},[i("page-print",{staticClass:"q-pa-md q-pr-lg shadow-2",staticStyle:{"max-width":"210mm"}},[i("div",{staticClass:"row no-wrap",staticStyle:{"margin-bottom":"30px"},attrs:{slot:"header"},slot:"header"},[i("div",{staticClass:"icon"},[i("q-icon",{staticClass:"q-display-3",attrs:{name:"widgets",color:"primary"}})],1),i("div",{staticClass:"title",staticStyle:{"max-width":"calc(100vw - 100px)"}},[i("div",{staticClass:"q-title "},[t._v("Priuk Perkasa Abadi, PT")]),i("div",{staticClass:"q-caption small"},[t._v("Jalan Jati Raya Blok J3 No.7, Cikarang Selatan, Bekasi, Jawa Barat 17530")])]),i("div",{staticClass:"no-print float-right"},[t.rsView.revise_id?i("q-chip",{attrs:{tag:"",outline:"",small:"",color:"negative"}},[t._v("\n          Revised\n        ")]):t._e()],1)]),i("div",{staticClass:"row justify-between q-gutter-y-sm"},[i("div",{},[i("span",{staticClass:"text-weight-medium uppercase"},[t._v(t._s(t.rsView.customer_name))]),i("br"),i("span",{staticClass:"text-weight-medium "},[t._v("Phone: "+t._s(t.rsView.customer_phone))]),i("br"),i("br"),t._v("\n        Address:"),i("br"),i("address",{staticStyle:{"white-space":"pre-wrap"}},[t._v(t._s(t.rsView.customer_address))])]),i("div",{},[i("table",{staticClass:"q-table table table-bordered",staticStyle:{width:"300px"}},[i("tr",[i("td",{attrs:{colspan:"2"}},[t._v("SHIP-DELIVERY ORDER")])]),i("tr",[i("th",[t._v(" Number ")]),i("td",[t._v(" "+t._s(t.rsView.number))])]),i("tr",[i("th",[t._v(" Date ")]),i("td",[t._v(" "+t._s(t.$app.moment(t.rsView.created_at).format("DD/MM/YYYY"))+" ")])])])]),i("div",{staticClass:"col-12"},[i("q-table",{ref:"table",staticClass:"table-border d-grid no-shadow no-radius",attrs:{color:"secondary",separator:"vertical",dense:"","hide-bottom":"",data:t.rsView.ship_delivery_items,"no-data-label":"No Production",columns:[{name:"code",label:"code",align:"left",field:function(t){return t.item.code}},{name:"part_name",label:"Part name",align:"left",field:function(t){return t.item.part_name}},{name:"part_number",label:"Part number",align:"left",field:function(t){return t.item.part_number}},{name:"quantity",label:"Quantity",align:"right",field:function(t){return t.quantity}},{name:"unit_id",label:"Unit",align:"center",field:function(t){return t.unit.code}}]}})],1),t.rsView.plan_begin_date||t.rsView.plan_until_date?i("div",{staticClass:"col-12 text-weight-light text-italic"},[t._v("\n          Delivery plan from "+t._s(t.rsView.plan_begin_date?t.$app.moment(t.rsView.plan_begin_date).format("DD/MM/YYYY"):"")+"\n          until then "+t._s(t.rsView.plan_until_date?t.$app.moment(t.rsView.plan_until_date).format("DD/MM/YYYY"):"")+"\n      ")]):t._e(),i("div",{staticClass:"col-12"},[i("div",{staticClass:"q-my-xs text-italic"},[t._v("Description:")]),i("div",{staticClass:"q-my-xs text-weight-light",staticStyle:{"min-height":"30px"}},[t._v(t._s(t.rsView.description))])]),i("div",{staticClass:"col-12 group print-hide ",staticStyle:{"padding-top":"50px"}},[i("q-btn",{attrs:{label:"Back","icon-right":t.btnIcon("cancel"),color:"dark",to:t.VIEW.resource.uri+"?return"}}),t.IS_EDITABLE?i("q-btn",{attrs:{label:"Edit","icon-right":t.btnIcon("edit"),color:"positive",to:t.VIEW.resource.uri+"/"+t.$route.params.id+"/edit"}}):t._e(),i("q-btn",{attrs:{label:"Print","icon-right":t.btnIcon("print"),color:"grey"},nativeOn:{click:function(e){return t.print()}}}),t.IS_EDITABLE?i("q-btn",{class:{"float-right":t.$q.screen.gt.md},attrs:{label:"Delete","icon-right":t.btnIcon("delete"),color:"negative",outline:""},on:{click:t.VIEW.delete}}):t._e()],1)])])],1):t._e()},n=[],s=i("447e"),r=i("b44a"),l=i("3252"),o={mixins:[s["a"]],components:{PagePrint:r["a"],PagePrintBreak:l["a"]},data:function(){return{VIEW:{data:{},resource:{api:"/api/v1/incomes/ship-deliveries",uri:"/admin/incomes/delivery/ship-delivery-items"}},rsView:{},count:0}},created:function(){this.init()},computed:{IS_EDITABLE:function(){return!this.rsView.revise_id&&!(this.rsView.hasOwnProperty("has_relationship")&&this.rsView.has_relationship.length>0)}},methods:{init:function(){var t=this;this.SHOW=!1,this.VIEW.onLoad(function(e){t.setView(e),setTimeout(function(){t.SHOW=!0},500)})},btnIcon:function(t){return this.$q.screen.lt.sm?"":t},print:function(){window.print()},getBaseUnit:function(t){return 1==t.unit_rate?"":"(".concat(t.unit_amount," ").concat(t.item.unit.code,")")},setView:function(t){this.rsView=t}}},c=o,d=i("2877"),u=Object(d["a"])(c,a,n,!1,null,null,null);e["default"]=u.exports}}]);