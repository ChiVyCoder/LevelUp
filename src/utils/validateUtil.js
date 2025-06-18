import styles from '../pages/Register/Register.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function getParent(element, selector) {
  const targetClassName = selector.startsWith('.') ? selector.slice(1) : selector;
  while (element.parentElement) {
    if (element.parentElement.classList.contains(targetClassName)) {
      return element.parentElement;
    }
    element = element.parentElement;
  }
  return null;
}

function Validator(options) {
  var formElement = document.querySelector(options.form);
  var selectorRules = {};

  function validate(inputElement, rule) {
    var errorElement = getParent(inputElement, options.formGroupSelector || `.${cx('formGroup')}`.split(' ')[0])?.querySelector(options.errorElement);
    var errorMessage;
    var rules = selectorRules[rule.selector];

    if (inputElement.type === 'radio') {
      const radioButtons = document.querySelectorAll(`input[name="${inputElement.name}"]`);
      let isChecked = false;
      for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
          isChecked = true;
          break;
        }
      }
      errorMessage = isChecked ? undefined : rule.message || 'Vui lòng chọn 1 mục';
      const formGroupRadio = getParent(document.querySelector(rule.selector), options.formGroupSelector || `.${cx('formGroup')}`.split(' ')[0]);
      if (formGroupRadio && errorElement) {
        if (errorMessage) {
          errorElement.innerText = errorMessage;
          formGroupRadio.classList.add(cx('invalid'));
        } else {
          errorElement.innerText = '';
          formGroupRadio.classList.remove(cx('invalid'));
        }
      }
    } else {
      for (var i = 0; i < rules.length; ++i) {
        errorMessage = rules[i](inputElement.value);
        if (errorMessage) break;
      }
      const formGroup = getParent(inputElement, options.formGroupSelector || `.${cx('formGroup')}`.split(' ')[0]);
      if (formGroup && errorElement) {
        if (errorMessage) {
          errorElement.innerText = errorMessage;
          formGroup.classList.add(cx('invalid'));
        } else {
          errorElement.innerText = '';
          formGroup.classList.remove(cx('invalid'));
        }
      }
    }

    return !errorMessage;
  }

  if (formElement) {
    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach(function (inputElement) {
        inputElement.oninput = function () {
          const formGroup = getParent(inputElement, options.formGroupSelector || `.${cx('formGroup')}`.split(' ')[0]);
          const errorElement = formGroup?.querySelector(options.errorElement);
          if (errorElement) {
            errorElement.innerText = '';
            formGroup.classList.remove(cx('invalid'));
          }
        };
        // Loại bỏ onblur listener
      });
    });

    formElement.onsubmit = function (event) {
      event.preventDefault();

      var isValid = true;

      options.rules.forEach(function (rule) {
        var inputElements = formElement.querySelectorAll(rule.selector);
        Array.from(inputElements).forEach(function (inputElement) {
          if (!validate(inputElement, rule)) {
            isValid = false;
          }
        });
      });

      if (isValid) {
        if (typeof options.onSubmit === 'function') {
          var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
          var formValues = Array.from(enableInputs).reduce(function (values, input) {
            switch (input.type) {
              case 'radio':
                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked')?.value;
                break;
              case 'checkbox':
                if (!values[input.name]) {
                  values[input.name] = [];
                }
                if (input.matches(':checked')) {
                  values[input.name].push(input.value);
                }
                break;
              case 'file':
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }
            return values;
          }, {});
          options.onSubmit(formValues);
        } else {
          console.log('Không có hàm xử lý submit!');
        }
      } else {
        console.log('Form có lỗi!');
      }
    };
  }
}

// Định nghĩa các rules
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || 'Vui lòng nhập trường này';
    }
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || 'Trường này phải là email';
    }
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
    }
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không khớp';
    }
  };
};

Validator.isRequiredRadio = function (selector, message) {
  return {
    selector: selector,
    test: function () {
      const formGroup = document.querySelector(selector);
      const radioButtons = formGroup ? formGroup.querySelectorAll('input[type="radio"]') : [];
      let isChecked = false;
      radioButtons.forEach(radio => {
        if (radio.checked) {
          isChecked = true;
        }
      });
      return isChecked ? undefined : message || 'Vui lòng chọn 1 mục';
    },
    message: message, // Thêm message vào rule để sử dụng trong hàm validate
  };
};

Validator.isRequiredDate = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || 'Vui lòng chọn ngày';
    }
  };
};

Validator.isRequiredTextarea = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || 'Vui lòng nhâp thông tin';
    }
  };
};

export default Validator;