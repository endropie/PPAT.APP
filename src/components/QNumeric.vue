<script>
  import AutoNumeric from 'autonumeric/dist/autoNumeric.min'
  const defaultOptions = {digitGroupSeparator: '.', decimalCharacter: ',', decimalCharacterAlternative: '.'};

  // import FrameMixin from 'quasar-framework/src/mixins/input-frame.js'
  // import InputMixin from 'quasar-framework/src/mixins/input.js'
  // import inputTypes from 'quasar-framework/src/components/input/input-types.js'
  // import frameDebounce from 'quasar-framework/src/utils/frame-debounce.js'
  // import { between } from 'quasar-framework/src/utils/format.js'
  // import QResizeObservable from 'quasar-framework/src/components/observables/QResizeObservable.js'
  // import QInputFrame from 'quasar-framework/src/components/input-frame/QInputFrame.js'
  // import QSpinner from 'quasar-framework/src/components/spinner/QSpinner.js'
  // import QIcon from 'quasar-framework/src/components/icon/QIcon.js'

  import QField from 'quasar/src/components/field/QField.js'

  import MaskMixin from 'quasar/src/mixins/mask.js'
  import debounce from 'quasar/src/utils/debounce.js'
  import { stop } from 'quasar/src/utils/event.js'

  export default {
    name: 'QNumeric',
    mixins: [FrameMixin, InputMixin],
    props: {
      value: {
        required: false,
        validator(val) {
            return typeof val === 'number' || typeof val === 'string' || val === '' || val === null;
        },
      },
      options: {
        type    : [Object, String, Array],
        required: false,
        default() {
          return defaultOptions;
        },
      },
      type: {
        type: String,
        default: 'text',
        validator: t => inputTypes.includes(t)
      },
      align: {
        type: String,
        validator: v => ['left', 'center', 'right'].includes(v)
      },
      noPassToggle: Boolean,
      numericKeyboardToggle: Boolean,
      readonly: Boolean,

      decimals: Number,
      step: Number,
      upperCase: Boolean,
      lowerCase: Boolean,
      initialShowPassword: Boolean
    },
    data () {
        return {
        anElement         : null,
        initialOptions    : null,
        hasContentEditable: true,

        showPass: this.initialShowPassword,
        showNumber: true,
        model: this.value,
        watcher: null,
        autofilled: false,
        shadow: {
            val: this.model,
            set: this.__set,
            setNav: this.__set,
            loading: false,
            watched: 0,
            isEditable: () => this.editable,
            isDark: () => this.dark,
            hasFocus: () => document.activeElement === this.$refs.input,
            register: () => {
            this.shadow.watched += 1
            this.__watcherRegister()
            },
            unregister: () => {
            this.shadow.watched = Math.max(0, this.shadow.watched - 1)
            this.__watcherUnregister()
            },
            getEl: () => this.$refs.input
        }
        }
    },
    watch: {
        value (v) {
        
        const
            vOldNum = parseFloat(this.model),
            vNewNum = parseFloat(v)
        if (!this.isNumber || this.isNumberError || isNaN(vOldNum) || isNaN(vNewNum) || vOldNum !== vNewNum) {
          
          this.model = v

          if(this.value !== this.anElement.getNumber()) {
            this.anElement.set(this.value)
          } 

        }
        this.isNumberError = false
        this.isNegZero = false
        },
        isTextarea (v) {
        this[v ? '__watcherRegister' : '__watcherUnregister']()
        },
        '$attrs.rows' () {
        this.isTextarea && this.__updateArea()
        }
    },
    provide () {
        return {
        __input: this.shadow
        }
    },
    computed: {
        anInfo() {
          return {
            value  : this.value,
            options: this.options,
          };
        },
        isNumber () {
          return this.type === 'number'
        },
        isPassword () {
          return this.type === 'password'
        },
        isTextarea () {
          return this.type === 'textarea'
        },
        isLoading () {
          return this.loading || (this.shadow.watched && this.shadow.loading)
        },
        keyboardToggle () {
          return this.$q.platform.is.mobile &&
            this.isNumber &&
            this.numericKeyboardToggle
        },
        inputType () {
          if (this.isPassword) {
            return this.showPass && this.editable ? 'text' : 'password'
          }
          return this.isNumber
            ? (this.showNumber || !this.editable ? 'number' : 'text')
            : this.type
        },
        inputClasses () {
          const classes = []
          this.align && classes.push(`text-${this.align}`)
          this.autofilled && classes.push('q-input-autofill')
          return classes
        },
        length () {
          return this.model !== null && this.model !== undefined
            ? ('' + this.model).length
            : 0
        },
        computedClearValue () {
          return this.clearValue === void 0 ? (this.isNumber ? null : '') : this.clearValue
        },
        computedStep () {
          return this.step || (this.decimals ? 10 ** -this.decimals : 'any')
        },

        frameProps () {
          return {
            prefix: this.prefix,
            suffix: this.suffix,
            stackLabel: this.stackLabel,
            floatLabel: this.floatLabel,
            placeholder: this.placeholder,
            error: this.error,
            warning: this.warning,
            disable: this.disable,
            readonly: this.readonly,
            inverted: this.inverted,
            invertedLight: this.invertedLight,
            dark: this.dark,
            hideUnderline: this.hideUnderline,
            before: this.before,
            after: this.after,
            color: this.color,
            noParentField: this.noParentField,
            focused: this.focused,
            length: this.autofilled + this.length
        }
        }
    },
    methods: {
      updateVModel(event) {
        if (this.anElement !== null) {
          this.$emit('input', this.anElement.getNumber(), event);
        }
      },
      manageOptionElement(optionElement) {
        let options;
        if (typeof optionElement === 'string' || optionElement instanceof String) {
            options = AutoNumeric.getPredefinedOptions()[optionElement];
            if (options === void(0) || options === null) {
                // If the given `optionElement` does not exist, we switch back to the default options
                console.warn(`The given pre-defined options [${optionElement}] is not recognized by AutoNumeric.\nSwitching back to the default options.`);
                options = defaultOptions; // Default value
            }
        } else { // A `settings` object
            options = optionElement;
        }
        return options;
      },
      togglePass () {
        this.showPass = !this.showPass
        clearTimeout(this.timer)
        this.focus()
      },
      toggleNumber () {
        this.showNumber = !this.showNumber
        clearTimeout(this.timer)
        this.focus()
      },

      __clearTimer () {
        this.$nextTick(() => clearTimeout(this.timer))
      },

      __onAnimationStart (e) {
        if (e.animationName.indexOf('webkit-autofill-') === 0) {
          const value = e.animationName === 'webkit-autofill-on'
          if (value !== this.autofilled) {
          e.value = this.autofilled = value
          e.el = this
          return this.$emit('autofill', e)
        }
        }
      },
      __setModel (val) {
        clearTimeout(this.timer)
        this.focus()
        this.__set( this.anElement, true)
      },
      __set (e, forceUpdate) {
        // let val = e && e.target ? e.target.value : e
        let val = this.anElement.getNumber()

        val = parseFloat(val)

        this.$emit('input', val)
        if (forceUpdate) {
            this.$nextTick(() => {
            if (JSON.stringify(val) !== JSON.stringify(this.value)) {
                this.$emit('change', val)
            }
            })
        }
      },
      __updateArea () {
        const
          shadow = this.$refs.shadow,
          input = this.$refs.input
        if (shadow && input) {
          const
            sH = shadow.scrollHeight,
            h = between(sH, shadow.offsetHeight, this.maxHeight || sH)
            input.style.height = `${h}px`
            input.style.overflowY = this.maxHeight && h < sH ? 'scroll' : 'hidden'
        }
        },
      __watcher (value) {
        if (this.isTextarea) {
            this.__updateArea()
        }
        if (this.shadow.watched) {
            this.shadow.val = value
        }
      },
      __watcherRegister () {
        if (!this.watcher) {
            this.watcher = this.$watch('model', this.__watcher)
        }
      },
      __watcherUnregister (forceUnregister) {
        if (
            this.watcher &&
            (forceUnregister || (!this.isTextarea && !this.shadow.watched))
        ) {
            this.watcher()
            this.watcher = null
        }
      },

      __getInput (h) {
        let app = this
        return h('input', {
          ref: 'input',
          staticClass: 'col q-input-target q-no-input-spinner ellipsis',
          'class': this.inputClasses,
          attrs: Object.assign({}, this.$attrs, {
            type: 'text',
            autocomplete: "off",
            placeholder: this.inputPlaceholder,
            disabled: this.disable,
            readonly: this.readonly,
            step: this.computedStep,
            value:  this.value
          }),
          // domProps: { value:  this.value },
          on: {
            input: this.__set,
            focus: this.__onFocus,
            blur: this.__onInputBlur,
            keydown: this.__onKeydown,
            keyup: this.__onKeyup,
            paste: this.__onPaste,
            animationstart: this.__onAnimationStart,
            'autoNumeric:rawValueModified': this.updateVModel
          }
        })
      }
    },
    created() {
        // Manage the options
        if (Array.isArray(this.options)) {
            // This allows the user to use multiple options (strings or objects) in an array, and overwrite the previous one with the next option element ; this is useful to tune the wanted format
            let optionObjects = {};
            this.options.forEach(optionElement => {
                this.initialOptions = this.manageOptionElement(optionElement);
                optionObjects       = Object.assign(optionObjects, this.initialOptions); // Merge each options objects one after the other
            });
            this.initialOptions = optionObjects;
        } else {
            this.initialOptions = this.manageOptionElement(this.options);
        }
        // Define if the generated non-input element should have the contenteditable attribute set to `true`
        this.hasContentEditable = !this.initialOptions.readOnly;
    },
    mounted () {
        this.anElement = new AutoNumeric(this.$refs.input, this.initialOptions);
        if (this.value !== null && this.value !== '' && this.value !== undefined) {
            this.anElement.set(this.value);
            
            this.updateVModel(); 
        }
        this.__updateArea = frameDebounce(this.__updateArea)
    },
    beforeDestroy () {
        this.__watcherUnregister(true)
    },

    render (h) {
        return h(QInputFrame, 
        {
        staticClass: 'q-input',
        props: this.frameProps,
        on: {
            click: this.__onClick,
            focus: this.__onFocus,
            paste: this.__onPaste
        }
        },
        [].concat(this.$slots.before).concat([
        this.isTextarea ? this.__getTextarea(h) : this.__getInput(h),

        (!this.disable && this.isPassword && !this.noPassToggle && (this.initialShowPassword || this.length) && h(QIcon, {
            slot: 'after',
            staticClass: 'q-if-control',
            props: {
            name: this.$q.icon.input[this.showPass ? 'showPass' : 'hidePass']
            },
            nativeOn: {
            mousedown: this.__clearTimer,
            touchstart: this.__clearTimer,
            click: this.togglePass
            }
        })) || void 0,

        (this.editable && this.keyboardToggle && h(QIcon, {
            slot: 'after',
            staticClass: 'q-if-control',
            props: {
            name: this.$q.icon.input[this.showNumber ? 'showNumber' : 'hideNumber']
            },
            nativeOn: {
            mousedown: this.__clearTimer,
            touchstart: this.__clearTimer,
            click: this.toggleNumber
            }
        })) || void 0,

        (this.isClearable && h(QIcon, {
            slot: 'after',
            staticClass: 'q-if-control',
            props: {
            name: this.$q.icon.input[`clear${this.isInverted ? 'Inverted' : ''}`]
            },
            nativeOn: {
            mousedown: this.__clearTimer,
            touchstart: this.__clearTimer,
            click: this.clear
            }
        })) || void 0,

        (this.isLoading && (this.$slots.loading
            ? h('div', {
            staticClass: 'q-if-control',
            slot: 'after'
            }, this.$slots.loading)
            : h(QSpinner, {
            slot: 'after',
            staticClass: 'q-if-control',
            props: { size: '24px' }
            }))) || void 0
        ]).concat(this.$slots.after).concat(this.$slots.default
        ? h('div', { staticClass: 'absolute-full no-pointer-events', slot: 'after' }, this.$slots.default)
        : void 0
        ))
    }
  }

</script>