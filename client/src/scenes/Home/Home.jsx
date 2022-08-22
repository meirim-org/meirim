import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'redux/modal/slice';
import { reportToAnalytics } from 'utils';
import '../../assets/bootstrap.css';
import logoSmall from '../../assets/logo_small.png';
import traktor from '../../assets/traktor_op.png';
import Wrapper from '../../components/Wrapper';
import { useTranslation } from '../../locale/he_IL';
import { howItWorks, whatSay } from './constants';
import './Home.css';

const Home = (props) => {
	const dispatch = useDispatch();
	const { state } = props.location;
	const { t } = useTranslation();

	useEffect(() => {
		if (state === 'openRegister') {
			reportToAnalytics({
				event: 'registration-start',
				ref: 'menu'
			});
			dispatch(openModal({ modalType: 'register' }));
		};
	}, [state, dispatch]);

	return (
		<Wrapper>
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
};

Home.propTypes = {
	location: PropTypes.object.isRequired
};

export default Home;