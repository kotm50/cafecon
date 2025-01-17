import PropTypes from "prop-types";
import { useState } from "react";

function UploadFile(props) {
  const [fileName, setFileName] = useState(""); // 파일명 상태
  const [fileUrl, setFileUrl] = useState(""); // 파일 URL 상태

  const handleFileChange = event => {
    const selectedFile = event.target.files[0]; // 첫 번째 파일만 선택
    if (!selectedFile) {
      // 파일 선택이 취소된 경우
      props.setFile(null);
      setFileName(""); // 파일명 초기화
      setFileUrl(""); // 파일 URL 초기화
      return;
    }

    // 파일 크기 체크 (10MB = 10 * 1024 * 1024 바이트)
    const fileSizeInMB = selectedFile.size / (1024 * 1024);
    if (fileSizeInMB > 10) {
      alert("용량이 너무 큽니다. 수정 후 다시 업로드 해 주세요.");
      props.setFile(null); // 파일 초기화

      event.target.value = ""; // input 값 초기화
      return;
    }

    // 파일명 및 URL 저장
    setFileName(selectedFile.name);
    setFileUrl(URL.createObjectURL(selectedFile));
    props.setFile(selectedFile);
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-y-2">
        <div className="flex justify-start gap-x-2">
          <div className="flex justify-between w-full text-sm px-2">
            <input
              type="file"
              id="fileInput"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/x-hwp,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="py-1.5 flex justify-start gap-x-2">
              <label
                htmlFor="fileInput"
                className="px-2 py-0.5 bg-[#efefef] hover:bg-[#e5e5e5] rounded-sm border border-black block whitespace-nowrap"
              >
                파일첨부
              </label>
              <div className="py-1 text-xs text-left">
                jpg, png, pdf, doc, hwp 파일
              </div>
            </div>
            <div className="py-1.5">
              <button
                type="button"
                className="px-2 py-0.5 bg-[#efefef] hover:bg-[#e5e5e5] rounded-sm border border-black"
                onClick={() => {
                  props.setFile(null);
                  setFileName(""); // 파일명 초기화
                  setFileUrl(""); // 파일 URL 초기화
                }}
              >
                파일 초기화
              </button>
            </div>
          </div>
        </div>

        {/* 파일이 선택되면 파일명 표시 */}
        {fileName && (
          <div className="grid grid-cols-1 gap-y-2 px-2 pb-2">
            <div
              className="w-fit h-fit relative z-0 hover:font-bold bg-blue-100 border border-blue-300 rounded-full px-4 py-1 text-xs text-blue-900 hover:bg-blue-200"
              title="파일명을 클릭하면 새 탭에서 열립니다"
            >
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                {fileName}
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

UploadFile.propTypes = {
  setFile: PropTypes.func.isRequired,
};

export default UploadFile;
