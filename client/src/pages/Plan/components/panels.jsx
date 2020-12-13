import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-charts';
import { TabPanel, TabBox, Typography, Button } from 'shared';
import { renderMultiplier, renderPercent } from 'utils';
import { series, axes, daysPassed } from '../utils';
import * as SC from './style';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Badge, TextareaAutosize } from '@material-ui/core';
import { SubComment } from './';


export const GoalsPanel = ({ goalsFromMavat, tabValue }) => 
	<TabPanel value={tabValue} index={0}>
		<TabBox>{goalsFromMavat}</TabBox>
	</TabPanel>;

GoalsPanel.propTypes = {
	goalsFromMavat: PropTypes.string.isRequired,
	tabValue: PropTypes.string.isRequired,
};

/*mynameisuh*/
export const StatusTypeUrlPanel = ({ status, tabValue, type, url }) => 
	<TabPanel value={tabValue} index={0}>
		<TabBox>{`סטטוס: ${status}  סוג תוכנית: ${type}  מסמכי התוכנית באתר הממשלה: ${url}`}</TabBox>
	</TabPanel>;

StatusTypeUrlPanel.propTypes = {
	type: PropTypes.string.isRequired,
	status: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	tabValue: PropTypes.string.isRequired,
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
	url: PropTypes.string.isRequired,
	tabValue: PropTypes.string.isRequired,
};

export const CommentPanel = ({ key, tabValue, commentData, newComment }) => {
	const theme = useTheme();
	const [newSubComment, setNewSubComment] = React.useState(false);
	const { content, created_at } = commentData;
	const { name } = commentData.person;
	
	return (
		<TabPanel value={tabValue} index={1}>
			<TabBox isOpinion={true} disabled={newComment} key={key}>
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
						id={'like-' + key}
						textColor={theme.palette.black}
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
						id={'add-response-' + key}
						textColor={theme.palette.black}
						text={t.addAResponse}
						onClick={() => setNewSubComment(true)}
						simple
						iconBefore={<SC.CommentIcon/>}
					/>
				</SC.AddSubComment>
				<SC.CommentsWrapper>

					{newSubComment &&
						<SC.addCommentWrapper>
							<SC.FormControl fullWidth={true}>
								<TextareaAutosize aria-label={t.emptyTextarea} rowsMin={5}/>
							</SC.FormControl>
							<SC.addCommentButtonWrapper>
								<Button
									id="close-new-opinion"
									text={t.close}
									simple
									small
									textColor={theme.palette.black}
									onClick={() => setNewSubComment(false)}
								/>
								<Button
									id="send-new-opinion"
									text={t.send}
									fontWeight={600}
									small
									simple
									onClick={() => ''}
								/>
							</SC.addCommentButtonWrapper>

						</SC.addCommentWrapper>
					}
				</SC.CommentsWrapper>
				
				{commentData.subComments &&
					<div>
						{commentData.subComments.map((subComment, index) => (
							<SubComment key={index} subCommentData={subComment} />
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
	key: PropTypes.number.isRequired,
	commentData: PropTypes.object.isRequired,
	newComment: PropTypes.bool.isRequired,
	handleNewComment: PropTypes.func.isRequired,
	tabValue: PropTypes.string.isRequired,
};
