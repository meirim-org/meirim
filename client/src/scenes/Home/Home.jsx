import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Wrapper from '../../components/Wrapper';
import Register from '../../pages/Register/index.jsx';

import t from '../../locale/he_IL';
import traktor from '../../assets/traktor_op.png';
import logoSmall from '../../assets/logo_small.png';
import '../../assets/bootstrap.css';
import './Home.css';

const howItWorks = [
	{
		icon: 'building',
		text: (
			<>
				<strong>יזמי נזל"ן</strong>
				{' '}
				מגישים תוכנית חדשה לוועדת התכנון
				באמצעות מערכת "תכנון זמין"
			</>
		),
	},
	{
		icon: 'paper-plane',
		text: (
			<>
				<strong>מעירים</strong>
				{' '}
				מזהה שהוגשה תוכנית חדשה ושולחת לכל
				הנרשמים באיזור הרלוונטי התראה בדואר אלקטרוני
			</>
		),
	},
	{
		icon: 'chart-area',
		text: (
			<>
				<strong>אתם</strong>
				{' '}
				מקבלים התראה רלוונטית עם לינק לתוכנית המלאה
				ומידע מונגש שעוזר להבין את מהות התוכנית
			</>
		),
	},
];

const whatSay = [
	{
		text: 'מעירים זו מהפכה והיא חשובה לתקשורת עם האזרח, אקדם את הטמעת המערכת בקריית אונו',
		name: 'עו"ד נירית בלייר',
		title: 'חברת מועצת העיר קריית אונו',
	},

	{
		text: 'מעירים נותן לנו כלים יעילים להתמודד עם תהליכי תכנון שלעתים רבות סמויים מן העין אבל משפיעים ישירות על החיים שלנו',
		name: 'ערן בן ימיני',
		title: 'מנכ"ל ארגון חיים וסביבה',
	},

	{
		text: 'קיבלתי מידע חשוב על תכנית פיתוח משמעותית הצמודה לביתי. זה איפשר לי להיערך עם השכנים, להגיש התנגדות ואף להביא לשיפור המצב התכנוני שאושר בעבורנו.',
		name: 'יהונתן הימן',
		title: 'מתכנן קהילתי, ירושלים',
	},
	{
		text: 'מעירים הוא כלי עבודה נהדר, בייחוד במעכב אחרי תכניות בסמכות מקומית',
		name: 'מנהל התכנון',
		title: '',
	},
	{
		text: 'מעירים הוא כלי שמחזיר לי מעט כוח במערכת היחסים המורכבת והלא מאוזנת מול הרשות העירונית ונבכי הבירוקרטיה שלה.',
		name: 'יואב שפרנק',
		title: 'פעיל חברתי, דרום תל אביב',
	},
];

export default function Home(props) {
	const { me } = props;
	
	return (
		<Wrapper me={me}>
			<div
				className="d-none d-md-block"
				style={{
					width: '50%',
					position: 'absolute',
					height: '100%',
					left: 0,
					top: 0,
					bottom: 0,
					backgroundImage: `url(${traktor})`,
					backgroundSize: 'cover',
					backgroundPosition: '50% 50%',
				}}
			/>
			<div className="container heroContainer">
				<section className="hero">
					<div className="content">
						<img className="logo" src={logoSmall} alt={t.name} />
						<div className="d-lg-none">
							<h4>{t.meirimTitle}</h4>
							<p>{t.whatToRegister}</p>
							<a href="#register" className="join">
								{t.callToAction}
							</a>
						</div>
					</div>
				</section>
				<div className="row garden">
					<div className="col-lg-4">
						<h2>{t.whyRegister}</h2>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-4">
						<p>{t.howItWorks}</p>
					</div>
					<div className="col-lg-4">
						<Register />
					</div>
				</div>
			</div>
			<div className="container how-it-works">
				<div className="row responsive-title">
					<h3>כיצד "מעירים" עובדת?</h3>
				</div>

				<div className="row">
					{howItWorks.map((item, index) => (
						<div className="col" key={index}>
							<div className="howItWorks">
								<div className="icon">
									<FontAwesomeIcon
										icon={item.icon}
										size="4x"
									/>
								</div>
								{item.text}
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="container">
				<div className="row responsive-title">
					<h3>אומרים על "מעירים":</h3>
				</div>
				<div className="row">
					{whatSay.map((item, index) => (
						<div className="col-sm-4" key={index}>
							<div className="whatSay">
								<div className="box">
									<div className="dialog-box">
										"
										{item.text}
										"
									</div>
									<div className="info">
										<strong>{item.name}</strong>
										{' '}
										<br />
										{item.title}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</Wrapper>
	);
}
