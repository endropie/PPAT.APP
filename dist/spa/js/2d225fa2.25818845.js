(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d225fa2"],{e760:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.SHOW?n("q-page",{staticClass:"page-index",attrs:{padding:""}},[n("q-pull-to-refresh",{attrs:{handler:e.TABLE.refresh,inline:""}},[n("q-table",{ref:"table",staticClass:"table-index",attrs:{inline:"",color:"primary",dark:e.LAYOUT.isDark,title:e.TABLE.getTitle(),data:e.TABLE.rowData,columns:e.TABLE.columns,filter:e.TABLE.filter,selection:"none",selected:e.TABLE.selected,"row-key":"id",pagination:e.TABLE.pagination,loading:e.TABLE.loading},on:{"update:selected":function(t){return e.$set(e.TABLE,"selected",t)},"update:pagination":function(t){return e.$set(e.TABLE,"pagination",t)},request:e.TABLE.compute},scopedSlots:e._u([{key:"top-right",fn:function(t){return[n("q-search",{attrs:{slot:"right","hide-underline":"",dark:e.LAYOUT.isDark},slot:"right",model:{value:e.TABLE.filter,callback:function(t){e.$set(e.TABLE,"filter",t)},expression:"TABLE.filter"}})]}},{key:"body-cell-prefix",fn:function(t){return n("q-td",{staticStyle:{width:"35px"},attrs:{props:t}},[n("q-btn",{attrs:{dense:"",flat:"",color:"light",icon:"edit",to:e.TABLE.resource.uri+"/"+t.row.id+"/edit"}}),n("q-btn",{attrs:{dense:"",flat:"",color:"light",icon:"delete"},nativeOn:{click:function(n){return e.TABLE.delete(t.row)}}})],1)}},{key:"body-cell-customer_id",fn:function(t){return n("q-td",{attrs:{props:t}},[t.row.customer?n("span",[e._v(" "+e._s(t.row.customer.name))]):n("span",[e._v("- undifined -")])])}},{key:"body-cell-begin_date",fn:function(t){return n("q-td",{attrs:{props:t}},[t.row.begin_date?n("span",[e._v(" "+e._s(e.$app.moment(t.row.begin_date).format("DD/MM/YY")))]):n("span",[e._v("- undifined -")])])}},{key:"body-cell-until_date",fn:function(t){return n("q-td",{attrs:{props:t}},[t.row.until_date?n("span",[e._v(" "+e._s(e.$app.moment(t.row.until_date).format("DD/MM/YY")))]):n("span",[e._v("- undifined -")])])}},{key:"body-cell-interval_date",fn:function(t){return n("q-td",{attrs:{props:t}},[n("span",[e._v(" \n          "+e._s(t.row.begin_date?e.$app.moment(t.row.begin_date).format("DD/MM/YY"):"undefined")+" - \n          "+e._s(t.row.until_date?e.$app.moment(t.row.until_date).format("DD/MM/YY"):"undefined")+"\n        ")])])}},{key:"body-cell-created_date",fn:function(t){return n("q-td",{attrs:{props:t}},[t.row.created_at?n("span",[e._v(" "+e._s(e.$app.moment(t.row.created_at).format("DD/MM/YYYY")))]):n("span",[e._v("- undifined -")])])}},{key:"body-cell-created_time",fn:function(t){return n("q-td",{attrs:{props:t}},[t.row.created_at?n("span",[e._v(" "+e._s(e.$app.moment(t.row.created_at).format("HH:mm")))]):n("span",[e._v("- undifined -")])])}}],null,!1,2331538879)})],1)],1):e._e()},r=[],i=n("9155"),o={mixins:[i["a"]],data:function(){return{TABLE:{mode:"index",resource:{api:"/api/v1/incomes/forecasts",uri:"/admin/incomes/forecasts"},columns:[{name:"prefix",label:""},{name:"number",label:"Number",field:"number",align:"left",sortable:!0},{name:"customer_id",label:"Customer",field:"customer_id",align:"left",sortable:!0},{name:"begin_date",label:"Begin Date",field:"begin_date",align:"center"},{name:"until_date",label:"Until Date",field:"until_date",align:"center"},{name:"created_date",label:"Date",field:"created_at",align:"center",sortable:!0},{name:"created_time",label:"Time",field:"created_at",align:"center"}]}}},created:function(){var e=this;this.SHOW=!1,this.INDEX.load(function(){setTimeout(function(){return e.SHOW=!0},500)})}},l=o,d=n("2877"),s=Object(d["a"])(l,a,r,!1,null,null,null);t["default"]=s.exports}}]);