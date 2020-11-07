import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import CloseIcon from "@material-ui/icons/Close"
import * as SC from "./style"

const useStyles = makeStyles(() => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
}))

const MainModal = ({ children }) => {
	const classes = useStyles()

	return (
		<SC.ModalWrapper>
			<Modal
				open
				aria-labelledby="server-modal-title"
				aria-describedby="server-modal-description"
				className={classes.modal}
			>
				<SC.ModalContentWRapper>
					<SC.IconWrapper>
						<CloseIcon style={{cursor: "pointer", fill: "gray"}}/>
					</SC.IconWrapper>
					{children}
				</SC.ModalContentWRapper>
			</Modal>
		</SC.ModalWrapper>
	)
}

MainModal.propTypes = {
	children: React.element
}

export default MainModal
