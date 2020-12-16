import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-charts';
import { TabPanel, TabBox, Typography, Button, Link } from 'shared';
import { renderMultiplier, renderPercent } from 'utils';
import { series, axes, daysPassed } from '../utils';
import * as SC from './style';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Badge, Chip } from '@material-ui/core';
import { SubComment, NewSubCommentForm } from './';


export const GoalsPanel = ({ goalsFromMavat, tabValue }) => 
	<TabPanel value={tabValue} index={0}>
		<TabBox>{goalsFromMavat}</TabBox>
	</TabPanel>;


GoalsPanel.propTypes = {
	goalsFromMavat: PropTypes.string.isRequired,
	tabValue: PropTypes.any.isRequired,
};

/*mynameisuh*/
export const PlanDetaillPanel = ({ status, terms, tabValue, type, url }) => {
	const theme = useTheme();
	
	return (
		<TabPanel value={tabValue} index={0}>
			<TabBox>
				<SC.PlanDeatilsTitlwWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={theme.palette.black}
					>
						{t.planDetails}
					</Typography>
				</SC.PlanDeatilsTitlwWrapper>
				
				{terms.length > 0 &&
					<SC.PlanTermsWrapper>
						{terms.map((term, index) => (
							<SC.PlanTermWrapper key={index}>
								<Chip label={term} />
							</SC.PlanTermWrapper>
						))}
					</SC.PlanTermsWrapper>
				}

				<SC.StatusAndTypeWrapper>
					<SC.StatusWrapper>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={theme.palette.gray['main']}>
							{`${t.status}: `}
						</Typography>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={theme.palette.black}>
							{status}
						</Typography>
					</SC.StatusWrapper>
					<SC.TypeWrapper>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={theme.palette.gray['main']}>
							{`${t.planType}: `}
						</Typography>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={theme.palette.black}>
							{type}
						</Typography>
					</SC.TypeWrapper>
				
				</SC.StatusAndTypeWrapper>

				<SC.UrlWrapper>
					<Link underline={false} url={url} text={t.planDeatailOnGovSite}/>
				</SC.UrlWrapper>
			</TabBox>
		</TabPanel>
	);
};


PlanDetaillPanel.propTypes = {
	type: PropTypes.string.isRequired,
	status: PropTypes.string.isRequired,
	terms: PropTypes.array,
	url: PropTypes.string,
	tabValue: PropTypes.any.isRequired,
};

export const StatsPanel = ({ tabValue, dataArea, textArea, }) => {
	const meter = 'מ"ר';
	
	return (
		<TabPanel value={tabValue} index={0}>
			<TabBox>
				{!!dataArea && !!dataArea[0].data.length && (
					<div className="rectangle">
						<h4>שינוי שטח</h4>
						{textArea.exist !== 0 &&
														<p>
																תוכנית זו מגדילה את השטח הבנוי
																פי {renderMultiplier(textArea)}{' '}
																(תוספת {textArea.new} {meter})
														</p>
						}
						{textArea.exist === 0 &&
														<p>
																תוכנית זו מוסיפה
															{textArea.new} {meter} 
																שטח בנוי
														</p>
						}
						<p>
							{renderPercent(
								(textArea.new +
																		textArea.exist) /
																		textArea.area
							)}
														% בניה (במקום{' '}
							{renderPercent(
								textArea.exist /
																		textArea.area
							)}
														% )
						</p>
						<div style={{ height: 200 }}>
							<Chart
								series={series}
								data={dataArea}
								axes={axes}
								tooltip={true}
							/>
						</div>
					</div>
				)}
			</TabBox>
		</TabPanel>
	);
};

StatsPanel.propTypes = {
	dataArea: PropTypes.array.isRequired,
	textArea: PropTypes.object.isRequired,
	url: PropTypes.string,
	tabValue: PropTypes.any.isRequired,
};

export const CommentPanel = ({ id, tabValue, commentData, newComment }) => {
	const theme = useTheme();
	const [newSubComment, setNewSubComment] = React.useState(false);
	const handleNewSubComment = (newValue) => setNewSubComment(newValue);
	const { content, created_at } = commentData;
	const { name } = commentData.person;
	
	return (
		<TabPanel value={tabValue} index={1} >
			<TabBox isOpinion={true} disabled={newComment}>
				<SC.Header>
					<SC.FirstSide>
						<Typography
							variant="menuTitle"
							mobileVariant="menuTitle"
							component="span"
							color={theme.palette.green['text2']}
						>
							ביקורת
						</Typography>
						<Typography
							variant="highlightedText"
							mobileVariant="highlightedText"
							component="span"
							color={theme.palette.black}
						>
							{name}
						</Typography>
					</SC.FirstSide>
					<SC.SecondSide>
						<Typography
							variant="light"
							mobileVariant="light"
							component="span"
							color={theme.palette.gray['main']}
						>
	                    לפני
							{daysPassed(created_at)}
	                    ימים
						</Typography>
					</SC.SecondSide>
				</SC.Header>
				<SC.Text>
					<Typography
						variant="paragraphText"
						mobileVariant="paragraphText"
						component="p"
						color={theme.palette.black}
					>
						{content}
					</Typography>
				</SC.Text>
				<SC.Like>
					<Button
						id={'like-' + id}
						textcolor={theme.palette.black}
						text={t.iLike}
						onClick={() => ''}
						simple
						iconBefore={<SC.LikeIcon/>}
					/>
					<Badge
						badgeContent="4"
					/>
				</SC.Like>
				<SC.AddSubComment className={newSubComment ? 'active' : ''}>
					<Button
						id={'add-response-' + id}
						textcolor={theme.palette.black}
						text={t.addAResponse}
						onClick={() => setNewSubComment(true)}
						simple
						iconBefore={<SC.CommentIcon/>}
					/>
				</SC.AddSubComment>
				<SC.CommentsWrapper>
					{newSubComment &&
						<NewSubCommentForm newSubComment={newSubComment} handleNewSubComment={handleNewSubComment}  />
					}
				</SC.CommentsWrapper>
				
				{commentData.subComments &&
					<div>
						{commentData.subComments.map((subComment, index) => (
							<SubComment key={index} id={index} subCommentData={subComment} />
						))}
					</div>
				}
			</TabBox>
		</TabPanel>
	);
};

CommentPanel.defaultProps = {
	newComment: false
};

CommentPanel.propTypes = {
	id: PropTypes.number.isRequired,
	commentData: PropTypes.object.isRequired,
	newComment: PropTypes.bool.isRequired,
	handleNewComment: PropTypes.func.isRequired,
	tabValue: PropTypes.any.isRequired,
};
