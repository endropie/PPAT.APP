<template>
  <table class="page-print shadow-2" style="width100%; max-width: calc(100vw - 20px);">
    <thead>
      <td class="page-print-header" style="max-width:calc(100vw - 50px)">
        <slot name="header">
          <div class="header no-wrap row items-start" style="margin-bottom30px">
            <div class="head-icon self-start">
              <slot name="'header-icon'">
                <div>
                  <q-icon  name="widgets" color="primary" class=""/>
                </div>
              </slot>
            </div>
            <div class="head-brand">
              <div class="brand text-no-wrap float-left">
                <div  class="title text-weight-bolder uppercase ellipsis text-truncate" style="opacity:0.8">
                  <slot name="header-title">
                    <span>Priuk Perkasa Abadi, PT</span>
                  </slot>
                </div>
                <div class="subtitle text-weight-light ellipsis text-truncate">
                  <slot name="header-subtitle">
                    <span>Jalan Jati Raya Blok J3 No.7, Cikarang Selatan, Bekasi, Jawa Barat 17530</span>
                  </slot>
                </div> 
              </div>
              <div class="tags no-print float-right">
                <slot name="header-tags"></slot>
              </div>
            </div>
          </div>
        </slot>
      </td>
    </thead>
    <tbody>
      <tr>
        <td class="page-print-body">
          <slot></slot>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>
          <slot name="footer"></slot>
        </td>
      </tr>
    </tfoot>
  </table>
</template>


<script>
export default {
  name :'page-print',
}
</script>
<style lang="stylus">
table
  page-break-after auto 
  thead
    display table-header-group
  tfoot 
    display table-row-group
  tr    
    page-break-insideavoid page-break-afterauto 
  td    
    page-break-insideavoid page-break-afterauto 

.profile
  font-size:14px
  line-height 1.42857143
  address
    white-space: pre-wrap;
    font-style normal
.info 
  dl.horizontal dt
    text-align left 
  dl.horizontal.right dt
    text-align right 

.identity
  .q-item-main .q-item-label
    text-weight bolder

.page-print.header-hide .header
  display none;

.page-print.right
  .header.row
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;

.page-print.header-minimaze
  .header
    border-bottom solid 0.5px rgba(125, 125, 125, 0.5)
    .head-icon .q-icon
      font-size 40px 
    .head-brand
      min-width calc(100% - 40px)
    .head-brand .title
      font-size 18px 
    .head-brand .subtitle
      font-size 11px 
    .head-brand .tags
      .q-chip
        font-size 12px
        min-height 1px
        padding 0 3px
        .q-chip-main 
          padding 2px
      .q-chip.q-chip-tag 
        padding-left 1.3rem

.page-print 
  .page-print-header, .page-print-footer
    padding 10px 10px
  .page-print-body
    font-size 14px
    padding 10px 20px
  .header
    .head-icon
      .q-icon
        font-size 70px

    .head-brand
      min-width calc(100% - 70px)
      padding 10px 0px

      .title
        font-size 32px
        line-height 100%
        span
          line-height 1.12
          letter-spacing 0.02em
      .subtitle
        font-size 80%
        // line-height 0.12
        letter-spacing -0.02em

    .head-tags
      float right
      -webkit-box-pack justify
      -ms-flex-pack justify
      justify-content space-between

  
  .header.reverse 
    .head-tags
      float left
      justify-content space-start
  .q-table
    th 
      font-weight 400
      text-transform uppercase
@media print
  .q-page-container
    padding 5px !important
    
  .page-print
    box-shadow none
    -webkit-box-shadow none

    .page-print-header, .page-print-footer
      padding 0px !important
    .page-print-body
      padding 10px !important
      
    .page-print-header
      max-width unset 

  // setting customize required
  .q-layout-page-container.q-layout-transition
    padding 0px !important
    // padding-top 0px !important
  


</style>

