import { messageRules } from '#/headlessbrowser/utils/index';
import { TestCaseFunction } from '#/headlessbrowser/types/index';

const temp: TestCaseFunction = async ({
  browser,
  context,
  page,
  ws,
  params,
  query,
}) => {
  /**
   * 테스트 케이스
   */
  try {
    // fetch 인터셉터 (page load 상단에서 page 호출전 모니터링 선언)
    /*const mainApiRequestPromise = page.waitForRequest(request => {
      console.log(request.url());
      return /\/detail\/search\/base/.test(request.url());
    });*/
    const mainApiResponsePromise = page.waitForResponse(request => {
      //console.log(request.url());
      return /\/detail\/search\/base/.test(request.url());
    });

    // 페이지 로드
    await page.goto('https://www.lotteon.com/m/product/LE1204314173', {
      timeout: 30000,
    });
    await page.waitForLoadState();

    // 중앙팝업 (TODO: 중앙팝업 노출케이스에 안보이는 경우 확인)
    if (
      await page
        .locator('#modals-container [data-modal="adobePop"]')
        .isVisible()
    ) {
      await page.waitForTimeout(1000);
      await page.locator('#modals-container .popupClose').click();
    }

    // 앱설치 유도 팝업 (TODO: 앱설치 유도 팝업 노출케이스에 안보이는 경우 확인)
    if (await page.locator('.popContents').isVisible()) {
      await page.waitForTimeout(1000);
      await page.locator('.btnNoProblem').click();
    }

    // 앱전용 상품 팝업 (TODO: 앱전용 상품 팝업 노출케이스에 안보이는 경우 확인)
    if (
      await page.locator('[data-modal="AppExclusiveProductPopup"]').isVisible()
    ) {
      await page.waitForTimeout(1000);
      await page
        .locator(
          '[data-modal="AppExclusiveProductPopup"] .team-popup-contents--btn-no-problem',
        )
        .click();
    }

    // Main API 응답 가져오기 (상품종류 등 확인)
    const mainApiData = await (await mainApiResponsePromise).json();
    //console.log('mainApiData', mainApiData?.data?.basicInfo);

    // TODO: 특정 element 위치 찾고, 해당 타겟으로 스크롤 이동
    // ...

    // 스와이프
    await page.waitForTimeout(2000);
    if (await page.locator('#innerImgClickDisable').isVisible()) {
      // 슬라이드 정보
      //await page.$$eval(device === 'pc' ? '#header ul.lst_home a' : 'header nav a', nodes => nodes.map(node => node.href));

      // 위치 정보
      const box = await page.locator('#innerImgClickDisable').boundingBox();
      const center = {
        x: box!.x + box!.width / 2,
        y: box!.y + box!.height / 2,
      };
      //console.log(center);
      /*page.setContent(
        `<div style="top: ${center.y}px; left: ${center.x}px; position: fixed; width: 20px; height:20px; background-color: red;"></div>`,
      );*/
      /*page.evaluate(([body]) => {
        //
      }, [await page.evaluate('document.body')]);*/

      // 확대보기
      //await page.mouse.click(center.x, center.y);

      // 스와이프 실행
      await page.mouse.move(center.x, center.y);
      await page.mouse.down();
      await page.mouse.move(center.x - 100, center.y);
      await page.mouse.up();
    }

    // 페이지 스크롤
    await page.waitForTimeout(1000);
    await page.evaluate(async () => {
      // 비동기 페이징 방식에 대한 대응이 필요하다.
      await new Promise<void>((resolve, reject) => {
        let totalHeight = 0;
        let distance = 100;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight; // document height
          window.scrollBy(0, distance); // scroll x, y
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  } catch (error) {
    console.error(error);
    ws?.send(messageRules('catch', JSON.stringify(error)));
  }
};

export default temp;
