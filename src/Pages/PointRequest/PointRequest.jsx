function PointRequest() {
  return (
    <>
      <h2 className="text-center text-4xl mb-10">포인트 신청하기</h2>
      <div className="w-full">
        <button
          className="block w-[200px] h-[200px] mx-auto text-xl font-extra bg-green-600 hover:bg-opacity-80 text-white rounded-lg"
          onClick={() =>
            alert(
              "코티 고객사를 위한 서비스 입니다.\n코티 고객사시라면 고객센터로 문의주세요.\n이용해 주셔서 감사합니다.\n고객센터 : 1644-4223"
            )
          }
        >
          포인트 신청하기
        </button>
      </div>
    </>
  );
}

export default PointRequest;
