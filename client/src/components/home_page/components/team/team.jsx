import React from 'react';

require('./team.scss');

const Team = () => {
  return (
    <div className={"team"}>
      <p className={"short-desc"}>
        אנחנו קבוצה קטנה ונחושה של אדריכלים,
        מתכנתים ומעצבת שעובדות ימים ולילות בהתנדבות במטרה להגביר את השקיפות במערכת התכנון,
        לעודד אקטיביזם עירוני ולאפשר לכל אחד ואחת. זה הצוות שלנו:
      </p>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/naor.png')}/>
        <p className={"name"}>נאור תורג׳מן</p>
        <p className={"title"}>מתכנת</p>
      </div>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/yonatan.png')}/>
        <p className={"name"}>יונתן דורטהיימר</p>
        <p className={"title"}>מתכנת</p>
      </div>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/talia.png')}/>
        <p className={"name"}>ד״ר טליה מרגלית</p>
        <p className={"title"}>חוקרת ויועצת אקדמית</p>
      </div>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/eyal.png')}/>
        <p className={"name"}>איל מגדלוביץ</p>
        <p className={"title"}>יזם ומנהל הפרויקט</p>
      </div>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/lilach.png')}/>
        <p className={"name"}>לילך</p>
        <p className={"title"}>מתכנתת</p>
      </div>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/shira.png')}/>
        <p className={"name"}>שירה</p>
        <p className={"title"}>אדריכלית</p>
      </div>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/danni.png')}/>
        <p className={"name"}>דני פרידלנד</p>
        <p className={"title"}>מתכנת</p>
      </div>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/ann.png')}/>
        <p className={"name"}>אן לילמנסטונס</p>
        <p className={"title"}>מעצבת</p>
      </div>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/noa.png')}/>
        <p className={"name"}>נועה ירקוני</p>
        <p className={"title"}>תוכן</p>
      </div>
      <div className={"person"}>
        <img className={"image"} src={require('../../../../images/tomer.png')}/>
        <p className={"name"}>תומר צ׳ציק</p>
        <p className={"title"}>מתכנת</p>
      </div>
    </div>
  )
};

export default Team;
