import PropTypes from "prop-types";
import "./Specification.css";
import { useRef } from "react";
import domtoimage from "dom-to-image";
import { jsPDF } from "jspdf";
import seal from "../../assets/seal.png";

function Specification(props) {
  const captureRef = useRef(null);

  const handleSaveAsPDF = () => {
    const node = captureRef.current;
    if (node) {
      // DOM을 PNG 이미지로 캡처
      domtoimage
        .toPng(node)
        .then(dataUrl => {
          // PDF 생성
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(dataUrl);

          // PDF 크기 계산 (A4 크기에 맞춤)
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          // 이미지 추가
          pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

          // PDF 다운로드
          pdf.save("captured-document.pdf");
        })
        .catch(error => {
          console.error("Error generating PDF:", error);
        });
    }
  };
  return (
    <>
      <div className="flex flex-col gap-y-8 p-5" ref={captureRef}>
        <div className="text-center text-3xl font-extra mb-5">
          전자거래명세서
        </div>
        <div className="grid grid-cols-2 gap-x-4 relative">
          <img
            src={seal}
            className="absolute w-[64px] h-auto top-0 left-[45%] -translate-x-1/2"
          />
          <table className="w-full specification">
            <tbody>
              <tr>
                <th className="center" rowSpan={6}>
                  공<br />
                  <br />급<br />
                  <br />자
                </th>
                <th>사업자등록번호</th>
                <td>123-12-12345</td>
              </tr>
              <tr>
                <th>상호명</th>
                <td>주식회사 코리아티엠</td>
              </tr>
              <tr>
                <th>사업장주소</th>
                <td>서울 중구 다산로</td>
              </tr>
              <tr>
                <th>대표자명</th>
                <td>홍길동</td>
              </tr>
              <tr>
                <th>업태</th>
                <td>서비스업</td>
              </tr>
              <tr>
                <th>업종</th>
                <td>직업정보 제공사업</td>
              </tr>
            </tbody>
          </table>
          <table className="w-full specification">
            <tbody>
              <tr>
                <th className="center" rowSpan={6}>
                  받<br />
                  <br />는<br />
                  <br />자
                </th>
                <th>사업자등록번호</th>
                <td>123-12-12345</td>
              </tr>
              <tr>
                <th>상호명</th>
                <td>주식회사 코리아티엠</td>
              </tr>
              <tr>
                <th>사업장주소</th>
                <td>서울 중구 다산로</td>
              </tr>
              <tr>
                <th>대표자명</th>
                <td>홍길동</td>
              </tr>
              <tr>
                <th>업태</th>
                <td>서비스업</td>
              </tr>
              <tr>
                <th>업종</th>
                <td>직업정보 제공사업</td>
              </tr>
            </tbody>
          </table>
        </div>
        {props.type === "deposit" && (
          <>
            <table className="w-full specification">
              <thead>
                <tr>
                  <th className="center">거래일자</th>
                  <th className="center">거래번호</th>
                  <th className="center">공급가액</th>
                  <th className="center">세액</th>
                  <th className="center">합계금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="center">2025-01-23 12:30:00</td>
                  <td className="center">1234567890</td>
                  <td className="center">100,000</td>
                  <td className="center">10,000</td>
                  <td className="center">110,000</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full specification">
              <thead>
                <tr>
                  <th className="center">No</th>
                  <th className="center">구매일시</th>
                  <th className="center">품목</th>
                  <th className="center">단가</th>
                  <th className="center">공급가액</th>
                  <th className="center">비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="center">1</td>
                  <td className="center">2025-01-23 12:30:00</td>
                  <td>기프티머니 충전</td>
                  <td className="center">100,000</td>
                  <td className="center">100,000</td>
                  <td className="center">-</td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {props.type === "withdraw" && (
          <>
            <table className="w-full specification">
              <thead>
                <tr>
                  <th className="center">거래일자</th>
                  <th className="center">거래번호</th>
                  <th className="center">공급가액</th>
                  <th className="center">세액</th>
                  <th className="center">합계금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="center">2025-01-23 12:30:00</td>
                  <td className="center">1234567890</td>
                  <td className="right">100,000</td>
                  <td className="right">10,000</td>
                  <td className="right">110,000</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full specification">
              <thead>
                <tr>
                  <th className="center">No</th>
                  <th className="center">구매일시</th>
                  <th className="center">품목</th>
                  <th className="center">단가</th>
                  <th className="center">공급가액</th>
                  <th className="center">비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="center">1</td>
                  <td className="center">2025-01-23 12:30:00</td>
                  <td>cu모바일상품권 1만원권</td>
                  <td className="right">10,000</td>
                  <td className="right">10,000</td>
                  <td className="center">-</td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {props.type === "withdrawAll" && (
          <>
            <table className="w-full specification">
              <thead>
                <tr>
                  <th className="center">거래일자</th>
                  <th className="center">거래번호</th>
                  <th className="center">공급가액</th>
                  <th className="center">세액</th>
                  <th className="center">합계금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="center">2025-01-10~2025-01-23</td>
                  <td className="center">1234567890 외 100건</td>
                  <td className="right">1,000,000</td>
                  <td className="right">100,000</td>
                  <td className="right">1,100,000</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        <div className="bg-gray-100 p-4 specification">
          <div className="font-extra">&lt;안내&gt;</div>
          <ul>
            <li>
              거래명세서는 결제가 완료되었음을 증명하는 용도로만 활용 가능하며,
              소득공제용 영수증 및 매입 세금계산서로는 활용할 수 없습니다.
            </li>
            <li>
              거래명세서는 세무상의 지출 증빙 효력이 없으므로 법적 증빙자료로
              사용할 수 없습니다.
            </li>
            <li>
              상기 내역은 조회 시점을 기준으로 환불 및 취소 금액이 반영된 결제
              금액에 대하여 발급됩니다.
            </li>
          </ul>
        </div>
      </div>
      <div className="py-4 w-full text-center">
        <button
          className="w-fit bg-blue-600 hover:bg-opacity-80 text-white px-4 py-2 mx-auto rounded-lg"
          onClick={handleSaveAsPDF}
        >
          PDF로 저장하기
        </button>
      </div>
    </>
  );
}

Specification.propTypes = {
  type: PropTypes.string.isRequired,
  setModalOn: PropTypes.func.isRequired,
  setModalType: PropTypes.func.isRequired,
  pointInfo: PropTypes.object,
};

export default Specification;
