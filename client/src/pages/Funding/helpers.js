export const PoptionSuccessModalId = 'c00e53946c2ca';

export const openSuccessModal = () => {
	if(window.poptin_display) {
		window.poptin_display(PoptionSuccessModalId);
	}
};