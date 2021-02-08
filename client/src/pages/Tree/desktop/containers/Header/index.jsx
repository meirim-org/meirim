import React from 'react';
import { useHistory } from 'react-router-dom';
import t from 'locale/he_IL';
import PropTypes from 'prop-types';
import { TreeSelectors } from 'redux/selectors';
import { ShareTree, Title } from './components';
import * as SC from './style';
import { tabIsActive, pageTitleText } from '../../../utils';
import { useTitle } from '../../../../../hooks';

const Header = ({ match }) => {
    const history = useHistory();
    const {
        treeData: { place, street, street_number, total_trees },
    } = TreeSelectors();
    const pathData = {
        pathName: history.location.pathname,
        treeId: match.params.id,
    };

    const titleText = pageTitleText(total_trees, street, street_number);
    useTitle(`${t.treePermits}: ${titleText}, ${place}`);

    return (
        <SC.Header>
            <SC.TitlesAndTabs>
                <Title place={place} text={titleText} />
                <SC.AppBar position="static">
                    <div>
                        <SC.Tab
                            className={
                                tabIsActive('summary', pathData) ? 'active' : ''
                            }
                            onClick={() => history.push(match.url)}
                        >
                            {t.summary}
                        </SC.Tab>
                    </div>
                </SC.AppBar>
            </SC.TitlesAndTabs>
            <SC.Buttons>
                <ShareTree />
            </SC.Buttons>
        </SC.Header>
    );
};

Header.propTypes = {
    match: PropTypes.object.isRequired,
};

export default Header;
