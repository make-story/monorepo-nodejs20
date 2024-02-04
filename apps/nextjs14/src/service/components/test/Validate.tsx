/**
 * 유효성 검사 테스트
 */
import { useEffect } from 'react';

const Validate = (props: any) => {
  const getElementValue = ($element: any = null) => {
    return $element?.getAttribute('value') || '';
  };
  const isNonEmpty = (value: any = '') => {
    return value !== '';
  };
  const isEmail = (value: any = '') => {
    const regex = new RegExp('[a-zA-Z0-9.]+@[a-zA-Z0-9.]{1,64}');
    return regex.test(value);
  };
  const isPhone = (value: any = '') => {
    const regex = /^\d+[-\s]\d+[-\s]\d+$/;
    return regex.test(value);
  };
  const onClickValidate = (event: any) => {
    const $form = document.querySelector('form');
    if (!$form) {
      return false;
    }
    const $type = $form.querySelector('[name="type"]:checked'); // radio
    const $first_name = $form.querySelector('#first_name'); // text
    const $last_name = $form.querySelector('#last_name'); // text
    const $email = $form.querySelector('#email'); // text
    const $company_name = $form.querySelector('#company_name'); // text
    const $phone = $form.querySelector('#phone'); // text

    switch ($type?.getAttribute('value') || '') {
      case 'person':
        // 빈값 여부 확인 ('')
        // 이메일 형태 확인 (.@.)
        if (
          !isNonEmpty(getElementValue($first_name)) ||
          !isNonEmpty(getElementValue($last_name)) ||
          !isNonEmpty(getElementValue($email)) ||
          !isEmail(getElementValue($email))
        ) {
          return false;
        }
        break;
      case 'company':
        // 빈값 여부 확인 ('')
        // 전화번호 형태 확인 (***-***-****)
        if (
          !isNonEmpty(getElementValue($company_name)) ||
          !isPhone(getElementValue($phone))
        ) {
          return false;
        }
        break;
      default:
        return false;
    }
    console.log('$type', $type?.getAttribute('value'));
  };

  return (
    <>
      <form>
        <input
          type='radio'
          id='type_person'
          name='type'
          value='person'
          checked
        />
        <input type='radio' id='type_company' name='type' value='company' />
        <input type='text' id='first_name' name='first_name' value='John' />
        <input type='text' id='last_name' name='last_name' value='Doe' />
        <input type='text' id='email' name='email' value='john@example.com' />
        <input type='text' id='company_name' name='company_name' value='' />
        <input type='text' id='phone' name='phone' value='234-567-890' />
      </form>
      Validate
      <button onClick={onClickValidate}>유효성검사!</button>
    </>
  );
};

export default Validate;
