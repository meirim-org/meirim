import React from 'react';

require('./team.scss');

function getPersonComponent(name, title, img) {
  return <div className={"person"}>
    <img className={"image"} src={require(`../../../../images/${img}.png`)} />
    <p className={"name"}>{name}</p>
    <p className={"title"}>{title}</p>
  </div>
}

const Team = () => {
  return (
    <div className={"team"}>
      <p className={"short-desc"}>
        אנחנו קבוצה עצמאית, קטנה ונחושה של אדריכלים, מתכנתים ומעצבת שעובדת ימים ולילות בהתנדבות במטרה להגביר את השקיפות במערכת התכנון ולעודד אקטיביזם עירוני. זה הצוות שלנו:
      </p>
      {getPersonComponent("נאור תורג׳מן", "מתכנת", "naor")}
      {getPersonComponent("יונתן דורטהיימר", "אדריכל ומתכנת", "yonatan")}
      {getPersonComponent("דר' טליה מרגלית", "אדריכלית, חוקרת ויועצת אקדמית", "talia")}
      {getPersonComponent("איל מגדלוביץ", "אדריכל ומנהל הפרויקט", "eyal")}
      {getPersonComponent("לילך ריטר רמתי", "מתכנתת", "lilach")}
      {getPersonComponent("שירה אפרתי", "אדריכלית", "shira")}
      {getPersonComponent("דני פרידלנד", "מתכנת", "danni")}
      {getPersonComponent("אן לילמנסטונס", "מעצבת", "ann")}
      {getPersonComponent("נועה ירקוני", "אדריכלית", "noa")}
      {getPersonComponent("תומר צ׳ציק", "מתכנת", "tomer")}
      {getPersonComponent("עדי קויש", "אדריכלית", "adi")}
    </div>
  )
};

export default Team;
