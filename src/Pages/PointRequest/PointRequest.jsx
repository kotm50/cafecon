function PointRequest() {
  return (
    <>
      <h2 className="text-center text-4xl mb-10">포인트 신청하기</h2>
      <div className="w-full">
        <button
          className="block w-[200px] h-[200px] mx-auto text-xl font-extra bg-green-600 hover:bg-opacity-80 text-white rounded-lg"
          onClick={() =>
            alert("포인트 충전은\n고객센터 : 1644-4223 으로 문의해 주세요")
          }
        >
          포인트 신청하기
        </button>
      </div>
    </>
  );
}

export default PointRequest;
