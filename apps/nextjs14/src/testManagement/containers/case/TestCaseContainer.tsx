import { PropsWithChildren } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@makestory/ui/src/elements/select';

import TestCaseRun from '@/testManagement/components/case/TestCaseRun';

const TestCaseContainer = (props: PropsWithChildren) => {
  /**
   * 비즈니스 로직 및 이벤트 관리
   * 소켓 연결(nav 에서 선택된 값 전달)
   * 소켓에서 받은 내용 각 컴포넌트로 전달
   */
  // 웹소켓 사용자훅
  const useTestCaseWebSoket = () => {};

  /**
   * 화면 디자인 & 마크업 작업
   * 부트스트랩 등 UI 라이브러리 예시 참고하여 만들어보자!
   *
   * https://www.radix-ui.com/primitives/docs/components/accordion
   * https://ant.design/components/overview
   * https://react-bootstrap.netlify.app/docs/components/accordion
   */
  return (
    <>
      <button className='text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 text-15px'>
        aa
      </button>
      <Select>
        <SelectTrigger className='w-[280px]'>
          <SelectValue placeholder='Select a timezone' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value='est'>Eastern Standard Time (EST)</SelectItem>
            <SelectItem value='cst'>Central Standard Time (CST)</SelectItem>
            <SelectItem value='mst'>Mountain Standard Time (MST)</SelectItem>
            <SelectItem value='pst'>Pacific Standard Time (PST)</SelectItem>
            <SelectItem value='akst'>Alaska Standard Time (AKST)</SelectItem>
            <SelectItem value='hst'>Hawaii Standard Time (HST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe & Africa</SelectLabel>
            <SelectItem value='gmt'>Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value='cet'>Central European Time (CET)</SelectItem>
            <SelectItem value='eet'>Eastern European Time (EET)</SelectItem>
            <SelectItem value='west'>
              Western European Summer Time (WEST)
            </SelectItem>
            <SelectItem value='cat'>Central Africa Time (CAT)</SelectItem>
            <SelectItem value='eat'>East Africa Time (EAT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value='msk'>Moscow Time (MSK)</SelectItem>
            <SelectItem value='ist'>India Standard Time (IST)</SelectItem>
            <SelectItem value='cst_china'>China Standard Time (CST)</SelectItem>
            <SelectItem value='jst'>Japan Standard Time (JST)</SelectItem>
            <SelectItem value='kst'>Korea Standard Time (KST)</SelectItem>
            <SelectItem value='ist_indonesia'>
              Indonesia Central Standard Time (WITA)
            </SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Australia & Pacific</SelectLabel>
            <SelectItem value='awst'>
              Australian Western Standard Time (AWST)
            </SelectItem>
            <SelectItem value='acst'>
              Australian Central Standard Time (ACST)
            </SelectItem>
            <SelectItem value='aest'>
              Australian Eastern Standard Time (AEST)
            </SelectItem>
            <SelectItem value='nzst'>
              New Zealand Standard Time (NZST)
            </SelectItem>
            <SelectItem value='fjt'>Fiji Time (FJT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>South America</SelectLabel>
            <SelectItem value='art'>Argentina Time (ART)</SelectItem>
            <SelectItem value='bot'>Bolivia Time (BOT)</SelectItem>
            <SelectItem value='brt'>Brasilia Time (BRT)</SelectItem>
            <SelectItem value='clt'>Chile Standard Time (CLT)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <TestCaseRun />
    </>
  );
};

export default TestCaseContainer;
