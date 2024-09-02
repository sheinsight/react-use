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

              checkbox.defaultChecked = defaultForm[name] === checkbox.value

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

            default: {
              element.defaultValue = defaultForm[name] as string
              element.value = (value ?? '').toString()
              break
            }
          }

          break
        }

        // <select />
        case element instanceof HTMLSelectElement: {
          const select = element as HTMLSelectElement

          if (Array.isArray(value)) {
            for (const option of Array.from(select.options)) {
              option.selected = value.includes(option.value)
            }
          } else {
            select.value = (value ?? '').toString()
          }

          break
        }

        // <textarea />
        case element instanceof HTMLTextAreaElement: {
          element.defaultValue = defaultForm[name] as string
          element.value = (value ?? '').toString()
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
              formValue[name] = (radio.checked ? radio.value : formValue[name]) as FormState[typeof name]
              break
            }

            default:
              formValue[name] = element.value as FormState[typeof name]
              break
          }

          break
        }

        // <select />
        case element instanceof HTMLSelectElement: {
          const select = element

          if (select.multiple) {
            formValue[name] = Array.from(select.options)
              .filter((option) => option.selected)
              .map((option) => option.value) as FormState[typeof name]
          } else {
            formValue[name] = select.value as FormState[typeof name]
          }

          break
        }

        // <textarea />
        case element instanceof HTMLTextAreaElement: {
          formValue[name] = element.value as FormState[typeof name]
          break
        }
      }
    }
  }

  return formValue
}
