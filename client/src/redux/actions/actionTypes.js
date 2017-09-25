import _ from 'lodash';

const keys = [
    'LOGIN',
    'LOGIN_SUCCESS',
    'LOGIN_ERROR',
];

const Actions = _.keyBy(keys);
export default Actions;