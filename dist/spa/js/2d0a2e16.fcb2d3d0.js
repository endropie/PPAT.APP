(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0a2e16"],{"0099":function(t,e,i){"use strict";i.r(e);var r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.SHOW?i("q-page",{staticClass:"form-page",attrs:{padding:""}},[i("q-card",{staticClass:"q-ma-sm",attrs:{inline:""}},[i("q-card-section",[i("form-header",{attrs:{title:t.FORM.title(),subtitle:t.FORM.subtitle()}},[i("template",{slot:"menu-item"},[t.$route.params.id?i("list-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:t.$tc("label.remove"),icon:"delete",clickable:""},on:{click:t.FORM.delete}}):t._e()],1)],2)],1),i("q-separator",{attrs:{dark:t.LAYOUT.isDark}}),i("q-card-section",{staticClass:"row q-col-gutter-sm"},[i("q-field",{staticClass:"col-12",attrs:{prefix:"Work Time Process",dense:"",borderless:"",error:t.errors.has("worktime")}},[i("q-option-group",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"worktime",type:"radio",inline:"",options:[{label:"Reguler",value:"REGULER"},{label:"Overtime",value:"OVERTIME",color:"secondary"}]},model:{value:t.rsForm.worktime,callback:function(e){t.$set(t.rsForm,"worktime",e)},expression:"rsForm.worktime"}})],1),i("div",{staticClass:"col-12 col-sm-6"},[i("div",{staticClass:"row q-col-gutter-x-md q-mb-lg"},[i("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"edit"==t.$route.meta.mode?"required":"",expression:"$route.meta.mode == 'edit' ? 'required':''"}],staticClass:"col-12",attrs:{name:"number",label:"No Transaction",placeholder:"[Auto Generate]",error:t.errors.has("number"),"error-message":t.errors.first("number"),autofocus:""},model:{value:t.rsForm.number,callback:function(e){t.$set(t.rsForm,"number",e)},expression:"rsForm.number"}}),i("select-filter",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12",attrs:{name:"line_id",label:"Line Production",disable:t.IssetLineItems,options:t.LineOptions,clearable:"",error:t.errors.has("line_id"),"error-message":t.errors.first("line_id")},model:{value:t.rsForm.line_id,callback:function(e){t.$set(t.rsForm,"line_id",e)},expression:"rsForm.line_id"}})],1)]),i("div",{staticClass:"col-12 col-sm-6"},[i("div",{staticClass:"row q-col-gutter-x-sm"},[i("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12",attrs:{name:"date",label:"Date","stack-label":"",type:"date",error:t.errors.has("date")},model:{value:t.rsForm.date,callback:function(e){t.$set(t.rsForm,"date",e)},expression:"rsForm.date"}}),i("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12",attrs:{name:"shift_id",label:"Shift","stack-label":"",options:t.ShiftOptions,filter:"",error:t.errors.has("shift_id")},model:{value:t.rsForm.shift_id,callback:function(e){t.$set(t.rsForm,"shift_id",e)},expression:"rsForm.shift_id"}})],1)]),i("div",{staticClass:"col-12"},[i("q-table",{staticClass:"d-grid full-width no-shadow",attrs:{color:"primary",dense:"","hide-bottom":"",data:t.rsForm.workin_production_items,"rows-per-page-options":[0],columns:[{name:"prefix",label:"",align:"left"},{name:"work_order_item_id",label:"Work Order Part",align:"left"},{name:"item_id",label:"Item Part",align:"left"},{name:"quantity",label:"Quantity",align:"center"},{name:"unit_id",label:"unit",align:"center"}],pagination:{rowsPerPage:0}},scopedSlots:t._u([{key:"body",fn:function(e){return[i("q-tr",{attrs:{propItem:e,width:"30%"}},[i("q-td",{key:"prefix",staticStyle:{"max-width":"70px"}},[i("div",{},[i("q-btn",{staticClass:"no-padding",attrs:{dense:"",flat:"",size:"md",icon:"delete",color:"blue-grey-5"},on:{click:function(i){return t.removeItem(e.row.__index)}}},[i("q-tooltip",{attrs:{offset:[10,10]}},[t._v("Remove")])],1),i("q-btn",{staticClass:"no-padding",attrs:{dense:"",flat:"",size:"md",icon:"queue",color:"blue-grey-4"},on:{click:function(i){return t.cloneItem(e.row.__index)}}},[i("q-tooltip",{attrs:{offset:[10,10]}},[t._v("clone")])],1)],1)]),i("q-td",{key:"work_order_item_id"},[i("q-select",{attrs:{name:"workin_production_items."+e.row.__index+".work_order_item_id",outlined:"","hide-bottom-space":"",dense:"",color:"blue-grey-5",readonly:!t.IssetLineID,options:t.WorkOrderItemOptions,filter:"",clearable:"",error:t.errors.has("workin_production_items."+e.row.__index+".work_order_item_id")},on:{input:function(i){t.setWorkOrderItemReference(e.row.__index,i)}},model:{value:e.row.work_order_item_id,callback:function(i){t.$set(e.row,"work_order_item_id",i)},expression:"propItem.row.work_order_item_id"}}),i("q-tooltip",{attrs:{disable:t.IssetLineID,offset:[0,10]}},[t._v("Select The Line Production, first! ")])],1),i("q-td",{key:"item_id",attrs:{width:"35%"}},[i("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"full-width",attrs:{name:"workin_production_items."+e.row.__index+".item_id",outlined:"","hide-bottom-space":"",dense:"",color:"blue-grey-5",readonly:!t.IssetLineID||!!e.row.work_order_item_id,options:t.ItemOptions,error:t.errors.has("workin_production_items."+e.row.__index+".item_id")},on:{input:function(i){t.setItemReference(e.row.__index,i)}},model:{value:e.row.item_id,callback:function(i){t.$set(e.row,"item_id",i)},expression:"propItem.row.item_id"}}),i("q-tooltip",{attrs:{disable:t.IssetLineID,offset:[0,10]}},[t._v("Select The Line Production, first! ")])],1),i("q-td",{key:"quantity",attrs:{width:"20%"}},[i("q-input",{directives:[{name:"validate",rawName:"v-validate",value:e.row.item_id?"required":"",expression:"propItem.row.item_id ? 'required' : ''"}],attrs:{name:"workin_production_items."+e.row.__index+".quantity",type:"number",min:"0",align:"center",outlined:"","hide-bottom-space":"",dense:"",color:"blue-grey-5",warning:e.row.quantity>t.numUnitConvertion(e.row,t.LoadUnitAvailable[e.row.__index])&&"warning",suffix:" / "+t.strUnitConvertion(e.row,t.LoadUnitAvailable[e.row.__index]),error:t.errors.has("workin_production_items."+e.row.__index+".quantity")},model:{value:e.row.quantity,callback:function(i){t.$set(e.row,"quantity",i)},expression:"propItem.row.quantity"}})],1),i("q-td",{key:"unit_id",attrs:{width:"15%"}},[i("q-select",{directives:[{name:"validate",rawName:"v-validate",value:e.row.item_id?"required":"",expression:"propItem.row.item_id ? 'required' : ''"}],attrs:{name:"workin_production_items."+e.row.__index+".unit_id",outlined:"","hide-bottom-space":"",dense:"",color:"blue-grey-5",options:t.ItemUnitOptions[e.row.__index],error:t.errors.has("workin_production_items."+e.row.__index+".unit_id")},on:{input:function(i){t.setUnitReference(e.row.__index,i)}},model:{value:e.row.unit_id,callback:function(i){t.$set(e.row,"unit_id",i)},expression:"propItem.row.unit_id"}})],1)],1),i("q-tr",{attrs:{propItem:e}},[i("q-td"),i("q-td",{attrs:{colspan:"2"}},[i("div",{staticClass:"text-left"},[i("q-markup-table",{staticClass:"no-border no-shadow"},[i("tr",[i("td",[t._v("No Plate    ")]),i("td",[t._v(t._s(e.row.item.part_number))])]),i("tr",[i("td",[t._v("Plate name  ")]),i("td",[t._v(t._s(e.row.item.part_name))])])])],1)]),i("q-td",{attrs:{colspan:"2"}},[i("div",{staticClass:"text-left"},[i("q-markup-table",{staticClass:"no-border no-shadow"},[i("tr",[i("td",[t._v("Quantity    ")]),i("td",[t._v(t._s(t.formatNumber(Number(e.row.quantity)*Number(e.row.unit_rate)))+" "+t._s(e.row.item.unit?e.row.item.unit.name:""))])]),i("tr",[i("td",[t._v("FG #alias    ")]),i("td",[t._v(t._s(e.row.item.part_alias||""))])])])],1)]),i("q-td",{attrs:{colspan:"100%"}})],1)]}},{key:"bottom-row",fn:function(e){return i("q-tr",{attrs:{propItem:e}},[i("q-td",{attrs:{colspan:"100%"}},[i("q-btn",{staticClass:"full-width",attrs:{label:"New Part",dense:"",color:"positive"},on:{click:function(e){return t.addNewItem()}}})],1)],1)}}],null,!1,2472235870)},[i("template",{slot:"top-left"})],2)],1),i("div",{staticClass:"col-12 q-mt-md"},[i("div",{staticClass:"row q-col-gutter-x-lg "},[i("q-input",{staticClass:"col-12",attrs:{name:"description",type:"textarea",rows:"3","stack-label":"",label:"Description",filled:""},model:{value:t.rsForm.description,callback:function(e){t.$set(t.rsForm,"description",e)},expression:"rsForm.description"}})],1)])],1),i("q-separator",{attrs:{dark:t.LAYOUT.isDark}}),i("q-card-actions",{staticClass:"q-mx-lg"},[i("q-btn",{attrs:{label:t.$tc("label.cancel"),icon:"cancel",color:"dark"},on:{click:function(e){return t.FORM.toBack()}}}),i("q-btn",{attrs:{label:t.$tc("label.reset"),icon:"refresh",color:"light"},on:{click:function(e){return t.setForm(t.FORM.data)}}}),i("q-btn",{attrs:{label:t.$tc("label.save"),icon:"save",color:"positive"},on:{click:function(e){return t.onSave()}}})],1)],1),i("q-inner-loading",{attrs:{visible:t.FORM.loading,dark:t.LAYOUT.isDark}},[i("q-spinner-dots",{attrs:{size:"70px",color:"primary"}})],1)],1):t._e()},o=[],n=(i("551c"),i("06db"),i("097d"),i("7514"),i("c5f6"),i("7f7f"),i("0ce1")),s={mixins:[n["a"]],data:function(){var t=this;return{SHEET:{work_order_items:{data:[],api:"/api/v1/factories/work-orders?mode=item-lines"},work_orders:{data:[],api:"/api/v1/factories/work-orders?mode=item-lines"},lines:{data:[],api:"/api/v1/references/lines?mode=all"},shifts:{data:[],api:"/api/v1/references/shifts?mode=all"},customers:{data:[],api:"/api/v1/incomes/customers?mode=all"},units:{data:[],api:"/api/v1/references/units?mode=all"},items:{data:[],api:"/api/v1/common/items?mode=all"},itemstocks:{data:[],api:"/api/v1/common/items?mode=itemstock"}},FORM:{resource:{uri:"/admin/factories/workin-productions",api:"/api/v1/factories/workin-productions"}},rsForm:{},setDefault:function(){return{number:null,date:t.$app.moment().format("YYYY-MM-DD"),time:t.$app.moment().format("HH:mm"),line_id:null,shift_id:null,worktime:"REGULER",description:null,workin_production_items:[{id:null,item_id:null,item:{},unit_id:null,unit:{},unit_rate:1,quantity:null,work_order_item_id:null}]}}}},created:function(){this.init()},computed:{IssetLineItems:function(){var t=this.rsForm.workin_production_items;for(var e in t)if(t.hasOwnProperty(e)&&t[e].item_id)return!0;return!1},IssetLineID:function(){return!!this.rsForm.line_id},TotalQuantity:function(){this.rsForm.workin_production_items.reduce(function(t,e){console.warn(t,e)})},WorkOrderItemOptions:function(){var t=this;if(!this.rsForm.line_id)return[];if(0===this.SHEET.work_orders.data.length)return[];var e=this.SHEET.work_orders.data||[],i=[],r=function(e){return t.MAPINGKEY["items"][e]?"["+t.MAPINGKEY["items"][e].code+"] "+t.MAPINGKEY["items"][e].part_name:null};return e.map(function(e){e.work_order_items.map(function(r){r.work_order_item_lines.some(function(e){return e.line_id==t.rsForm.line_id})&&(r.work_order={id:e.id,number:e.number,line_id:e.line_id},i.push(r))})}),i.map(function(t){return{data:t,label:"".concat(t.work_order.number," #").concat(t.id),sublabel:r(t.item_id),value:t.id}})},LineOptions:function(){return this.SHEET.lines.data.map(function(t){return{label:t.name,value:t.id}})||[]},ShiftOptions:function(){return this.SHEET.shifts.data.map(function(t){return{label:t.name,value:t.id}})||[]},CustomerOptions:function(){return this.SHEET.customers.data.map(function(t){return{label:[t.code,t.name].join(" - "),value:t.id}})||[]},UnitOptions:function(){return this.SHEET.units.data.map(function(t){return{label:t.code,value:t.id}})||[]},ItemOptions:function(){var t=this,e=this.SHEET.items.data.filter(function(e){return e.item_prelines.some(function(e){return e.line_id===t.rsForm.line_id})});return e.map(function(t){return{label:t.code+" "+t.part_name,value:t.id}})||[]},ItemUnitOptions:function(){var t=this,e=[];for(var i in this.rsForm.workin_production_items)this.rsForm.workin_production_items.hasOwnProperty(i)&&function(){var r=t.rsForm.workin_production_items[i];e[i]=t.UnitOptions||[],e[i]=e[i].filter(function(t){if(!r.item_id)return!1;if(r.item){if(r.item.unit_id===t.value)return!0;if(r.item.item_units){var e=r.item.item_units.filter(function(e){return e.unit_id==t.value});if(e.length>0)return!0}}return!1})}();return e},LoadUnitAvailable:function(){var t=this,e={},i={set:function(t,e){this.hasOwnProperty(t)||(this[t]=0),this[t]+=Number(e)},get:function(t){return this.hasOwnProperty(t)?this[t]:0}};this.FORM.data&&this.FORM.data.workin_production_items.forEach(function(t){e.hasOwnProperty(t.work_order_item_id)||(e[t.work_order_item_id]=0),e[t.work_order_item_id]+=Number(t.quantity||0)*Number(t.unit_rate||0)}),this.WorkOrderItemOptions.map(function(i){e.hasOwnProperty(i.data.id)||(e[i.data.id]=0);var r=i.data.work_order_item_lines.find(function(e){return e.line_id===t.rsForm.line_id});e[i.data.id]+=Number(i.data.unit_amount||0)-Number(r.total_workin_production_item||0)});var r={};return this.rsForm.workin_production_items&&this.rsForm.workin_production_items.map(function(t,o){e[t.work_order_item_id]&&t.work_order_item_id&&(r[o]=Number(e[t.work_order_item_id]||0)-Number(i.get(t.work_order_item_id)||0),i.set(t.work_order_item_id,Number(t.quantity)*Number(t.unit_rate)))}),r},LoadItemStock:function(){var t=JSON.parse(JSON.stringify(this.MAPINGKEY["itemstocks"])),e={set:function(t,e){this.hasOwnProperty(t)||(this[t]=0),this[t]+=Number(e)},get:function(t){return this.hasOwnProperty(t)?this[t]:0}};this.FORM.data.workin_production_items.forEach(function(e){t.hasOwnProperty(e.item_id)&&(t[e.item_id].totals["FG"]+=Number(e.quantity))});var i={};return this.rsForm.workin_production_items.map(function(r,o){t[r.item_id]&&r.item_id&&(i[o]=Number(t[r.item_id].totals["FG"]||0)-Number(e.get(r.item_id)||0),e.set(r.item_id,r.quantity))}),i},MAPINGKEY:function(){var t={work_order_items:{},units:{},items:{},itemstocks:{}};return this.SHEET["units"].data.map(function(e){t["units"][e.id]=e}),this.SHEET["items"].data.map(function(e){t["items"][e.id]=e}),this.SHEET["itemstocks"].data.map(function(e){t["itemstocks"][e.id]=e}),this.SHEET["work_orders"].data.map(function(e){e.work_order_items.map(function(e){t["work_order_items"][e.id]=e})}),t}},watch:{$route:"init"},methods:{init:function(){var t=this;this.SHOW=!1,this.FORM.load(function(e){t.setForm(e),setTimeout(function(){t.SHOW=!0},500)})},setForm:function(t){var e=this;this.rsForm=JSON.parse(JSON.stringify(t)),t.hasOwnProperty("has_relationship")&&t["has_relationship"].length>0&&(this.FORM.has_relationship=t.has_relationship,this.FORM.onRelationship({title:"Request order has relation!",message:t["has_relationship"].join("-"),then:function(){return e.$router.push("".concat(e.FORM.resource.uri,"/").concat(t.id,"/view"))}}))},strUnitConvertion:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return e<0?"(-)":Number(e)/Number(t.unit_rate||1)},numUnitConvertion:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Number(e)/Number(t.unit_rate||1)},setWorkOrderItemReference:function(t,e){if(e){if(this.MAPINGKEY["work_order_items"][e]){var i=this.MAPINGKEY["work_order_items"][e].item_id;this.rsForm.workin_production_items[t].item_id=i,this.setItemReference(t,i)}}else this.rsForm.workin_production_items[t].item_id=null,this.setItemReference(t,null)},setItemReference:function(t,e){if(e){var i=this.MAPINGKEY["items"][e].unit_id;this.rsForm.workin_production_items[t].unit_id=i,this.rsForm.workin_production_items[t].unit_rate=1,this.rsForm.workin_production_items[t].item=this.MAPINGKEY["items"][e],this.rsForm.workin_production_items[t].unit=this.MAPINGKEY["units"][i]}else this.rsForm.workin_production_items[t].unit_id=null,this.rsForm.workin_production_items[t].unit={},this.rsForm.workin_production_items[t].item={}},setUnitReference:function(t,e){var i=this,r=this.rsForm.workin_production_items[t];(e||r.hasOwnProperty("item"))&&(r.item.unit_id===e?this.rsForm.workin_production_items[t].unit_rate=1:r.item.item_units&&r.item.item_units.map(function(r){r.unit_id==e&&(i.rsForm.workin_production_items[t].unit_rate=r.rate)}))},addNewItem:function(){var t=this.setDefault().workin_production_items[0];this.rsForm.workin_production_items.push(t)},cloneItem:function(t){var e=this.rsForm.workin_production_items[t];this.rsForm.workin_production_items.push(e)},removeItem:function(t){this.rsForm.workin_production_items.splice(t,1),this.rsForm.workin_production_items.length<1&&this.addNewItem()},onSave:function(){var t=this;this.$validator.validate().then(function(e){if(e){t.FORM.loading=!0;var i=t.FORM.meta(),r=i.method,o=(i.mode,i.apiUrl);t.$axios.set(r,o,t.rsForm).then(function(e){var i=e.data.number+" - #"+e.data.id;t.FORM.response.success({message:i}),t.FORM.toView(e.data.id)}).catch(function(e){t.FORM.response.fields(e.response),t.FORM.response.error(e.response,"Submit")}).finally(function(){t.FORM.loading=!1})}else t.$q.notify({color:"negative",icon:"error",position:"top-right",timeout:3e3,message:"Please complete the form fields"})})}}},a=s,d=i("2877"),l=Object(d["a"])(a,r,o,!1,null,null,null);e["default"]=l.exports}}]);