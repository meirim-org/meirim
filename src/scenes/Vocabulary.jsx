import React, { Component } from 'react';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Keywords from '../assets/keywords'

import './Vocabulary.css';

class Vocabulary extends Component {
  render() {
    const { me } = this.props;
    return (
      <React.Fragment>
        <Navigation me={me} />
        <div className="container">
        <h1>מילון שימושי קרקע</h1>
          <p>
          בתכנון עירוני נהוג להגדיר מראש את השימושים המותרים בשטח מסויים. בעוד אסכולות מסוימות דוגלות בחיוניות של הקצאת שטחים שונים לשימושים שונים (ידוע בשם הפרדת שימושים) אחרות קוראות להקצאות קרקע אחת ליותר משימוש אחד (נגיד, מגורים ומסחר ביחד), לפחות במקרים מסויימים (ידוע בשם עירוב שימושים). לפניכם רשימה של שימושי הקרקע בהם עושים שימוש בישראל המלווים בהסבר קצר.
          </p>
          {Keywords.map((word) => (
              // <Card className="card" raised={true} key={plan.id}>
                // <Link
                <React.Fragment>
                  <h4>
                    {word.title}
                  </h4>
                  <p>
                    {word.description}
                  </p>

                  {/* {word.image &&
                  <img className="" src={word.image} />
                  } */}
                </React.Fragment>
          ))
          }
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Vocabulary;
