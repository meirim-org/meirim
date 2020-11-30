import React from 'react';
import { Button } from 'shared'
import styled from 'styled-components';
import { copiedToClipboard } from 'toasts'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Wrapper = styled.div`
	display: grid;
	padding: 1em 6em 0 6em;
`
const Title = styled.h1``

const SharePlan = () => {
	return (
		<Wrapper>
			<Title>שיתוף תוכנית</Title>
			  <a
				className="share-link"
				target="_blank"
				rel="noopener noreferrer"
				href={'https://wa.me/?text=תוכנית%20שאולי%20תעניין%20אותך%3A%0A' + encodeURI(window.location.toString())}>
				<Button onClick={() => {console.log('clicked share')}} text="שתיוף ב- Whatsapp"/></a>
			<CopyToClipboard text={encodeURI(window.location.toString())} onCopy={() => copiedToClipboard()}>
				<button>Copy to clipboard with button</button>
			</CopyToClipboard>
		</Wrapper>
	)
}

export default SharePlan
