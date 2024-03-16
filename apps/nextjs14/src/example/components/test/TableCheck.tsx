/**
 * 테이블 td 의 색값 비교
 */
import { useEffect } from 'react';

const TableCheck = (props: any) => {
  useEffect(() => {
    const $table = document.querySelector('table');
    if (!$table) {
      return;
    }
    const $td: NodeListOf<HTMLTableCellElement> =
      $table.querySelectorAll('td') || [];

    const $list = Array.from($td).filter(($item, index) => {
      console.log('color', $item.style.color);
      console.log('backgroundColor', $item.style.backgroundColor);
      // TODO: 핵사코드를 rgb로 변환 후 비교해야 정확하다..
      return $item.style.color !== $item.style.backgroundColor;
    });

    console.log('$list', $list);
    console.log($list.map($item => $item?.textContent).join(''));
  }, []);

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td style={{ color: '#ff00ff', backgroundColor: '#FFFFFF' }}>Q</td>
            <td style={{ backgroundColor: '#442244', color: '#442244' }}>Y</td>
            <td style={{ color: '#FFFF00', backgroundColor: '#442244' }}>A</td>
          </tr>
          <tr>
            <td style={{ color: '#FFEEFE', backgroundColor: '#990000' }}>Q</td>
            <td style={{ color: '#FFFF00', backgroundColor: '#FF0' }}>M</td>
            <td style={{ color: '#000000', backgroundColor: '#FF7777' }}>O</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default TableCheck;
