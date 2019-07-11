(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0e2cb9"],{"7fe9":function(e,t,r){"use strict";r.r(t);var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.SHOW?r("q-page",{staticClass:"main-page justify-center",attrs:{padding:""}},[r("q-card",{staticClass:"q-ma-sm ",attrs:{inline:""}},[r("q-card-section",[r("form-header",{attrs:{title:e.FORM.title(),subtitle:e.FORM.subtitle()}},[r("template",{slot:"menu-prepend"},[e.rsForm.revise_id?r("q-chip",{attrs:{small:"",color:"negative"}},[e._v("\n            Revised\n          ")]):e._e()],1),r("template",{slot:"menu-item"},[e.$route.params.id?r("list-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:e.$tc("label.remove"),icon:"delete",clickable:""},on:{click:e.FORM.delete}}):e._e()],1)],2)],1),r("q-card-section",[r("div",{staticClass:"row q-gutter-sm q-gutter-x-md"},[r("q-field",{staticClass:"col-12 ",attrs:{label:"Transaction mode","label-width":"3",error:e.errors.has("transaction"),"error-message":e.errors.first("transaction")}},[r("div",{staticClass:"row no-wrap"},[r("q-option-group",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col",attrs:{name:"transaction",type:"radio",color:"secondary",inline:"",options:[{label:"REGULER",value:"REGULER"},{label:"RETURN",value:"RETURN"}]},model:{value:e.rsForm.transaction,callback:function(t){e.$set(e.rsForm,"transaction",t)},expression:"rsForm.transaction"}})],1)]),r("div",{staticClass:"col-12 col-md-6"},[r("div",{staticClass:"row q-gutter-x-sm q-mb-md"},[r("q-field",{staticClass:"col-12",attrs:{error:e.errors.has("number"),"error-message":e.errors.first("number")}},[r("div",{staticClass:"row justify no-wrap"},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"edit"==e.$route.meta.mode?"required":"",expression:"$route.meta.mode == 'edit' ? 'required':''"}],staticClass:"col",attrs:{name:"number","stack-label":"",label:"No Transaction",readonly:""},model:{value:e.rsForm.number,callback:function(t){e.$set(e.rsForm,"number",t)},expression:"rsForm.number"}}),r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"edit"==e.$route.meta.mode?"required":"",expression:"$route.meta.mode == 'edit' ? 'required':''"}],staticClass:"col col-auto",staticStyle:{width:"70px"},attrs:{name:"number","stack-label":"",label:"Revision",readonly:"",align:"center"},model:{value:e.rsForm.numrev,callback:function(t){e.$set(e.rsForm,"numrev",t)},expression:"rsForm.numrev"}})],1)]),r("q-field",{staticClass:"col-12",attrs:{error:e.errors.has("customer_id"),"error-message":e.errors.first("customer_id")}},[r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"customer_id",label:"Customer",readonly:"",options:e.CustomerOptions},on:{input:e.setCustomerReference},model:{value:e.rsForm.customer_id,callback:function(t){e.$set(e.rsForm,"customer_id",t)},expression:"rsForm.customer_id"}}),r("q-tooltip",{attrs:{disable:!e.IssetIncomeItems,offset:[0,10]}},[e._v("To change, Please clear Delivery items first!")])],1),r("q-field",{staticClass:"col-12 q-pt-lg",attrs:{error:e.errors.has("request_order_id"),"error-message":e.errors.first("request_order_id"),label:"Request Order [PO]","label-width":"12"}},[r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"request_order_id",readonly:"",options:e.RequestOrderOptions},on:{input:e.setRequestOrderReference},model:{value:e.rsForm.request_order_id,callback:function(t){e.$set(e.rsForm,"request_order_id",t)},expression:"rsForm.request_order_id"}}),r("q-tooltip",{attrs:{disable:e.IssetCustomerID,offset:[0,10]}},[e._v("Select a customer, first! ")]),e.SHEET["request_orders"].loading?r("q-spinner-mat",{staticClass:"field-loading",attrs:{color:"primary"}}):e._e()],1)],1)]),r("div",{staticClass:"col-12 col-md-6"},[r("div",{staticClass:"row q-gutter-x-sm"},[r("q-field",{staticClass:"col-12"},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"customer_name","stack-label":"",label:"Name"},model:{value:e.rsForm.customer_name,callback:function(t){e.$set(e.rsForm,"customer_name",t)},expression:"rsForm.customer_name"}})],1),r("q-field",{staticClass:"col-12"},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"customer_phone","stack-label":"",label:"phone"},model:{value:e.rsForm.customer_phone,callback:function(t){e.$set(e.rsForm,"customer_phone",t)},expression:"rsForm.customer_phone"}})],1),r("q-field",{staticClass:"col-12"},[r("q-input",{attrs:{name:"customer_address","stack-label":"",label:"Address",type:"textarea",rows:"2"},model:{value:e.rsForm.customer_address,callback:function(t){e.$set(e.rsForm,"customer_address",t)},expression:"rsForm.customer_address"}})],1)],1)]),r("div",{staticClass:"col-12 q-my-md"},[r("q-table",{ref:"table",staticClass:"table-border d-grid no-shadow",attrs:{data:e.rsForm.delivery_order_items,dense:"","hide-bottom":"",separator:"vertical","rows-per-page-options":[0],columns:[{name:"item_id",label:"Part item",align:"center"},{name:"quantity",label:"Quantity",align:"center"},{name:"unit_id",label:"unit",align:"center"}],pagination:{rowsPerPage:0}},scopedSlots:e._u([{key:"body",fn:function(t){return[r("q-tr",{attrs:{propItem:t}},[r("q-td",{key:"item_id",attrs:{width:"50%"}},[r("q-field",{staticStyle:{"min-width":"150px"},attrs:{error:e.errors.has("delivery_order_items."+t.row.__index+".item_id")}},[r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"delivery_order_items."+t.row.__index+".item_id",inverted:"",color:"blue-grey-5",options:e.ItemOptions,filter:"",readonly:""},on:{input:function(r){e.setItemReference(t.row.__index,r)}},model:{value:t.row.item_id,callback:function(r){e.$set(t.row,"item_id",r)},expression:"propItem.row.item_id"}}),r("q-tooltip",{attrs:{disable:e.IssetCustomerID,offset:[0,10]}},[e._v("Select a customer, first! ")])],1)],1),r("q-td",{key:"quantity",attrs:{width:"25%"}},[r("q-field",{staticStyle:{"min-width":"120px"},attrs:{error:e.errors.has("delivery_order_items."+t.row.__index+".quantity")}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:e.FORM.validator.quantity(t.row,e.numUnitConvertion(t.row,e.MaxMount[t.row.__index])),expression:"FORM.validator.quantity(propItem.row, numUnitConvertion(propItem.row, MaxMount[propItem.row.__index]))"}],attrs:{name:"delivery_order_items."+t.row.__index+".quantity",type:"number",align:"center",inverted:"",color:"blue-grey-5",suffix:t.row.item_id?"&nbsp;/&nbsp; "+e.numUnitConvertion(t.row,e.MaxMount[t.row.__index]):""},model:{value:t.row.quantity,callback:function(r){e.$set(t.row,"quantity",r)},expression:"propItem.row.quantity"}})],1)],1),r("q-td",{key:"unit_id",attrs:{width:"20%"}},[r("q-field",{staticStyle:{"min-width":"100px"},attrs:{error:e.errors.has("delivery_order_items."+t.row.__index+".unit_id")}},[r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:t.row.item_id?"required":"",expression:"propItem.row.item_id ? 'required' : ''"}],attrs:{name:"delivery_order_items."+t.row.__index+".unit_id",inverted:"",color:"blue-grey-5",options:e.ItemUnitOptions[t.row.__index]},on:{input:function(r){e.setUnitReference(t.row.__index,r)}},model:{value:t.row.unit_id,callback:function(r){e.$set(t.row,"unit_id",r)},expression:"propItem.row.unit_id"}})],1)],1)],1),t.row.item_id?r("q-tr",{attrs:{propItem:t}},[r("q-td",{attrs:{colspan:"1"}},[r("div",{staticClass:"text-left"},[r("table",{staticClass:"table-description full-width"},[r("tr",[r("td",[e._v("No Plate    ")]),r("td",[e._v(e._s(t.row.item.part_number))])]),r("tr",[r("td",[e._v("Plate name  ")]),r("td",[e._v(e._s(t.row.item.part_name))])])])])]),r("q-td",{attrs:{colspan:"2"}},[r("div",{staticClass:"text-left"},[r("table",{staticClass:"table-description full-width"},[r("tr",[r("td",[e._v("Quantity    ")]),r("td",[e._v(e._s(e.formatNumber(Number(t.row.quantity)*Number(t.row.unit_rate)))+" "+e._s(t.row.unit.name))])]),r("tr",[r("td",[e._v("FG #alias    ")]),r("td",[e._v(e._s(t.row.item.part_alias))])])])])])],1):e._e()]}}],null,!1,1778946426)})],1),r("div",{staticClass:"col-12"},[r("div",{staticClass:"row q-gutter-x-lg q-mb-md"},[r("q-field",{staticClass:"col-12",attrs:{error:e.errors.has("operator_id"),"error-message":e.errors.first("operator_id")}},[r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"operator_id","stack-label":"",label:"Operator",options:e.OperatorOptions},model:{value:e.rsForm.operator_id,callback:function(t){e.$set(e.rsForm,"operator_id",t)},expression:"rsForm.operator_id"}})],1),r("q-field",{staticClass:"col-12 col-sm-8 col-md-4",attrs:{error:e.errors.has("date"),"error-message":e.errors.first("date")}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"date","stack-label":"",label:"Date",type:"date"},model:{value:e.rsForm.date,callback:function(t){e.$set(e.rsForm,"date",t)},expression:"rsForm.date"}})],1),r("q-field",{staticClass:"col-12 col-sm-4 col-md-2",attrs:{error:e.errors.has("time"),"error-message":e.errors.first("time")}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"time","stack-label":"",label:"Time",type:"time"},model:{value:e.rsForm.time,callback:function(t){e.$set(e.rsForm,"time",t)},expression:"rsForm.time"}})],1),r("q-field",{staticClass:"col-12 col-sm-8 col-md-4",attrs:{error:e.errors.has("due_date"),"error-message":e.errors.first("due_date")}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"due_date","stack-label":"",label:"Due Date",type:"date"},model:{value:e.rsForm.due_date,callback:function(t){e.$set(e.rsForm,"due_date",t)},expression:"rsForm.due_date"}})],1),r("q-field",{staticClass:"col-12 col-sm-4 col-md-2",attrs:{error:e.errors.has("due_time"),"error-message":e.errors.first("due_time")}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"due_time","stack-label":"",label:"Due Time",type:"time"},model:{value:e.rsForm.due_time,callback:function(t){e.$set(e.rsForm,"due_time",t)},expression:"rsForm.due_time"}})],1),r("q-field",{staticClass:"col-12",attrs:{icon:"rate_review"}},[r("q-input",{attrs:{name:"description",type:"textarea",rows:"3","stack-label":"",label:"Description"},model:{value:e.rsForm.description,callback:function(t){e.$set(e.rsForm,"description",t)},expression:"rsForm.description"}})],1)],1)])],1)]),r("q-separator",{attrs:{dark:e.LAYOUT.isDark}}),r("q-card-actions",{staticClass:"q-mx-lg"},[r("q-btn",{attrs:{label:e.$tc("label.cancel"),icon:"cancel",color:"dark"},on:{click:function(t){return e.FORM.toBack()}}}),r("q-btn",{attrs:{label:e.$tc("label.reset"),icon:"refresh",color:"light"},on:{click:function(t){return e.setForm(e.FORM.data)}}}),e.IS_EDITABLE?r("q-btn",{attrs:{label:e.$tc("label.save"),icon:"save",color:"positive"},on:{click:function(t){return e.onSave()}}}):e._e()],1)],1),r("q-inner-loading",{attrs:{visible:e.FORM.loading,dark:e.LAYOUT.isDark}},[r("q-spinner-dots",{attrs:{size:"70px",color:"primary"}})],1)],1):e._e()},s=[],a=(r("551c"),r("06db"),r("097d"),r("7514"),r("c5f6"),r("7f7f"),r("0ce1")),o={mixins:[a["a"]],data:function(){var e=this;return{SHEET:{request_orders:{autoload:!1,api:"/api/v1/incomes/request-orders?mode=all&--with=request_order_items"},customers:{data:[],api:"/api/v1/incomes/customers?mode=all"},transports:{data:[],api:"/api/v1/warehouses/transports?mode=all"},operators:{data:[],api:"/api/v1/references/operators?mode=all"},vehicles:{data:[],api:"/api/v1/references/vehicles?mode=all"},units:{data:[],api:"/api/v1/references/units?mode=all"},items:{data:[],api:"/api/v1/common/items?mode=all"},itemstocks:{data:[],api:"/api/v1/common/items?mode=itemstock"}},FORM:{resource:{api:"/api/v1/incomes/delivery-orders",uri:"/admin/incomes/delivery/delivery-orders"},validator:{quantity:function(t,r){var i=["required"],s=e.$store.state.admin.CONFIG.model.pre_deliveries.max_quantity_validation;return t.item_id&&!0===s&&i.push("max_value:".concat(r)),i.join("|")}}},rsForm:{},setDefault:function(){return{number:null,num_rev:null,transaction:null,customer_id:null,customer_name:null,customer_phone:null,customer_address:null,operator_id:null,date:e.$app.moment().format("YYYY-MM-DD"),time:e.$app.moment().format("HH:mm"),due_date:e.$app.moment().format("YYYY-MM-DD"),due_time:e.$app.moment().format("HH:mm"),revise_id:0,description:null,delivery_order_items:[]}}}},created:function(){this.init()},computed:{IS_EDITABLE:function(){return!!this.rsForm.hasOwnProperty("revise_id")&&!this.rsForm.revise_id},IssetIncomeItems:function(){var e=this.rsForm.delivery_order_items;for(var t in e)if(e.hasOwnProperty(t)&&e[t].item_id)return!0;return!1},IssetCustomerID:function(){return!!this.rsForm.customer_id},RequestOrderOptions:function(){if(!this.rsForm.customer_id)return[];var e=this.SHEET.request_orders.data||[];return e.map(function(e){return{data:e,label:"".concat(e.number),value:e.id}})},CustomerOptions:function(){return this.SHEET.customers.data.map(function(e){return{label:[e.code,e.name].join(" - "),value:e.id}})||[]},TransportOptions:function(){return this.SHEET.vehicles.data.map(function(e){return{label:e.name,value:e.name}})},OperatorOptions:function(){return this.SHEET.operators.data.map(function(e){return{label:e.name,value:e.id}})||[]},VehicleOptions:function(){return this.SHEET.vehicles.data.map(function(e){return{label:e.name,value:e.id}})||[]},UnitOptions:function(){return this.SHEET.units.data.map(function(e){return{label:e.code,value:e.id}})||[]},ItemOptions:function(){var e=this,t=this.SHEET.items.data.filter(function(t){return t.customer_id===e.rsForm.customer_id});return t.map(function(e){return{label:"".concat(e.code," - ").concat(e.part_name),value:e.id}})||[]},ItemUnitOptions:function(){var e=this,t=[];for(var r in this.rsForm.delivery_order_items)this.rsForm.delivery_order_items.hasOwnProperty(r)&&function(){var i=e.rsForm.delivery_order_items[r];t[r]=e.UnitOptions||[],t[r]=t[r].filter(function(e){if(!i.item_id)return!1;if(i.item){if(i.item.unit_id===e.value)return!0;if(i.item.item_units){var t=i.item.item_units.filter(function(t){return t.unit_id==e.value});if(t.length>0)return!0}}return!1})}();return t},MaxMount:function(){if(0==this.RequestOrderOptions.length)return[];var e={},t={set:function(e,t){this.hasOwnProperty(e)||(this[e]=0),this[e]+=Number(t)},get:function(e){return this.hasOwnProperty(e)?this[e]:0}};this.RequestOrderOptions.map(function(t){t.data.request_order_items.map(function(t){e.hasOwnProperty(t.item_id)||(e[t.item_id]=0),e[t.item_id]+=Number(t.unit_amount||0),e[t.item_id]-=Number(t.total_delivery_item||0)})});var r=[];return this.rsForm.delivery_order_items&&(r=this.rsForm.delivery_order_items.map(function(r,i){var s=0;return e[r.item_id]&&r.item_id&&(s=Number(t.get(r.item_id)||0),t.set(r.item_id,Number(r.quantity)*Number(r.unit_rate))),Number(e[r.item_id]||0)-s})),r},MaxStock:function(){var e=JSON.parse(JSON.stringify(this.MAPINGKEY["itemstocks"])),t={set:function(e,t){this.hasOwnProperty(e)||(this[e]=0),this[e]+=Number(t)},get:function(e){return this.hasOwnProperty(e)?this[e]:0}};this.FORM.data.delivery_order_items.forEach(function(t){e.hasOwnProperty(t.item_id)&&(e[t.item_id].totals["FG"]+=Number(t.quantity))});var r={};return this.rsForm.delivery_order_items.map(function(i,s){e[i.item_id]&&i.item_id&&(r[s]=Number(e[i.item_id].totals["FG"]||0)-Number(t.get(i.item_id)||0),t.set(i.item_id,i.quantity))}),r},MAPINGKEY:function(){var e={customers:{},units:{},items:{},itemstocks:{}};return this.SHEET["customers"].data.map(function(t){e["customers"][t.id]=t}),this.SHEET["units"].data.map(function(t){e["units"][t.id]=t}),this.SHEET["items"].data.map(function(t){e["items"][t.id]=t}),this.SHEET["itemstocks"].data.map(function(t){e["itemstocks"][t.id]=t}),e}},watch:{$route:"init"},methods:{init:function(){var e=this;this.SHOW=!1,this.FORM.load(function(t){e.setForm(t),setTimeout(function(){e.SHOW=!0},500)})},numUnitConvertion:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Number(t)/Number(e.unit_rate||1)},setCustomerReference:function(e){this.rsForm.customer_id?(this.rsForm.customer_name=this.MAPINGKEY["customers"][e].name,this.rsForm.customer_phone=this.MAPINGKEY["customers"][e].phone,this.rsForm.customer_address=this.MAPINGKEY["customers"][e].address_raw,this.SHEET.load("request_orders","customer_id="+this.rsForm.customer_id)):(this.rsForm.customer_name=null,this.rsForm.customer_phone=null,this.rsForm.customer_address=null)},setRequestOrderReference:function(e){var t=this;e||(this.rsForm.delivery_order_items=[]);var r=this.SHEET.pre_deliveries.data,i=r.find(function(t){return t.id===e});if(i){var s=[];i.pre_delivery_items.map(function(e){s.push({pre_delivery_item_id:e.id,item_id:e.item_id,unit_id:e.unit_id,item:t.MAPINGKEY["items"][e.item_id],unit:t.MAPINGKEY["units"][e.unit_id],quantity:null})})}else console.warn("[PLAY] Set PDO invalid!")},setItemReference:function(e,t){if(t){this.rsForm.delivery_order_items[e].item=this.MAPINGKEY["items"][t];var r=this.MAPINGKEY["items"][t].unit_id;this.rsForm.delivery_order_items[e].unit_id=r,this.rsForm.delivery_order_items[e].unit_rate=1,this.rsForm.delivery_order_items[e].unit=this.MAPINGKEY["units"][r]}else this.rsForm.delivery_order_items[e].unit_id=null,this.rsForm.delivery_order_items[e].unit={},this.rsForm.delivery_order_items[e].item={}},setUnitReference:function(e,t){var r=this;t&&(this.rsForm.delivery_order_items[e].item.unit_id===t?this.rsForm.delivery_order_items[e].unit_rate=1:this.rsForm.delivery_order_items[e].item.item_units&&this.rsForm.delivery_order_items[e].item.item_units.map(function(i){i.unit_id==t&&(r.rsForm.delivery_order_items[e].unit_rate=i.rate)}))},setForm:function(e){var t=this;if(this.rsForm=e,this.SHEET.load("request_orders","customer_id=".concat(this.rsForm.customer_id,"&id=").concat(this.rsForm.request_order_id)),e.hasOwnProperty("has_relationship")&&e["has_relationship"].length>0){this.FORM.has_relationship=e.has_relationship;var r=e["has_relationship"].join("-");this.$q.dialog({title:"Work Order has Related",message:r,preventClose:!0,ok:"Direct to Detail Page",cancel:"Continue"}).then(function(){t.$router.push("".concat(t.FORM.resource.uri,"/").concat(e.id,"/view"))}).catch(function(){})}},onSave:function(){var e=this;this.$validator.validate().then(function(t){if(t){e.FORM.loading=!0;var r="PATCH",i=[e.FORM.resource.api,e.$route.params.id,"revision"].join("/");e.$axios.set(r,i,e.rsForm).then(function(t){var r=t.data.number+" - #"+t.data.id;e.FORM.response.success({message:r}),e.FORM.toView(t.data.id)}).catch(function(t){e.FORM.response.fields(t.response),e.FORM.response.error(t.response,"REVISION FAILED")}).finally(function(){e.FORM.loading=!1})}else e.$q.notify({color:"negative",icon:"error",position:"top-right",timeout:3e3,message:"Please complete the form fields"})})}}},n=o,l=r("2877"),d=Object(l["a"])(n,i,s,!1,null,null,null);t["default"]=d.exports}}]);