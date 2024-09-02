/**
 * Whether the element is a form item element
 */
export function isInvalidFormChildElement(
  element: unknown,
): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement].some((type) => element instanceof type)
}

/**
 * Sync the form DOM state with the form value
 */
export function syncFormStateToDom<FormState extends object>(
  formEl: HTMLFormElement,
  form: FormState,
  defaultForm: FormState,
) {
  for (const element of Array.from(formEl.elements)) {
    if (isInvalidFormChildElement(element) && 'name' in element) {
      const name = element.name as keyof FormState
      const value = form[name]

      switch (true) {
        // <input />
        case element instanceof HTMLInputElement: {
          switch (element.type) {
            case 'checkbox': {
              const checkbox = element

              if (Array.isArray(defaultForm[name])) {
                checkbox.defaultChecked = defaultForm[name].includes(checkbox.value)
              } else {
                checkbox.defaultChecked = defaultForm[name] && checkbox.value === 'on'
              }

              if (Array.isArray(value)) {
                checkbox.checked = value.includes(checkbox.value)
              } else {
                checkbox.checked = Boolean(value)
              }

              break
            }

            case 'radio': {
              const radio = element
              radio.defaultChecked = defaultForm[name] === radio.value
              radio.checked = radio.value === value
              break
            }

            // range / date / time / number / text / password / email / tel / url / search
            default: {
              element.defaultValue = defaultForm[name] as string
              element.value = String(value ?? '')
              break
            }
          }

          break
        }

        // <select />
        case element instanceof HTMLSelectElement: {
          const select = element

          if (Array.isArray(value) && Array.isArray(defaultForm[name])) {
            select.multiple = true

            for (const option of Array.from(select.options)) {
              option.defaultSelected = defaultForm[name].includes(option.value)
              option.selected = value.includes(option.value)
            }
          } else {
            select.multiple = false

            for (const option of Array.from(select.options)) {
              option.defaultSelected = defaultForm[name] === option.value
              option.selected = value === option.value
            }

            select.value = String(value ?? '')
          }

          break
        }

        // <textarea />
        case element instanceof HTMLTextAreaElement: {
          element.defaultValue = String(defaultForm[name]) as string
          element.value = String(value ?? '')

          break
        }
      }
    }
  }
}

/**
 * Get the form value from the form element
 */
export function getFormStateFromDom<FormState extends object>(formEl: HTMLFormElement, form: FormState): FormState {
  const formValue = structuredClone(form)

  for (const element of Array.from(formEl.elements)) {
    if (isInvalidFormChildElement(element) && 'name' in element) {
      const name = element.name as keyof FormState

      switch (true) {
        // <input />
        case element instanceof HTMLInputElement: {
          switch (element.type) {
            case 'checkbox': {
              const checkbox = element

              if (Array.isArray(formValue[name])) {
                if (checkbox.checked) {
                  formValue[name] = [...new Set([...formValue[name], checkbox.value])] as FormState[typeof name]
                } else {
                  formValue[name] = formValue[name].filter((v) => v !== checkbox.value) as FormState[typeof name]
                }
              } else {
                formValue[name] = checkbox.checked as FormState[typeof name]
              }

              break
            }

            case 'radio': {
              const radio = element

              if (radio.checked) {
                formValue[name] = radio.value as FormState[typeof name]
              }

              break
            }

            // range / date / time / number / text / password / email / tel / url / search
            default: {
              formValue[name] = element.value as FormState[typeof name]

              break
            }
          }

          break
        }

        // <select />
        case element instanceof HTMLSelectElement: {
          const select = element
          const opts = Array.from(select.options)

          if (select.multiple) {
            formValue[name] = opts.filter((op) => op.selected).map((op) => op.value) as FormState[typeof name]
          } else {
            formValue[name] = (opts.find((op) => op.selected)?.value || select.value) as FormState[typeof name]
          }

          break
        }

        // <textarea />
        case element instanceof HTMLTextAreaElement: {
          formValue[name] = element.value as FormState[typeof name]

          break
        }

        default:
          break
      }
    }
  }

  return formValue
}
