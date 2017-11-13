import React from 'react';

require('../../styles/home-page.scss');

const HomePage = () => {
	return (
		<main>
			<div className="header-question">
				<h1>
					הבניין שיועד לטיפת חלב
					<br/>
					עומד להפוך
					<span style={{color: '#0000CC'}}>לדירת יוקרה?</span>
				</h1>
			</div>
		</main>
	)
}

export default HomePage;
