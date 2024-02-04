/**
 * Utility Types
 * https://www.typescriptlang.org/docs/handbook/utility-types.html
 */
import { ReactElement } from 'react';

/**
 * Record
 * 객체 key, value 타입
 */
type IFieldValue = {
  name: string;
  value: number;
};
type IFormName = 'event' | 'point';
type ITest = Record<IFormName, IFieldValue>;

/**
 * 모든 프로퍼티들을 Optional하게 변경
 */
interface RequiredUserInformation {
  id: string;
  uid: string;
  name: string;
}
interface OptionalUserInformation {
  age: number;
  profile: string;
  phone: string;
}
type UserInformation = RequiredUserInformation &
  Partial<OptionalUserInformation>;

export default function UtilityTypes(): ReactElement {
  const x: ITest = {
    event: {
      name: 'foo',
      value: 0,
    },
    point: {
      name: 'foo',
      value: 30,
    },
  };

  return <>TEST</>;
}
