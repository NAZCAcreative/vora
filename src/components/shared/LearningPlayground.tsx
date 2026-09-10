/** CSS-built characters keep the illustration crisp and lightweight at every size. */
export function LearningPlayground() {
  return (
    <div className="learning-playground" role="img" aria-label="안녕! 말풍선 친구들이 함께 즐겁게 한국어를 배우는 일러스트">
      <div className="playground-orbit" />
      <span className="playground-spark spark-one" aria-hidden="true">✦</span>
      <span className="playground-spark spark-two" aria-hidden="true">✦</span>
      <span className="playground-dot" />
      <div className="hello-sticker">안녕! <span aria-hidden="true">✺</span></div>
      <div className="speech-friend friend-peach"><span className="friend-eyes"><i /><i /></span><span className="friend-smile" /><span className="friend-cheek cheek-left" /><span className="friend-cheek cheek-right" /></div>
      <div className="speech-friend friend-lavender"><span className="friend-eyes"><i /><i /></span><span className="friend-smile" /></div>
      <div className="word-sticker">한 마디가 시작하는 새로운 세상</div>
      <div className="playground-label"><span aria-hidden="true">♡</span> Learn. Laugh. Connect.</div>
    </div>
  );
}
