import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-charts';
import { TabPanel, TabBox, Typography, Text, Button, Link } from 'shared';
import { renderMultiplier, renderPercent } from 'utils';
import { series, axes, daysPassed } from '../utils';
import * as SC from './style';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Badge, Chip } from '@material-ui/core';
import { SubComment, NewSubCommentForm } from './';
import parse from 'html-react-parser';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';



export const GoalsPanel = ({ goalsFromMavat, tabValue }) => {
	const theme = useTheme();
	
	if (!goalsFromMavat) return null;
	
	return (
		<TabPanel value={tabValue} index={0}>
			<TabBox>
				<SC.PlanSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={theme.palette.black}
					>
						{t.planGoals}
					</Typography>
				</SC.PlanSummaryTitleWrapper>

				<SC.EntryContent>
					{parse(goalsFromMavat)}
				</SC.EntryContent>

			</TabBox>
		</TabPanel>
	);
};


GoalsPanel.propTypes = {
	goalsFromMavat: PropTypes.string,
	tabValue: PropTypes.any.isRequired,
};

/*mynameisuh*/
export const PlanDetaillPanel = ({ status, terms, tabValue, type, url }) => {
	const theme = useTheme();
	
	return (
		<TabPanel value={tabValue} index={0}>
			<TabBox>
				<SC.PlanSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={theme.palette.black}
					>
						{t.planDetails}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				
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
					<Link textDecoration="none" url={url} text={t.planDeatailOnGovSite}/>
					<SC.CustomLinkIcon></SC.CustomLinkIcon>
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
	const theme = useTheme();

	if ( !dataArea || !dataArea[0].data.length) return null;
	

	return (
		<TabPanel value={tabValue} index={0}>
			<TabBox>
				<SC.PlanSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={theme.palette.black}
					>
						{t.meanings}
					</Typography>
				</SC.PlanSummaryTitleWrapper>

				{textArea.exist !== 0 
					?
					<>
						<Text text={`${t.thisPlanIncreases} `} color={theme.palette.black}/>
						<Text text={`${renderMultiplier(textArea)} `} color={theme.palette.primary.main} weight="600" />
						<Text text={`(${t.extension} `} color={theme.palette.gray['alt']} />
						<Text text={`${textArea.new} ${t.meter}`} color={theme.palette.gray['alt']} weight="600" />
						<Text text=")" color={theme.palette.gray['alt']} />
					</>
					:
					<>
						<Text text={`${t.thisPlanAdds} ${t.buildingLand}`} color={theme.palette.black} />
						<Text text={`${textArea.new} ${t.meter}`} color={theme.palette.gray['alt']} weight="600"/>
					</>
				}

				<br/>
				
				<Text text={`${renderPercent( (textArea.new + textArea.exist) / textArea.area )}% `} color={theme.palette.primary.main} weight="600"/>
				<Text text={`${t.building} `} color={theme.palette.black} />
				<Text text={`${t.insteadOf} `} color={theme.palette.gray['alt']} />
				<Text text={`${renderPercent( textArea.exist / textArea.area )}%`} color={theme.palette.gray['alt']} weight="600"/>
			
				<SC.ChartWrapper>
					<Chart
						series={series}
						data={dataArea}
						axes={axes}
						tooltip={true}
					/>
				</SC.ChartWrapper>

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

export const SubscribePanel = ({ tabValue, subscribePanel, handleSubscribePanel }) => {
	const theme = useTheme();

	//add user connection condition 
	if ( !subscribePanel ) return null;

	return (
		<TabPanel value={tabValue} index={0}>
			<TabBox position="relative" bgColor={theme.palette.primary['100']} borderColor={theme.palette.primary['200']}>
				<SC.SubscribeIconWrapper>
					<NotificationsNoneIcon />
				</SC.SubscribeIconWrapper>
				<SC.SubscribeTextWrapper>
					<Text text={t.subscribeTitle} color={theme.palette.primary['800']} weight="600" />
					<br/>
					<Text text={t.subscribeText} color={theme.palette.primary['800']} />
				</SC.SubscribeTextWrapper>
				<SC.SubscribeButtonsWrapper>
					<SC.SubscribeButtonWrapper>
						<Button onClick={() => alert('הרשמה')} extrasmall={true} text={t.signup}/>
					</SC.SubscribeButtonWrapper>
					<SC.SubscribeButtonWrapper>
						<Button 
							fontSize="14px"
							textDecoration="underline"
							simple={true} 
							fontWeight="400" 
							onClick={() => handleSubscribePanel(false)}
							text={t.noThanks}
					 />
					</SC.SubscribeButtonWrapper>
				</SC.SubscribeButtonsWrapper>
				<SC.CloseSubscribeIcon onClick={() => handleSubscribePanel(false)} />
			</TabBox>
		</TabPanel>
	);
};

SubscribePanel.propTypes = {
	tabValue: PropTypes.any.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
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
